/**
 * Выборка лидов для ежедневной оперативной сводки (10:00 / 18:00 МСК).
 */

import {
  DAILY_DIGEST_LEAD_STATUSES,
  DAILY_DIGEST_PARTNER_STATUSES,
  LEAD_STATUS,
  type LeadStatus,
  type PartnerStatus,
} from '@/lib/telegram-leads/model'

import { getLeadsDb } from './sqlite-db'

const TERMINAL_MAIN: readonly LeadStatus[] = [
  LEAD_STATUS.REFUSED,
  LEAD_STATUS.SPAM,
  LEAD_STATUS.CLOSED_WON,
  LEAD_STATUS.CLOSED_LOST,
] as const

function ph(n: number): string {
  return Array.from({ length: n }, () => '?').join(', ')
}

export type DailyDigestLeadRow = {
  id: number
  public_id: string
  name: string | null
  phone_e164: string
  comment: string | null
  owner_display: string | null
  status: LeadStatus
  partner_status: PartnerStatus
  updated_at: string
  open_agreement_text: string | null
  open_agreement_next: string | null
}

/**
 * Актуальные незакрытые follow-up: статусы из модели, партнёрский хвост, либо есть открытая договорённость.
 * Сортировка: просроченный дедлайн первым, затем по ближайшему next_contact_at.
 */
export function queryDailyDigestRows(nowIso: string): DailyDigestLeadRow[] {
  const db = getLeadsDb()
  const st = [...DAILY_DIGEST_LEAD_STATUSES]
  const ps = [...DAILY_DIGEST_PARTNER_STATUSES]
  const ex = [...TERMINAL_MAIN]

  const sql = `
    SELECT
      l.id,
      l.public_id,
      l.name,
      l.phone_e164,
      l.comment,
      l.owner_display,
      l.status,
      l.partner_status,
      l.updated_at,
      la.text AS open_agreement_text,
      la.next_contact_at AS open_agreement_next
    FROM leads l
    LEFT JOIN (
      SELECT
        lead_id,
        text,
        next_contact_at,
        ROW_NUMBER() OVER (PARTITION BY lead_id ORDER BY created_at DESC) AS rn
      FROM agreements
      WHERE record_status = 'open'
    ) la ON l.id = la.lead_id AND la.rn = 1
    WHERE l.closed_at IS NULL
      AND l.status NOT IN (${ph(ex.length)})
      AND (
        l.status IN (${ph(st.length)})
        OR l.partner_status IN (${ph(ps.length)})
        OR la.text IS NOT NULL
      )
    ORDER BY
      CASE
        WHEN la.next_contact_at IS NOT NULL AND la.next_contact_at < ? THEN 0
        ELSE 1
      END,
      CASE WHEN la.next_contact_at IS NULL THEN 1 ELSE 0 END,
      la.next_contact_at ASC,
      l.updated_at DESC
  `

  const rows = db.prepare(sql).all(...ex, ...st, ...ps, nowIso) as Record<string, unknown>[]

  return rows.map(r => ({
    id: Number(r.id),
    public_id: String(r.public_id),
    name: r.name == null ? null : String(r.name),
    phone_e164: String(r.phone_e164),
    comment: r.comment == null ? null : String(r.comment),
    owner_display: r.owner_display == null ? null : String(r.owner_display),
    status: r.status as LeadStatus,
    partner_status: r.partner_status as PartnerStatus,
    updated_at: String(r.updated_at),
    open_agreement_text: r.open_agreement_text == null ? null : String(r.open_agreement_text),
    open_agreement_next: r.open_agreement_next == null ? null : String(r.open_agreement_next),
  }))
}

/** Ключ дедупликации: календарная дата МСК + слот 10|18. */
export function dailyDigestDaySlotKey(slot: '10' | '18', refDate = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(refDate)
  const y = parts.find(p => p.type === 'year')?.value ?? '0000'
  const m = parts.find(p => p.type === 'month')?.value ?? '01'
  const d = parts.find(p => p.type === 'day')?.value ?? '01'
  return `${y}-${m}-${d}-${slot}`
}

/** true = слот ещё не отправляли, строка зарезервирована. */
export function reserveDailyDigestSlot(daySlot: string): boolean {
  const db = getLeadsDb()
  const info = db
    .prepare(
      `INSERT OR IGNORE INTO daily_digest_log (day_slot, sent_at) VALUES (?, ?)`,
    )
    .run(daySlot, new Date().toISOString())
  return Number(info.changes) > 0
}

export function releaseDailyDigestSlot(daySlot: string): void {
  const db = getLeadsDb()
  db.prepare(`DELETE FROM daily_digest_log WHERE day_slot = ?`).run(daySlot)
}
