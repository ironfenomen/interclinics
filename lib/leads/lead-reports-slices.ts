/**
 * Срезы по заявкам, созданным в периоде (данные из таблицы leads, не из Telegram).
 */

import { getLeadsDb } from './sqlite-db'

export type SliceRow = { key: string; count: number }

function topGrouped(
  fromIso: string,
  toIsoExclusive: string,
  column: 'owner_display' | 'form_id' | 'city_label' | 'lead_type',
  limit: number,
): SliceRow[] {
  const db = getLeadsDb()
  const col =
    column === 'owner_display'
      ? `COALESCE(NULLIF(TRIM(owner_display), ''), 'не назначен')`
      : column === 'form_id'
        ? `COALESCE(NULLIF(TRIM(form_id), ''), '—')`
        : column === 'city_label'
          ? `COALESCE(NULLIF(TRIM(city_label), ''), '—')`
          : `COALESCE(NULLIF(TRIM(lead_type), ''), '—')`

  const rows = db
    .prepare(
      `SELECT ${col} AS k, COUNT(*) AS c
       FROM leads
       WHERE created_at >= ? AND created_at < ?
       GROUP BY k
       ORDER BY c DESC
       LIMIT ?`,
    )
    .all(fromIso, toIsoExclusive, limit) as { k: string; c: number }[]

  return rows.map(r => ({ key: r.k, count: r.c }))
}

/** Топ-N по ответственным, форме, городу, типу лида (по дате создания заявки в периоде). */
export function aggregateLeadSlicesCreatedInPeriod(
  fromIso: string,
  toIsoExclusive: string,
  limit = 8,
): {
  byOwner: SliceRow[]
  byFormId: SliceRow[]
  byCity: SliceRow[]
  byLeadType: SliceRow[]
} {
  return {
    byOwner: topGrouped(fromIso, toIsoExclusive, 'owner_display', limit),
    byFormId: topGrouped(fromIso, toIsoExclusive, 'form_id', limit),
    byCity: topGrouped(fromIso, toIsoExclusive, 'city_label', limit),
    byLeadType: topGrouped(fromIso, toIsoExclusive, 'lead_type', limit),
  }
}
