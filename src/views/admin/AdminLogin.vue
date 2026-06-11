<template>
  <div class="min-h-screen bg-white text-[#0A0F0D] flex flex-col justify-between font-sans relative overflow-hidden">
    <!-- Subtle background accent -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-[#008A20]/5 rounded-full blur-[100px] pointer-events-none"></div>

    <header class="p-6 border-b border-zinc-100">
      <div class="max-w-6xl mx-auto flex items-center gap-3">
        <router-link to="/" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#008A20] flex items-center justify-center font-bold text-white text-sm shadow">
            NMA
          </div>
          <span class="font-display font-bold text-sm tracking-wide text-[#0A0F0D]">
            Network Marketing Academia
          </span>
        </router-link>
      </div>
    </header>

    <main class="flex-grow flex items-center justify-center px-4 relative z-10">
      <div class="max-w-md w-full bg-white border border-zinc-200 rounded-2xl p-8 shadow-lg space-y-6">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-xl bg-[#008A20]/10 flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🔐</span>
          </div>
          <h2 class="text-2xl font-display font-bold text-[#0A0F0D]">Trainer Workspace</h2>
          <p class="text-xs text-zinc-500 leading-relaxed">Authenticate using administrator credentials to manage catalog, leads, settings, and support inquiries.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-1">
            <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Username</label>
            <input 
              type="text" 
              v-model="username" 
              required 
              placeholder="admin"
              class="w-full bg-[#F4F6F5] border border-zinc-200 rounded-lg p-3 text-xs text-[#0A0F0D] focus:outline-none focus:border-[#008A20] focus:ring-1 focus:ring-[#008A20]/20 transition placeholder:text-zinc-400" 
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              v-model="password" 
              required 
              placeholder="••••••••"
              class="w-full bg-[#F4F6F5] border border-zinc-200 rounded-lg p-3 text-xs text-[#0A0F0D] focus:outline-none focus:border-[#008A20] focus:ring-1 focus:ring-[#008A20]/20 transition" 
            />
          </div>

          <div v-if="authStore.error" class="text-xs text-red-600 font-semibold p-3 bg-red-50 border border-red-200 rounded-lg">
            ⚠️ {{ authStore.error }}
          </div>

          <button 
            type="submit" 
            :disabled="authStore.loading"
            class="w-full bg-[#008A20] hover:bg-[#006616] text-white font-bold py-3 rounded-lg text-sm transition disabled:opacity-50 font-display flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{{ authStore.loading ? 'Authenticating...' : 'Sign In to Workspace' }}</span>
          </button>
        </form>
      </div>
    </main>

    <footer class="p-6 text-center text-xs text-zinc-400 border-t border-zinc-100">
      © 2026 Network Marketing Academia • Secured Portal
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');

const handleLogin = async () => {
  const success = await authStore.login(username.value, password.value);
  if (success) {
    router.push('/admin/dashboard');
  }
};
</script>
