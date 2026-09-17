import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginDto, RegisterDto } from '@/types/auth'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const getInitialUser = (): User | null => {
    const saved = localStorage.getItem('auth_user')
    try {
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  const user = ref<User | null>(getInitialUser())
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginDto) {
    loading.value = true
    error.value = null
    try {
      const res = await authService.login(credentials)
      token.value = res.token
      user.value = res.user
      localStorage.setItem('auth_token', res.token)
      localStorage.setItem('auth_user', JSON.stringify(res.user))
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterDto) {
    loading.value = true
    error.value = null
    try {
      const res = await authService.register(data)
      token.value = res.token
      user.value = res.user
      localStorage.setItem('auth_token', res.token)
      localStorage.setItem('auth_user', JSON.stringify(res.user))
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
