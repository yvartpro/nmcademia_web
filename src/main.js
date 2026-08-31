import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './index.css';
import { useTranslationsStore } from './stores/translations';
import { useLanguagesStore } from './stores/languages';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);

// create translations store and expose $t globally
const translations = useTranslationsStore(pinia);
app.config.globalProperties.$t = (key, def = '') => translations.t(key, def);

// Bootstrap the app: detect the language and load its translations BEFORE
// mounting. This prevents a flash of raw translation-key strings while the
// locale is still being fetched. The static splash in index.html is shown in
// the meantime. A timeout guarantees the app always mounts, even if the
// languages/translations endpoints are slow or unavailable.
const MAX_BOOT_WAIT_MS = 4000;

async function bootstrap() {
  const languagesStore = useLanguagesStore(pinia);
  try {
    await Promise.race([
      (async () => {
        await languagesStore.fetchLanguages();
        const selected = languagesStore.selectedLanguageId;
        if (selected) await translations.initForSelected(selected);
      })(),
      new Promise((resolve) => setTimeout(resolve, MAX_BOOT_WAIT_MS))
    ]);
  } catch (e) {
    // non-fatal: translations can still be loaded later by components
    console.warn('Translations init failed:', e);
  }
  app.mount('#app');
}

bootstrap();
