import { describe, expect, it } from 'vitest'
import { adherenceForWindow, overallAdherence, scoreLabel } from '@/utils/adherence'
import { todayISO } from '@/utils/date'
import type { DoseSlot } from '@/types'
import { makeMedication } from './factories'

describe('adherenceForWindow', () => {
  it('computes taken/total and percent per day', () => {
    const med = makeMedication()
    const today = todayISO()
    const yesterday = todayISO(-1)
    const doses: DoseSlot[] = [
      { id: 'd1', userId: med.userId, medicationId: med.id, date: today, time: '08:00', status: 'taken' },
      { id: 'd2', userId: med.userId, medicationId: med.id, date: today, time: '20:00', status: 'pending' },
      { id: 'd3', userId: med.userId, medicationId: med.id, date: yesterday, time: '08:00', status: 'taken' },
    ]
    const points = adherenceForWindow(doses, [med], 3)
    expect(points).toHaveLength(3)
    const todayPoint = points.find((p) => p.date === today)
    expect(todayPoint).toMatchObject({ taken: 1, total: 2, percent: 50 })
  })

  it('excludes doses from inactive medications', () => {
    const active = makeMedication()
    const inactive = makeMedication({ active: false })
    const today = todayISO()
    const doses: DoseSlot[] = [
      { id: 'd1', userId: active.userId, medicationId: active.id, date: today, time: '08:00', status: 'taken' },
      { id: 'd2', userId: inactive.userId, medicationId: inactive.id, date: today, time: '20:00', status: 'taken' },
    ]
    const points = adherenceForWindow(doses, [active, inactive], 1)
    expect(points[0]).toMatchObject({ taken: 1, total: 1, percent: 100 })
  })

  it('returns zero percent for empty days', () => {
    const med = makeMedication()
    const points = adherenceForWindow([], [med], 1)
    expect(points[0]).toMatchObject({ taken: 0, total: 0, percent: 0 })
  })
})

describe('overallAdherence', () => {
  it('aggregates taken/total across points', () => {
    const points = [
      { date: 'a', label: 'x', taken: 2, total: 2, percent: 100 },
      { date: 'b', label: 'y', taken: 0, total: 2, percent: 0 },
    ]
    expect(overallAdherence(points)).toBe(50)
  })

  it('returns 0 when there are no doses', () => {
    expect(overallAdherence([])).toBe(0)
  })
})

describe('scoreLabel', () => {
  it('maps percentages to labels', () => {
    expect(scoreLabel(90)).toBe('Excelente adherencia')
    expect(scoreLabel(75)).toBe('Buena adherencia')
    expect(scoreLabel(50)).toBe('Adherencia moderada')
    expect(scoreLabel(10)).toBe('Adherencia baja')
  })
})