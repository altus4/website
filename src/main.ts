import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import altus4Plugin from './plugins/altus4';

const app = createApp(App);
app.use(createPinia());

// Install Altus4 plugin
app.use(altus4Plugin, {
  baseURL:
    import.meta.env.VITE_ALTUS4_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:3000/api/v1',
  timeout: 30000,
  debug: import.meta.env.DEV,
});
app.mount('#app');
