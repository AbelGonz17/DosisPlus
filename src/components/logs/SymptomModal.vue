<script setup lang="ts">
import type { DoseSlot, Medication, Severity } from '@/types'
import Modal from '@/components/ui/Modal.vue'
import SymptomPicker from '@/components/logs/SymptomPicker.vue'

const props = defineProps<{
  open: boolean
  medication?: Medication | null
  dose?: DoseSlot | null
}>()

const emit = defineEmits<{
  close: []
  save: [{ dose: DoseSlot; symptomId: string; severity: Severity; note?: string }]
}>()

function onSave(input: { symptomId: string; severity: Severity; note?: string }) {
  if (!props.dose) return
  emit('save', { dose: props.dose, ...input })
}
</script>

<template>
  <Modal :open="open" @close="emit('close')">
    <template #title>
      {{ medication?.name ?? '' }} — toma registrada
    </template>

    <div class="mb-4 flex flex-col items-center gap-2 rounded-xl bg-emerald-50 px-4 py-6 text-center">
      <span class="grid size-12 place-items-center rounded-full bg-emerald-100 text-2xl">✓</span>
      <p class="font-semibold text-emerald-800">Dosis marcada como tomada</p>
      <p class="text-sm text-emerald-700">
        Se actualizó el porcentaje de adherencia semanal.
      </p>
    </div>

    <SymptomPicker @save="onSave" />
  </Modal>
</template>