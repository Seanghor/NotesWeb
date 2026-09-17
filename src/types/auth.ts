export interface User {
  id: number
  username: string
  role?: string
  createdAt?: string
}

export interface AuthResponse {
  token: string
  userId: number
  username: string
  role: string
  expiresAt: string
  createdAt?: string
}

export interface LoginDto {
  username: string
  password?: string
}

export interface RegisterDto {
  username: string
  password?: string
}
