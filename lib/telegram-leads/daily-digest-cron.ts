import type { DailyDigestLeadRow } from '@/lib/leads/daily-digest-query'
import {
  dailyDigestDaySlotKey,
  queryDailyDigestRows,
  releaseDailyDigestSlot,
  reserveDailyDigestSlot,
} from '@/lib/leads/daily-digest-query'
import {
  LEAD_STATUS,
  PARTNER_STATUS,
  type LeadStatus,
  type PartnerStatus,
} from '@/lib/telegram-leads/model'

import { sendHtmlMessage } from '@/lib/telegram-leads/telegram-client'

const TG_MAX = 3900

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const STATUS_RU: Record<LeadStatus, string> = {
  [LEAD_STATUS.NEW]: 'новая',
  [LEAD_STATUS.IN_PROGRESS]: 'в работе',
  [LEAD_STATUS.CONTACTED]: 'связались',
  [LEAD_STATUS.NO_ANSWER]: 'не дозвон',
  [LEAD_STATUS.AGREEMENTS]: 'договорённости',
  [LEAD_STATUS.CALLBACK_LATER]: 'перезвон',
  [LEAD_STATUS.AWAITING_DECISION]: 'ждём решения',
  [LEAD_STATUS.CONSULTATION]: 'консультация',
  [LEAD_STATUS.BOOKED]: 'записан',
  [LEAD_STATUS.PARTNER_SENT]: 'партнёрам',
  [LEAD_STATUS.REFUSED]: 'отказ',
  [LEAD_STATUS.SPAM]: 'спам',
  [LEAD_STATUS.CLOSED_WON]: 'успех',
  [LEAD_STATUS.CLOSED_LOST]: 'без конверсии',
}

const PARTNER_RU: Record<PartnerStatus, string> = {
  [PARTNER_STATUS.NONE]: '—',
  [PARTNER_STATUS.IN_PROGRESS]: 'партн.в работе',
  [PARTNER_STATUS.AGREEMENTS]: 'партн.догов.',
  [PARTNER_STATUS.PASSED]: 'партн.прошла',
  [PARTNER_STATUS.NOT_PASSED]: 'партн.нет',
}

function clip(s: string, n: number): string {
  const t = s.trim()
  if (t.length <= n) return t
  return `${t.slice(0, n)}…`
}

function formatMskShort(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function isOverdue(row: DailyDigestLeadRow, nowIso: string): boolean {
  return row.open_agreement_next != null && row.open_agreement_next < nowIso
}

function formatLeadBlock(row: DailyDigestLeadRow, nowIso: string): string {
  const overdue = isOverdue(row, nowIso)
  const name = row.name?.trim() || '—'
  const need = clip(row.comment?.trim() || '—', 80)
  const owner = row.owner_display?.trim() || '—'
  const st = STATUS_RU[row.status] ?? row.status
  const ps =
    row.status === LEAD_STATUS.PARTNER_SENT
      ? PARTNER_RU[row.partner_status] ?? row.partner_status
      : row.partner_status !== PARTNER_STATUS.NONE
        ? PARTNER_RU[row.partner_status] ?? row.partner_status
        : '—'
  const agr = row.open_agreement_text ? `«${clip(row.open_agreement_text, 100)}»` : '—'
  const due = formatMskShort(row.open_agreement_next)
  const mark = overdue ? '<b>⚠ ПРОСРОЧЕНО</b> ' : ''

  return [
    `${mark}<code>${esc(row.public_id)}</code> ${esc(name)} · <code>${esc(row.phone_e164)}</code>`,
    `Нужно: ${esc(need)} · Отв: ${esc(owner)}`,
    `Статус: ${esc(st)} · Партнёры: ${esc(ps)}`,
    `Дог: ${esc(agr)} · До: ${esc(due)} МСК`,
  ].join('\n')
}

function buildMessageChunks(slot: '10' | '18', rows: DailyDigestLeadRow[], now: Date, nowIso: string): string[] {
  const headMsk = now.toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  const overdueN = rows.filter(r => isOverdue(r, nowIso)).length
  const header =
    `<b>Сводка follow-up — ${slot}:00 МСК</b> (${esc(headMsk)})\n` +
    `Всего: ${rows.length}${overdueN ? ` · <b>просрочено договорённостей: ${overdueN}</b>` : ''}\n`

  const chunks: string[] = []
  let cur = header

  for (const row of rows) {
    const block = `${formatLeadBlock(row, nowIso)}\n\n`
    if (cur.length + block.length > TG_MAX) {
      chunks.push(cur.trimEnd())
      cur = `<b>…продолжение</b>\n\n${block}`
    } else {
      cur += block
    }
  }
  if (cur.length > header.length) chunks.push(cur.trimEnd())
  return chunks
}

function digestChatId(): string | null {
  const d = process.env.TG_DIGEST_CHAT_ID?.trim()
  if (d) return d
  return process.env.TG_CHAT_ID?.trim() || null
}

export type DailyDigestCronResult =
  | { ok: true; skipped: 'empty' }
  | { ok: true; skipped: 'dedup' }
  | { ok: true; sent: number; chunks: number }
  | { ok: false; error: string }

/**
 * Собрать и отправить сводку. Внешний cron: 10:00 и 18:00 Europe/Moscow (например 07:00 и 15:00 UTC).
 */
export async function runDailyDigestCron(input: {
  slot: '10' | '18'
  force?: boolean
}): Promise<DailyDigestCronResult> {
  const token = process.env.TG_BOT_TOKEN?.trim()
  const chatId = digestChatId()
  if (!token || !chatId) {
    return { ok: false, error: 'TG_BOT_TOKEN или TG_DIGEST_CHAT_ID/TG_CHAT_ID не заданы' }
  }

  const now = new Date()
  const nowIso = now.toISOString()
  const rows = queryDailyDigestRows(nowIso)

  if (rows.length === 0) {
    return { ok: true, skipped: 'empty' }
  }

  const daySlot = dailyDigestDaySlotKey(input.slot, now)
  if (!input.force && !reserveDailyDigestSlot(daySlot)) {
    return { ok: true, skipped: 'dedup' }
  }

  const chunks = buildMessageChunks(input.slot, rows, now, nowIso)
  try {
    for (const text of chunks) {
      await sendHtmlMessage({ chatId, text, disableWebPagePreview: true })
    }
    return { ok: true, sent: rows.length, chunks: chunks.length }
  } catch (e) {
    releaseDailyDigestSlot(daySlot)
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}
