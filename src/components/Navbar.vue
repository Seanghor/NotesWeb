<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { RoutePathEnum } from '@/enum/routes.enum'
import logOutSvg from '@/assets/logOut.svg'
import logoSvg from '@/assets/logo.svg'

const authStore = useAuthStore()
const toastStore = useToastStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  toastStore.info('Logged out successfully')
  router.push(RoutePathEnum.LOGIN)
}
</script>

<template>
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo  -->
      <div class="flex items-center gap-2.5 group">
        <div
          class="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-indigo-700 transition"
        >
          <img :src="logoSvg" alt="Logo" class="w-5 h-5" />
        </div>
        <span class="font-bold text-lg text-slate-800 tracking-tight">
          Notes<span class="text-indigo-600 ml-2">Application</span>
        </span>
      </div>

      <!-- Logout Bottom-->
      <div class="flex items-center gap-3 text-sm">
        <template v-if="authStore.isAuthenticated">
          <div
            class="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-xs font-medium text-slate-700">
              {{ authStore.user?.username || 'User' }}
            </span>
          </div>

          <button
            @click="handleLogout"
            class="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition cursor-pointer"
          >
            <img :src="logOutSvg" alt="Logout" class="w-4 h-4" />
          </button>
        </template>
        <template v-else>
          <RouterLink
            :to="RoutePathEnum.LOGIN"
            class="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          >
            Sign In
          </RouterLink>
          <RouterLink
            :to="RoutePathEnum.REGISTER"
            class="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition cursor-pointer"
          >
            Register
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>
