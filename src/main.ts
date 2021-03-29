import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import 'element-plus/lib/theme-chalk/index.css';
import './assets/sass/index.scss'
createApp(App).use(store).use(ElementPlus).mount('#app')
