<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { RoutePathEnum } from '@/enum/routes.enum'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const errorMsg = ref('')

async function handleSubmit() {
  if (!username.value || !password.value) {
    errorMsg.value = 'Please enter both username and password'
    return
  }
  errorMsg.value = ''
  try {
    await authStore.login({
      username: username.value.trim(),
      password: password.value,
    })
    router.push(RoutePathEnum.HOME)
  } catch (err: any) {
    errorMsg.value = err.message || 'Login failed'
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full p-8 bg-white border border-slate-200 rounded-3xl shadow-xl">
      <h2 class="text-2xl font-black text-slate-800 text-center">Welcome Back</h2>
      <p class="text-sm text-slate-500 text-center mt-1">Sign in to manage your notes</p>

      <div
        v-if="errorMsg"
        class="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-medium"
      >
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            required
            placeholder="Enter username"
            class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 active:scale-[0.99]"
        >
          {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="mt-6 text-center text-xs text-slate-500">
        Don't have an account?
        <RouterLink
          :to="RoutePathEnum.REGISTER"
          class="text-indigo-600 font-semibold hover:underline"
        >
          Sign up
        </RouterLink>
      </p>
    </div>
  </div>
</template>
