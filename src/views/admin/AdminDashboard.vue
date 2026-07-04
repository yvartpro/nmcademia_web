<template>
  <div class="min-h-screen bg-white text-[#0A0F0D] flex font-sans">
    
    <!-- Sidebar Navigation -->
    <aside class="w-64 bg-[#F4F6F5] border-r border-zinc-200 flex flex-col justify-between shrink-0">
      <div>
        <div class="p-6 border-b border-zinc-200 flex items-center gap-3">
          <AppLogo size="sm" :show-text="false" />
          <div>
            <h1 class="font-display font-bold text-xs tracking-wide text-[#0A0F0D]">NMA Workspace</h1>
            <span class="text-[9px] text-[#008A20] font-mono tracking-widest">ADMINISTRATOR</span>
          </div>
        </div>

        <nav class="p-4 space-y-1 max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
          <button 
            @click="activeTab = 'profile'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'profile' 
                ? 'bg-[#008A20]/10 text-[#008A20] border-l-4 border-[#008A20] font-bold' 
                : 'text-zinc-600 hover:text-[#0A0F0D] hover:bg-zinc-200/60'
            ]"
          >
            <span>👤</span>
            <span>My Profile</span>
          </button>

          <button 
            @click="activeTab = 'leads'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'leads' 
                ? 'bg-[#008A20]/10 text-[#008A20] border-l-4 border-[#008A20] font-bold' 
                : 'text-zinc-600 hover:text-[#0A0F0D] hover:bg-zinc-200/60'
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
                ? 'bg-[#008A20]/10 text-[#008A20] border-l-4 border-[#008A20] font-bold' 
                : 'text-zinc-600 hover:text-[#0A0F0D] hover:bg-zinc-200/60'
            ]"
          >
            <span>💬</span>
            <span>Live Chat Support</span>
          </button>

          <div>
            <button 
              @click="selectSettingsSection('contact')"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
                activeTab === 'settings' 
                  ? 'bg-[#008A20]/10 text-[#008A20] border-l-4 border-[#008A20] font-bold' 
                  : 'text-zinc-600 hover:text-[#0A0F0D] hover:bg-zinc-200/60'
              ]"
            >
              <span>⚙️</span>
              <span>Site Configurations</span>
            </button>

            <div v-if="activeTab === 'settings'" class="ml-6 mt-1 space-y-1">
              <button
                v-for="item in settingsSectionItems"
                :key="item.id"
                type="button"
                @click="selectSettingsSection(item.id)"
                class="w-full rounded-md px-3 py-2 text-left text-[11px] font-semibold transition-all"
                :class="settingsSection === item.id
                  ? 'bg-white text-[#008A20] shadow-sm'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-[#0A0F0D]'"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
          
          <div class="pt-4 pb-2">
            <span class="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Content Management</span>
          </div>

          <button 
            @click="activeTab = 'founders'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'founders' ? 'bg-[#008A20]/10 text-[#008A20] border border-[#008A20]/20' : 'text-zinc-600 hover:text-[#0A0F0D] hover:bg-zinc-200/60 border border-transparent'
            ]"
          >
            <span>👔</span>
            <span>Founders</span>
          </button>

          <button 
            @click="activeTab = 'testimonials'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'testimonials' ? 'bg-[#008A20]/10 text-[#008A20] border border-[#008A20]/20' : 'text-zinc-600 hover:text-[#0A0F0D] hover:bg-zinc-200/60 border border-transparent'
            ]"
          >
            <span>⭐</span>
            <span>Testimonials</span>
          </button>

          <button 
            @click="activeTab = 'partners'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
              activeTab === 'partners' ? 'bg-[#008A20]/10 text-[#008A20] border border-[#008A20]/20' : 'text-zinc-600 hover:text-[#0A0F0D] hover:bg-zinc-200/60 border border-transparent'
            ]"
          >
            <span>🏭</span>
            <span>Manufacturing</span>
          </button>

          <button 
            @click="activeTab = 'earnings'"
            :class="tabClass('earnings')"
          >
            <span>💰</span>
            <span>Earning Streams</span>
          </button>

          <button 
            @click="activeTab = 'ways'"
            :class="tabClass('ways')"
          >
            <span>🧭</span>
            <span>Ways of Earning</span>
          </button>

          <button @click="activeTab = 'faqs'" :class="tabClass('faqs')">
            <span>❓</span>
            <span>FAQs</span>
          </button>

          <button @click="activeTab = 'products'" :class="tabClass('products')">
            <span>📦</span>
            <span>Products</span>
          </button>

          <button @click="activeTab = 'packages'" :class="tabClass('packages')">
            <span>🎁</span>
            <span>Packages</span>
          </button>

          <button @click="activeTab = 'countries'" :class="tabClass('countries')">
            <span>🌍</span>
            <span>Countries</span>
          </button>

          <button @click="activeTab = 'media'" :class="tabClass('media')">
            <span>🖼️</span>
            <span>Media Library</span>
          </button>

          <button @click="activeTab = 'presentations'" :class="tabClass('presentations')">
            <span>🎬</span>
            <span>Presentations</span>
          </button>
        </nav>
      </div>

      <div class="p-4 border-t border-zinc-200">
        <button 
          @click="handleLogout"
          class="w-full bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-zinc-200 text-zinc-500 text-xs font-bold py-2.5 rounded-lg transition"
        >
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Workspace -->
    <main class="flex-grow flex flex-col bg-[#F4F6F5]/40 overflow-y-auto">
      
      <!-- Top header bar -->
      <header class="h-16 border-b border-zinc-200 px-8 flex items-center justify-between shrink-0 bg-white">
        <h2 class="text-sm font-bold tracking-wide uppercase text-[#0A0F0D]">
          {{ activeTabTitle }}
        </h2>
        <div class="flex items-center gap-4 text-xs">
          <span class="text-zinc-500">Database Status:</span>
          <span class="flex items-center gap-1.5 font-semibold text-[#008A20]">
            <span class="w-1.5 h-1.5 rounded-full bg-[#008A20]"></span> Connected
          </span>
        </div>
      </header>

      <!-- Content viewport -->
      <div class="flex-grow p-8">
        <OwnerProfileManager v-if="activeTab === 'profile'" />
        
        <!-- Tab 1: Leads Dashboard -->
        <div v-if="activeTab === 'leads'" class="space-y-6 animate-fade-in">
          
          <!-- Summary statistics cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-5 bg-white border border-zinc-200 rounded-xl shadow-sm">
              <span class="text-xs text-zinc-500 font-bold uppercase tracking-wider block">Total Captured</span>
              <p class="text-2xl font-black text-[#0A0F0D] mt-1">{{ totalLeads }}</p>
            </div>
            <div class="p-5 bg-white border border-zinc-200 rounded-xl shadow-sm">
              <span class="text-xs text-amber-600 font-bold uppercase tracking-wider block">Pending</span>
              <p class="text-2xl font-black text-amber-600 mt-1">{{ pendingLeads }}</p>
            </div>
            <div class="p-5 bg-white border border-zinc-200 rounded-xl shadow-sm">
              <span class="text-xs text-blue-600 font-bold uppercase tracking-wider block">Contacted</span>
              <p class="text-2xl font-black text-blue-600 mt-1">{{ contactedLeads }}</p>
            </div>
            <div class="p-5 bg-white border border-zinc-200 rounded-xl shadow-sm">
              <span class="text-xs text-[#008A20] font-bold uppercase tracking-wider block">Joined Alliance</span>
              <p class="text-2xl font-black text-[#008A20] mt-1">{{ joinedLeads }}</p>
            </div>
          </div>

          <!-- Filters area -->
          <div class="bg-white border border-zinc-200 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-sm">
            <div class="flex flex-wrap gap-3">
              <CountrySelect
                v-model="leadsFilter.country"
                show-all-option
                all-label="All Countries"
                @change="loadLeads"
              />

              <select 
                v-model="leadsFilter.status"
                @change="loadLeads"
                class="bg-white border border-zinc-200 text-xs text-[#0A0F0D] rounded-lg px-3 py-2 focus:outline-none focus:border-[#008A20]"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Joined">Joined</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <button @click="loadLeads" class="text-xs text-[#008A20] hover:underline font-semibold">
              ⟳ Refresh Leads
            </button>
          </div>

          <!-- Leads Data Table -->
          <div class="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="bg-[#F4F6F5] text-[10px] text-[#0A0F0D] font-bold uppercase tracking-widest border-b border-zinc-200">
                    <th class="p-4">Name</th>
                    <th class="p-4">Email</th>
                    <th class="p-4">Country</th>
                    <th class="p-4">Segment Profile</th>
                    <th class="p-4">Status</th>
                    <th class="p-4">Date</th>
                    <th class="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-100 text-xs">
                  <tr v-for="lead in leadsStore.leads" :key="lead.id" class="hover:bg-[#F4F6F5]/60 transition">
                    <td class="p-4 font-semibold text-[#0A0F0D]">{{ lead.fullName }}</td>
                    <td class="p-4 text-zinc-500">{{ lead.email }}</td>
                    <td class="p-4">
                      <CountryLabel :code="lead.country" show-name size="sm" code-class="text-[#008A20]" />
                    </td>
                    <td class="p-4 text-zinc-500 truncate max-w-[150px]">{{ lead.profileType }}</td>
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
                    <td class="p-4 text-zinc-400">{{ formatDate(lead.createdAt) }}</td>
                    <td class="p-4 text-right space-x-2 shrink-0">
                      <button 
                        @click="showDetails(lead)"
                        class="text-[10px] border border-zinc-200 hover:border-[#008A20] hover:text-[#008A20] px-2 py-1 rounded transition"
                      >
                        View Details
                      </button>
                      <button 
                        @click="deleteLead(lead.id)"
                        class="text-[10px] border border-transparent hover:border-red-200 hover:text-red-500 px-2 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr v-if="leadsStore.leads.length === 0">
                    <td colspan="7" class="p-8 text-center text-zinc-400 text-xs">
                      No leads captured matching filters.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab 2: Live Chat Center (Split Pane) -->
        <div v-else-if="activeTab === 'chats'" class="h-[calc(100vh-12rem)] min-h-[450px] border border-zinc-200 rounded-xl overflow-hidden flex bg-white animate-fade-in shadow-sm">
          
          <!-- Chats Sessions Left List -->
          <div class="w-80 border-r border-zinc-200 flex flex-col justify-between shrink-0 bg-[#F4F6F5]/50">
            <header class="p-4 border-b border-zinc-200 bg-white flex items-center justify-between">
              <span class="text-xs font-bold text-[#0A0F0D]">Active Inquiries</span>
              <button @click="chatStore.adminFetchSessions()" class="text-[10px] text-[#008A20] hover:underline font-semibold">
                Refresh
              </button>
            </header>

            <div class="flex-grow overflow-y-auto divide-y divide-zinc-100 custom-scrollbar">
              <div 
                v-for="session in chatStore.activeSessions" 
                :key="session.id"
                @click="selectSession(session.id)"
                :class="[
                  'p-4 cursor-pointer transition-all duration-200 space-y-1 text-xs',
                  chatStore.selectedSessionId === session.id 
                    ? 'bg-[#008A20]/5 border-l-4 border-[#008A20]' 
                    : 'hover:bg-[#F4F6F5]'
                ]"
              >
                <div class="flex items-center justify-between">
                  <h6 class="font-bold" :class="{'text-[#008A20]': chatStore.selectedSessionId === session.id, 'text-[#0A0F0D]': chatStore.selectedSessionId !== session.id}">
                    {{ session.visitorName }}
                  </h6>
                  <span class="text-[9px] text-zinc-400">
                    {{ formatTime(session.lastMessageAt) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-[11px] text-zinc-500 truncate max-w-[140px] font-light">
                    {{ session.email || 'No Email' }}
                  </p>
                  <span 
                    :class="[
                      'text-[8px] font-bold uppercase rounded px-1.5 py-0.5',
                      session.status === 'active' ? 'bg-[#008A20]/10 border border-[#008A20]/20 text-[#008A20]' : 'bg-zinc-100 text-zinc-400'
                    ]"
                  >
                    {{ session.status }}
                  </span>
                </div>
              </div>
              <div v-if="chatStore.activeSessions.length === 0" class="text-center text-zinc-400 text-xs py-8">
                No chat sessions found.
              </div>
            </div>
          </div>

          <!-- Chat Conversation Area -->
          <div class="flex-grow flex flex-col justify-between bg-white">
            <!-- Header -->
            <header v-if="chatStore.selectedSessionId" class="p-4 border-b border-zinc-200 bg-[#F4F6F5]/40 flex items-center justify-between">
              <div class="flex items-center gap-3 text-xs">
                <span class="font-bold text-[#008A20]">
                  {{ activeChatSessionDetails?.visitorName }}
                </span>
                <span class="text-zinc-400">•</span>
                <span class="text-zinc-500">
                  {{ activeChatSessionDetails?.phone || 'No phone' }}
                </span>
              </div>
              <button 
                @click="closeSession(chatStore.selectedSessionId)"
                class="text-[10px] bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 px-3 py-1 rounded transition"
              >
                Close Chat Session
              </button>
            </header>

            <!-- Message Area -->
            <div class="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar" ref="chatMessagesContainer">
              <div v-if="!chatStore.selectedSessionId" class="h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
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
                      ? 'self-end ml-auto bg-[#008A20]/10 border border-[#008A20]/20 text-[#0A0F0D] rounded-br-none'
                      : 'self-start mr-auto bg-[#F4F6F5] border border-zinc-200 text-[#0A0F0D] rounded-bl-none'
                  ]"
                >
                  <p>{{ msg.message }}</p>
                  <span class="text-[8px] text-zinc-400 block text-right mt-1.5">
                    {{ formatTime(msg.createdAt) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer Reply Controls -->
            <footer v-if="chatStore.selectedSessionId" class="p-4 border-t border-zinc-200 bg-white flex gap-2">
              <input 
                type="text" 
                v-model="adminReplyText" 
                @keyup.enter="sendAdminReply"
                placeholder="Type your response..." 
                class="flex-grow bg-[#F4F6F5] border border-zinc-200 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#008A20] text-[#0A0F0D]"
              />
              <button 
                @click="sendAdminReply"
                :disabled="!adminReplyText.trim()"
                class="bg-[#008A20] hover:bg-[#006616] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition"
              >
                Send Reply
              </button>
            </footer>
          </div>

        </div>

        <SiteSettingsManager v-else-if="activeTab === 'settings'" :active-group="settingsSection" />

        <FoundersManager v-else-if="activeTab === 'founders'" />
        <TestimonialsManager v-else-if="activeTab === 'testimonials'" />
        <PartnersManager v-else-if="activeTab === 'partners'" />
        <EarningsManager v-else-if="activeTab === 'earnings'" />
        <WaysManager v-else-if="activeTab === 'ways'" />
        <FAQsManager v-else-if="activeTab === 'faqs'" />
        <ProductsManager v-else-if="activeTab === 'products'" />
        <PackagesManager v-else-if="activeTab === 'packages'" />
        <CountriesManager v-else-if="activeTab === 'countries'" />
        <MediaLibrary v-else-if="activeTab === 'media'" />
        <PresentationsManager v-else-if="activeTab === 'presentations'" />

      </div>
    </main>

    <!-- Details View Modal -->
    <div v-if="detailsModal.isOpen" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative">
        <button 
          @click="detailsModal.isOpen = false"
          class="absolute top-4 right-4 text-zinc-400 hover:text-[#0A0F0D] text-xs font-semibold px-2 py-1 hover:bg-zinc-100 rounded"
        >
          ✕ Close
        </button>

        <h4 class="text-lg font-display font-extrabold text-[#008A20] border-b border-zinc-200 pb-3">
          Prospect Capture Detail
        </h4>

        <div class="space-y-4 text-xs">
          <div>
            <span class="text-zinc-400 font-bold uppercase tracking-wider block">Full Name:</span>
            <p class="text-[#0A0F0D] text-sm mt-0.5">{{ detailsModal.lead.fullName }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-zinc-400 font-bold uppercase tracking-wider block">Email:</span>
              <p class="text-[#0A0F0D] mt-0.5">{{ detailsModal.lead.email }}</p>
            </div>
            <div>
              <span class="text-zinc-400 font-bold uppercase tracking-wider block">Phone:</span>
              <p class="text-[#0A0F0D] mt-0.5">{{ detailsModal.lead.phone || 'No phone' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-zinc-400 font-bold uppercase tracking-wider block">Country:</span>
              <p class="text-[#008A20] font-extrabold uppercase mt-0.5">{{ detailsModal.lead.country }}</p>
            </div>
            <div>
              <span class="text-zinc-400 font-bold uppercase tracking-wider block">Profile Type:</span>
              <p class="text-[#0A0F0D] mt-0.5">{{ detailsModal.lead.profileType }}</p>
            </div>
          </div>

          <div>
            <span class="text-zinc-400 font-bold uppercase tracking-wider block">Challenges / Selected Options:</span>
            <div class="p-3 bg-[#F4F6F5] border border-zinc-200 rounded-lg text-[#0A0F0D] leading-relaxed font-light mt-1 max-h-36 overflow-y-auto whitespace-pre-line custom-scrollbar">
              {{ parseChallenges(detailsModal.lead.challenges) }}
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2 text-[10px] text-zinc-400">
            <span>Registered Date:</span>
            <span class="text-zinc-600 font-medium">{{ formatDate(detailsModal.lead.createdAt) }}</span>
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
import { useContentStore } from '../../stores/content';

import FoundersManager from '../../components/admin/FoundersManager.vue';
import TestimonialsManager from '../../components/admin/TestimonialsManager.vue';
import PartnersManager from '../../components/admin/PartnersManager.vue';
import EarningsManager from '../../components/admin/EarningsManager.vue';
import WaysManager from '../../components/admin/WaysManager.vue';
import FAQsManager from '../../components/admin/FAQsManager.vue';
import ProductsManager from '../../components/admin/ProductsManager.vue';
import PackagesManager from '../../components/admin/PackagesManager.vue';
import CountriesManager from '../../components/admin/CountriesManager.vue';
import MediaLibrary from '../../components/admin/MediaLibrary.vue';
import PresentationsManager from '../../components/admin/PresentationsManager.vue';
import SiteSettingsManager from '../../components/admin/SiteSettingsManager.vue';
import { SETTING_GROUPS } from '../../config/settingMeta';
import OwnerProfileManager from '../../components/admin/OwnerProfileManager.vue';
import CountrySelect from '../../components/ui/CountrySelect.vue';
import AppLogo from '../../components/ui/AppLogo.vue';
import { useMediaStore } from '../../stores/media';

const router = useRouter();
const authStore = useAuthStore();
const leadsStore = useLeadsStore();
const activeTab = ref('profile');
const settingsSection = ref('contact');
const settingsSectionItems = SETTING_GROUPS.map(group => ({
  id: group.id,
  label: group.title,
}));
const chatStore = useChatStore();
const catalogStore = useCatalogStore();
const contentStore = useContentStore();
const mediaStore = useMediaStore();

const totalLeads = computed(() => leadsStore.leads.length);
const pendingLeads = computed(() => leadsStore.leads.filter(l => l.status === 'Pending').length);
const contactedLeads = computed(() => leadsStore.leads.filter(l => l.status === 'Contacted').length);
const joinedLeads = computed(() => leadsStore.leads.filter(l => l.status === 'Joined').length);

const leadsFilter = ref({ country: '', status: '' });
const adminReplyText = ref('');
const chatMessagesContainer = ref(null);

// Details Modal state
const detailsModal = ref({
  isOpen: false,
  lead: {}
});

const activeTabTitle = computed(() => {
  if (activeTab.value === 'profile') return 'My Profile & Domain Mapping';
  if (activeTab.value === 'leads') return 'Captured Leads (Distributor Signups)';
  if (activeTab.value === 'chats') return 'Live Chat Support Center';
  if (activeTab.value === 'settings') return 'System Configurations Dashboard';
  if (activeTab.value === 'founders') return 'Company Founders';
  if (activeTab.value === 'testimonials') return 'Client Testimonials';
  if (activeTab.value === 'partners') return 'Manufacturing Partners';
  if (activeTab.value === 'earnings') return 'Compensation Earning Streams';
  if (activeTab.value === 'ways') return 'Ways of Earning';
  if (activeTab.value === 'faqs') return 'Frequently Asked Questions';
  if (activeTab.value === 'products') return 'Product Catalog';
  if (activeTab.value === 'packages') return 'Registration Packages & Pricing';
  if (activeTab.value === 'countries') return 'Countries & WhatsApp Numbers';
  if (activeTab.value === 'media') return 'Media Library';
  if (activeTab.value === 'presentations') return 'Product Presentations';
  return 'Dashboard';
});

const tabClass = (tab) => [
  'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
  activeTab.value === tab
    ? 'bg-[#008A20]/10 text-[#008A20] border border-[#008A20]/20'
    : 'text-zinc-600 hover:text-[#0A0F0D] hover:bg-zinc-200/60 border border-transparent'
];

const selectSettingsSection = (section) => {
  activeTab.value = 'settings';
  settingsSection.value = section;
};

const activeChatSessionDetails = computed(() => {
  return chatStore.activeSessions.find(s => s.id === chatStore.selectedSessionId);
});

onMounted(async () => {
  // Check auth
  if (!authStore.token) {
    router.push('/admin/login');
    return;
  }

  await Promise.all([
    catalogStore.adminFetchCountries(),
    catalogStore.fetchPackages(),
    catalogStore.fetchProducts(),
    contentStore.fetchAllAdmin(),
    mediaStore.fetchAll()
  ]);

  // Load leads
  loadLeads();

  // Load chat sessions (also connects to WebSockets)
  chatStore.adminFetchSessions();
});

onUnmounted(() => {
  chatStore.disconnectSocket();
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
  if (status === 'Pending') return 'border-amber-300 bg-amber-50 text-amber-700';
  if (status === 'Contacted') return 'border-blue-200 bg-blue-50 text-blue-700';
  if (status === 'Joined') return 'border-[#008A20]/20 bg-[#008A20]/5 text-[#008A20]';
  return 'border-zinc-200 bg-zinc-50 text-zinc-500';
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
  background: #F4F6F5;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #008A20;
}
</style>
