import type { DoseSlot, Medication } from '@/types'
import { todayISO } from './date'

export interface AdherencePoint {
  date: string
  label: string
  taken: number
  total: number
  percent: number
}

export function adherenceForWindow(
  doses: DoseSlot[],
  medications: Medication[],
  days: number,
): AdherencePoint[] {
  const activeIds = new Set(medications.filter((m) => m.active).map((m) => m.id))
  const points: AdherencePoint[] = []
  for (let day = days - 1; day >= 0; day--) {
    const date = todayISO(-day)
    const dayDoses = doses.filter(
      (d) => d.date === date && activeIds.has(d.medicationId),
    )
    const taken = dayDoses.filter((d) => d.status === 'taken').length
    const total = dayDoses.length
    points.push({
      date,
      label: dateToShortLabel(date),
      taken,
      total,
      percent: total === 0 ? 0 : Math.round((taken / total) * 100),
    })
  }
  return points
}

export function overallAdherence(points: AdherencePoint[]): number {
  const totals = points.reduce(
    (acc, p) => {
      acc.taken += p.taken
      acc.total += p.total
      return acc
    },
    { taken: 0, total: 0 },
  )
  if (totals.total === 0) return 0
  return Math.round((totals.taken / totals.total) * 100)
}

export function scoreLabel(percent: number): string {
  if (percent >= 90) return 'Excelente adherencia'
  if (percent >= 75) return 'Buena adherencia'
  if (percent >= 50) return 'Adherencia moderada'
  return 'Adherencia baja'
}

function dateToShortLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'short' })
}