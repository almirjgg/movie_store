import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/authService'
import AuthView from '../views/AuthView.vue'
import MovieListView from '../views/MovieListView.vue'
import MovieView from '../views/MovieView.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
      children: [
        {
          path: '',
          name: 'login-form',
          component: () => import('../components/auth/LoginForm.vue')
        },
        {
          path: 'signup',
          name: 'signup-form',
          component: () => import('../components/auth/SignupForm.vue')
        }
      ]
    },
    {
      path: '/movies',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'movies',
          component: MovieListView,
          meta: { requiresAuth: true }
        },
        {
          path: ':id',
          name: 'movie-detail',
          component: MovieView,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

// Guard de navegación para proteger las rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  if (to.path === '/' && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
