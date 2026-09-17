import httpClient from '@/config/http/apiClient'
import ApiURL from '@/enum/apiUrl.enum'
import type { Note, CreateNoteDto, UpdateNoteDto, NoteQueryDto } from '@/types/notes'

async function getNotes(query?: NoteQueryDto): Promise<Note[]> {
  const res = await httpClient.get<any, Note[]>(ApiURL.GET_ALL_NOTE, {
    params: query,
  })
  return Array.isArray(res) ? res : []
}

async function getNoteById(id: number): Promise<Note> {
  return await httpClient.get<any, Note>(`${ApiURL.GET_ONE_NOTE}/${id}`)
}

async function createNote(dto: CreateNoteDto): Promise<Note> {
  return await httpClient.post<any, Note>(ApiURL.CREATE_NOTE, dto)
}

async function updateNote(id: number, dto: UpdateNoteDto): Promise<boolean> {
  await httpClient.put(`${ApiURL.UPDATE_NOTE}/${id}`, dto)
  return true
}

async function deleteNote(id: number): Promise<boolean> {
  await httpClient.delete(`${ApiURL.DELETE_NOTE}/${id}`)
  return true
}

export default {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
}
