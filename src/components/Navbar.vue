<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { RoutePathEnum } from '@/enum/routes.enum'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push(RoutePathEnum.LOGIN)
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Brand Logo -->
      <RouterLink
        :to="RoutePathEnum.HOME"
        class="flex items-center gap-2 font-black text-xl text-indigo-600 hover:opacity-90"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span>NotesApp</span>
      </RouterLink>

      <!-- User Info & Navigation Actions -->
      <div class="flex items-center gap-3">
        <template v-if="authStore.isAuthenticated">
          <span class="text-sm font-medium text-slate-600 hidden sm:inline">
            Hello, <strong class="text-slate-900">{{ authStore.user?.username || 'User' }}</strong>
          </span>
          <button
            @click="handleLogout"
            class="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <RouterLink
            :to="RoutePathEnum.LOGIN"
            class="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition"
          >
            Sign In
          </RouterLink>
          <RouterLink
            :to="RoutePathEnum.REGISTER"
            class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
          >
            Sign Up
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
