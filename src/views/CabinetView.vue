<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Medication, MedicationInput } from '@/types'
import { useMedicationsStore } from '@/stores/medications'
import { getFormEmoji, getFormLabel, getRouteLabel } from '@/data/constants'
import { formatTime, todayISO } from '@/utils/date'
import { colorWithAlpha } from '@/utils/color'
import MedicationForm from '@/components/medication/MedicationForm.vue'
import StockBadge from '@/components/medication/StockBadge.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const meds = useMedicationsStore()
const route = useRoute()
const router = useRouter()

const showForm = ref(false)
const editing = ref<Medication | null>(null)

watch(
  () => route.query.nuevo,
  (v) => {
    if (v === '1') {
      showForm.value = true
      editing.value = null
      router.replace({ query: {} })
    }
  },
  { immediate: true },
)

const sorted = computed(() =>
  [...meds.userMedications].sort((a, b) => a.name.localeCompare(b.name)),
)

function openNew() {
  editing.value = null
  showForm.value = true
}

function openEdit(med: Medication) {
  editing.value = med
  showForm.value = true
}

function onSave(input: MedicationInput) {
  if (editing.value) {
    meds.updateMedication(editing.value.id, input)
  } else {
    meds.addMedication(input)
  }
  showForm.value = false
}

function onDelete(med: Medication) {
  if (window.confirm(`¿Eliminar ${med.name} y su programación?`)) {
    meds.deleteMedication(med.id)
  }
}

function nextDoseTime(med: Medication): string {
  const today = todayISO()
  const dose = meds
    .dosesForDate(today)
    .find(
      (d) =>
        d.medicationId === med.id &&
        (d.status === 'pending' || d.status === 'postponed'),
    )
  return dose ? formatTime(dose.time) : 'Sin dosis pendiente'
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Gabinete</h1>
        <p class="text-sm text-slate-500">Mis medicamentos</p>
      </div>
      <Button size="sm" @click="openNew">
        <span class="text-lg leading-none">+</span>
        Añadir
      </Button>
    </div>

    <div v-if="sorted.length > 0" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="med in sorted"
        :key="med.id"
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        :class="med.stock <= med.stockThreshold ? 'border-rose-200' : ''"
      >
        <div class="flex items-start gap-3">
          <div
            class="grid size-11 shrink-0 place-items-center rounded-xl text-xl"
            :style="{ backgroundColor: colorWithAlpha(med.color, '1a') }"
          >
            {{ getFormEmoji(med.form) }}
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <p class="font-semibold text-slate-900">{{ med.name }}</p>
              <div class="flex items-center gap-1">
                <button
                  class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Editar"
                  @click="openEdit(med)"
                >
                  <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                  </svg>
                </button>
                <button
                  class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Eliminar"
                  @click="onDelete(med)"
                >
                  <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4Z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-sm text-slate-500">
              {{ med.concentration }} · {{ getFormLabel(med.form) }} · Vía {{ getRouteLabel(med.route) }}
            </p>
            <div class="mt-2 flex flex-wrap items-center gap-1.5">
              <StockBadge :medication="med" />
              <Badge classes="bg-sky-50 text-sky-700 ring-sky-200" :dot="med.color">
                {{ med.indication }}
              </Badge>
              <Badge classes="bg-slate-100 text-slate-600 ring-slate-200">
                Próx. dosis: {{ nextDoseTime(med) }}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EmptyState
      v-else
      title="Sin medicamentos"
      message="Añade tu primer medicamento para comenzar a registrar tus dosis."
      emoji="💊"
    >
      <Button size="sm" class="mt-2" @click="openNew">Añadir medicamento</Button>
    </EmptyState>

    <Modal :open="showForm" @close="showForm = false">
      <template #title>{{ editing ? 'Editar medicamento' : 'Añadir medicamento' }}</template>
      <MedicationForm :initial="editing ?? undefined" @save="onSave" @cancel="showForm = false" />
    </Modal>
  </div>
</template>