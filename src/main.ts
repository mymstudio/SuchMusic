import { createApp } from "vue";
import App from "./App.vue";
import naive from 'naive-ui'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'

import TopAlbums from './components/views/TopAlbums.vue'
import SearchA from './components/Search.vue'

const routes = [
  { path: '/', component: TopAlbums },
  { path: '/search', component: SearchA },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const pinia = createPinia()


const app = createApp(App)
app.use(naive)
.use(pinia)
.use(router)
.mount("#app");
