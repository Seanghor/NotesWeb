import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/Home.vue'
import LoginPage from '@/views/Login.vue'
import RegisterPage from '@/views/Register.vue'
import { RoutePathEnum } from '@/enum/routes.enum'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RoutePathEnum.HOME,
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: true },
    },
    {
      path: RoutePathEnum.LOGIN,
      name: 'login',
      component: LoginPage,
    },
    {
      path: RoutePathEnum.REGISTER,
      name: 'register',
      component: RegisterPage,
    },
  ],
})

// Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isValidToken = !!token && token !== 'undefined' && token !== 'null'

  if (to.meta.requiresAuth && !isValidToken) {
    next(RoutePathEnum.LOGIN)
  } else if (
    (to.path === RoutePathEnum.LOGIN || to.path === RoutePathEnum.REGISTER) &&
    isValidToken
  ) {
    next(RoutePathEnum.HOME)
  } else {
    next()
  }
})

export default router
