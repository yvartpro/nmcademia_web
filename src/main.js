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

// Try to initialize translations early: fetch languages and load selected locale
(async () => {
	try {
		const languagesStore = useLanguagesStore(pinia);
		await languagesStore.fetchLanguages();
		const selected = languagesStore.selectedLanguageId;
		if (selected) await translations.initForSelected(selected);
	} catch (e) {
		// non-fatal: translations can still be loaded later by components
		console.warn('Translations init failed:', e);
	}
})();

app.mount('#app');
