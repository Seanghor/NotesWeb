import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Note, CreateNoteDto, UpdateNoteDto } from '@/types/notes'
import noteService from '@/services/notes.service'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filter & Sort State
  const searchQuery = ref<string>('')
  const selectedCategory = ref<string>('All')
  const sortOrder = ref<'desc' | 'asc'>('desc')

  // data filtered from API backend
  const filteredNotes = computed(() => notes.value)
  const totalNotes = computed(() => notes.value.length)

  // Auto fetch
  watch([selectedCategory, sortOrder], async () => {
    await fetchNotes()
  })

  // Debounced search query
  let searchTimer: ReturnType<typeof setTimeout> | null = null
  watch(searchQuery, () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(async () => {
      await fetchNotes()
    }, 300)
  })

  // Fetch list notes from API
  async function fetchNotes() {
    loading.value = true
    error.value = null
    try {
      notes.value = await noteService.getNotes({
        search: searchQuery.value.trim() || undefined,
        category: selectedCategory.value !== 'All' ? selectedCategory.value : undefined,
        sortOrder: sortOrder.value,
      })
    } catch (err: any) {
      error.value = err.message || 'Failed to load notes'
    } finally {
      loading.value = false
    }
  }

  // Create note
  async function createNote(dto: CreateNoteDto) {
    const created = await noteService.createNote(dto)
    await fetchNotes()
    return created
  }

  // Update note
  async function updateNote(id: number, dto: UpdateNoteDto) {
    await noteService.updateNote(id, dto)
    await fetchNotes()
  }

  // Delete note
  async function deleteNote(id: number) {
    await noteService.deleteNote(id)
    await fetchNotes()
  }

  return {
    // State
    notes,
    loading,
    error,
    searchQuery,
    selectedCategory,
    sortOrder,

    // Getters
    filteredNotes,
    totalNotes,

    // Actions
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  }
})
