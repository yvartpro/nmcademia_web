<template>
  <div
    class="fixed right-6 z-50 font-sans transition-[bottom] duration-200"
    :class="isPresentationRoute ? 'bottom-28' : 'bottom-6'"
  >
    
    <!-- Collapsed Toggle Button -->
    <button 
      v-if="!isOpen" 
      @click="toggleChat"
      class="w-14 h-14 rounded-full bg-accent hover:bg-accent-dark text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 relative group"
    >
      <span class="text-2xl">💬</span>
      <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
        {{ unreadCount }}
      </span>
      
      <!-- Hover Tooltip -->
      <span class="absolute right-16 bg-zinc-900 border border-zinc-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
        Consult Team Trainer
      </span>
    </button>

    <!-- Expanded Chat Card -->
    <div 
      v-else 
      class="w-80 md:w-96 h-[500px] rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-up"
    >
      
      <!-- Card Header -->
      <header class="bg-accent border-b border-accent-dark p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
            TR
          </div>
          <div>
            <h5 class="font-bold text-xs md:text-sm text-white">Consult Team Trainer</h5>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="w-2 h-2 rounded-full bg-white/70 animate-pulse"></span>
              <span class="text-[10px] text-white/80">Online &amp; Active</span>
            </div>
          </div>
        </div>
        <button @click="toggleChat" class="text-white/70 hover:text-white transition text-xs font-semibold px-2 py-1 hover:bg-white/10 rounded">
          ✕ Close
        </button>
      </header>

      <!-- Message History / Setup Form -->
      <div class="flex-grow p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar bg-zinc-50" ref="messagesContainer">
        
        <div v-if="ensuringSession" class="flex flex-col items-center justify-center gap-2 my-auto py-12 text-zinc-400">
          <span class="text-2xl animate-pulse">💬</span>
          <p class="text-xs">Restoring your conversation…</p>
        </div>

        <!-- First-time visitors only: collect details before chat -->
        <div v-else-if="showRegistrationForm" class="space-y-4 my-auto">
          <div class="text-center space-y-1 py-4">
            <span class="text-3xl">👋</span>
            <h6 class="font-bold text-sm text-zinc-900">Ask a question to our trainer</h6>
            <p class="text-xs text-zinc-500 max-w-[240px] mx-auto leading-normal">Complete the signup steps first, or fill in your details below to open chat.</p>
          </div>
          
          <form @submit.prevent="startSessionSubmit" class="space-y-3">
            <input 
              type="text" 
              v-model="initForm.name" 
              required 
              placeholder="Your Full Name"
              class="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-accent transition"
            />
            <input 
              type="email" 
              v-model="initForm.email" 
              placeholder="Your Email Address (Optional)"
              class="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-accent transition"
            />
            <input 
              type="tel" 
              v-model="initForm.phone" 
              placeholder="Your Phone Number (Optional)"
              class="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-accent transition"
            />
            <button 
              type="submit" 
              :disabled="loadingSession"
              class="w-full bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded-lg text-xs transition disabled:opacity-50"
            >
              {{ loadingSession ? 'Opening session...' : 'Start Chat Session' }}
            </button>
          </form>
        </div>

        <!-- Active Message Bubbles -->
        <div v-else class="space-y-3 flex flex-col justify-end min-h-full">
          <p
            v-if="chatStore.hasRegisteredVisitor() && chatStore.messages.length === 0"
            class="text-xs text-center text-zinc-400 pb-2"
          >
            Welcome back, {{ chatStore.visitorName }}. Ask your trainer anything below.
          </p>
          <div 
            v-for="msg in chatStore.messages" 
            :key="msg.id"
            :class="[
              'max-w-[75%] p-3 rounded-xl text-xs leading-relaxed break-words',
              msg.sender === 'guest'
                ? 'self-end bg-accent/10 border border-accent/20 text-zinc-800 rounded-br-none'
                : 'self-start bg-white border border-zinc-200 text-zinc-700 rounded-bl-none shadow-sm'
            ]"
          >
            <p>{{ msg.message }}</p>
            <span class="text-[8px] text-zinc-400 block text-right mt-1.5">
              {{ formatTime(msg.createdAt) }}
            </span>
          </div>

          <div
            v-if="chatStore.messages.length === 0 && !chatStore.hasRegisteredVisitor()"
            class="text-center text-zinc-400 text-xs py-8"
          >
            Type your question below to start chatting with the trainer.
          </div>
        </div>

      </div>

      <!-- Message Sender Controls -->
      <footer v-if="chatStore.sessionId" class="p-3 border-t border-zinc-200 bg-white flex gap-2">
        <input 
          type="text" 
          v-model="messageText" 
          @keyup.enter="sendMessage"
          placeholder="Type your message..." 
          class="flex-grow bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-accent transition"
        />
        <button 
          @click="sendMessage"
          :disabled="!messageText.trim()"
          class="bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-xs transition"
        >
          Send
        </button>
      </footer>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from '../stores/chat';

