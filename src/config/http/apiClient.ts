import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import env from '@/config/env'
import { RoutePathEnum } from '@/enum/routes.enum'

const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// For 401 Unauthorized
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token') //toke
      localStorage.removeItem('auth_user')
      if (window.location.pathname !== RoutePathEnum.LOGIN) {
        window.location.href = RoutePathEnum.LOGIN
      }
    }
    const message = error.response?.data?.message || error.message || 'Network error occurred'
    return Promise.reject(new Error(message))
  },
)

export default apiClient
