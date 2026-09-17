<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { RoutePathEnum } from '@/enum/routes.enum'

const authStore = useAuthStore()
const toastStore = useToastStore()
const router = useRouter()

const registerData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})
const showPassword = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  if (!registerData.username.trim() || !registerData.password) {
    errorMsg.value = 'Please fill in all fields'
    return
  }
  if (registerData.password !== registerData.confirmPassword) {
    errorMsg.value = 'Passwords do not match'
    return
  }

  errorMsg.value = ''
  try {
    await authStore.register({
      username: registerData.username.trim(),
      password: registerData.password,
    })
    toastStore.success('Account created successfully')
    router.push(RoutePathEnum.HOME)
  } catch (err: any) {
    errorMsg.value = err.message || 'Registration failed'
  }
}
</script>

<template>
  <div class="min-h-[75vh] flex items-center justify-center px-4 py-8">
    <div class="max-w-md w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 class="text-xl font-bold text-gray-900 text-center">Create Account</h2>
      <p class="text-xs text-gray-500 text-center mt-1">Register for a new account</p>

      <div v-if="errorMsg" class="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSubmit" class="mt-5 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Username</label>
          <input
            v-model="registerData.username"
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
              v-model="registerData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Password"
              class="w-full px-3 py-2 pr-12 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              :title="showPassword ? 'Hide password' : 'Show password'"
            >
              <svg
                v-if="!showPassword"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
          <input
            v-model="registerData.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Confirm Password"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition disabled:opacity-50 cursor-pointer"
        >
          {{ authStore.loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <p class="mt-4 text-center text-xs text-gray-500">
        Already have an account?
        <RouterLink :to="RoutePathEnum.LOGIN" class="text-blue-600 hover:underline font-medium">
          Sign In
        </RouterLink>
      </p>
    </div>
  </div>
</template>
