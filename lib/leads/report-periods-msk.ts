/**
 * Границы отчётных периодов по календарю Europe/Moscow (без DST, UTC+3).
 */

const MSK_OFFSET_H = 3

/** MSK полночь заданной календарной даты → ISO UTC. */
export function mskMidnightUtcIso(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month - 1, day, -MSK_OFFSET_H, 0, 0, 0)).toISOString()
}

export function getMskYmd(d: Date): { y: number; m: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)
  const y = Number(parts.find(p => p.type === 'year')?.value ?? 0)
  const m = Number(parts.find(p => p.type === 'month')?.value ?? 1)
  const day = Number(parts.find(p => p.type === 'day')?.value ?? 1)
  return { y, m, day }
}

/** Понедельник = 0 … воскресенье = 6 (по календарю МСК для момента ref). */
export function mskWeekdayMon0(ref: Date): number {
  const w = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Moscow',
    weekday: 'short',
  }).format(ref)
  const map: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  }
  return map[w] ?? 0
}

function addCalendarDaysMsk(y: number, m: number, d: number, delta: number): { y: number; m: number; day: number } {
  const noonUtcMs = Date.UTC(y, m - 1, d, 12 - MSK_OFFSET_H, 0, 0, 0)
  const shifted = new Date(noonUtcMs + delta * 86_400_000)
  return getMskYmd(shifted)
}

/**
 * Завершённая календарная неделя пн–вс, строго до текущей недели.
 * (Удобно вызывать по пн утром МСК — отчёт за прошлую неделю.)
 */
export function previousCompletedWeekMskBounds(ref = new Date()): {
  fromIso: string
  toIsoExclusive: string
  label: string
  periodKey: string
} {
  const { y, m, day } = getMskYmd(ref)
  const mon0 = mskWeekdayMon0(ref)
  const thisMonday = addCalendarDaysMsk(y, m, day, -mon0)
  const prevMonday = addCalendarDaysMsk(thisMonday.y, thisMonday.m, thisMonday.day, -7)
  const fromIso = mskMidnightUtcIso(prevMonday.y, prevMonday.m, prevMonday.day)
  const toIsoExclusive = mskMidnightUtcIso(thisMonday.y, thisMonday.m, thisMonday.day)
  const sun = addCalendarDaysMsk(prevMonday.y, prevMonday.m, prevMonday.day, 6)
  const label = `пн ${String(prevMonday.day).padStart(2, '0')}.${String(prevMonday.m).padStart(2, '0')} — вс ${String(sun.day).padStart(2, '0')}.${String(sun.m).padStart(2, '0')}.${sun.y} МСК`
  const periodKey = `weekly:${prevMonday.y}-${String(prevMonday.m).padStart(2, '0')}-${String(prevMonday.day).padStart(2, '0')}`
  return { fromIso, toIsoExclusive, label, periodKey }
}

/**
 * Предыдущий полный календарный месяц в МСК.
 * snapshotAsOfIso — последняя миллисекунда месяца (для срезов «в работе»).
 */
export function previousCompletedMonthMskBounds(ref = new Date()): {
  fromIso: string
  toIsoExclusive: string
  snapshotAsOfIso: string
  label: string
  periodKey: string
} {
  const { y, m } = getMskYmd(ref)
  let py = y
  let pm = m - 1
  if (pm < 1) {
    pm = 12
    py -= 1
  }
  const fromIso = mskMidnightUtcIso(py, pm, 1)
  /** Первый день текущего месяца МСК — верхняя граница предыдущего месяца. */
  const toIsoExclusive = mskMidnightUtcIso(y, m, 1)
  const snapshotAsOfIso = new Date(new Date(toIsoExclusive).getTime() - 1).toISOString()
  const label = `${String(pm).padStart(2, '0')}.${py} МСК`
  const periodKey = `monthly:${py}-${String(pm).padStart(2, '0')}`
  return { fromIso, toIsoExclusive, snapshotAsOfIso, label, periodKey }
}
