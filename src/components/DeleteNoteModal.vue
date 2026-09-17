<script setup lang="ts">
import { ref } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useToastStore } from '@/stores/toast'
import type { Note } from '@/types/notes'
import Modal from '@/components/Modal.vue'
import dangerSvg from '@/assets/danger.svg'

const props = defineProps<{
  isOpen: boolean
  note?: Note | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'deleted', id: number): void
}>()

const notesStore = useNotesStore()
const toastStore = useToastStore()
const submitting = ref<boolean>(false)

async function handleConfirmDelete() {
  if (!props.note) return
  submitting.value = true
  try {
    await notesStore.deleteNote(props.note.id)
    toastStore.success('Note deleted successfully')
    emit('deleted', props.note.id)
    emit('close')
  } catch (err: any) {
    alert(err.message || 'Failed to delete note')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Modal :isOpen="isOpen && !!note" maxWidth="sm" @close="emit('close')">
    <div class="text-center">
      <div
        class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3"
      >
        <img :src="dangerSvg" alt="Delete Note" class="w-4 h-4" />
      </div>
      <h3 class="text-base font-bold text-slate-900">Delete Note?</h3>
      <p class="mt-1 text-xs text-slate-500">
        Are you sure you want to delete
        <strong class="text-slate-700">"{{ note?.title }}"</strong>?
      </p>
    </div>

    <template #footer>
      <div class="flex justify-center gap-2">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="handleConfirmDelete"
          :disabled="submitting"
          class="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
        >
          {{ submitting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </template>
  </Modal>
</template>
