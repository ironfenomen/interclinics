/**
 * Выборки для ежедневных сводок и агрегаты недельной/месячной аналитики (по БД и lead_activity).
 * @see docs/telegram-leads-bot-spec.md §7–9, lib/telegram-leads/model.ts
 */

import {
  LEAD_STATUS,
  MONTHLY_REPORT_KEYS,
  PARTNER_STATUS,
  WEEKLY_FUNNEL_KEYS,
  type MonthlyReportKey,
  type WeeklyFunnelKey,
} from '@/lib/telegram-leads/model'

import { queryDailyDigestRows } from './daily-digest-query'
import { getLeadsDb } from './sqlite-db'

/** @deprecated Используйте queryDailyDigestRows — та же логика + открытые договорённости и исключение терминальных статусов. */
export function listLeadIdsForDailyDigest(): number[] {
  return queryDailyDigestRows(new Date().toISOString()).map(r => r.id)
}

function countActivity(
  fromIso: string,
  toIsoExclusive: string,
  condition: string,
): number {
  const db = getLeadsDb()
  const row = db
    .prepare(
      `SELECT COUNT(*) AS c FROM lead_activity
       WHERE at >= ? AND at < ? AND ${condition}`,
    )
    .get(fromIso, toIsoExclusive) as { c: number }
  return row.c
}

/** Для месячных метрик по лидам — одна строка на лид за период. */
function countDistinctLeadsActivity(
  fromIso: string,
  toIsoExclusive: string,
  condition: string,
): number {
  const db = getLeadsDb()
  const row = db
    .prepare(
      `SELECT COUNT(DISTINCT lead_id) AS c FROM lead_activity
       WHERE at >= ? AND at < ? AND ${condition}`,
    )
    .get(fromIso, toIsoExclusive) as { c: number }
  return row.c
}

function weeklyZeros(): Record<WeeklyFunnelKey, number> {
  return Object.fromEntries(WEEKLY_FUNNEL_KEYS.map(k => [k, 0])) as Record<WeeklyFunnelKey, number>
}

/**
 * Недельная воронка: число **событий** (строк в lead_activity) с соответствующим to_* за период.
 * `received_total` — новые лиды по `leads.created_at`.
 */
export function aggregateWeeklyFunnel(
  fromIso: string,
  toIsoExclusive: string,
): Record<WeeklyFunnelKey, number> {
  const db = getLeadsDb()
  const out = weeklyZeros()

  const created = db
    .prepare(`SELECT COUNT(*) AS c FROM leads WHERE created_at >= ? AND created_at < ?`)
    .get(fromIso, toIsoExclusive) as { c: number }
  out.received_total = created.c

  out.taken_in_progress = countActivity(fromIso, toIsoExclusive, `to_status = '${LEAD_STATUS.IN_PROGRESS}'`)
  out.contacted = countActivity(fromIso, toIsoExclusive, `to_status = '${LEAD_STATUS.CONTACTED}'`)
  out.no_answer = countActivity(fromIso, toIsoExclusive, `to_status = '${LEAD_STATUS.NO_ANSWER}'`)
  out.consultation = countActivity(fromIso, toIsoExclusive, `to_status = '${LEAD_STATUS.CONSULTATION}'`)
  out.booked = countActivity(fromIso, toIsoExclusive, `to_status = '${LEAD_STATUS.BOOKED}'`)
  out.partner_sent = countActivity(fromIso, toIsoExclusive, `to_status = '${LEAD_STATUS.PARTNER_SENT}'`)
  out.refused = countActivity(fromIso, toIsoExclusive, `to_status = '${LEAD_STATUS.REFUSED}'`)
  out.spam = countActivity(fromIso, toIsoExclusive, `to_status = '${LEAD_STATUS.SPAM}'`)

  out.partner_in_progress = countActivity(
    fromIso,
    toIsoExclusive,
    `to_partner_status = '${PARTNER_STATUS.IN_PROGRESS}'`,
  )
  out.partner_agreements = countActivity(
    fromIso,
    toIsoExclusive,
    `to_partner_status = '${PARTNER_STATUS.AGREEMENTS}'`,
  )
  out.partner_passed = countActivity(
    fromIso,
    toIsoExclusive,
    `to_partner_status = '${PARTNER_STATUS.PASSED}'`,
  )
  out.partner_not_passed = countActivity(
    fromIso,
    toIsoExclusive,
    `to_partner_status = '${PARTNER_STATUS.NOT_PASSED}'`,
  )

  return out
}

