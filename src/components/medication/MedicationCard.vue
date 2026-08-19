<script setup lang="ts">
import type { DoseSlot, Medication } from '@/types'
import { DOSE_STATUS_META, getFormEmoji, getFormLabel } from '@/data/constants'
import { formatTime } from '@/utils/date'
import { colorWithAlpha } from '@/utils/color'
import Badge from '@/components/ui/Badge.vue'

defineProps<{
  medication: Medication
  dose: DoseSlot
  disabled?: boolean
}>()

const emit = defineEmits<{
  take: [dose: DoseSlot]
  postpone: [dose: DoseSlot]
  skip: [dose: DoseSlot]
  symptom: [dose: DoseSlot]
}>()
</script>

<template>
  <div
    class="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
  >
    <div
      class="grid size-11 shrink-0 place-items-center rounded-xl text-xl"
      :style="{ backgroundColor: colorWithAlpha(medication.color, '1a') }"
    >
      {{ getFormEmoji(medication.form) }}
    </div>

    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="font-semibold text-slate-900">{{ medication.name }}</p>
          <p class="text-sm text-slate-500">
            {{ medication.concentration }} · {{ getFormLabel(medication.form) }}
          </p>
        </div>
        <span class="text-lg font-bold tabular-nums text-indigo-700">{{ formatTime(dose.time) }}</span>
      </div>

      <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
        <Badge :classes="DOSE_STATUS_META[dose.status].classes">
          {{ DOSE_STATUS_META[dose.status].label }}
        </Badge>
        <Badge classes="bg-sky-50 text-sky-700 ring-sky-200" :dot="medication.color">
          {{ medication.indication }}
        </Badge>
      </div>

      <p v-if="medication.instructions" class="mt-1.5 text-xs text-slate-400">
        {{ medication.instructions }}
      </p>

      <div
        v-if="dose.status === 'pending' || dose.status === 'postponed'"
        class="mt-3 flex flex-wrap gap-2"
      >
        <button
          class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="disabled"
          @click="emit('take', dose)"
        >
          <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
          </svg>
          Tomar
        </button>
        <button
          class="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="disabled"
          @click="emit('postpone', dose)"
        >
          <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd" />
          </svg>
          Posponer 15 min
        </button>
        <button
          class="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-200 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="disabled"
          @click="emit('skip', dose)"
        >
          Omitir
        </button>
      </div>

      <div v-else-if="dose.status === 'taken'" class="mt-3">
        <button
          class="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50"
          @click="emit('symptom', dose)"
        >
          <svg class="size-4 text-rose-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 1.5a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4.75c.414 0 .75.336.75.75v3.75a.75.75 0 0 1-1.5 0V7c0-.414.336-.75.75-.75ZM10 15a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 10 15Z" clip-rule="evenodd" />
          </svg>
          Registrar síntoma / efecto
        </button>
      </div>
    </div>
  </div>
</template>