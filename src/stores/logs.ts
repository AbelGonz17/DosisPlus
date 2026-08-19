import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Severity, SymptomLog } from '@/types'
import { loadJSON, saveJSON } from '@/utils/storage'
import { todayISO } from '@/utils/date'
import { uid } from '@/utils/id'
import { seedSymptoms, SEED_USER_ID } from '@/data/seed'
import { useUsersStore } from './users'

const KEY = 'symptom_logs'

function migrateLogs(list: SymptomLog[]): SymptomLog[] {
  return list.map((l) => ({ ...l, userId: l.userId ?? SEED_USER_ID }))
}

export const useLogsStore = defineStore('logs', () => {
  const users = useUsersStore()
  const symptomLogs = ref<SymptomLog[]>(migrateLogs(loadJSON(KEY, seedSymptoms)))

  watch(
    symptomLogs,
    (v) => saveJSON(KEY, v),
    { deep: true },
  )

  const userLogs = computed(() =>
    symptomLogs.value.filter((l) => l.userId === users.activeUserId),
  )

  function addSymptomLog(input: {
    doseId: string
    medicationId: string
    symptomId: string
    severity: Severity
    note?: string
  }): SymptomLog {
    const log: SymptomLog = {
      id: uid('sym'),
      userId: users.activeUserId ?? SEED_USER_ID,
      doseId: input.doseId,
      medicationId: input.medicationId,
      symptomId: input.symptomId,
      severity: input.severity,
      note: input.note?.trim() || undefined,
      date: todayISO(),
      createdAt: new Date().toISOString(),
    }
    symptomLogs.value.push(log)
    return log
  }

  function deleteSymptomLog(id: string): void {
    symptomLogs.value = symptomLogs.value.filter((l) => l.id !== id)
  }

  function purgeUserData(userId: string): void {
    symptomLogs.value = symptomLogs.value.filter((l) => l.userId !== userId)
  }

  return {
    symptomLogs,
    userLogs,
    addSymptomLog,
    deleteSymptomLog,
    purgeUserData,
  }
})