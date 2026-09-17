<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useToastStore } from '@/stores/toast'
import type { Note, CreateNoteDto } from '@/types/notes'
import { NoteCategoryEnum } from '@/enum/notes.enum'
import { NOTE_CATEGORIES } from '@/constants/notes.constant'
import Modal from '@/components/Modal.vue'

const props = defineProps<{
  isOpen: boolean
  note?: Note | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved', note: Note): void
}>()

const notesStore = useNotesStore()
const toastStore = useToastStore()

const formData = reactive<CreateNoteDto>({
  title: '',
  content: '',
  category: NoteCategoryEnum.PERSONAL,
})

const formError = ref<string>('')
const submitting = ref<boolean>(false)

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.note) {
        formData.title = props.note.title
        formData.content = props.note.content || ''
        formData.category = props.note.category || NoteCategoryEnum.PERSONAL
      } else {
        formData.title = ''
        formData.content = ''
        formData.category = NoteCategoryEnum.PERSONAL
      }
      formError.value = ''
    }
  },
)

async function handleSaveNote() {
  if (!formData.title.trim()) {
    formError.value = 'Title is required'
    return
  }

  submitting.value = true
  formError.value = ''
  try {
    const payload: CreateNoteDto = {
      title: formData.title.trim(),
      content: formData.content?.trim(),
      category: formData.category,
    }

    if (props.note) {
      await notesStore.updateNote(props.note.id, payload)
      toastStore.success('Note updated successfully')
      emit('saved', { ...props.note, ...payload } as Note)
    } else {
      const created = await notesStore.createNote(payload)
      toastStore.success('Note created successfully')
      emit('saved', created)
    }
    emit('close')
  } catch (err: any) {
    formError.value = err.message || 'Failed to save note'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Modal :is-open="isOpen" :title="note ? 'Edit Note' : 'Create New Note'" @close="emit('close')">
    <form @submit.prevent="handleSaveNote" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          Title <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="formData.title"
          type="text"
          autofocus
          placeholder="Title of note"
          class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          :class="{ 'border-rose-400': formError }"
        />
        <p v-if="formError" class="mt-1 text-xs text-rose-500">{{ formError }}</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Category</label>
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
          <button
            v-for="cat in NOTE_CATEGORIES"
            :key="cat"
            type="button"
            @click="formData.category = cat"
            class="py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition cursor-pointer"
            :class="
              formData.category === cat
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            "
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Content</label>
        <textarea
          v-model="formData.content"
          rows="6"
          placeholder="Note content"
          class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-y"
        ></textarea>
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
        <button
          type="button"
          @click="emit('close')"
          class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
        >
          {{ submitting ? 'Saving...' : note ? 'Save Changes' : 'Create Note' }}
        </button>
      </div>
    </form>
  </Modal>
</template>
