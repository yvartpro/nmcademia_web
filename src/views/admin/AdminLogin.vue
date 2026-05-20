<template>
  <div class="min-h-screen bg-[#0b0f19] text-white flex flex-col justify-between font-sans relative overflow-hidden">
    <!-- Background glowing bubbles -->
    <div class="absolute top-1/3 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

    <header class="p-6">
      <div class="max-w-6xl mx-auto flex items-center gap-3">
        <router-link to="/" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-bold text-slate-900 text-sm shadow">
            NMA
          </div>
          <span class="font-display font-bold text-sm tracking-wide bg-gradient-to-r from-amber-400 to-yellow-250 bg-clip-text text-transparent">
            Network Marketing Academia
          </span>
        </router-link>
      </div>
    </header>

    <main class="flex-grow flex items-center justify-center px-4 relative z-10">
      <div class="max-w-md w-full bg-slate-900/40 border border-gray-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl space-y-6">
        <div class="text-center space-y-2">
          <h2 class="text-2xl font-display font-bold bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">Trainer Workspace</h2>
          <p class="text-xs text-gray-400">Authenticate using administrator credentials to manage catalog, leads, settings, and support inquiries.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-1">
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</label>
            <input 
              type="text" 
              v-model="username" 
              required 
              placeholder="admin"
              class="w-full bg-slate-950 border border-gray-800 rounded-lg p-3 text-xs focus:outline-none focus:border-amber-400 transition" 
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              v-model="password" 
              required 
              placeholder="••••••••"
              class="w-full bg-slate-950 border border-gray-800 rounded-lg p-3 text-xs focus:outline-none focus:border-amber-400 transition" 
            />
          </div>

          <div v-if="authStore.error" class="text-xs text-red-500 font-semibold p-2 bg-red-500/10 border border-red-500/20 rounded">
            ⚠️ {{ authStore.error }}
          </div>

          <button 
            type="submit" 
            :disabled="authStore.loading"
            class="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-lg text-xs transition disabled:opacity-50 font-display flex items-center justify-center gap-2"
          >
            <span>{{ authStore.loading ? 'Authenticating...' : 'Sign In to Workspace' }}</span>
          </button>
        </form>
      </div>
    </main>

    <footer class="p-6 text-center text-xs text-gray-600 border-t border-gray-900 bg-slate-950/40">
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
