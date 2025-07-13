import { createApp } from "vue";
import App from "./App.vue";
import naive from 'naive-ui'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import LocalSongs from "./components/views/LocalSongs.vue";
import TopAlbums from './components/views/TopAlbums.vue'
import SearchA from './components/Search.vue'

const routes = [
  { path: '/', component: TopAlbums, name: 'TopAlbums' },
  { path: '/search', component: SearchA },
  { path: '/local', component: LocalSongs, name: 'LocalSongs' },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
})

const pinia = createPinia()


const app = createApp(App)
app.use(naive)
.use(pinia)
.use(router)
.mount("#app");
