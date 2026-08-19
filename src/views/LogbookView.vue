<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMedicationsStore } from '@/stores/medications'
import { useLogsStore } from '@/stores/logs'
import { useUsersStore } from '@/stores/users'
import { SEVERITY_META, getSymptom } from '@/data/constants'
import { adherenceForWindow, overallAdherence, scoreLabel } from '@/utils/adherence'
import { dateToLongLabel, relativeDayLabel, todayISO } from '@/utils/date'
import AdherenceChart from '@/components/dashboard/AdherenceChart.vue'
import Card from '@/components/ui/Card.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Button from '@/components/ui/Button.vue'

const meds = useMedicationsStore()
const logs = useLogsStore()
const users = useUsersStore()

const range = ref<'weekly' | 'monthly'>('weekly')

const points = computed(() =>
  adherenceForWindow(meds.allDoses, meds.activeMedications, range.value === 'weekly' ? 7 : 30),
)
const overall = computed(() => overallAdherence(points.value))

const recentLogs = computed(() =>
  [...logs.userLogs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
)

function medicationName(id: string): string {
  return meds.medicationById.get(id)?.name ?? 'Medicamento'
}

function printReport() {
  window.print()
}
</script>

<template>
  <div class="space-y-4 print:hidden">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Bitácora de salud</h1>
        <p class="text-sm text-slate-500">Seguimiento y reportes</p>
      </div>
      <Button variant="secondary" size="sm" @click="printReport">
        <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.046.752.097 1.126.153A2.212 2.212 0 0 1 18 8.653v4.097A2.25 2.25 0 0 1 15.75 15h-.241l.305 1.984A1.75 1.75 0 0 1 14.084 19H5.915a1.75 1.75 0 0 1-1.73-2.016L4.492 15H4.25A2.25 2.25 0 0 1 2 12.75V8.653c0-1.082.775-2.034 1.874-2.198.374-.056.75-.107 1.127-.153V2.75Z" clip-rule="evenodd" />
        </svg>
        Exportar PDF
      </Button>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Left Column: Adherence -->
      <div class="space-y-4">
        <Card>
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium text-slate-500">Adherencia</p>
            <div class="flex rounded-lg bg-slate-100 p-0.5">
              <button
                class="rounded-md px-3 py-1 text-xs font-semibold transition-colors"
                :class="range === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'"
                @click="range = 'weekly'"
              >
                Semanal
              </button>
              <button
                class="rounded-md px-3 py-1 text-xs font-semibold transition-colors"
                :class="range === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'"
                @click="range = 'monthly'"
              >
                Mensual
              </button>
            </div>
          </div>
          <AdherenceChart :points="points" />
        </Card>
      </div>

      <!-- Right Column: Symptoms -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">
            Historial de síntomas
          </h2>
          <span class="text-xs text-slate-400">{{ recentLogs.length }} registros</span>
        </div>

        <div v-if="recentLogs.length > 0" class="space-y-3">
          <Card v-for="log in recentLogs" :key="log.id" class="!p-3.5">
            <div class="flex items-start gap-3">
              <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl">
                {{ getSymptom(log.symptomId)?.emoji ?? '📝' }}
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-sm font-semibold text-slate-900">
                    {{ getSymptom(log.symptomId)?.name ?? 'Síntoma' }}
                  </p>
                  <span
                    class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset"
                    :class="SEVERITY_META[log.severity].classes"
                  >
                    {{ SEVERITY_META[log.severity].label }}
                  </span>
                </div>
                <p class="text-xs text-slate-500">
                  {{ medicationName(log.medicationId) }} · {{ dateToLongLabel(log.date) }}
                </p>
                <p v-if="log.note" class="mt-1 text-sm text-slate-600">{{ log.note }}</p>
              </div>
              <button
                class="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                aria-label="Eliminar registro"
                @click="logs.deleteSymptomLog(log.id)"
              >
                <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4Z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </Card>
        </div>

        <EmptyState
          v-else
          title="Sin síntomas registrados"
          message="Registra efectos adversos desde el panel de Hoy para generar tu reporte."
          emoji="📝"
        />
      </div>
    </div>
  </div>

  <div class="hidden space-y-6 print:block">
    <div class="border-b border-slate-800 pb-4">
      <h1 class="text-2xl font-bold">DosisPlus — Reporte de adherencia</h1>
      <p class="text-sm">Generado el {{ dateToLongLabel(todayISO()) }}</p>
    </div>

    <div>
      <h2 class="mb-1 text-sm font-bold uppercase">Paciente</h2>
      <p>{{ users.activeUser?.name }} · {{ users.activeUser?.age }} años · Sangre {{ users.activeUser?.bloodType }}</p>
      <p>
        Médico: {{ users.activeUser?.doctor.name }} ({{ users.activeUser?.doctor.specialty }}) · {{ users.activeUser?.doctor.phone }}
      </p>
    </div>

    <div>
      <h2 class="mb-1 text-sm font-bold uppercase">Resumen de adherencia</h2>
      <p>
        Cumplimiento {{ range === 'weekly' ? 'semanal' : 'mensual' }}:
        <strong>{{ overall }}%</strong> — {{ scoreLabel(overall) }}
      </p>
      <table class="mt-2 w-full text-sm">
        <thead>
          <tr class="border-b border-slate-300 text-left">
            <th class="py-1">Día</th>
            <th class="py-1">Tomadas</th>
            <th class="py-1">Totales</th>
            <th class="py-1">%</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in points" :key="p.date" class="border-b border-slate-100">
            <td class="py-1 capitalize">{{ relativeDayLabel(p.date) }}</td>
            <td class="py-1">{{ p.taken }}</td>
            <td class="py-1">{{ p.total }}</td>
            <td class="py-1">{{ p.percent }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h2 class="mb-1 text-sm font-bold uppercase">Medicación activa</h2>
      <ul class="list-disc pl-5 text-sm">
        <li v-for="med in meds.activeMedications" :key="med.id">
          {{ med.name }} {{ med.concentration }} — {{ med.indication }}
        </li>
      </ul>
    </div>

    <div>
      <h2 class="mb-1 text-sm font-bold uppercase">Síntomas reportados</h2>
      <div v-if="recentLogs.length === 0" class="text-sm">Sin registros.</div>
      <ul v-else class="list-disc pl-5 text-sm">
        <li v-for="log in recentLogs" :key="log.id">
          {{ dateToLongLabel(log.date) }} — {{ getSymptom(log.symptomId)?.name }} ({{
            SEVERITY_META[log.severity].label
          }})
          <template v-if="log.note">: {{ log.note }}</template>
        </li>
      </ul>
    </div>
  </div>
</template>