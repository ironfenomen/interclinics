import { aggregateLeadSlicesCreatedInPeriod, type SliceRow } from '@/lib/leads/lead-reports-slices'
import { aggregateMonthlyReport, aggregateWeeklyFunnel } from '@/lib/leads/lead-reports'
import {
  previousCompletedMonthMskBounds,
  previousCompletedWeekMskBounds,
} from '@/lib/leads/report-periods-msk'
import {
  releasePeriodicReportSlot,
  reservePeriodicReportSlot,
} from '@/lib/leads/periodic-report-log'

import { sendHtmlMessage } from '@/lib/telegram-leads/telegram-client'

const TG_MAX = 3800

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function statsChatId(): string | null {
  const d = process.env.TG_STATS_CHAT_ID?.trim()
  if (d) return d
  return process.env.TG_DIGEST_CHAT_ID?.trim() || process.env.TG_CHAT_ID?.trim() || null
}

function formatSliceBlock(title: string, rows: SliceRow[]): string {
  if (rows.length === 0) return ''
  const body = rows.map(r => `· ${esc(r.key)}: ${r.count}`).join('\n')
  return `\n<b>${esc(title)}</b>\n${body}`
}

function chunkHtmlMessage(full: string): string[] {
  if (full.length <= TG_MAX) return [full]
  const chunks: string[] = []
  let rest = full
  while (rest.length > 0) {
    if (rest.length <= TG_MAX) {
      chunks.push(rest)
      break
    }
    let cut = rest.lastIndexOf('\n', TG_MAX)
    if (cut < TG_MAX / 2) cut = TG_MAX
    chunks.push(rest.slice(0, cut))
    rest = `<b>…продолжение</b>\n` + rest.slice(cut).trimStart()
  }
  return chunks
}

export type PeriodicStatsResult =
  | { ok: true; skipped: 'dedup' }
  | { ok: true; sent: true; chunks: number }
  | { ok: false; error: string }

export async function runWeeklyStatsCron(input?: { force?: boolean }): Promise<PeriodicStatsResult> {
  const token = process.env.TG_BOT_TOKEN?.trim()
  const chatId = statsChatId()
  if (!token || !chatId) {
    return { ok: false, error: 'TG_BOT_TOKEN или TG_STATS_CHAT_ID/TG_DIGEST_CHAT_ID/TG_CHAT_ID не заданы' }
  }

  const bounds = previousCompletedWeekMskBounds()
  if (!input?.force && !reservePeriodicReportSlot(bounds.periodKey)) {
    return { ok: true, skipped: 'dedup' }
  }

  const w = aggregateWeeklyFunnel(bounds.fromIso, bounds.toIsoExclusive)
  const slices = aggregateLeadSlicesCreatedInPeriod(bounds.fromIso, bounds.toIsoExclusive, 8)

  let text =
    `<b>Недельная воронка</b> (${esc(bounds.label)})\n` +
    `<i>События по истории (lead_activity), заявки — по created_at</i>\n\n` +
    `<b>Всего заявок</b>: ${w.received_total}\n` +
    `Взято в работу: ${w.taken_in_progress}\n` +
    `Связались: ${w.contacted}\n` +
    `Не дозвонились: ${w.no_answer}\n` +
    `Консультация: ${w.consultation}\n` +
    `Записан: ${w.booked}\n` +
    `Передано партнёрам: ${w.partner_sent}\n` +
    `Отказ: ${w.refused}\n` +
    `Спам: ${w.spam}\n\n` +
    `<b>Партнёры</b> (события to_partner_status):\n` +
    `· в работе: ${w.partner_in_progress}\n` +
    `· договорённости: ${w.partner_agreements}\n` +
    `· прошла: ${w.partner_passed}\n` +
    `· не прошла: ${w.partner_not_passed}` +
    formatSliceBlock('Ответственные (топ)', slices.byOwner) +
    formatSliceBlock('Форма / form_id', slices.byFormId) +
    formatSliceBlock('Город', slices.byCity) +
    formatSliceBlock('Тип услуги', slices.byLeadType)

  try {
    const parts = chunkHtmlMessage(text)
    for (const p of parts) {
      await sendHtmlMessage({ chatId, text: p, disableWebPagePreview: true })
    }
    return { ok: true, sent: true, chunks: parts.length }
  } catch (e) {
    releasePeriodicReportSlot(bounds.periodKey)
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export async function runMonthlyStatsCron(input?: { force?: boolean }): Promise<PeriodicStatsResult> {
  const token = process.env.TG_BOT_TOKEN?.trim()
  const chatId = statsChatId()
  if (!token || !chatId) {
    return { ok: false, error: 'TG_BOT_TOKEN или TG_STATS_CHAT_ID/TG_DIGEST_CHAT_ID/TG_CHAT_ID не заданы' }
  }

  const bounds = previousCompletedMonthMskBounds()
  if (!input?.force && !reservePeriodicReportSlot(bounds.periodKey)) {
    return { ok: true, skipped: 'dedup' }
  }

  const m = aggregateMonthlyReport({
    monthStartIso: bounds.fromIso,
    monthEndExclusiveIso: bounds.toIsoExclusive,
    snapshotAsOfIso: bounds.snapshotAsOfIso,
  })
  const slices = aggregateLeadSlicesCreatedInPeriod(bounds.fromIso, bounds.toIsoExclusive, 8)

  let text =
    `<b>Месячная статистика</b> (${esc(bounds.label)})\n` +
    `<i>Своя линия: события за месяц (distinct lead_id), кроме «в работе» — срез на конец месяца</i>\n\n` +
    `<b>Всего заявок</b>: ${m.total_leads}\n` +
    `Прошло (запись/успех): ${m.passed_own}\n` +
    `Не прошло (closed_lost): ${m.not_passed_own}\n` +
    `В работе (срез на конец мес.): ${m.in_progress_open}\n` +
    `Отказ: ${m.refused}\n` +
    `Спам: ${m.spam}\n` +
    `Передано партнёрам: ${m.sent_to_partners}\n\n` +
    `<b>Партнёры</b>\n` +
    `· прошло: ${m.partner_passed}\n` +
    `· не прошло: ${m.partner_not_passed}\n` +
    `· в работе (срез): ${m.partner_in_progress_open}\n` +
    `· договорённости (срез): ${m.partner_agreements_open}` +
    formatSliceBlock('Ответственные (топ)', slices.byOwner) +
    formatSliceBlock('Форма / form_id', slices.byFormId) +
    formatSliceBlock('Город', slices.byCity) +
    formatSliceBlock('Тип услуги', slices.byLeadType)

  try {
    const parts = chunkHtmlMessage(text)
    for (const p of parts) {
      await sendHtmlMessage({ chatId, text: p, disableWebPagePreview: true })
    }
    return { ok: true, sent: true, chunks: parts.length }
  } catch (e) {
    releasePeriodicReportSlot(bounds.periodKey)
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
