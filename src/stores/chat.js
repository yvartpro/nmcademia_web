import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useChatStore = defineStore('chat', () => {
  const sessionId = ref(localStorage.getItem('chat_session_id') || null);
  const visitorName = ref(localStorage.getItem('chat_visitor_name') || 'Visitor');
  const messages = ref([]);
  const activeSessions = ref([]);
  const selectedSessionId = ref(null);
  const pollingInterval = ref(null);

  // Initialize guest session or restore existing
  const initGuestSession = async (name, email = '', phone = '') => {
    if (sessionId.value) return sessionId.value;
    try {
      const response = await api.post('/chat/session', { visitorName: name, email, phone });
      sessionId.value = response.data.id;
      visitorName.value = name;
      localStorage.setItem('chat_session_id', response.data.id);
      localStorage.setItem('chat_visitor_name', name);
      return response.data.id;
    } catch (err) {
      console.error('Failed to initialize chat session:', err);
      throw err;
    }
  };

  const sendGuestMessage = async (text, name = 'Visitor', email = '', phone = '') => {
    try {
      let currentSessionId = sessionId.value;
      if (!currentSessionId) {
        currentSessionId = await initGuestSession(name, email, phone);
      }
      const response = await api.post('/chat/message', {
        chatSessionId: currentSessionId,
        message: text
      });
      messages.value.push(response.data);
    } catch (err) {
      console.error('Send guest message failed:', err);
    }
  };

  const fetchGuestMessages = async () => {
    if (!sessionId.value) return;
    try {
      const response = await api.get(`/chat/messages/${sessionId.value}`);
      messages.value = response.data;
    } catch (err) {
      console.error('Fetch guest messages failed:', err);
    }
  };

  // Start polling guest messages (every 4 seconds)
  const startGuestPolling = () => {
    if (pollingInterval.value) return;
    fetchGuestMessages();
    pollingInterval.value = setInterval(() => {
      fetchGuestMessages();
    }, 4000);
  };

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
    }
  };

  // Admin Actions
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
      // Update session's lastMessageAt locally
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
