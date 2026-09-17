<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import type { Note } from '@/types/notes'
import { NOTE_CATEGORIES } from '@/constants/notes.constant'
import plusSvg from '@/assets/plus.svg'
import NoteCard from '@/components/NoteCard.vue'
import NoteFormModal from '@/components/NoteFormModal.vue'
import NoteDetailModal from '@/components/NoteDetailModal.vue'
import DeleteNoteModal from '@/components/DeleteNoteModal.vue'

const notesStore = useNotesStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

// Modal states
const isCreateOrEditOpen = ref(false)
const isDetailOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedNote = ref<Note | null>(null)

function openCreateModal() {
  selectedNote.value = null
  isCreateOrEditOpen.value = true
}

function openEditModal(note: Note) {
  selectedNote.value = note
  isDetailOpen.value = false
  isCreateOrEditOpen.value = true
}

function openDetailModal(note: Note) {
  selectedNote.value = note
  isDetailOpen.value = true
}

function openDeleteModal(note: Note) {
  selectedNote.value = note
  isDetailOpen.value = false
  isDeleteOpen.value = true
}

onMounted(async () => {
  await notesStore.fetchNotes()
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header -->
    <div
      class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">My Notes</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Welcome,
          <strong class="text-slate-800">{{ authStore.user?.username || 'User' }}</strong> — you
          have
          <span
            class="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-semibold text-blue-700"
          >
            {{ notesStore.totalNotes }} {{ notesStore.totalNotes === 1 ? 'note' : 'notes' }}
          </span>
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
      >
        <img :src="plusSvg" alt="Add Note" class="w-4 h-4 text-white-500" />
        <span>New Note</span>
      </button>
    </div>

    <!-- Search + Sort  -->
    <div class="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative w-full sm:max-w-md">
        <input
          v-model="notesStore.searchQuery"
          type="text"
          placeholder="Search by title or content..."
          class="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-2xs"
        />
        <svg
          class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
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
        <button
          v-if="notesStore.searchQuery"
          @click="notesStore.searchQuery = ''"
          class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Sorting Select -->
      <div class="flex items-center gap-2 self-end sm:self-auto text-xs">
        <span class="text-slate-500 font-medium">Sort:</span>
        <select
          v-model="notesStore.sortOrder"
          class="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>

    <!-- Category Filter Pills -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 text-xs">
      <span class="text-slate-400 font-medium mr-1 shrink-0">Category:</span>
      <button
        @click="notesStore.selectedCategory = 'All'"
        class="px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer shrink-0"
        :class="
          notesStore.selectedCategory === 'All'
            ? 'bg-slate-900 text-white shadow-xs'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
        "
      >
        All
      </button>
      <button
        v-for="cate in NOTE_CATEGORIES"
        :key="cate"
        @click="notesStore.selectedCategory = cate"
        class="px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer shrink-0"
        :class="
          notesStore.selectedCategory === cate
            ? 'bg-slate-900 text-white shadow-xs'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
        "
      >
        {{ cate }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="notesStore.loading" class="py-20 text-center text-slate-500 text-sm">
      <div
        class="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"
      ></div>
      <p>Loading notes...</p>
    </div>

    <!-- No data -->
    <div
      v-else-if="notesStore.filteredNotes.length === 0"
      class="py-20 text-center border border-dashed border-slate-300 rounded-xl bg-white p-8"
    >
      <div
        class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p class="text-slate-600 font-medium text-sm">
        {{
          notesStore.searchQuery || notesStore.selectedCategory !== 'All'
            ? 'No notes match your filters.'
            : 'No notes created yet.'
        }}
      </p>
    </div>

    <!-- Notes Exist /-->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <NoteCard
        v-for="note in notesStore.filteredNotes"
        :key="note.id"
        :note="note"
        @view="openDetailModal"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
    </div>

    <!-- Modals -->
    <NoteFormModal
      :isOpen="isCreateOrEditOpen"
      :note="selectedNote"
      @close="isCreateOrEditOpen = false"
    />

    <NoteDetailModal
      :isOpen="isDetailOpen"
      :note="selectedNote"
      @close="isDetailOpen = false"
      @edit="openEditModal"
    />

    <DeleteNoteModal :isOpen="isDeleteOpen" :note="selectedNote" @close="isDeleteOpen = false" />
  </div>
</template>
