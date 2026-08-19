<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DoseSlot, Severity } from '@/types'
import { useMedicationsStore } from '@/stores/medications'
import { useLogsStore } from '@/stores/logs'
import { todayISO, dateToLongLabel, relativeDayLabel } from '@/utils/date'
import { adherenceForWindow } from '@/utils/adherence'
import DayTimeline from '@/components/dashboard/DayTimeline.vue'
import AdherenceChart from '@/components/dashboard/AdherenceChart.vue'
import SymptomModal from '@/components/logs/SymptomModal.vue'
import Button from '@/components/ui/Button.vue'
import { useRouter } from 'vue-router'

const meds = useMedicationsStore()
const logs = useLogsStore()
const router = useRouter()

const selectedDate = ref(todayISO())
const activeDose = ref<DoseSlot | null>(null)
const showSymptomModal = ref(false)

watch(
  selectedDate,
  (d) => meds.ensureDateFor(d),
  { immediate: true },
)

const doses = computed(() => meds.dosesForDate(selectedDate.value))
const adherencePoints = computed(() =>
  adherenceForWindow(meds.allDoses, meds.activeMedications, 7),
)
const lowStock = computed(() => meds.lowStockMedications())

const activeMedication = computed(() =>
  activeDose.value ? meds.medicationById.get(activeDose.value.medicationId) : null,
)

function shiftDay(delta: number) {
  const d = new Date(`${selectedDate.value}T12:00:00`)
  d.setDate(d.getDate() + delta)
  selectedDate.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function onTake(dose: DoseSlot) {
  meds.setDoseStatus(dose.id, 'taken')
  activeDose.value = dose
  showSymptomModal.value = true
}

function onPostpone(dose: DoseSlot) {
  meds.postponeDose(dose.id)
}

function onSkip(dose: DoseSlot) {
  meds.setDoseStatus(dose.id, 'skipped')
}

function onSymptom(dose: DoseSlot) {
  activeDose.value = dose
  showSymptomModal.value = true
}

function onSaveSymptom(input: {
  dose: DoseSlot
  symptomId: string
  severity: Severity
  note?: string
}) {
  logs.addSymptomLog({
    doseId: input.dose.id,
    medicationId: input.dose.medicationId,
    symptomId: input.symptomId,
    severity: input.severity,
    note: input.note,
  })
  showSymptomModal.value = false
}

const isToday = computed(() => selectedDate.value === todayISO())
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold capitalize text-slate-900">
          {{ relativeDayLabel(selectedDate) }}
        </h1>
        <p class="text-sm capitalize text-slate-500">{{ dateToLongLabel(selectedDate) }}</p>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
          :disabled="isToday"
          aria-label="Día anterior"
          @click="shiftDay(-1)"
        >
          <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clip-rule="evenodd" />
          </svg>
        </button>
        <button
          class="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50"
          aria-label="Día siguiente"
          @click="shiftDay(1)"
        >
          <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Timeline & Add Button -->
      <div class="space-y-4 lg:col-span-7 xl:col-span-8">
        <DayTimeline
          :doses="doses"
          :medications="meds.medicationById"
          :disabled="!isToday"
          @take="onTake"
          @postpone="onPostpone"
          @skip="onSkip"
          @symptom="onSymptom"
        />

        <Button full @click="router.push({ name: 'cabinet', query: { nuevo: '1' } })">
          <span class="text-lg leading-none">+</span>
          Añadir medicamento
        </Button>
      </div>

      <!-- Right Column: Alerts & Chart -->
      <div class="space-y-4 lg:col-span-5 xl:col-span-4">
        <div
          v-if="lowStock.length > 0"
          class="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5"
        >
          <span class="text-lg">⚠️</span>
          <div class="text-sm">
            <p class="font-semibold text-rose-800">Alerta de reposición</p>
            <p class="text-rose-700">
              {{ lowStock.map((m) => m.name).join(', ') }} — quedan pocas dosis.
            </p>
          </div>
          <button
            class="ml-auto shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200 transition-colors hover:bg-rose-100"
            @click="router.push({ name: 'cabinet' })"
          >
            Revisar
          </button>
        </div>

        <AdherenceChart :points="adherencePoints" />
      </div>
    </div>

    <SymptomModal
      :open="showSymptomModal"
      :medication="activeMedication"
      :dose="activeDose"
      @close="showSymptomModal = false"
      @save="onSaveSymptom"
    />
  </div>
</template>