import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])

  function show(message: string, type: ToastMessage['type'] = 'info', duration = 3500) {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  function success(message: string, duration = 3500) {
    show(message, 'success', duration)
  }

  function error(message: string, duration = 4500) {
    show(message, 'error', duration)
  }

  function info(message: string, duration = 3500) {
    show(message, 'info', duration)
  }

  function warning(message: string, duration = 4000) {
    show(message, 'warning', duration)
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    warning,
    remove,
  }
})
