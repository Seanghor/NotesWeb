<script setup lang="ts">
import type { Note } from '@/types/notes'
import { NoteCategoryEnum } from '@/enum/notes.enum'
import Modal from '@/components/Modal.vue'

const props = defineProps<{
  isOpen: boolean
  note?: Note | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', note: Note): void
}>()

function getCategoryBadgeClass(category?: string) {
  switch (category) {
    case NoteCategoryEnum.PERSONAL:
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case NoteCategoryEnum.WORK:
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case NoteCategoryEnum.STUDY:
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case NoteCategoryEnum.IDEAS:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case NoteCategoryEnum.TODO:
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

function formatDate(dateString?: string | null) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <Modal
    :is-open="isOpen && !!note"
    @close="emit('close')"
  >
    <template #header>
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span
            v-if="note?.category"
            class="px-2 py-0.5 rounded-md text-[11px] font-semibold border"
            :class="getCategoryBadgeClass(note?.category)"
          >
            {{ note?.category }}
          </span>
        </div>
        <h2 class="text-xl font-bold text-slate-900 break-words">{{ note?.title }}</h2>
      </div>
    </template>

    <div class="max-h-80 overflow-y-auto pr-1">
      <p class="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
        {{ note?.content || 'No content provided for this note.' }}
      </p>
    </div>

    <div class="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 space-y-0.5">
      <div><strong>Created:</strong> {{ formatDate(note?.createdAt) }}</div>
      <div v-if="note?.updatedAt">
        <strong>Updated:</strong> {{ formatDate(note?.updatedAt) }}
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          Close
        </button>
        <button
          v-if="note"
          @click="emit('edit', note)"
          class="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition cursor-pointer"
        >
          Edit Note
        </button>
      </div>
    </template>
  </Modal>
</template>
