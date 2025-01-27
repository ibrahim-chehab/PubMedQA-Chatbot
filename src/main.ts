import { createApp } from 'vue'
import { createPinia } from 'pinia'; // Import Pinia
import '@fortawesome/fontawesome-free/css/all.css';
import './style.scss'
import App from './App.vue'

const app = createApp(App);

app.use(createPinia()); // Use Pinia
app.mount('#app');