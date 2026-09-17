<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { RoutePathEnum } from '@/enum/routes.enum'
import type { LoginDto } from '@/types/auth'
import show from '@/assets/show.svg'
import hide from '@/assets/hide.svg'

const authStore = useAuthStore()
const toastStore = useToastStore()
const router = useRouter()

const loginData = reactive<LoginDto>({
  username: '',
  password: '',
})
const showPassword = ref(false)
const errorMsg = ref('')

// handle login
async function handleSubmit() {
  if (!loginData.username.trim() || !loginData.password) {
    errorMsg.value = 'Please enter both username and password'
    return
  }
  errorMsg.value = ''
  try {
    await authStore.login(loginData)
    toastStore.success(`Welcome back, ${authStore.user?.username}`)
    router.push(RoutePathEnum.HOME)
  } catch (err: any) {
    errorMsg.value = err.message || 'Invalid credentials. Please try again.'
  }
}

// handle show password
function handleShowPassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-[75vh] flex items-center justify-center px-4 py-8">
    <div class="max-w-md w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 class="text-xl font-bold text-gray-900 text-center">Sign In</h2>
      <p class="text-xs text-gray-500 text-center mt-1">Enter your account credentials</p>

      <div
        v-if="errorMsg"
        class="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded"
      >
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSubmit" class="mt-5 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Username</label>
          <input
            v-model="loginData.username"
            type="text"
            required
            placeholder="Username"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input
              v-model="loginData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Password"
              class="w-full px-3 py-2 pr-12 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              @click="handleShowPassword"
              class="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              :title="showPassword ? 'Hide password' : 'Show password'"
            >
              <!-- SHow icon -->
              <img v-if="!showPassword" :src="show" alt="show" class="w-4 h-4" />
              <!-- Hide icon -->
              <img v-else :src="hide" alt="hide" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition disabled:opacity-50 cursor-pointer"
        >
          {{ authStore.loading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <p class="mt-4 text-center text-xs text-gray-500">
        Don't have an account?
        <RouterLink :to="RoutePathEnum.REGISTER" class="text-blue-600 hover:underline font-medium">
          Register
        </RouterLink>
      </p>
    </div>
  </div>
</template>
