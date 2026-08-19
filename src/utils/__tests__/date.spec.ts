import { describe, expect, it } from 'vitest'
import {
  dateToLongLabel,
  formatTime,
  minutesAhead,
  parseTime,
  partOfTime,
  relativeDayLabel,
  toISO,
  todayISO,
} from '@/utils/date'

describe('date utils', () => {
  it('formats 24h times to AM/PM', () => {
    expect(formatTime('08:30')).toBe('8:30 AM')
    expect(formatTime('12:00')).toBe('12:00 PM')
    expect(formatTime('00:15')).toBe('12:15 AM')
    expect(formatTime('23:59')).toBe('11:59 PM')
  })

  it('parses times to minutes since midnight', () => {
    expect(parseTime('00:00')).toBe(0)
    expect(parseTime('08:30')).toBe(510)
    expect(parseTime('23:59')).toBe(1439)
  })

  it('adds minutes with midnight wrap-around', () => {
    expect(minutesAhead('08:00', 480)).toBe('16:00')
    expect(minutesAhead('23:30', 45)).toBe('00:15')
  })

  it('classifies a time into a day part', () => {
    expect(partOfTime('03:59')).toBe('evening')
    expect(partOfTime('04:00')).toBe('morning')
    expect(partOfTime('11:59')).toBe('morning')
    expect(partOfTime('12:00')).toBe('afternoon')
    expect(partOfTime('18:59')).toBe('afternoon')
    expect(partOfTime('19:00')).toBe('evening')
  })

  it('produces zero-padded ISO dates', () => {
    expect(toISO(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(toISO(new Date(2026, 11, 30))).toBe('2026-12-30')
  })

  it('labels today, yesterday and tomorrow relatively', () => {
    expect(relativeDayLabel(todayISO())).toBe('Hoy')
    expect(relativeDayLabel(todayISO(-1))).toBe('Ayer')
    expect(relativeDayLabel(todayISO(1))).toBe('Mañana')
    expect(relativeDayLabel('2099-01-01')).toBe('2099-01-01')
  })

  it('builds a long Spanish date label', () => {
    const label = dateToLongLabel('2026-08-19')
    expect(label).toContain('agosto')
  })
})