const route = useRoute();
const chatStore = useChatStore();

/** Sit above the presentation slide footer (Previous / Next bar). */
const isPresentationRoute = computed(() => route.path === '/presentation');

const isOpen = ref(false);
const messageText = ref('');
const loadingSession = ref(false);
const messagesContainer = ref(null);

const initForm = ref({
  name: localStorage.getItem('chat_visitor_name') || '',
  email: localStorage.getItem('chat_visitor_email') || '',
  phone: localStorage.getItem('chat_visitor_phone') || ''
});

const unreadCount = ref(0);
const ensuringSession = ref(false);

const showRegistrationForm = computed(
  () => !chatStore.sessionId && !chatStore.hasRegisteredVisitor()
);

const ensureChatReady = async () => {
  if (chatStore.sessionId) {
    try {
      await chatStore.fetchGuestMessages();
    } catch {
      /* invalid session cleared in store */
    }
    return;
  }
  if (!chatStore.hasRegisteredVisitor()) return;

  ensuringSession.value = true;
  try {
    await chatStore.ensureGuestSession();
  } catch (e) {
    console.error('Could not restore chat session:', e);
  } finally {
    ensuringSession.value = false;
  }
};

const toggleChat = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    unreadCount.value = 0;
    await ensureChatReady();
    scrollToBottom();
    chatStore.startGuestPolling();
  } else {
    chatStore.stopPolling();
  }
};

const startSessionSubmit = async () => {
  loadingSession.value = true;
  try {
    await chatStore.initGuestSession(initForm.value.name, initForm.value.email, initForm.value.phone);
    await chatStore.fetchGuestMessages();
    chatStore.startGuestPolling();
    scrollToBottom();
  } catch (e) {
    console.error(e);
  } finally {
    loadingSession.value = false;
  }
};

const sendMessage = async () => {
  const text = messageText.value.trim();
  if (!text) return;
  messageText.value = '';

  await chatStore.sendGuestMessage(text, initForm.value.name, initForm.value.email, initForm.value.phone);
  scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatTime = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

// Check for unread messages when collapsed
watch(() => chatStore.messages.length, (newVal, oldVal) => {
  if (!isOpen.value && newVal > oldVal) {
    const lastMsg = chatStore.messages[chatStore.messages.length - 1];
    if (lastMsg && lastMsg.sender === 'trainer') {
      unreadCount.value++;
    }
  }
  scrollToBottom();
});

onMounted(async () => {
  if (chatStore.sessionId || chatStore.hasRegisteredVisitor()) {
    await chatStore.ensureGuestSession().catch(() => {});
    chatStore.startGuestPolling();
  }
});

onUnmounted(() => {
  chatStore.stopPolling();
});
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(244, 246, 245, 0.8);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 138, 32, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 138, 32, 0.4);
}
</style>
