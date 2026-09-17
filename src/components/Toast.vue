<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
    <div
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      class="pointer-events-auto flex items-center justify-between p-3 rounded border text-xs shadow-md"
      :class="{
        'bg-green-50 border-green-200 text-green-800': toast.type === 'success',
        'bg-red-50 border-red-200 text-red-800': toast.type === 'error',
        'bg-yellow-50 border-yellow-200 text-yellow-800': toast.type === 'warning',
        'bg-blue-50 border-blue-200 text-blue-800': toast.type === 'info',
      }"
    >
      <span>{{ toast.message }}</span>
      <button
        @click="toastStore.remove(toast.id)"
        class="ml-2 text-gray-400 hover:text-gray-600 font-bold"
      >
        ✕
      </button>
    </div>
  </div>
</template>
