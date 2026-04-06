import { nanoid } from 'nanoid'

import {
  AGREEMENT_RECORD_STATUS,
  type AgreementRecordStatus,
  LEAD_STATUS,
} from '@/lib/telegram-leads/model'

import { getLeadsDb } from './sqlite-db'
import type { LeadRecord, SiteLeadPayload } from './types'

function rowToLead(r: Record<string, unknown>): LeadRecord {
  return {
    id: Number(r.id),
    public_id: String(r.public_id),
    status: r.status as LeadRecord['status'],
    partner_status: r.partner_status as LeadRecord['partner_status'],
    result: r.result as LeadRecord['result'],
    owner_tg_user_id: r.owner_tg_user_id == null ? null : Number(r.owner_tg_user_id),
    owner_display: r.owner_display == null ? null : String(r.owner_display),
    agreement_summary: r.agreement_summary == null ? null : String(r.agreement_summary),
    taken_at: r.taken_at == null ? null : String(r.taken_at),
    updated_at: String(r.updated_at),
    created_at: String(r.created_at),
    closed_at: r.closed_at == null ? null : String(r.closed_at),
    site_domain: String(r.site_domain),
    form_id: String(r.form_id),
    page_path: r.page_path == null ? null : String(r.page_path),
    page_query: r.page_query == null ? null : String(r.page_query),
    device_class: r.device_class == null ? null : String(r.device_class),
    cta_label: r.cta_label == null ? null : String(r.cta_label),
    referrer: r.referrer == null ? null : String(r.referrer),
    utm: r.utm == null ? null : String(r.utm),
    consent_pd: Number(r.consent_pd),
    name: r.name == null ? null : String(r.name),
    phone_e164: String(r.phone_e164),
    city_slug: String(r.city_slug),
    city_label: String(r.city_label),
    lead_type: String(r.lead_type),
    comment: r.comment == null ? null : String(r.comment),
    telegram_chat_id: r.telegram_chat_id == null ? null : String(r.telegram_chat_id),
    telegram_message_id: r.telegram_message_id == null ? null : Number(r.telegram_message_id),
    site_payload_raw: r.site_payload_raw == null ? null : String(r.site_payload_raw),
    alarm_active: r.alarm_active != null ? Number(r.alarm_active) : 1,
    alarm_started_at: r.alarm_started_at == null ? null : String(r.alarm_started_at),
    alarm_last_sent_at: r.alarm_last_sent_at == null ? null : String(r.alarm_last_sent_at),
  }
}

function newPublicId(): string {
  return nanoid(10)
}

export function insertLeadFromSite(payload: SiteLeadPayload): { id: number; public_id: string } {
  const db = getLeadsDb()
  const now = new Date().toISOString()
  const publicId = newPublicId()
  let d = payload.phoneDigits.replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('8')) d = `7${d.slice(1)}`
  const phoneE164 =
    d.length === 11 && d.startsWith('7')
      ? `+${d}`
      : d.length === 10
        ? `+7${d}`
        : `+${d}`

  const formId = payload.formId?.trim() || payload.source || 'unknown'
  const raw = JSON.stringify({
    source: payload.source,
    receivedAt: now,
  })

  const stmt = db.prepare(`
    INSERT INTO leads (
      public_id, status, partner_status, result,
      updated_at, created_at,
      site_domain, form_id, page_path, page_query, device_class, cta_label,
      referrer, utm, consent_pd,
      name, phone_e164, city_slug, city_label, lead_type, comment,
      site_payload_raw,
      alarm_active, alarm_started_at, alarm_last_sent_at
    ) VALUES (
      @public_id, 'new', 'none', 'none',
      @updated_at, @created_at,
      @site_domain, @form_id, @page_path, @page_query, @device_class, @cta_label,
      @referrer, @utm, @consent_pd,
      @name, @phone_e164, @city_slug, @city_label, @lead_type, @comment,
      @site_payload_raw,
      1, @alarm_started_at, @alarm_last_sent_at
    )
  `)

  const info = stmt.run({
    public_id: publicId,
    updated_at: now,
    created_at: now,
    site_domain: payload.siteDomain,
    form_id: formId,
    page_path: payload.pagePath ?? null,
    page_query: payload.pageQuery ?? null,
    device_class: payload.deviceClass ?? null,
    cta_label: payload.ctaLabel ?? null,
    referrer: payload.referrer ?? null,
    utm: payload.utm ?? null,
    consent_pd: payload.consentPd ? 1 : 0,
    name: payload.name ?? null,
    phone_e164: phoneE164,
    city_slug: payload.citySlug,
    city_label: payload.cityLabel,
    lead_type: payload.leadType,
    comment: payload.comment ?? null,
    site_payload_raw: raw,
    alarm_started_at: now,
    alarm_last_sent_at: null,
  })

  return { id: Number(info.lastInsertRowid), public_id: publicId }
}

