<script setup lang="ts">
import type { Medication } from '@/types'

defineProps<{ medication: Medication }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
    :class="
      medication.stock <= medication.stockThreshold
        ? 'bg-rose-50 text-rose-700 ring-rose-200'
        : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    "
  >
    <svg class="size-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 3.586 14h12.828a1 1 0 0 0 .293-1.707L16 11.586V8a6 6 0 0 0-6-6ZM10 18a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 10 18Z" />
    </svg>
    {{ medication.stock }} restantes
    <template v-if="medication.stock <= medication.stockThreshold">
      · Reponer
    </template>
  </span>
</template>