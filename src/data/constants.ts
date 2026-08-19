import type {
  AdministrationRoute,
  DayPart,
  DoseStatus,
  PharmaceuticalForm,
  Severity,
  Symptom,
} from '@/types'

export const PHARMACEUTICAL_FORMS = [
  { id: 'capsule', label: 'Cápsula', emoji: '💊' },
  { id: 'tablet', label: 'Tableta', emoji: '🫓' },
  { id: 'syrup', label: 'Jarabe', emoji: '🥤' },
  { id: 'drops', label: 'Gotas', emoji: '💧' },
  { id: 'injection', label: 'Inyección', emoji: '💉' },
] as const satisfies readonly { id: PharmaceuticalForm; label: string; emoji: string }[]

export const ADMINISTRATION_ROUTES = [
  { id: 'oral', label: 'Oral' },
  { id: 'topical', label: 'Tópica' },
  { id: 'subcutaneous', label: 'Subcutánea' },
  { id: 'inhalation', label: 'Inhalación' },
] as const satisfies readonly { id: AdministrationRoute; label: string }[]

export const FREQUENCY_OPTIONS = [
  { hours: 24, label: 'Cada 24 h (1/día)' },
  { hours: 12, label: 'Cada 12 h (2/día)' },
  { hours: 8, label: 'Cada 8 h (3/día)' },
  { hours: 6, label: 'Cada 6 h (4/día)' },
] as const

export const INDICATION_OPTIONS = [
  'En ayunas',
  'Con alimentos',
  'Antes de acostarse',
  'No especificada',
] as const

export const MEDICATION_COLORS = [
  '#6366f1',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
  '#f43f5e',
] as const

export const DAY_PARTS = [
  { id: 'morning', label: 'Mañana', range: '04:00 – 11:59' },
  { id: 'afternoon', label: 'Tarde', range: '12:00 – 18:59' },
  { id: 'evening', label: 'Noche', range: '19:00 – 03:59' },
] as const satisfies readonly { id: DayPart; label: string; range: string }[]

export const DOSE_STATUS_META = {
  pending: { label: 'Pendiente', classes: 'bg-slate-100 text-slate-700 ring-slate-200' },
  taken: { label: 'Tomada', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  skipped: { label: 'Omitida', classes: 'bg-rose-50 text-rose-700 ring-rose-200' },
  postponed: { label: 'Pospuesta', classes: 'bg-amber-50 text-amber-700 ring-amber-200' },
} as const satisfies Record<DoseStatus, { label: string; classes: string }>

export const SEVERITY_META = {
  leve: { label: 'Leve', classes: 'bg-amber-50 text-amber-700 ring-amber-200' },
  moderado: { label: 'Moderado', classes: 'bg-orange-50 text-orange-700 ring-orange-200' },
  severo: { label: 'Severo', classes: 'bg-rose-50 text-rose-700 ring-rose-200' },
} as const satisfies Record<Severity, { label: string; classes: string }>

export const SYMPTOMS: Symptom[] = [
  { id: 'dizziness', name: 'Mareo', emoji: '🥴' },
  { id: 'nausea', name: 'Náuseas', emoji: '🤢' },
  { id: 'headache', name: 'Dolor de cabeza', emoji: '🤕' },
  { id: 'fatigue', name: 'Cansancio', emoji: '😴' },
  { id: 'palpitations', name: 'Palpitaciones', emoji: '💓' },
  { id: 'drowsiness', name: 'Somnolencia', emoji: '😵‍💫' },
  { id: 'rash', name: 'Reacción en la piel', emoji: '🟥' },
  { id: 'stomach', name: 'Malestar estomacal', emoji: '🫄' },
]

export function getFormLabel(id: PharmaceuticalForm): string {
  return PHARMACEUTICAL_FORMS.find((f) => f.id === id)?.label ?? id
}

export function getFormEmoji(id: PharmaceuticalForm): string {
  return PHARMACEUTICAL_FORMS.find((f) => f.id === id)?.emoji ?? '💊'
}

export function getRouteLabel(id: AdministrationRoute): string {
  return ADMINISTRATION_ROUTES.find((r) => r.id === id)?.label ?? id
}

export function getSymptom(id: string): Symptom | undefined {
  return SYMPTOMS.find((s) => s.id === id)
}