export function getLeadByPublicId(publicId: string): LeadRecord | undefined {
  const db = getLeadsDb()
  const r = db.prepare(`SELECT * FROM leads WHERE public_id = ?`).get(publicId) as Record<string, unknown> | undefined
  return r ? rowToLead(r) : undefined
}

export function getLeadById(id: number): LeadRecord | undefined {
  const db = getLeadsDb()
  const r = db.prepare(`SELECT * FROM leads WHERE id = ?`).get(id) as Record<string, unknown> | undefined
  return r ? rowToLead(r) : undefined
}

export function updateLeadTelegramPointers(
  leadId: number,
  chatId: string,
  messageId: number,
): void {
  const db = getLeadsDb()
  const now = new Date().toISOString()
  db.prepare(
    `UPDATE leads SET telegram_chat_id = ?, telegram_message_id = ?, updated_at = ? WHERE id = ?`,
  ).run(chatId, messageId, now, leadId)
}

export type LeadPatch = {
  status?: LeadRecord['status']
  partner_status?: LeadRecord['partner_status']
  result?: LeadRecord['result']
  owner_tg_user_id?: number | null
  owner_display?: string | null
  agreement_summary?: string | null
  taken_at?: string | null
  closed_at?: string | null
}

export function patchLead(leadId: number, updates: LeadPatch): void {
  const db = getLeadsDb()
  const now = new Date().toISOString()
  const sets: string[] = ['updated_at = ?']
  const vals: unknown[] = [now]

  const add = (col: string, v: unknown) => {
    sets.push(`${col} = ?`)
    vals.push(v)
  }

  if (updates.status !== undefined) add('status', updates.status)
  if (updates.partner_status !== undefined) add('partner_status', updates.partner_status)
  if (updates.result !== undefined) add('result', updates.result)
  if (updates.owner_tg_user_id !== undefined) add('owner_tg_user_id', updates.owner_tg_user_id)
  if (updates.owner_display !== undefined) add('owner_display', updates.owner_display)
  if (updates.agreement_summary !== undefined) add('agreement_summary', updates.agreement_summary)
  if (updates.taken_at !== undefined) add('taken_at', updates.taken_at)
  if (updates.closed_at !== undefined) add('closed_at', updates.closed_at)

  vals.push(leadId)
  db.prepare(`UPDATE leads SET ${sets.join(', ')} WHERE id = ?`).run(...vals)
}

