import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/conflicts/:id',
      name: 'conflict-detail',
      component: () => import('../views/DetailView.vue')
    },
    {
      path: '/create',
      name: 'create-conflict',
      component: () => import('../views/Createview.vue')
    }
  ]
})

export default router