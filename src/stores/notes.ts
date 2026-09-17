import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note, CreateNoteDto, UpdateNoteDto } from '@/types/notes'
import noteService from '@/services/notes.service'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filtering & Sorting State
  const searchQuery = ref('')
  const sortOrder = ref<'desc' | 'asc'>('desc')

  // Computed filtered & sorted notes
  const filteredNotes = computed(() => {
    let result = [...notes.value]

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) || (n.content && n.content.toLowerCase().includes(q)),
      )
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
    })

    return result
  })

  async function fetchNotes() {
    loading.value = true
    error.value = null
    try {
      notes.value = await noteService.getNotes({
        search: searchQuery.value || undefined,
        sortOrder: sortOrder.value,
      })
    } catch (err: any) {
      error.value = err.message || 'Failed to load notes'
    } finally {
      loading.value = false
    }
  }

  async function createNote(dto: CreateNoteDto) {
    const created = await noteService.createNote(dto)
    notes.value.unshift(created)
    return created
  }

  async function updateNote(id: number, dto: UpdateNoteDto) {
    await noteService.updateNote(id, dto)
    const index = notes.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...dto,
        updatedAt: new Date().toISOString(),
      } as Note
    }
  }

  async function deleteNote(id: number) {
    await noteService.deleteNote(id)
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  return {
    notes,
    loading,
    error,
    searchQuery,
    sortOrder,
    filteredNotes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  }
})
