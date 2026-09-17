<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'
import type { Note, CreateNoteDto } from '@/types/notes'

const notesStore = useNotesStore()
const authStore = useAuthStore()

// Modal States
const isCreateOrEditOpen = ref(false)
const isDetailOpen = ref(false)
const isDeleteOpen = ref(false)

const selectedNote = ref<Note | null>(null)
const formData = ref<{ title: string; content: string }>({ title: '', content: '' })
const formError = ref('')
const submitting = ref(false)

onMounted(() => {
  notesStore.fetchNotes()
})

// Handlers for Modals
function openCreateModal() {
  selectedNote.value = null
  formData.value = { title: '', content: '' }
  formError.value = ''
  isCreateOrEditOpen.value = true
}

function openEditModal(note: Note) {
  selectedNote.value = note
  formData.value = { title: note.title, content: note.content || '' }
  formError.value = ''
  isCreateOrEditOpen.value = true
}

function openDetailModal(note: Note) {
  selectedNote.value = note
  isDetailOpen.value = true
}

function openDeleteModal(note: Note) {
  selectedNote.value = note
  isDeleteOpen.value = true
}

// Actions
async function handleSaveNote() {
  if (!formData.value.title.trim()) {
    formError.value = 'Title is mandatory'
    return
  }

  submitting.value = true
  formError.value = ''
  try {
    const payload: CreateNoteDto = {
      title: formData.value.title.trim(),
      content: formData.value.content.trim() || undefined,
    }

    if (selectedNote.value) {
      await notesStore.updateNote(selectedNote.value.id, payload)
    } else {
      await notesStore.createNote(payload)
    }
    isCreateOrEditOpen.value = false
  } catch (err: any) {
    formError.value = err.message || 'Failed to save note'
  } finally {
    submitting.value = false
  }
}

async function handleConfirmDelete() {
  if (!selectedNote.value) return
  submitting.value = true
  try {
    await notesStore.deleteNote(selectedNote.value.id)
    isDeleteOpen.value = false
  } catch (err: any) {
    alert(err.message || 'Failed to delete note')
  } finally {
    submitting.value = false
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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Top Action Bar -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200"
    >
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">My Notes</h1>
        <p class="text-sm text-slate-500 mt-1">
          Create, search, view, update, and manage your personal notes
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow transition active:scale-95"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>New Note</span>
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div class="my-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative w-full sm:max-w-md">
        <input
          v-model="notesStore.searchQuery"
          type="text"
          placeholder="Search by title or content..."
          class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
        />
        <svg
          class="w-5 h-5 text-slate-400 absolute left-3 top-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Sorting Select -->
      <div class="flex items-center gap-2 self-end sm:self-auto">
        <span class="text-xs font-semibold text-slate-400">Sort by Date:</span>
        <select
          v-model="notesStore.sortOrder"
          class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="notesStore.loading" class="py-20 text-center">
      <div
        class="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"
      ></div>
      <p class="mt-2 text-sm text-slate-500">Loading notes...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="notesStore.error"
      class="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm"
    >
      {{ notesStore.error }}
    </div>

    <!-- Empty State -->
    <div
      v-else-if="notesStore.filteredNotes.length === 0"
      class="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50"
    >
      <svg
        class="w-12 h-12 text-slate-300 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-3 text-lg font-bold text-slate-700">No notes found</h3>
      <p class="text-sm text-slate-500">Get started by creating your first note.</p>
      <button
        @click="openCreateModal"
        class="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold rounded-xl text-sm transition"
      >
        Create Note
      </button>
    </div>

    <!-- Notes Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="note in notesStore.filteredNotes"
        :key="note.id"
        class="group relative flex flex-col justify-between p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition duration-200"
      >
        <!-- Click to View Details -->
        <div @click="openDetailModal(note)" class="cursor-pointer">
          <h3
            class="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition"
          >
            {{ note.title }}
          </h3>
          <p class="mt-2 text-sm text-slate-600 line-clamp-3 whitespace-pre-line min-h-[4.5rem]">
            {{ note.content || 'No content provided.' }}
          </p>
        </div>

        <!-- Footer -->
        <div
          class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400"
        >
          <div>
            <span>Created: {{ formatDate(note.createdAt) }}</span>
            <span v-if="note.updatedAt" class="block text-[11px] text-indigo-500">
              Edited: {{ formatDate(note.updatedAt) }}
            </span>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-1">
            <button
              @click.stop="openEditModal(note)"
              title="Edit Note"
              class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              @click.stop="openDeleteModal(note)"
              title="Delete Note"
              class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 1. Create / Edit Note Modal -->
    <div
      v-if="isCreateOrEditOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 class="text-xl font-bold text-slate-800">
            {{ selectedNote ? 'Edit Note' : 'Create New Note' }}
          </h2>
          <button @click="isCreateOrEditOpen = false" class="text-slate-400 hover:text-slate-600">
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

        <form @submit.prevent="handleSaveNote" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">
              Title <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="e.g. C# Learning Checklist"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              :class="{ 'border-rose-400 focus:ring-rose-400': formError }"
            />
            <p v-if="formError" class="mt-1 text-xs text-rose-500">{{ formError }}</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">
              Content <span class="text-xs text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              v-model="formData.content"
              rows="5"
              placeholder="Write your note content here..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="isCreateOrEditOpen = false"
              class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition disabled:opacity-50"
            >
              {{ submitting ? 'Saving...' : selectedNote ? 'Save Changes' : 'Create Note' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. View Note Detail Modal -->
    <div
      v-if="isDetailOpen && selectedNote"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div class="flex items-start justify-between pb-3 border-b border-slate-100">
          <h2 class="text-2xl font-bold text-slate-800 break-words">{{ selectedNote.title }}</h2>
          <button @click="isDetailOpen = false" class="text-slate-400 hover:text-slate-600">
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

        <div class="my-4 max-h-80 overflow-y-auto pr-2">
          <p class="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {{ selectedNote.content || 'No content provided for this note.' }}
          </p>
        </div>

        <div class="pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
          <div><strong>Created:</strong> {{ formatDate(selectedNote.createdAt) }}</div>
          <div v-if="selectedNote.updatedAt">
            <strong>Last Updated:</strong> {{ formatDate(selectedNote.updatedAt) }}
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="isDetailOpen = false"
            class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Close
          </button>
          <button
            @click="openEditModal(selectedNote)"
            class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition"
          >
            Edit Note
          </button>
        </div>
      </div>
    </div>

    <!-- 3. Delete Confirmation Modal -->
    <div
      v-if="isDeleteOpen && selectedNote"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center"
      >
        <div
          class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-800">Delete Note?</h3>
        <p class="mt-1 text-sm text-slate-500">
          Are you sure you want to delete
          <strong class="text-slate-700">"{{ selectedNote.title }}"</strong>?
        </p>

        <div class="mt-6 flex justify-center gap-3">
          <button
            @click="isDeleteOpen = false"
            class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            @click="handleConfirmDelete"
            :disabled="submitting"
            class="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow transition disabled:opacity-50"
          >
            {{ submitting ? 'Deleting...' : 'Yes, Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
