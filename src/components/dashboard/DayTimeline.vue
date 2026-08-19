<script setup lang="ts">
import { computed } from 'vue'
import type { DoseSlot, Medication } from '@/types'
import { DAY_PARTS } from '@/data/constants'
import { partOfTime } from '@/utils/date'
import MedicationCard from '@/components/medication/MedicationCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps<{
  doses: DoseSlot[]
  medications: Map<string, Medication>
  disabled?: boolean
}>()

const emit = defineEmits<{
  take: [dose: DoseSlot]
  postpone: [dose: DoseSlot]
  skip: [dose: DoseSlot]
  symptom: [dose: DoseSlot]
}>()

const grouped = computed(() =>
  DAY_PARTS.map((part) => ({
    part,
    slots: props.doses
      .filter((d) => partOfTime(d.time) === part.id)
      .sort((a, b) => a.time.localeCompare(b.time)),
  })).filter((g) => g.slots.length > 0),
)
</script>

<template>
  <div class="space-y-6">
    <div v-for="group in grouped" :key="group.part.id">
      <div class="mb-2 flex items-baseline justify-between">
        <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">
          {{ group.part.label }}
        </h2>
        <span class="text-xs text-slate-400">{{ group.part.range }}</span>
      </div>
      <div class="space-y-3">
        <MedicationCard
          v-for="dose in group.slots"
          :key="dose.id"
          :medication="medications.get(dose.medicationId)!"
          :dose="dose"
          :disabled="disabled"
          @take="emit('take', $event)"
          @postpone="emit('postpone', $event)"
          @skip="emit('skip', $event)"
          @symptom="emit('symptom', $event)"
        />
      </div>
    </div>

    <EmptyState
      v-if="grouped.length === 0"
      title="Sin dosis programadas"
      message="No hay medicamentos activos para este día. Añade uno desde el Gabinete."
    />
  </div>
</template>