import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/style.css'

import App from './App.vue'
import router from './router'
import initializationFirebase from './firebase/initialization'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
initializationFirebase()
