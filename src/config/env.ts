/**
 * Centralized environment configuration
 */
export const env = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'Notes App',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const

export default env
