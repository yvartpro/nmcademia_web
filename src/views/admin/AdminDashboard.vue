<template>
  <div class="min-h-screen bg-[#0b0f19] text-white flex font-sans">
    
    <!-- Sidebar Navigation -->
    <aside class="w-64 bg-slate-950 border-r border-gray-900 flex flex-col justify-between shrink-0">
      <div>
        <div class="p-6 border-b border-gray-950 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-bold text-slate-900 text-sm shadow">
            NMA
          </div>
          <div>
            <h1 class="font-display font-bold text-xs tracking-wide">NMA Workspace</h1>
            <span class="text-[9px] text-amber-500 font-mono tracking-widest">ADMINISTRATOR</span>
          </div>
        </div>

        <nav class="p-4 space-y-1">
          <button 
            @click="activeTab = 'leads'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'leads' 
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold' 
                : 'text-gray-400 hover:text-white hover:bg-slate-900/50'
            ]"
          >
            <span>👥</span>
            <span>Captured Leads</span>
          </button>

          <button 
            @click="activeTab = 'chats'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'chats' 
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold' 
                : 'text-gray-400 hover:text-white hover:bg-slate-900/50'
            ]"
          >
            <span>💬</span>
            <span>Live Chat Support</span>
          </button>

          <button 
            @click="activeTab = 'settings'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'settings' 
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold' 
                : 'text-gray-400 hover:text-white hover:bg-slate-900/50'
            ]"
          >
            <span>⚙️</span>
            <span>Site Configurations</span>
          </button>
          
          <div class="pt-4 pb-2">
            <span class="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Content Management</span>
          </div>

          <button 
            @click="activeTab = 'founders'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'founders' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
            ]"
          >
            <span>👔</span>
            <span>Founders</span>
          </button>

          <button 
            @click="activeTab = 'testimonials'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'testimonials' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
            ]"
          >
            <span>⭐</span>
            <span>Testimonials</span>
          </button>

          <button 
            @click="activeTab = 'partners'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'partners' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
            ]"
          >
            <span>🏭</span>
            <span>Manufacturing</span>
          </button>

          <button 
            @click="activeTab = 'earnings'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'earnings' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
            ]"
          >
            <span>💰</span>
            <span>Earning Streams</span>
          </button>
        </nav>
      </div>

      <div class="p-4 border-t border-gray-950">
        <button 
          @click="handleLogout"
          class="w-full bg-slate-900 hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/50 border border-gray-800 text-gray-400 text-xs font-bold py-2.5 rounded-lg transition"
        >
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Workspace -->
    <main class="flex-grow flex flex-col bg-slate-950/20 overflow-y-auto">
      
      <!-- Top header bar -->
      <header class="h-16 border-b border-gray-900 px-8 flex items-center justify-between shrink-0 bg-slate-950/40">
        <h2 class="text-sm font-semibold tracking-wide uppercase text-gray-400">
          {{ activeTabTitle }}
        </h2>
        <div class="flex items-center gap-4 text-xs">
          <span class="text-gray-400">Database Status:</span>
          <span class="flex items-center gap-1.5 font-semibold text-emerald-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Connected
          </span>
        </div>
      </header>

      <!-- Content viewport -->
      <div class="flex-grow p-8">
        
        <!-- Tab 1: Leads Dashboard -->
        <div v-if="activeTab === 'leads'" class="space-y-6 animate-fade-in">
          
          <!-- Filters area -->
          <div class="bg-slate-900/30 border border-gray-900 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
            <div class="flex flex-wrap gap-3">
              <select 
                v-model="leadsFilter.country"
                @change="loadLeads"
                class="bg-slate-950 border border-gray-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
              >
                <option value="">All Countries</option>
                <option v-for="c in catalogStore.countries" :key="c.code" :value="c.code">
                  {{ c.name }}
                </option>
              </select>

              <select 
                v-model="leadsFilter.status"
                @change="loadLeads"
                class="bg-slate-950 border border-gray-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Joined">Joined</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <button @click="loadLeads" class="text-xs text-amber-400 hover:underline">
              ⟳ Refresh Leads
            </button>
          </div>

          <!-- Leads Data Table -->
          <div class="bg-slate-950 border border-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="bg-slate-900 text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-950">
                    <th class="p-4">Name</th>
                    <th class="p-4">Email</th>
                    <th class="p-4">Country</th>
                    <th class="p-4">Segment Profile</th>
                    <th class="p-4">Status</th>
                    <th class="p-4">Date</th>
                    <th class="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-950 text-xs">
                  <tr v-for="lead in leadsStore.leads" :key="lead.id" class="hover:bg-slate-900/30 transition">
                    <td class="p-4 font-semibold text-gray-200">{{ lead.fullName }}</td>
                    <td class="p-4 text-gray-400">{{ lead.email }}</td>
                    <td class="p-4 text-amber-500 font-bold uppercase">{{ lead.country }}</td>
                    <td class="p-4 text-gray-400 truncate max-w-[150px]">{{ lead.profileType }}</td>
                    <td class="p-4">
                      <select 
                        :value="lead.status"
                        @change="updateStatus(lead.id, $event.target.value)"
                        :class="[
                          'border text-[10px] font-bold uppercase rounded px-2.5 py-1 focus:outline-none cursor-pointer',
                          statusColorClasses(lead.status)
                        ]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Joined">Joined</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td class="p-4 text-gray-500">{{ formatDate(lead.createdAt) }}</td>
                    <td class="p-4 text-right space-x-2 shrink-0">
                      <button 
                        @click="showDetails(lead)"
                        class="text-[10px] border border-gray-800 hover:border-amber-400 hover:text-amber-400 px-2 py-1 rounded transition"
                      >
                        View Details
                      </button>
                      <button 
                        @click="deleteLead(lead.id)"
                        class="text-[10px] border border-transparent hover:border-red-900 hover:text-red-400 px-2 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr v-if="leadsStore.leads.length === 0">
                    <td colspan="7" class="p-8 text-center text-gray-500 text-xs">
                      No leads captured matching filters.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab 2: Live Chat Center (Split Pane) -->
        <div v-else-if="activeTab === 'chats'" class="h-[calc(100vh-12rem)] min-h-[450px] border border-gray-900 rounded-xl overflow-hidden flex bg-slate-950/40 animate-fade-in">
          
          <!-- Chats Sessions Left List -->
          <div class="w-80 border-r border-gray-900 flex flex-col justify-between shrink-0 bg-slate-950/20">
            <header class="p-4 border-b border-gray-950 bg-slate-900/40 flex items-center justify-between">
              <span class="text-xs font-bold text-gray-300">Active Inquiries</span>
              <button @click="chatStore.adminFetchSessions()" class="text-[10px] text-amber-500 hover:underline">
                Refresh
              </button>
            </header>

            <div class="flex-grow overflow-y-auto divide-y divide-gray-950 custom-scrollbar">
              <div 
                v-for="session in chatStore.activeSessions" 
                :key="session.id"
                @click="selectSession(session.id)"
                :class="[
                  'p-4 cursor-pointer transition-all duration-200 space-y-1 text-xs',
                  chatStore.selectedSessionId === session.id 
                    ? 'bg-amber-500/10 border-l-4 border-amber-400' 
                    : 'hover:bg-slate-900/30'
                ]"
              >
                <div class="flex items-center justify-between">
                  <h6 class="font-bold" :class="{'text-amber-400': chatStore.selectedSessionId === session.id}">
                    {{ session.visitorName }}
                  </h6>
                  <span class="text-[9px] text-gray-500">
                    {{ formatTime(session.lastMessageAt) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-[11px] text-gray-400 truncate max-w-[140px] font-light">
                    {{ session.email || 'No Email' }}
                  </p>
                  <span 
                    :class="[
                      'text-[8px] font-bold uppercase rounded px-1.5 py-0.5',
                      session.status === 'active' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'
                    ]"
                  >
                    {{ session.status }}
                  </span>
                </div>
              </div>
              <div v-if="chatStore.activeSessions.length === 0" class="text-center text-gray-500 text-xs py-8">
                No chat sessions found.
              </div>
            </div>
          </div>

          <!-- Chat Conversation Area -->
          <div class="flex-grow flex flex-col justify-between bg-slate-950/10">
            <!-- Header -->
            <header v-if="chatStore.selectedSessionId" class="p-4 border-b border-gray-900 bg-slate-900/20 flex items-center justify-between">
              <div class="flex items-center gap-3 text-xs">
                <span class="font-bold text-amber-400">
                  {{ activeChatSessionDetails?.visitorName }}
                </span>
                <span class="text-gray-500">•</span>
                <span class="text-gray-400">
                  {{ activeChatSessionDetails?.phone || 'No phone' }}
                </span>
              </div>
              <button 
                @click="closeSession(chatStore.selectedSessionId)"
                class="text-[10px] bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 text-red-400 px-3 py-1 rounded transition"
              >
                Close Chat Session
              </button>
            </header>

            <!-- Message Area -->
            <div class="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar" ref="chatMessagesContainer">
              <div v-if="!chatStore.selectedSessionId" class="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                <span class="text-3xl">💬</span>
                <span class="text-xs">Select an inquiry from the sidebar to open the conversation.</span>
              </div>

              <div v-else class="space-y-4">
                <div 
                  v-for="msg in chatStore.messages" 
                  :key="msg.id"
                  :class="[
                    'max-w-[70%] p-3.5 rounded-xl text-xs leading-relaxed break-words',
                    msg.sender === 'trainer'
                      ? 'self-end ml-auto bg-amber-500/10 border border-amber-500/20 text-amber-100 rounded-br-none'
                      : 'self-start mr-auto bg-slate-900 border border-gray-850 text-gray-250 rounded-bl-none'
                  ]"
                >
                  <p>{{ msg.message }}</p>
                  <span class="text-[8px] text-gray-500 block text-right mt-1.5">
                    {{ formatTime(msg.createdAt) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer Reply Controls -->
            <footer v-if="chatStore.selectedSessionId" class="p-4 border-t border-gray-900 bg-slate-950 flex gap-2">
              <input 
                type="text" 
                v-model="adminReplyText" 
                @keyup.enter="sendAdminReply"
                placeholder="Type your response..." 
                class="flex-grow bg-slate-900 border border-gray-850 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-amber-400"
              />
              <button 
                @click="sendAdminReply"
                :disabled="!adminReplyText.trim()"
                class="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition"
              >
                Send Reply
              </button>
            </footer>
          </div>

        </div>

        <!-- Tab 3: System Settings Manager -->
        <div v-else-if="activeTab === 'settings'" class="max-w-2xl bg-slate-950 border border-gray-900 rounded-xl p-8 shadow-2xl space-y-6 animate-fade-in">
          
          <form @submit.prevent="saveSettings" class="space-y-6">
            <div class="space-y-2">
              <h3 class="text-base font-bold text-amber-400 font-display uppercase tracking-wider">Video & Contacts</h3>
              
              <div class="space-y-1">
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide">YouTube Embed Presentation Link</label>
                <input 
                  type="text" 
                  v-model="settingsForm.video_url" 
                  required
                  placeholder="https://www.youtube.com/embed/..."
                  class="w-full bg-slate-900 border border-gray-800 rounded-lg p-3 text-xs focus:outline-none focus:border-amber-400 transition" 
                />
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Trainer WhatsApp Link/Number</label>
                <input 
                  type="text" 
                  v-model="settingsForm.whatsapp_number" 
                  required
                  placeholder="+234..."
                  class="w-full bg-slate-900 border border-gray-800 rounded-lg p-3 text-xs focus:outline-none focus:border-amber-400 transition" 
                />
              </div>
            </div>

            <div class="space-y-2 border-t border-gray-900 pt-6">
              <h3 class="text-base font-bold text-amber-400 font-display uppercase tracking-wider">Landing Page Text Copy</h3>
              
              <div class="space-y-1">
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Landing Hero Confrontational Text</label>
                <textarea 
                  v-model="settingsForm.landing_hero_text" 
                  rows="4"
                  class="w-full bg-slate-900 border border-gray-800 rounded-lg p-3 text-xs focus:outline-none focus:border-amber-400 transition"
                ></textarea>
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Academia Mission Text</label>
                <textarea 
                  v-model="settingsForm.mission_statement" 
                  rows="4"
                  class="w-full bg-slate-900 border border-gray-800 rounded-lg p-3 text-xs focus:outline-none focus:border-amber-400 transition"
                ></textarea>
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Academia Vision Text</label>
                <textarea 
                  v-model="settingsForm.vision_statement" 
                  rows="4"
                  class="w-full bg-slate-900 border border-gray-800 rounded-lg p-3 text-xs focus:outline-none focus:border-amber-400 transition"
                ></textarea>
              </div>
            </div>

            <div v-if="settingsSaveMessage" class="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded">
              ✓ {{ settingsSaveMessage }}
            </div>

            <button 
              type="submit" 
              :disabled="savingSettings"
              class="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-lg text-xs transition disabled:opacity-50 font-display"
            >
              {{ savingSettings ? 'Saving Configurations...' : 'Save Site Settings' }}
            </button>
          </form>

        </div>

        <!-- Content Management Tabs -->
        <FoundersManager v-else-if="activeTab === 'founders'" />
        <TestimonialsManager v-else-if="activeTab === 'testimonials'" />
        <PartnersManager v-else-if="activeTab === 'partners'" />
        <EarningsManager v-else-if="activeTab === 'earnings'" />

      </div>
    </main>

    <!-- Details View Modal -->
    <div v-if="detailsModal.isOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-slate-950 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
        <button 
          @click="detailsModal.isOpen = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-white text-xs font-semibold px-2 py-1 hover:bg-slate-900 rounded"
        >
          ✕ Close
        </button>

        <h4 class="text-lg font-display font-extrabold text-amber-400 border-b border-gray-900 pb-3">
          Prospect Capture Detail
        </h4>

        <div class="space-y-4 text-xs">
          <div>
            <span class="text-gray-500 font-bold uppercase tracking-wider block">Full Name:</span>
            <p class="text-gray-200 text-sm mt-0.5">{{ detailsModal.lead.fullName }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-gray-500 font-bold uppercase tracking-wider block">Email:</span>
              <p class="text-gray-200 mt-0.5">{{ detailsModal.lead.email }}</p>
            </div>
            <div>
              <span class="text-gray-500 font-bold uppercase tracking-wider block">Phone:</span>
              <p class="text-gray-200 mt-0.5">{{ detailsModal.lead.phone || 'No phone' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-gray-500 font-bold uppercase tracking-wider block">Country:</span>
              <p class="text-amber-500 font-extrabold uppercase mt-0.5">{{ detailsModal.lead.country }}</p>
            </div>
            <div>
              <span class="text-gray-500 font-bold uppercase tracking-wider block">Profile Type:</span>
              <p class="text-gray-200 mt-0.5">{{ detailsModal.lead.profileType }}</p>
            </div>
          </div>

          <div>
            <span class="text-gray-500 font-bold uppercase tracking-wider block">Challenges / Selected Options:</span>
            <div class="p-3 bg-slate-900/60 border border-gray-850 rounded-lg text-gray-300 leading-relaxed font-light mt-1 max-h-36 overflow-y-auto whitespace-pre-line custom-scrollbar">
              {{ parseChallenges(detailsModal.lead.challenges) }}
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2 text-[10px] text-gray-500">
            <span>Registered Date:</span>
            <span class="text-gray-400 font-medium">{{ formatDate(detailsModal.lead.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useLeadsStore } from '../../stores/leads';
import { useChatStore } from '../../stores/chat';
import { useCatalogStore } from '../../stores/catalog';
import { useSettingsStore } from '../../stores/settings';
import { useContentStore } from '../../stores/content';

import FoundersManager from '../../components/admin/FoundersManager.vue';
import TestimonialsManager from '../../components/admin/TestimonialsManager.vue';
import PartnersManager from '../../components/admin/PartnersManager.vue';
import EarningsManager from '../../components/admin/EarningsManager.vue';

const router = useRouter();
const authStore = useAuthStore();
const leadsStore = useLeadsStore();
const chatStore = useChatStore();
const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();
const contentStore = useContentStore();

const activeTab = ref('leads');
const leadsFilter = ref({ country: '', status: '' });
const adminReplyText = ref('');
const chatMessagesContainer = ref(null);
const chatPollingInterval = ref(null);

// Settings Form states
const settingsForm = ref({
  video_url: '',
  whatsapp_number: '',
  landing_hero_text: '',
  mission_statement: '',
  vision_statement: ''
});
const savingSettings = ref(false);
const settingsSaveMessage = ref('');

// Details Modal state
const detailsModal = ref({
  isOpen: false,
  lead: {}
});

const activeTabTitle = computed(() => {
  if (activeTab.value === 'leads') return 'Captured Leads (Distributor Signups)';
  if (activeTab.value === 'chats') return 'Live Chat Support Center';
  if (activeTab.value === 'settings') return 'System Configurations Dashboard';
  if (activeTab.value === 'founders') return 'Company Founders';
  if (activeTab.value === 'testimonials') return 'Client Testimonials';
  if (activeTab.value === 'partners') return 'Manufacturing Partners';
  if (activeTab.value === 'earnings') return 'Compensation Earning Streams';
  return 'Dashboard';
});

const activeChatSessionDetails = computed(() => {
  return chatStore.activeSessions.find(s => s.id === chatStore.selectedSessionId);
});

onMounted(async () => {
  // Check auth
  if (!authStore.token) {
    router.push('/admin/login');
    return;
  }

  await catalogStore.fetchCountries();
  await settingsStore.fetchSettings();
  await contentStore.fetchAll();
  
  // Prep settings form
  syncSettingsForm();

  // Load leads
  loadLeads();

  // Load chat sessions
  chatStore.adminFetchSessions();

  // Start general admin chat session polling (every 4 seconds)
  chatPollingInterval.value = setInterval(() => {
    chatStore.adminFetchSessions();
    if (chatStore.selectedSessionId) {
      chatStore.adminFetchSessionMessages(chatStore.selectedSessionId);
    }
  }, 4000);
});

onUnmounted(() => {
  if (chatPollingInterval.value) {
    clearInterval(chatPollingInterval.value);
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/admin/login');
};

// Leads operations
const loadLeads = () => {
  leadsStore.fetchLeads(leadsFilter.value);
};

const updateStatus = async (id, status) => {
  await leadsStore.updateLeadStatus(id, status);
};

const deleteLead = async (id) => {
  if (confirm('Are you sure you want to delete this lead?')) {
    await leadsStore.deleteLead(id);
  }
};

const showDetails = (lead) => {
  detailsModal.value.lead = lead;
  detailsModal.value.isOpen = true;
};

const parseChallenges = (data) => {
  if (!data) return 'None';
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.join('\n');
    }
    return parsed;
  } catch {
    return data;
  }
};

const statusColorClasses = (status) => {
  if (status === 'Pending') return 'border-amber-500/20 bg-amber-500/10 text-amber-400';
  if (status === 'Contacted') return 'border-blue-500/20 bg-blue-500/10 text-blue-400';
  if (status === 'Joined') return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
  return 'border-gray-800 bg-slate-900 text-gray-500';
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Chat operations
const selectSession = async (sessionUuid) => {
  await chatStore.adminFetchSessionMessages(sessionUuid);
  scrollToBottom();
};

const sendAdminReply = async () => {
  const text = adminReplyText.value.trim();
  if (!text || !chatStore.selectedSessionId) return;
  adminReplyText.value = '';

  await chatStore.adminSendReply(chatStore.selectedSessionId, text);
  scrollToBottom();
};

const closeSession = async (sessionUuid) => {
  if (confirm('Close this support session?')) {
    await chatStore.adminCloseSession(sessionUuid);
  }
};

const formatTime = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatMessagesContainer.value) {
    chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight;
  }
};

// Settings operations
const syncSettingsForm = () => {
  settingsForm.value.video_url = settingsStore.settings['video_url'] || '';
  settingsForm.value.whatsapp_number = settingsStore.settings['whatsapp_number'] || '';
  settingsForm.value.landing_hero_text = settingsStore.settings['landing_hero_text'] || '';
  settingsForm.value.mission_statement = settingsStore.settings['mission_statement'] || '';
  settingsForm.value.vision_statement = settingsStore.settings['vision_statement'] || '';
};

const saveSettings = async () => {
  savingSettings.value = true;
  settingsSaveMessage.value = '';
  const success = await settingsStore.adminUpdateSettings(settingsForm.value);
  if (success) {
    settingsSaveMessage.value = 'Configurations updated successfully!';
  } else {
    alert('Failed to update configurations.');
  }
  savingSettings.value = false;
};

// Auto scroll on new messages
watch(() => chatStore.messages.length, () => {
  scrollToBottom();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(251, 191, 36, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(251, 191, 36, 0.4);
}
</style>
