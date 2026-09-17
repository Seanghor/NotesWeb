import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import env from '@/config/env'
import { RoutePathEnum } from '@/enum/routes.enum'
import { useToastStore } from '@/stores/toast'

const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT Bearer Token
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && token !== 'undefined' && token !== 'null' && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data
    }
    return response.data
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      if (
        window.location.pathname !== RoutePathEnum.LOGIN &&
        window.location.pathname !== RoutePathEnum.REGISTER
      ) {
        window.location.href = RoutePathEnum.LOGIN
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.errors ||
      error.message ||
      'An unexpected network error occurred'

    const formattedMessage = typeof message === 'object' ? JSON.stringify(message) : String(message)

    try {
      const toastStore = useToastStore()
      toastStore.error(formattedMessage)
    } catch {}

    return Promise.reject(new Error(formattedMessage))
  },
)

export default httpClient
