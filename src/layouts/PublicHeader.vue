<template>
  <header
    class="sticky top-0 z-50 border-b border-zinc-200/80 backdrop-blur-xl"
    :class="transparent ? 'bg-transparent' : 'bg-surface-1/90'"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
      <router-link to="/" class="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl">
        <AppLogo :logo-url="logoUrl" :show-tagline="showTagline" />
      </router-link>
      <div class="flex items-center gap-2">
        <UiButton
          v-if="showMemberLink && memberStore.isRegistered"
          variant="ghost"
          size="sm"
          :to="memberStore.journey.defaultRoute"
        >
          {{ $t('header.myPath') }}
        </UiButton>
        <router-link
          v-if="showAdmin"
          to="/admin/login"
          class="text-xs font-medium text-zinc-500 hover:text-zinc-700 px-2 py-1"
        >
          {{ $t('header.admin') }}
        </router-link>
        <select v-model="selected" @change="onChange" :disabled="languagesStore.loading || !languages.length" class="text-xs bg-white border border-accent/20 text-accent rounded-md px-3 py-1 shadow-sm hover:shadow-md transition-shadow duration-150 appearance-none pr-6 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent-dark">
          <option v-if="!languages.length" disabled value="">{{ languagesStore.loading ? 'Loading languages...' : 'No languages available' }}</option>
          <option v-for="l in languages" :key="l.id" :value="l.id">{{ l.name }}</option>
        </select>
      </div>
    </div>
  </header>
</template>

<script setup>
import AppLogo from '../components/ui/AppLogo.vue';
import UiButton from '../components/ui/UiButton.vue';
import { useMemberStore } from '../stores/member';
import { useLanguagesStore } from '../stores/languages';
import { useTranslationsStore } from '../stores/translations';
import { useContentStore } from '../stores/content';
import { useCatalogStore } from '../stores/catalog';
import { useSettingsStore } from '../stores/settings';
import { useOwnerStore } from '../stores/owner';
import { onMounted, ref } from 'vue';

const memberStore = useMemberStore();
const languagesStore = useLanguagesStore();
const contentStore = useContentStore();
const catalogStore = useCatalogStore();
const settingsStore = useSettingsStore();
const ownerStore = useOwnerStore();
const languages = ref([]);
const selected = ref(null);
const translationsStore = useTranslationsStore();

onMounted(async () => {
  console.log('PublicHeader mounted');
  const langs = await languagesStore.fetchLanguages();
  console.log('PublicHeader fetched languages:', langs);
  languages.value = langs;
  selected.value = languagesStore.selectedLanguageId;
  // load visitor UI translations for selected language
  try { await translationsStore.loadById(selected.value); } catch (e) { /* ignore */ }
});

const onChange = async () => {
  languagesStore.setSelectedLanguage(selected.value);
  try { await translationsStore.loadById(selected.value); } catch (e) { /* ignore */ }
  // Re-fetch public content to reflect new language without a full reload
  try {
    await Promise.all([
      contentStore.fetchAll(),
      catalogStore.fetchProducts(),
      catalogStore.fetchPackages(),
      settingsStore.fetchSettingsDetailed(),
      ownerStore.fetchProfile()
    ]);
  } catch (err) {
    // fallback to reload if any fetch fails
    window.location.reload();
  }
};

defineProps({
  logoUrl: { type: String, default: '' },
  transparent: { type: Boolean, default: false },
  showTagline: { type: Boolean, default: false },
  showMemberLink: { type: Boolean, default: true },
  showAdmin: { type: Boolean, default: true },
});
</script>
