import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'
import type { LeadRecord } from '@/lib/leads/types'
import {
  LEAD_RESULT,
  LEAD_STATUS,
  type LeadResult,
  type LeadStatus,
  type PartnerStatus,
  PARTNER_STATUS,
} from '@/lib/telegram-leads/model'

import { countOpenAgreements, getLatestOpenAgreementSnapshot } from '@/lib/leads/repository'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const STATUS_RU: Record<LeadStatus, string> = {
  [LEAD_STATUS.NEW]: 'Новая',
  [LEAD_STATUS.IN_PROGRESS]: 'Взято в работу',
  [LEAD_STATUS.CONTACTED]: 'Связались',
  [LEAD_STATUS.NO_ANSWER]: 'Не дозвонились',
  [LEAD_STATUS.AGREEMENTS]: 'Договорённости',
  [LEAD_STATUS.CALLBACK_LATER]: 'Перезвонить позже',
  [LEAD_STATUS.AWAITING_DECISION]: 'Ждём решения',
  [LEAD_STATUS.CONSULTATION]: 'Консультация',
  [LEAD_STATUS.BOOKED]: 'Записан',
  [LEAD_STATUS.PARTNER_SENT]: 'Передано партнёрам',
  [LEAD_STATUS.REFUSED]: 'Отказ',
  [LEAD_STATUS.SPAM]: 'Спам',
  [LEAD_STATUS.CLOSED_WON]: 'Закрыто: успех',
  [LEAD_STATUS.CLOSED_LOST]: 'Закрыто: без конверсии',
}

const PARTNER_RU: Record<PartnerStatus, string> = {
  [PARTNER_STATUS.NONE]: '—',
  [PARTNER_STATUS.IN_PROGRESS]: 'Партнёры: в работе',
  [PARTNER_STATUS.AGREEMENTS]: 'Партнёры: договорённости',
  [PARTNER_STATUS.PASSED]: 'Партнёры: прошла',
  [PARTNER_STATUS.NOT_PASSED]: 'Партнёры: не прошла',
}

const RESULT_RU: Record<LeadResult, string> = {
  [LEAD_RESULT.NONE]: '—',
  [LEAD_RESULT.IN_PIPELINE]: 'В работе',
  [LEAD_RESULT.BOOKED_OWN]: 'Запись (своя линия)',
  [LEAD_RESULT.PARTNER_PASSED]: 'Партнёры: прошла',
  [LEAD_RESULT.PARTNER_NOT_PASSED]: 'Партнёры: не прошла',
  [LEAD_RESULT.REFUSED]: 'Отказ',
  [LEAD_RESULT.SPAM]: 'Спам',
  [LEAD_RESULT.NO_CONTACT]: 'Нет контакта',
}

const LEAD_TYPE_RU: Record<string, string> = {
  vyzov: '🚑 Выезд',
  stacionar: '🏥 Стационар',
  rehab: '🔄 Реабилитация',
  general: '📋 Общая',
}

function formatMsk(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
  } catch {
    return iso
  }
}

function stagnationLine(lead: LeadRecord): string {
  const terminal =
    lead.status === LEAD_STATUS.REFUSED ||
    lead.status === LEAD_STATUS.SPAM ||
    lead.status === LEAD_STATUS.CLOSED_WON ||
    lead.status === LEAD_STATUS.CLOSED_LOST
  if (terminal) return '—'
  const h = (Date.now() - new Date(lead.updated_at).getTime()) / 3600000
  if (h >= 24) return `⚠️ нет действий ~${Math.floor(h)} ч`
  return 'ок'
}

/** Карточка для sendMessage / editMessageText (HTML). */
export function buildLeadCardHtml(lead: LeadRecord): string {
  const openAgreements = countOpenAgreements(lead.id)
  const snap = getLatestOpenAgreementSnapshot(lead.id)
  const agreementLine =
    openAgreements === 0
      ? '—'
      : snap
        ? `${esc(snap.text.slice(0, 56))}${snap.text.length > 56 ? '…' : ''} · <i>до ${snap.next_contact_at ? `${formatMsk(snap.next_contact_at)} МСК` : '—'}</i> · <i>${esc(snap.created_by_display ?? '—')}</i> <i>(открыто: ${openAgreements})</i>`
        : `<i>открыто: ${openAgreements}</i>`

  const pageLine =
    [lead.page_path, lead.page_query].filter(Boolean).join('?') || '—'
  const device = lead.device_class || '—'
  const cta = lead.cta_label || '—'
  const ref = lead.referrer ? esc(lead.referrer.slice(0, 120)) : '—'
  const utm = lead.utm ? esc(lead.utm.slice(0, 160)) : '—'
  const name = lead.name ? esc(lead.name) : '—'
  const comment = lead.comment ? esc(lead.comment.slice(0, 400)) : '—'

  const statusLine =
    lead.status === LEAD_STATUS.PARTNER_SENT
      ? `${STATUS_RU[lead.status] ?? lead.status} · ${PARTNER_RU[lead.partner_status] ?? lead.partner_status}`
      : (STATUS_RU[lead.status] ?? lead.status)

  const lines = [
    `🆕 <b>Новая заявка</b> · ${esc(BRAND_DISPLAY_NAME)}`,
    `🌐 Сайт: ${esc(lead.site_domain)}`,
    `📋 Форма: <code>${esc(lead.form_id)}</code>`,
    `📄 Страница: <code>${esc(pageLine)}</code>`,
    `📱 Устройство: ${esc(device)}`,
    `🏷 CTA: <code>${esc(cta)}</code>`,
    `🔗 Referrer: ${ref}`,
    `📊 UTM: ${utm}`,
    `🕐 Время: ${formatMsk(lead.created_at)} <i>(МСК)</i>`,
    `✅ Согласие ПД: ${lead.consent_pd ? 'да' : 'нет'}`,
    `🆔 ID: <code>${esc(lead.public_id)}</code>`,
    '',
    `👤 Имя: ${name}`,
    `📞 Телефон: <code>${esc(lead.phone_e164)}</code>`,
    `🏙 Город: ${esc(lead.city_label)}`,
    `📌 Тип: ${LEAD_TYPE_RU[lead.lead_type] || esc(lead.lead_type)}`,
    `💬 Запрос: ${comment}`,
    '',
    `────────────`,
    `<b>Управление</b>`,
    `Статус: ${esc(statusLine)}`,
    `Ответственный: ${lead.owner_display ? esc(lead.owner_display) : 'не назначен'}`,
    `Результат: ${RESULT_RU[lead.result] ?? lead.result}`,
    `Договорённости: ${agreementLine}`,
    ...(lead.status !== LEAD_STATUS.PARTNER_SENT
      ? [`Партнёры: ${PARTNER_RU[lead.partner_status] ?? lead.partner_status}`]
      : []),
    `В работе с: ${lead.taken_at ? formatMsk(lead.taken_at) : '—'}`,
    `Движение: ${stagnationLine(lead)}`,
  ]

  return lines.join('\n')
}
