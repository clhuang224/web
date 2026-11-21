import { createMemoryHistory, createRouter } from 'vue-router'
import AboutPage from '../pages/AboutPage.vue'
import DrawingPage from '../pages/DrawingPage.vue'
import DrawingsPage from '../pages/DrawingsPage.vue'
import EmbedPage from '../pages/EmbedPage.vue'
import HomePage from '../pages/HomePage.vue'
import PortfolioPage from '../pages/PortfolioPage.vue'
import ProjectPage from '../pages/ProjectPage.vue'

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/portfolio', component: PortfolioPage },
    { path: '/portfolio/:id', component: ProjectPage },
    { path: '/drawings', component: DrawingsPage },
    { path: '/drawing/:id', component: DrawingPage },
    { path: '/about', component: AboutPage },
    { path: '/behind-the-scenes/:id?', component: EmbedPage },
    { path: '/blog/:id?', component: EmbedPage },
  ],
})