function monthlyZeros(): Record<MonthlyReportKey, number> {
  return Object.fromEntries(MONTHLY_REPORT_KEYS.map(k => [k, 0])) as Record<MonthlyReportKey, number>
}

/**
 * Месячный отчёт: часть метрик — события за интервал `[monthStart, monthEndExclusive)`,
 * срезы «open» — по состоянию на `snapshotAsOfIso` (конец месяца, ISO UTC).
 */
export function aggregateMonthlyReport(input: {
  monthStartIso: string
  monthEndExclusiveIso: string
  snapshotAsOfIso: string
}): Record<MonthlyReportKey, number> {
  const db = getLeadsDb()
  const { monthStartIso, monthEndExclusiveIso, snapshotAsOfIso } = input
  const out = monthlyZeros()

  const total = db
    .prepare(
      `SELECT COUNT(*) AS c FROM leads WHERE created_at >= ? AND created_at < ?`,
    )
    .get(monthStartIso, monthEndExclusiveIso) as { c: number }
  out.total_leads = total.c

  out.passed_own = countDistinctLeadsActivity(
    monthStartIso,
    monthEndExclusiveIso,
    `(to_status = '${LEAD_STATUS.BOOKED}' OR to_status = '${LEAD_STATUS.CLOSED_WON}')`,
  )
  /** Закрыто без конверсии (отдельно от «отказ»). */
  out.not_passed_own = countDistinctLeadsActivity(
    monthStartIso,
    monthEndExclusiveIso,
    `to_status = '${LEAD_STATUS.CLOSED_LOST}'`,
  )
  out.refused = countDistinctLeadsActivity(
    monthStartIso,
    monthEndExclusiveIso,
    `to_status = '${LEAD_STATUS.REFUSED}'`,
  )
  out.spam = countDistinctLeadsActivity(
    monthStartIso,
    monthEndExclusiveIso,
    `to_status = '${LEAD_STATUS.SPAM}'`,
  )
  out.sent_to_partners = countDistinctLeadsActivity(
    monthStartIso,
    monthEndExclusiveIso,
    `to_status = '${LEAD_STATUS.PARTNER_SENT}'`,
  )
  out.partner_passed = countDistinctLeadsActivity(
    monthStartIso,
    monthEndExclusiveIso,
    `to_partner_status = '${PARTNER_STATUS.PASSED}'`,
  )
  out.partner_not_passed = countDistinctLeadsActivity(
    monthStartIso,
    monthEndExclusiveIso,
    `to_partner_status = '${PARTNER_STATUS.NOT_PASSED}'`,
  )

  const openMain = db
    .prepare(
      `SELECT COUNT(*) AS c FROM leads
       WHERE created_at <= ?
         AND (closed_at IS NULL OR closed_at > ?)
         AND status NOT IN (?, ?, ?, ?)
         AND status != ?`,
    )
    .get(
      snapshotAsOfIso,
      snapshotAsOfIso,
      LEAD_STATUS.REFUSED,
      LEAD_STATUS.SPAM,
      LEAD_STATUS.CLOSED_WON,
      LEAD_STATUS.CLOSED_LOST,
      LEAD_STATUS.PARTNER_SENT,
    ) as { c: number }
  out.in_progress_open = openMain.c

  const pinp = db
    .prepare(
      `SELECT COUNT(*) AS c FROM leads
       WHERE created_at <= ?
         AND (closed_at IS NULL OR closed_at > ?)
         AND status = ?
         AND partner_status = ?`,
    )
    .get(
      snapshotAsOfIso,
      snapshotAsOfIso,
      LEAD_STATUS.PARTNER_SENT,
      PARTNER_STATUS.IN_PROGRESS,
    ) as { c: number }
  out.partner_in_progress_open = pinp.c

  const pag = db
    .prepare(
      `SELECT COUNT(*) AS c FROM leads
       WHERE created_at <= ?
         AND (closed_at IS NULL OR closed_at > ?)
         AND status = ?
         AND partner_status = ?`,
    )
    .get(
      snapshotAsOfIso,
      snapshotAsOfIso,
      LEAD_STATUS.PARTNER_SENT,
      PARTNER_STATUS.AGREEMENTS,
    ) as { c: number }
  out.partner_agreements_open = pag.c

  return out
}