export function insertActivity(input: {
  leadId: number
  actorTgUserId: number | null
  action: string
  fromStatus: string | null
  toStatus: string | null
  fromPartnerStatus: string | null
  toPartnerStatus: string | null
  meta?: Record<string, unknown> | null
}): void {
  const db = getLeadsDb()
  db.prepare(`
    INSERT INTO lead_activity (
      lead_id, at, actor_tg_user_id, action,
      from_status, to_status, from_partner_status, to_partner_status, meta_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.leadId,
    new Date().toISOString(),
    input.actorTgUserId,
    input.action,
    input.fromStatus,
    input.toStatus,
    input.fromPartnerStatus,
    input.toPartnerStatus,
    input.meta ? JSON.stringify(input.meta) : null,
  )
}

export function countOpenAgreements(leadId: number): number {
  const db = getLeadsDb()
  const row = db
    .prepare(
      `SELECT COUNT(*) AS c FROM agreements WHERE lead_id = ? AND record_status = ?`,
    )
    .get(leadId, AGREEMENT_RECORD_STATUS.OPEN) as { c: number }
  return row.c
}

export function getLatestOpenAgreementText(leadId: number): string | null {
  const db = getLeadsDb()
  const row = db
    .prepare(
      `SELECT text FROM agreements WHERE lead_id = ? AND record_status = ? ORDER BY created_at DESC LIMIT 1`,
    )
    .get(leadId, AGREEMENT_RECORD_STATUS.OPEN) as { text: string } | undefined
  return row?.text ?? null
}

export type OpenAgreementSnapshot = {
  id: number
  text: string
  next_contact_at: string | null
  created_by_display: string | null
  created_at: string
}

export function getLatestOpenAgreementSnapshot(leadId: number): OpenAgreementSnapshot | null {
  const db = getLeadsDb()
  const row = db
    .prepare(
      `SELECT id, text, next_contact_at, created_by_display, created_at FROM agreements
       WHERE lead_id = ? AND record_status = ? ORDER BY created_at DESC LIMIT 1`,
    )
    .get(leadId, AGREEMENT_RECORD_STATUS.OPEN) as
    | {
        id: number
        text: string
        next_contact_at: string | null
        created_by_display: string | null
        created_at: string
      }
    | undefined
  return row ?? null
}

/** Открытые договорённости с дедлайном раньше nowIso (просрочка). Для сводок / SLA. */
export function listOpenAgreementsOverdue(
  nowIso: string,
): (OpenAgreementSnapshot & { lead_id: number })[] {
  const db = getLeadsDb()
  return db
    .prepare(
      `SELECT a.id, a.lead_id, a.text, a.next_contact_at, a.created_by_display, a.created_at
       FROM agreements a
       WHERE a.record_status = ? AND a.next_contact_at IS NOT NULL AND a.next_contact_at < ?
       ORDER BY a.next_contact_at ASC`,
    )
    .all(AGREEMENT_RECORD_STATUS.OPEN, nowIso) as (OpenAgreementSnapshot & { lead_id: number })[]
}

/** Все открытые договорённости (ежедневные сводки 10:00 / 18:00). */
export function listAllOpenAgreements(): (OpenAgreementSnapshot & { lead_id: number })[] {
  const db = getLeadsDb()
  return db
    .prepare(
      `SELECT a.id, a.lead_id, a.text, a.next_contact_at, a.created_by_display, a.created_at
       FROM agreements a
       WHERE a.record_status = ?
       ORDER BY CASE WHEN a.next_contact_at IS NULL THEN 1 ELSE 0 END, a.next_contact_at ASC, a.created_at DESC`,
    )
    .all(AGREEMENT_RECORD_STATUS.OPEN) as (OpenAgreementSnapshot & { lead_id: number })[]
}

export function insertAgreement(input: {
  leadId: number
  actorTgUserId: number
  actorDisplay: string
  text: string
  nextContactAt: string | null
  status?: AgreementRecordStatus
}): number {
  const db = getLeadsDb()
  const now = new Date().toISOString()
  const st = input.status ?? AGREEMENT_RECORD_STATUS.OPEN
  const info = db
    .prepare(`
    INSERT INTO agreements (
      lead_id, text, created_by_tg_user_id, created_by_display, created_at, next_contact_at, record_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
    .run(
      input.leadId,
      input.text,
      input.actorTgUserId,
      input.actorDisplay,
      now,
      input.nextContactAt,
      st,
    )
  return Number(info.lastInsertRowid)
}

export function updateAgreementStatus(agreementId: number, status: AgreementRecordStatus): void {
  const db = getLeadsDb()
  db.prepare(`UPDATE agreements SET record_status = ? WHERE id = ?`).run(status, agreementId)
}

export function refreshAgreementSummary(leadId: number): void {
  const db = getLeadsDb()
  const count = countOpenAgreements(leadId)
  const snap = getLatestOpenAgreementSnapshot(leadId)
  let summary: string | null = null
  if (count > 0 && snap) {
    const t = snap.text.length > 72 ? `${snap.text.slice(0, 72)}…` : snap.text
    const due = snap.next_contact_at
      ? new Date(snap.next_contact_at).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
      : '—'
    const who = snap.created_by_display ?? '—'
    summary = `${t} | до ${due} МСК | ${who} (открыто: ${count})`
  } else if (count > 0) {
    summary = `открыто: ${count}`
  }
  const now = new Date().toISOString()
  db.prepare(`UPDATE leads SET agreement_summary = ?, updated_at = ? WHERE id = ?`).run(summary, now, leadId)
}

export type AgreementInputSession = {
  id: number
  chat_id: string
  tg_user_id: number
  lead_id: number
  lead_public_id: string
  step: 'await_text' | 'await_deadline'
  draft_text: string | null
  prompt_message_id: number | null
  actor_display: string
  created_at: string
  expires_at: string
}

export function getAgreementInputSession(chatId: string, tgUserId: number): AgreementInputSession | null {
  const db = getLeadsDb()
  const now = new Date().toISOString()
  const row = db
    .prepare(
      `SELECT * FROM agreement_input_sessions WHERE chat_id = ? AND tg_user_id = ? AND expires_at > ?`,
    )
    .get(chatId, tgUserId, now) as Record<string, unknown> | undefined
  if (!row) return null
  return {
    id: Number(row.id),
    chat_id: String(row.chat_id),
    tg_user_id: Number(row.tg_user_id),
    lead_id: Number(row.lead_id),
    lead_public_id: String(row.lead_public_id),
    step: row.step as AgreementInputSession['step'],
    draft_text: row.draft_text == null ? null : String(row.draft_text),
    prompt_message_id: row.prompt_message_id == null ? null : Number(row.prompt_message_id),
    actor_display: String(row.actor_display),
    created_at: String(row.created_at),
    expires_at: String(row.expires_at),
  }
}

export function upsertAgreementInputSession(input: {
  chatId: string
  tgUserId: number
  leadId: number
  leadPublicId: string
  step: AgreementInputSession['step']
  draftText: string | null
  promptMessageId: number | null
  actorDisplay: string
  ttlMinutes?: number
}): void {
  const db = getLeadsDb()
  const now = new Date()
  const ttl = input.ttlMinutes ?? 30
  const expires = new Date(now.getTime() + ttl * 60_000).toISOString()
  const created = now.toISOString()
  db.prepare(`DELETE FROM agreement_input_sessions WHERE chat_id = ? AND tg_user_id = ?`).run(
    input.chatId,
    input.tgUserId,
  )
  db.prepare(`
    INSERT INTO agreement_input_sessions (
      chat_id, tg_user_id, lead_id, lead_public_id, step, draft_text, prompt_message_id,
      actor_display, created_at, expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.chatId,
    input.tgUserId,
    input.leadId,
    input.leadPublicId,
    input.step,
    input.draftText,
    input.promptMessageId,
    input.actorDisplay,
    created,
    expires,
  )
}

export function updateAgreementInputSessionPrompt(input: {
  chatId: string
  tgUserId: number
  step: AgreementInputSession['step']
  draftText: string | null
  promptMessageId: number | null
  extendTtlMinutes?: number
}): void {
  const db = getLeadsDb()
  const ttl = input.extendTtlMinutes ?? 30
  const expires = new Date(Date.now() + ttl * 60_000).toISOString()
  db.prepare(
    `UPDATE agreement_input_sessions SET step = ?, draft_text = ?, prompt_message_id = ?, expires_at = ? WHERE chat_id = ? AND tg_user_id = ?`,
  ).run(
    input.step,
    input.draftText,
    input.promptMessageId,
    expires,
    input.chatId,
    input.tgUserId,
  )
}

export function deleteAgreementInputSession(chatId: string, tgUserId: number): void {
  const db = getLeadsDb()
  db.prepare(`DELETE FROM agreement_input_sessions WHERE chat_id = ? AND tg_user_id = ?`).run(chatId, tgUserId)
}

/** Лиды с активной тревогой: new + alarm_active, готовые к очередному всплеску (интервал с last_sent). */
export function listLeadsNeedingAlarmTick(intervalMs: number): { id: number }[] {
  const db = getLeadsDb()
  const rows = db
    .prepare(
      `SELECT id, alarm_last_sent_at FROM leads WHERE alarm_active = 1 AND status = ?`,
    )
    .all(LEAD_STATUS.NEW) as { id: number; alarm_last_sent_at: string | null }[]

  const now = Date.now()
  return rows.filter(r => {
    if (r.alarm_last_sent_at == null) return true
    return now - new Date(r.alarm_last_sent_at).getTime() >= intervalMs
  })
}

export function recordAlarmLastSent(leadId: number): void {
  const db = getLeadsDb()
  const t = new Date().toISOString()
  db.prepare(`UPDATE leads SET alarm_last_sent_at = ?, updated_at = ? WHERE id = ?`).run(t, t, leadId)
}

export function deactivateLeadAlarm(leadId: number): void {
  const db = getLeadsDb()
  const t = new Date().toISOString()
  db.prepare(`UPDATE leads SET alarm_active = 0, updated_at = ? WHERE id = ?`).run(t, leadId)
}
