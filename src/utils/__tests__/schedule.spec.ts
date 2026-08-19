import { describe, expect, it } from 'vitest'
import { buildSeedDoses, genDosesForDate } from '@/utils/schedule'
import { makeMedication } from './factories'

describe('genDosesForDate', () => {
  it('creates one slot for a once-daily schedule', () => {
    const med = makeMedication({ frequencyHours: 24, startTime: '08:00' })
    const slots = genDosesForDate(med, '2026-08-19')
    expect(slots).toHaveLength(1)
    expect(slots[0]).toMatchObject({
      userId: med.userId,
      medicationId: med.id,
      date: '2026-08-19',
      time: '08:00',
      status: 'pending',
    })
  })

  it('creates evenly spaced slots across the day', () => {
    const med = makeMedication({ frequencyHours: 8, startTime: '08:00' })
    const slots = genDosesForDate(med, '2026-08-19')
    expect(slots.map((s) => s.time)).toEqual(['08:00', '16:00', '00:00'])
  })

  it('wraps past midnight without losing slots', () => {
    const med = makeMedication({ frequencyHours: 12, startTime: '20:00' })
    const slots = genDosesForDate(med, '2026-08-19')
    expect(slots.map((s) => s.time)).toEqual(['20:00', '08:00'])
  })

  it('generates unique ids', () => {
    const med = makeMedication({ frequencyHours: 6, startTime: '00:00' })
    const slots = genDosesForDate(med, '2026-08-19')
    const ids = new Set(slots.map((s) => s.id))
    expect(ids.size).toBe(slots.length)
  })
})

describe('buildSeedDoses', () => {
  it('covers the last 7 days for active medications only', () => {
    const active = makeMedication({ userId: 'user_a', frequencyHours: 24 })
    const inactive = makeMedication({ userId: 'user_a', active: false })
    const otherUser = makeMedication({ userId: 'user_b', frequencyHours: 24 })
    const slots = buildSeedDoses([active, inactive, otherUser])
    const allowed = new Set([active.id, otherUser.id])

    expect(slots.length).toBeGreaterThan(0)
    for (const slot of slots) {
      expect(allowed.has(slot.medicationId)).toBe(true)
      expect(['pending', 'taken', 'skipped']).toContain(slot.status)
    }
  })

  it('marks past doses as taken or skipped', () => {
    const med = makeMedication({ frequencyHours: 24 })
    const slots = buildSeedDoses([med])
    expect(slots.some((s) => s.status !== 'pending')).toBe(true)
  })
})