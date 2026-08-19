import type { Medication } from '@/types'

let medCount = 0

export function makeMedication(overrides: Partial<Medication> = {}): Medication {
  medCount += 1
  return {
    id: `med-${medCount}`,
    userId: 'user_test',
    name: 'Medicamento',
    concentration: '50 mg',
    form: 'tablet',
    route: 'oral',
    frequencyHours: 24,
    startTime: '08:00',
    indication: 'Indicación',
    stock: 30,
    stockThreshold: 5,
    active: true,
    color: '#4f46e5',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}