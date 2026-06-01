import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

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
    if (sessionId.value) {
      try {
        await fetchGuestMessages();
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
      messages.value.push(response.data);
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
    if (pollingInterval.value) return;
    if (sessionId.value) {
      fetchGuestMessages().catch(() => clearGuestSession());
    }
    pollingInterval.value = setInterval(() => {
      if (sessionId.value) {
        fetchGuestMessages().catch(() => {});
      }
    }, 4000);
  };

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
    }
  };

  const adminFetchSessions = async () => {
    try {
      const response = await api.get('/admin/chat/sessions');
      activeSessions.value = response.data;
    } catch (err) {
      console.error('Admin fetch sessions failed:', err);
    }
  };

  const adminFetchSessionMessages = async (sessionUuid) => {
    try {
      const response = await api.get(`/admin/chat/sessions/${sessionUuid}`);
      messages.value = response.data;
      selectedSessionId.value = sessionUuid;
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
      messages.value.push(response.data);
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
    initGuestSession
  };
});
