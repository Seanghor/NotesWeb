import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginDto, RegisterDto, AuthResponse } from '@/types/auth'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // >> get init user data
  const getInitialUser = (): User | null => {
    const saved = localStorage.getItem('auth_user')
    try {
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  const getInitialToken = (): string | null => {
    const saved = localStorage.getItem('auth_token')
    if (saved && saved !== 'undefined' && saved !== 'null') {
      return saved
    }
    return null
  }

  const user = ref<User | null>(getInitialUser())
  const token = ref<string | null>(getInitialToken())
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && token.value !== 'undefined')

  function setUserFromAuth(res: AuthResponse) {
    const tokenVal = res?.token
    if (!tokenVal || tokenVal === 'undefined') {
      throw new Error('No authentication token returned by the server.')
    }
    const userObj: User = {
      id: res.userId,
      username: res.username,
      role: res.role,
      createdAt: res?.createdAt,
    }

    token.value = tokenVal
    user.value = userObj
    localStorage.setItem('auth_token', tokenVal)
    localStorage.setItem('auth_user', JSON.stringify(userObj))
  }

  async function login(credentials: LoginDto) {
    loading.value = true
    error.value = null
    try {
      const res = await authService.login(credentials)
      setUserFromAuth(res)
      return res
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
      setUserFromAuth(res)
      return res
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
    // state
    user,
    token,
    loading,
    error,

    // Getter
    isAuthenticated,

    // Actions
    login,
    register,
    logout,
  }
})
