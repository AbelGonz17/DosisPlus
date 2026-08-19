<script setup lang="ts">
import { computed } from 'vue'
import type { AdherencePoint } from '@/utils/adherence'
import { scoreLabel } from '@/utils/adherence'

const props = defineProps<{
  points: AdherencePoint[]
}>()

const overall = computed(() => {
  const total = props.points.reduce((a, p) => a + p.total, 0)
  if (total === 0) return 0
  const taken = props.points.reduce((a, p) => a + p.taken, 0)
  return Math.round((taken / total) * 100)
})

const barColor = (p: number) => {
  if (p >= 90) return 'bg-emerald-500'
  if (p >= 75) return 'bg-indigo-500'
  if (p >= 50) return 'bg-amber-400'
  return 'bg-rose-400'
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="mb-4 flex items-end justify-between">
      <div>
        <p class="text-sm font-medium text-slate-500">Adherencia semanal</p>
        <p class="text-3xl font-bold tabular-nums text-slate-900">{{ overall }}%</p>
        <p class="text-xs font-medium" :class="overall >= 75 ? 'text-emerald-600' : overall >= 50 ? 'text-amber-600' : 'text-rose-600'">
          {{ scoreLabel(overall) }}
        </p>
      </div>
      <div
        class="grid size-16 place-items-center rounded-full"
        :class="overall >= 75 ? 'bg-emerald-50 text-emerald-700' : overall >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'"
      >
        <span class="text-xs font-semibold">{{ overall }}%</span>
      </div>
    </div>

    <div class="flex items-end gap-1.5" style="height: 96px">
      <div
        v-for="p in points"
        :key="p.date"
        class="flex h-full flex-1 flex-col items-center justify-end gap-1"
      >
        <span class="text-[10px] font-medium tabular-nums text-slate-500">
          {{ p.percent > 0 ? p.percent : '' }}
        </span>
        <div
          class="w-full max-w-8 rounded-t-md transition-all"
          :class="barColor(p.percent)"
          :style="{ height: `${Math.max(p.percent, p.total > 0 ? 6 : 2)}%` }"
          :title="`${p.label}: ${p.taken}/${p.total}`"
        />
      </div>
    </div>
    <div class="mt-1 flex gap-1.5">
      <span
        v-for="p in points"
        :key="p.date"
        class="flex-1 text-center text-[10px] capitalize text-slate-400"
      >
        {{ p.label }}
      </span>
    </div>

    <div v-if="props.points.length === 0" class="py-4 text-center text-sm text-slate-400">
      Sin datos suficientes.
    </div>
  </div>
</template>