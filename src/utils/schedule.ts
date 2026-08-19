import type { DoseSlot, Medication } from '@/types'
import { minutesAhead, todayISO } from './date'
import { uid } from './id'

export function genDosesForDate(medication: Medication, date: string): DoseSlot[] {
  const slots: DoseSlot[] = []
  let time = medication.startTime
  for (let i = 0; i < Math.floor(24 / medication.frequencyHours); i++) {
    slots.push({
      id: uid('dose'),
      userId: medication.userId,
      medicationId: medication.id,
      date,
      time,
      status: 'pending',
    })
    time = minutesAhead(time, medication.frequencyHours * 60)
  }
  return slots
}

export function buildSeedDoses(medications: Medication[]): DoseSlot[] {
  const slots: DoseSlot[] = []
  for (let day = -6; day <= 0; day++) {
    const date = todayISO(day)
    for (const med of medications.filter((m) => m.active)) {
      const daySlots = genDosesForDate(med, date)
      for (const slot of daySlots) {
        const slotDateTime = new Date(`${date}T${slot.time}:00`)
        if (slotDateTime.getTime() > Date.now()) {
          slots.push(slot)
          continue
        }
        const past = day < 0
        if (past) {
          slot.status = Math.random() > 0.12 ? 'taken' : 'skipped'
          slot.takenAt = new Date(
            slotDateTime.getTime() + Math.floor(Math.random() * 20 + 2) * 60 * 1000,
          ).toISOString()
        } else {
          slot.status = Math.random() > 0.25 ? 'taken' : 'pending'
          if (slot.status === 'taken') {
            slot.takenAt = new Date(
              slotDateTime.getTime() + 10 * 60 * 1000,
            ).toISOString()
          }
        }
        slots.push(slot)
      }
    }
  }
  return slots
}