import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io } from 'socket.io-client';
import api from '../api';
import { useAuthStore } from './auth';

const STORAGE = {
  sessionId: 'chat_session_id',
  name: 'chat_visitor_name',
  email: 'chat_visitor_email',
  phone: 'chat_visitor_phone',
  registered: 'nma_lead_registered'
};

export const useChatStore = defineStore('chat', () => {
  const sessionId = ref(localStorage.getItem(STORAGE.sessionId) || null);
  const visitorName = ref(localStorage.getItem(STORAGE.name) || 'Visitor');
  const messages = ref([]);
  const activeSessions = ref([]);
  const selectedSessionId = ref(null);
  const pollingInterval = ref(null);

  let socket = null;
  const socketConnected = ref(false);

  const connectSocket = () => {
    if (socket) return;

    const backendUrl = import.meta.env.VITE_BACKEND_ORIGIN || 'http://localhost:3000';
    socket = io(backendUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      socketConnected.value = true;
      
      if (sessionId.value) {
        socket.emit('join_session', sessionId.value);
      }
      
      if (selectedSessionId.value) {
        socket.emit('join_session', selectedSessionId.value);
      }
    });

    socket.on('disconnect', () => {
      socketConnected.value = false;
    });

    socket.on('message_received', (msg) => {
      if (!messages.value.some(m => m.id === msg.id)) {
        messages.value.push(msg);
      }
      const session = activeSessions.value.find(s => s.id === msg.chatSessionId);
      if (session) {
        session.lastMessageAt = msg.createdAt;
      }
    });

    socket.on('session_updated', (session) => {
      const idx = activeSessions.value.findIndex(s => s.id === session.id);
      if (idx !== -1) {
        activeSessions.value[idx] = session;
        activeSessions.value.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      } else {
        activeSessions.value.unshift(session);
      }
    });

    socket.on('session_closed', ({ chatSessionId }) => {
      if (sessionId.value === chatSessionId) {
        clearGuestSession();
      }
      if (selectedSessionId.value === chatSessionId) {
        selectedSessionId.value = null;
        messages.value = [];
      }
      activeSessions.value = activeSessions.value.filter(s => s.id !== chatSessionId);
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      socketConnected.value = false;
    }
  };

  const joinSessionRoom = (sessionUuid) => {
    if (socket && socketConnected.value) {
      socket.emit('join_session', sessionUuid);
    }
  };

  const joinAdminRoom = () => {
    if (socket && socketConnected.value) {
      const authStore = useAuthStore();
      const ownerId = authStore.user?.ownerId;
      if (ownerId) {
        socket.emit('join_admin', ownerId);
      } else {
        socket.emit('join_admin');
      }
    }
  };

  const persistVisitor = (name, email, phone) => {
    if (name) {
      visitorName.value = name;
      localStorage.setItem(STORAGE.name, name);
    }
    if (email) localStorage.setItem(STORAGE.email, email);
    if (phone) localStorage.setItem(STORAGE.phone, phone);
  };

  const markLeadRegistered = () => {
    localStorage.setItem(STORAGE.registered, '1');
  };

  const hasRegisteredVisitor = () => {
    return (
      localStorage.getItem(STORAGE.registered) === '1' &&
      Boolean(localStorage.getItem(STORAGE.name)?.trim()) &&
      Boolean(localStorage.getItem(STORAGE.email)?.trim())
    );
  };

  const clearGuestSession = () => {
    sessionId.value = null;
    messages.value = [];
    localStorage.removeItem(STORAGE.sessionId);
  };

  const saveSessionId = (id) => {
    sessionId.value = id;
    localStorage.setItem(STORAGE.sessionId, id);
  };

  const getStoredVisitor = () => ({
    name: localStorage.getItem(STORAGE.name) || '',
    email: localStorage.getItem(STORAGE.email) || '',
    phone: localStorage.getItem(STORAGE.phone) || ''
  });

  /** Create or resume a chat session (reuses active session for same email on server). */
  const initGuestSession = async (name, email = '', phone = '') => {
    persistVisitor(name, email, phone);

    if (sessionId.value) {
      try {
        await api.get(`/chat/messages/${sessionId.value}`);
        connectSocket();
        joinSessionRoom(sessionId.value);
        return sessionId.value;
      } catch {
        clearGuestSession();
      }
    }

    try {
      const response = await api.post('/chat/session', {
        visitorName: name || visitorName.value || 'Visitor',
        email,
        phone
      });
      saveSessionId(response.data.id);
      if (response.data.visitorName) {
        visitorName.value = response.data.visitorName;
      }
      if (email?.trim() && name?.trim()) {
        markLeadRegistered();
      }
      connectSocket();
      joinSessionRoom(response.data.id);
      return response.data.id;
    } catch (err) {
      console.error('Failed to initialize chat session:', err);
      throw err;
    }
  };

  /**
   * Open chat for someone who already completed signup — no registration form.
   */
  const ensureGuestSession = async () => {
    connectSocket();
    if (sessionId.value) {
      try {
        await fetchGuestMessages();
        joinSessionRoom(sessionId.value);
        return sessionId.value;
      } catch {
        clearGuestSession();
      }
    }

    if (!hasRegisteredVisitor()) {
      return null;
    }

    const { name, email, phone } = getStoredVisitor();
    await initGuestSession(name, email, phone);
    await fetchGuestMessages();
    joinSessionRoom(sessionId.value);
    return sessionId.value;
  };

  const sendGuestMessage = async (text, name = '', email = '', phone = '') => {
    try {
      let currentSessionId = sessionId.value;
      if (!currentSessionId) {
        const stored = getStoredVisitor();
        currentSessionId = await initGuestSession(
          name || stored.name || 'Visitor',
          email || stored.email,
          phone || stored.phone
        );
      }
      const response = await api.post('/chat/message', {
        chatSessionId: currentSessionId,
        message: text
      });
      // If the socket is connected, the server will emit 'message_received'
      // and the socket handler will add the message. Avoid pushing here
      // to prevent duplicate bubbles. If socket is not connected, push
      // the response as a fallback.
      if (!socketConnected.value) {
        messages.value.push(response.data);
      }
    } catch (err) {
      console.error('Send guest message failed:', err);
      throw err;
    }
  };

  const fetchGuestMessages = async () => {
    if (!sessionId.value) return;
    const response = await api.get(`/chat/messages/${sessionId.value}`);
    messages.value = response.data;
  };

  const startGuestPolling = () => {
    connectSocket();
    if (sessionId.value) {
      fetchGuestMessages().catch(() => clearGuestSession());
      joinSessionRoom(sessionId.value);
    }
  };

  const stopPolling = () => {
    // Keep socket alive to deliver updates
  };

  const adminFetchSessions = async () => {
    try {
      const response = await api.get('/admin/chat/sessions');
      activeSessions.value = response.data;
      connectSocket();
      joinAdminRoom();
    } catch (err) {
      console.error('Admin fetch sessions failed:', err);
    }
  };

  const adminFetchSessionMessages = async (sessionUuid) => {
    try {
      const response = await api.get(`/admin/chat/sessions/${sessionUuid}`);
      messages.value = response.data;
      selectedSessionId.value = sessionUuid;
      connectSocket();
      joinSessionRoom(sessionUuid);
    } catch (err) {
      console.error('Admin fetch session messages failed:', err);
    }
  };

  const adminSendReply = async (sessionUuid, text) => {
    try {
      const response = await api.post('/admin/chat/reply', {
        chatSessionId: sessionUuid,
        message: text
      });
      // When connected via socket, server emits 'message_received' to
      // session room; rely on that to append the message to avoid
      // duplicates. If socket is disconnected, append the message.
      if (!socketConnected.value) {
        messages.value.push(response.data);
      }
      const session = activeSessions.value.find(s => s.id === sessionUuid);
      if (session) session.lastMessageAt = new Date().toISOString();
    } catch (err) {
      console.error('Admin reply failed:', err);
    }
  };

  const adminCloseSession = async (sessionUuid) => {
    try {
      await api.post(`/admin/chat/sessions/${sessionUuid}/close`);
      activeSessions.value = activeSessions.value.filter(s => s.id !== sessionUuid);
      if (selectedSessionId.value === sessionUuid) {
        selectedSessionId.value = null;
        messages.value = [];
      }
    } catch (err) {
      console.error('Admin close session failed:', err);
    }
  };

  return {
    sessionId,
    visitorName,
    messages,
    activeSessions,
    selectedSessionId,
    hasRegisteredVisitor,
    markLeadRegistered,
    ensureGuestSession,
    clearGuestSession,
    sendGuestMessage,
    fetchGuestMessages,
    startGuestPolling,
    stopPolling,
    adminFetchSessions,
    adminFetchSessionMessages,
    adminSendReply,
    adminCloseSession,
    initGuestSession,
    connectSocket,
    disconnectSocket,
    joinSessionRoom,
    joinAdminRoom
  };
});
