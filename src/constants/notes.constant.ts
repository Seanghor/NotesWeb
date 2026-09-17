import { NoteCategoryEnum } from '@/enum/notes.enum'

export const NOTE_CATEGORIES = Object.values(NoteCategoryEnum)

export const NOTE_CATEGORY_OPTIONS = [
  { label: 'Personal', value: NoteCategoryEnum.PERSONAL },
  { label: 'Work', value: NoteCategoryEnum.WORK },
  { label: 'Study', value: NoteCategoryEnum.STUDY },
  { label: 'Ideas', value: NoteCategoryEnum.IDEAS },
  { label: 'Todo', value: NoteCategoryEnum.TODO },
]
