<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    isOpen: false,
    maxWidth: 'md',
  },
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm':
      return 'max-w-sm'
    case 'lg':
      return 'max-w-xl'
    case 'xl':
      return 'max-w-2xl'
    case 'md':
    default:
      return 'max-w-lg'
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
      @click.self="emit('close')"
    >
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          class="bg-white rounded-xl w-full p-6 shadow-xl border border-slate-200 overflow-hidden"
          :class="maxWidthClass"
        >
          <!-- Modal Header -->
          <div
            v-if="$slots.header || title"
            class="flex items-start justify-between pb-3 border-b border-slate-100 gap-3"
          >
            <slot name="header">
              <h2 class="text-lg font-bold text-slate-800 break-words">{{ title }}</h2>
            </slot>

            <button
              @click="emit('close')"
              class="text-slate-400 hover:text-slate-600 transition cursor-pointer shrink-0"
              title="Close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="mt-4">
            <slot></slot>
          </div>

          <!-- Modal Footer -->
          <div v-if="$slots.footer" class="mt-5 pt-3 border-t border-slate-100">
            <slot name="footer"></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
