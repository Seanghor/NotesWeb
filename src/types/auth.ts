export interface User {
  id: number
  username: string
  role?: string
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginDto {
  username: string
  password?: string
}

export interface RegisterDto {
  username: string
  password?: string
}
