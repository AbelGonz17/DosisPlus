export function todayISO(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return toISO(d)
}

export function toISO(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const hours = h % 12 === 0 ? 12 : h % 12
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${hours}:${String(m).padStart(2, '0')} ${suffix}`
}

export function parseTime(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesAhead(time: string, minutes: number): string {
  const total = parseTime(time) + minutes
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function relativeDayLabel(date: string): string {
  const today = todayISO()
  if (date === today) return 'Hoy'
  if (date === todayISO(-1)) return 'Ayer'
  if (date === todayISO(1)) return 'Mañana'
  return date
}

export function dateToLongLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export type DayPartLabel = 'morning' | 'afternoon' | 'evening'

export function partOfTime(time: string): DayPartLabel {
  const [h] = time.split(':').map(Number)
  if (h >= 4 && h < 12) return 'morning'
  if (h >= 12 && h < 19) return 'afternoon'
  return 'evening'
}