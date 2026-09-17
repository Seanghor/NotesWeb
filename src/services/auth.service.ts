import httpClient from '@/config/http/apiClient'
import ApiURL from '@/enum/apiUrl.enum'
import type { LoginDto, AuthResponse } from '@/types/auth'

async function login(credentials: LoginDto) {
  return await httpClient.post<any, AuthResponse>(ApiURL.LOGIN, credentials)
}

async function register(data: LoginDto) {
  return await httpClient.post<any, AuthResponse>(ApiURL.REGISTER, data)
}

export default {
  login,
  register,
}
