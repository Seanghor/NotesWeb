import { NoteCategoryEnum } from '@/enum/notes.enum'

export { NoteCategoryEnum }
export type NoteCategory = NoteCategoryEnum

export interface Note {
  id: number
  title: string
  content?: string
  category?: NoteCategoryEnum | string
  userId: number
  createdAt: string
  updatedAt?: string | null
}

export interface CreateNoteDto {
  title: string
  content?: string
  category?: NoteCategoryEnum | string
}

export interface UpdateNoteDto {
  title: string
  content?: string
  category?: NoteCategoryEnum | string
}

export interface NoteQueryDto {
  search?: string
  category?: NoteCategoryEnum | string
  sortOrder?: 'asc' | 'desc'
}
