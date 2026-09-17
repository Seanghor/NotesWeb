<script setup lang="ts">
import type { Note } from '@/types/notes'
import { NoteCategoryEnum } from '@/enum/notes.enum'
import showSvg from '@/assets/show.svg'
import deleteSvg from '@/assets/delete.svg'
import penSvg from '@/assets/pen.svg'

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  (e: 'view', note: Note): void
  (e: 'edit', note: Note): void
  (e: 'delete', note: Note): void
}>()

function getCardColor(category?: string) {
  switch (category) {
    case NoteCategoryEnum.PERSONAL:
      return 'border-t-sky-500'
    case NoteCategoryEnum.WORK:
      return 'border-t-indigo-500'
    case NoteCategoryEnum.STUDY:
      return 'border-t-amber-500'
    case NoteCategoryEnum.IDEAS:
      return 'border-t-emerald-500'
    case NoteCategoryEnum.TODO:
      return 'border-t-rose-500'
    default:
      return 'border-t-slate-400'
  }
}

function getCategoryBadgeClass(category?: string) {
  switch (category) {
    case NoteCategoryEnum.PERSONAL:
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case NoteCategoryEnum.WORK:
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case NoteCategoryEnum.STUDY:
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case NoteCategoryEnum.IDEAS:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case NoteCategoryEnum.TODO:
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
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
  <div
    class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition duration-150 flex flex-col justify-between border-t-4"
    :class="getCardColor(note.category)"
  >
    <!-- View Note Div -->
    <div class="cursor-pointer">
      <div class="flex items-start justify-between gap-2 mb-1.5">
        <h3 class="font-bold text-slate-900 text-base line-clamp-1 transition flex-1">
          {{ note.title }}
        </h3>
        <span
          v-if="note.category"
          class="px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0"
          :class="getCategoryBadgeClass(note.category)"
        >
          {{ note.category }}
        </span>
      </div>
      <p
        class="mt-2 text-sm text-slate-600 line-clamp-4 whitespace-pre-line min-h-[4.5rem] leading-relaxed"
      >
        {{ note.content || 'No content provided.' }}
      </p>
    </div>

    <!-- Footer card -->
    <div
      class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400"
    >
      <span>{{ formatDate(note.createdAt) }}</span>

      <!-- Quick Actions -->
      <div class="flex items-center gap-1" @click.stop>
        <!-- View -->
        <button
          @click="emit('view', note)"
          title="View Note"
          class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition cursor-pointer"
        >
          <img :src="showSvg" alt="View Note" class="w-4 h-4 text-slate-400" />
        </button>
        <!-- Edit -->
        <button
          @click="emit('edit', note)"
          title="Edit Note"
          class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition cursor-pointer"
        >
          <img :src="penSvg" alt="Edit Note" class="w-4 h-4" />
        </button>

        <!-- Delete -->
        <button
          @click="emit('delete', note)"
          title="Delete Note"
          class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
        >
          <img :src="deleteSvg" alt="Delete Note" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
