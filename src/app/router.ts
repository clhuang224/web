import { createMemoryHistory, createRouter } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import PortfolioPage from '../pages/PortfolioPage.vue'
import AboutPage from '../pages/AboutPage.vue'

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/portfolio', component: PortfolioPage },
    { path: '/about', component: AboutPage },
  ],
})
