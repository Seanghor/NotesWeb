import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/Home.vue'
import LoginPage from '@/views/Login.vue'
import RegisterPage from '@/views/Register.vue'
import { RoutePathEnum } from '@/enum/routes.enum.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RoutePathEnum.HOME,
      name: 'home',
      component: HomePage,
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

export default router
