export interface Note {
  id: number
  title: string
  content?: string
  userId: number
  createdAt: string
  updatedAt?: string | null
}

export interface CreateNoteDto {
  title: string
  content?: string
}

export interface UpdateNoteDto {
  title: string
  content?: string
}

export interface NoteQueryDto {
  search?: string
  fromDate?: string
  toDate?: string
  sortOrder?: 'asc' | 'desc'
}
