import apiClient from '@/config/http/apiClient'
import ApiURL from '@/enum/apiUrl.enum'
import type { Note, CreateNoteDto, UpdateNoteDto, NoteQueryDto } from '@/types/notes'

async function getNotes(query?: NoteQueryDto): Promise<Note[]> {
  return apiClient.get<any, Note[]>(ApiURL.GET_ALL_NOTE, {
    params: query,
  })
}

async function getNoteById(id: number): Promise<Note> {
  return apiClient.get<any, Note>(`${ApiURL.GET_ALL_NOTE}/${id}`)
}

async function createNote(dto: CreateNoteDto): Promise<Note> {
  return apiClient.post<any, Note>(ApiURL.CREATE_NOTE, dto)
}

async function updateNote(id: number, dto: UpdateNoteDto): Promise<boolean> {
  return apiClient.put<any, boolean>(`${ApiURL.UPDATE_NOTE}/${id}`, dto)
}

async function deleteNote(id: number): Promise<boolean> {
  return apiClient.delete<any, boolean>(`${ApiURL.DELETE_NOTE}/${id}`)
}

export default {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
}
