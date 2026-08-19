import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMedicationsStore } from '@/stores/medications'
import { useUsersStore } from '@/stores/users'
import { SEED_USER_ID } from '@/data/seed'
import { todayISO } from '@/utils/date'
import { makeMedication } from '@/utils/__tests__/factories'

describe('medications store', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('dosisplus:active_user', JSON.stringify(SEED_USER_ID))
    setActivePinia(createPinia())
  })

  it('seeds doses idempotently for an ensured date', () => {
    const meds = useMedicationsStore()
    const date = todayISO()
    meds.ensureDateFor(date)
    const first = meds.dosesForDate(date).length
    expect(first).toBeGreaterThan(0)

    meds.ensureDateFor(date)
    expect(meds.dosesForDate(date).length).toBe(first)
  })

  it('keeps dosesForDate pure (does not mutate state)', () => {
    const meds = useMedicationsStore()
    const date = todayISO()
    meds.ensureDateFor(date)
    const before = JSON.stringify(meds.dosesByDate[date])
    const result = meds.dosesForDate(date)
    expect(result[0]?.status).toBeDefined()
    expect(JSON.stringify(meds.dosesByDate[date])).toBe(before)
  })

  it('returns only doses for the active user', () => {
    const meds = useMedicationsStore()
    const users = useUsersStore()
    meds.ensureDateFor(todayISO())
    const before = meds.dosesForDate(todayISO()).length
    users.createUser({ name: 'Nuevo Usuario' })
    expect(meds.dosesForDate(todayISO()).length).toBe(0)
    expect(before).toBeGreaterThan(0)
  })

  it('adds a medication with doses for today and tomorrow', () => {
    const meds = useMedicationsStore()
    const added = meds.addMedication(makeMedication({ frequencyHours: 24, startTime: '09:00' }))
    expect(meds.medications.some((m) => m.id === added.id)).toBe(true)
    expect(meds.dosesForDate(todayISO()).filter((s) => s.medicationId === added.id)).toHaveLength(1)
    expect(meds.dosesForDate(todayISO(1)).filter((s) => s.medicationId === added.id)).toHaveLength(1)
  })

  it('decrements stock when a dose is taken and clears it otherwise', () => {
    const meds = useMedicationsStore()
    const added = meds.addMedication(makeMedication({ stock: 10 }))
    const dose = meds.dosesForDate(todayISO()).find((s) => s.medicationId === added.id)
    expect(dose).toBeDefined()
    const med = meds.medications.find((m) => m.id === added.id)
    const stockBefore = med!.stock

    meds.setDoseStatus(dose!.id, 'taken')
    expect(meds.medications.find((m) => m.id === added.id)!.stock).toBe(stockBefore - 1)
    expect(meds.dosesForDate(todayISO()).find((s) => s.id === dose!.id)!.takenAt).toBeDefined()

    meds.setDoseStatus(dose!.id, 'pending')
    expect(meds.dosesForDate(todayISO()).find((s) => s.id === dose!.id)!.takenAt).toBeUndefined()
  })

  it('flags medications below the stock threshold', () => {
    const meds = useMedicationsStore()
    meds.medications.splice(0, meds.medications.length)
    meds.addMedication(makeMedication({ name: 'Con stock', stock: 30, stockThreshold: 5 }))
    meds.addMedication(makeMedication({ name: 'Sin stock', stock: 2, stockThreshold: 5 }))
    const low = meds.lowStockMedications().map((m) => m.name)
    expect(low).toEqual(['Sin stock'])
  })

  it('purges all data of a removed user', () => {
    const meds = useMedicationsStore()
    const users = useUsersStore()
    meds.addMedication(makeMedication())
    const other = users.createUser({ name: 'Otro' })
    meds.addMedication(makeMedication())
    users.removeUser(other.id)
    expect(meds.medications.some((m) => m.userId === other.id)).toBe(false)
  })
})