import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { DoseSlot, Medication, MedicationInput } from '@/types'
import { loadJSON, saveJSON } from '@/utils/storage'
import { todayISO } from '@/utils/date'
import { uid } from '@/utils/id'
import { buildSeedDoses, genDosesForDate } from '@/utils/schedule'
import { seedMedications, SEED_USER_ID } from '@/data/seed'
import { useUsersStore } from './users'

const KEY = 'medications'
const KEY_DOSES = 'doses'

function migrateMedications(list: Medication[]): Medication[] {
  return list.map((m) => ({ ...m, userId: m.userId ?? SEED_USER_ID }))
}

function migrateDoses(map: Record<string, DoseSlot[]>): Record<string, DoseSlot[]> {
  const out: Record<string, DoseSlot[]> = {}
  for (const [date, slots] of Object.entries(map)) {
    out[date] = slots.map((s) => ({ ...s, userId: s.userId ?? SEED_USER_ID }))
  }
  return out
}

function defaultDoses(): Record<string, DoseSlot[]> {
  const map: Record<string, DoseSlot[]> = {}
  for (const slot of buildSeedDoses(seedMedications)) {
    ;(map[slot.date] ??= []).push(slot)
  }
  return map
}

export const useMedicationsStore = defineStore('medications', () => {
  const users = useUsersStore()
  const medications = ref<Medication[]>(migrateMedications(loadJSON(KEY, seedMedications)))
  const dosesByDate = ref<Record<string, DoseSlot[]>>(migrateDoses(loadJSON(KEY_DOSES, defaultDoses())))

  watch(
    medications,
    (v) => saveJSON(KEY, v),
    { deep: true },
  )
  watch(
    dosesByDate,
    (v) => saveJSON(KEY_DOSES, v),
    { deep: true },
  )

  const activeUserId = computed(() => users.activeUserId)

  const activeMedications = computed(() =>
    medications.value.filter(
      (m) => m.active && m.userId === activeUserId.value,
    ),
  )

  const userMedications = computed(() =>
    medications.value.filter((m) => m.userId === activeUserId.value),
  )

  const medicationById = computed(() => {
    const map = new Map<string, Medication>()
    for (const med of medications.value) map.set(med.id, med)
    return map
  })

  const allDoses = computed(() =>
    Object.values(dosesByDate.value).flat().filter((d) => d.userId === activeUserId.value),
  )

  function lowStockMedications(): Medication[] {
    return activeMedications.value.filter((m) => m.stock <= m.stockThreshold)
  }

  function ensureDateFor(date: string): void {
    const userId = activeUserId.value
    if (!userId) return
    const slots = dosesByDate.value[date] ?? []
    if (slots.some((s) => s.userId === userId)) return
    const fresh = activeMedications.value.flatMap((m) => genDosesForDate(m, date))
    dosesByDate.value[date] = [...slots, ...fresh]
  }

  function ensureRecent(): void {
    for (let d = -7; d <= 1; d++) ensureDateFor(todayISO(d))
  }

  function dosesForDate(date: string): DoseSlot[] {
    return (dosesByDate.value[date] ?? [])
      .filter(
        (s) =>
          s.userId === activeUserId.value &&
          medicationById.value.has(s.medicationId),
      )
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  function addMedication(input: MedicationInput): Medication {
    const med: Medication = {
      ...input,
      id: uid('med'),
      userId: activeUserId.value ?? SEED_USER_ID,
      active: true,
      createdAt: new Date().toISOString(),
    }
    medications.value.push(med)
    for (const date of [todayISO(), todayISO(1)]) {
      const existing = dosesByDate.value[date] ?? []
      dosesByDate.value[date] = [...existing, ...genDosesForDate(med, date)]
    }
    return med
  }

  function updateMedication(id: string, patch: Partial<MedicationInput>): void {
    const idx = medications.value.findIndex((m) => m.id === id)
    if (idx === -1) return
    const prev = medications.value[idx]
    medications.value[idx] = { ...prev, ...patch }
    replaceDosesForMedication(id)
  }

  function deleteMedication(id: string): void {
    medications.value = medications.value.filter((m) => m.id !== id)
    for (const date of Object.keys(dosesByDate.value)) {
      dosesByDate.value[date] = (dosesByDate.value[date] ?? []).filter(
        (s) => s.medicationId !== id,
      )
    }
  }

  function replaceDosesForMedication(id: string): void {
    const med = medications.value.find((m) => m.id === id)
    if (!med) return
    const today = todayISO()
    for (const date of Object.keys(dosesByDate.value)) {
      if (date < today) continue
      const slots = dosesByDate.value[date] ?? []
      const others = slots.filter(
        (s) => s.medicationId !== id || s.status === 'taken',
      )
      const fresh = med.active ? genDosesForDate(med, date) : []
      const keepTaken = slots.filter(
        (s) => s.medicationId === id && s.status === 'taken',
      )
      const merged = fresh.map((slot) => {
        const taken = keepTaken.find(
          (k) => k.time === slot.time && k.status === 'taken',
        )
        return taken ? taken : slot
      })
      dosesByDate.value[date] = [...others, ...merged]
    }
  }

  function setDoseStatus(doseId: string, status: DoseSlot['status']): void {
    for (const date of Object.keys(dosesByDate.value)) {
      const slots = dosesByDate.value[date] ?? []
      const idx = slots.findIndex((s) => s.id === doseId)
      if (idx === -1) continue
      slots[idx].status = status
      if (status === 'taken') {
        slots[idx].takenAt = new Date().toISOString()
        const med = medicationById.value.get(slots[idx].medicationId)
        if (med && med.stock > 0) med.stock -= 1
      } else {
        slots[idx].takenAt = undefined
      }
      return
    }
  }

  function postponeDose(doseId: string): void {
    for (const date of Object.keys(dosesByDate.value)) {
      const slots = dosesByDate.value[date] ?? []
      const slot = slots.find((s) => s.id === doseId)
      if (!slot) continue
      slot.status = 'postponed'
      const [h, m] = slot.time.split(':').map(Number)
      const total = h * 60 + m + 15
      slot.time = `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
      return
    }
  }

  function purgeUserData(userId: string): void {
    medications.value = medications.value.filter((m) => m.userId !== userId)
    for (const date of Object.keys(dosesByDate.value)) {
      dosesByDate.value[date] = (dosesByDate.value[date] ?? []).filter(
        (s) => s.userId !== userId,
      )
    }
  }

  return {
    medications,
    dosesByDate,
    activeMedications,
    userMedications,
    medicationById,
    allDoses,
    lowStockMedications,
    ensureDateFor,
    ensureRecent,
    dosesForDate,
    addMedication,
    updateMedication,
    deleteMedication,
    setDoseStatus,
    postponeDose,
    purgeUserData,
  }
})