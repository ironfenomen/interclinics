/**
 * Парсинг дедлайна следующего контакта для договорённости (МСК для явной даты).
 * Относительные смещения — от текущего момента сервера (достаточно для операторского сценария).
 */

export type ParsedAgreementDeadline =
  | { kind: 'none' }
  | { kind: 'utc'; iso: string }

const NONE_WORDS = new Set(['нет', 'no', '—', '-', 'н', 'skip', 'пусто'])

export function parseAgreementDeadlineInput(raw: string, refNow = new Date()): ParsedAgreementDeadline | null {
  const s0 = raw.trim()
  if (!s0) return null
  const lower = s0.toLowerCase().replace(/\s+/g, ' ')
  if (NONE_WORDS.has(lower)) return { kind: 'none' }

  const dRel = lower.match(/^\+(\d+)\s*d$/)
  if (dRel) {
    const t = refNow.getTime() + Number(dRel[1]) * 86_400_000
    return { kind: 'utc', iso: new Date(t).toISOString() }
  }
  const hRel = lower.match(/^\+(\d+)\s*h$/)
  if (hRel) {
    const t = refNow.getTime() + Number(hRel[1]) * 3_600_000
    return { kind: 'utc', iso: new Date(t).toISOString() }
  }

  const m = s0.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/i)
  if (m) {
    const d = Number(m[1])
    const mo = Number(m[2])
    const y = Number(m[3])
    const hh = m[4] != null ? Number(m[4]) : 10
    const mm = m[5] != null ? Number(m[5]) : 0
    if (mo < 1 || mo > 12 || d < 1 || d > 31 || hh > 23 || mm > 59) return null
    const utcMs = Date.UTC(y, mo - 1, d, hh - 3, mm, 0, 0)
    return { kind: 'utc', iso: new Date(utcMs).toISOString() }
  }

  return null
}
