import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'
import type { LeadRecord } from '@/lib/leads/types'
import {
  LEAD_RESULT,
  LEAD_STATUS,
  type LeadResult,
  type LeadStatus,
  PARTNER_STATUS,
  type PartnerStatus,
} from '@/lib/telegram-leads/model'

import { countOpenAgreements, getLatestOpenAgreementSnapshot } from '@/lib/leads/repository'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Подписи статуса в карточке (коротко, без технарщины). */
const CARD_STATUS: Record<LeadStatus, string> = {
  [LEAD_STATUS.NEW]: 'Новая',
  [LEAD_STATUS.IN_PROGRESS]: 'В работе',
  [LEAD_STATUS.CONTACTED]: 'Связались',
  [LEAD_STATUS.NO_ANSWER]: 'Не дозвонились',
  [LEAD_STATUS.AGREEMENTS]: 'Договорённости',
  [LEAD_STATUS.CALLBACK_LATER]: 'Перезвон позже',
  [LEAD_STATUS.AWAITING_DECISION]: 'Ждём решения',
  [LEAD_STATUS.CONSULTATION]: 'Консультация',
  [LEAD_STATUS.BOOKED]: 'Записан',
  [LEAD_STATUS.PARTNER_SENT]: 'Передано партнёрам',
  [LEAD_STATUS.REFUSED]: 'Отказ',
  [LEAD_STATUS.SPAM]: 'Спам',
  [LEAD_STATUS.CLOSED_WON]: 'Закрыто: успех',
  [LEAD_STATUS.CLOSED_LOST]: 'Закрыто: без конверсии',
}

/** Итог по лиду в карточке (отдельно от статуса воронки). */
const CARD_RESULT: Record<LeadResult, string> = {
  [LEAD_RESULT.NONE]: '—',
  [LEAD_RESULT.IN_PIPELINE]: 'В работе',
  [LEAD_RESULT.BOOKED_OWN]: 'Запись на нашей линии',
  [LEAD_RESULT.PARTNER_PASSED]: 'У партнёра: принято',
  [LEAD_RESULT.PARTNER_NOT_PASSED]: 'У партнёра: не принято',
  [LEAD_RESULT.REFUSED]: 'Отказ',
  [LEAD_RESULT.SPAM]: 'Спам',
  [LEAD_RESULT.NO_CONTACT]: 'Нет контакта',
}

const PARTNER_STAGE: Record<PartnerStatus, string> = {
  [PARTNER_STATUS.NONE]: '—',
  [PARTNER_STATUS.IN_PROGRESS]: 'В работе у партнёра',
  [PARTNER_STATUS.AGREEMENTS]: 'Договорённости с партнёром',
  [PARTNER_STATUS.PASSED]: 'Партнёр принял',
  [PARTNER_STATUS.NOT_PASSED]: 'Партнёр не принял',
}

const LEAD_TYPE_SHORT: Record<string, string> = {
  vyzov: 'Выезд',
  stacionar: 'Стационар',
  rehab: 'Реабилитация',
  general: 'Общая',
}

function formatMsk(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
  } catch {
    return iso
  }
}

function terminalMain(lead: LeadRecord): boolean {
  return (
    lead.status === LEAD_STATUS.REFUSED ||
    lead.status === LEAD_STATUS.SPAM ||
    lead.status === LEAD_STATUS.CLOSED_WON ||
    lead.status === LEAD_STATUS.CLOSED_LOST
  )
}

function partnerOutcomeDone(lead: LeadRecord): boolean {
  return (
    lead.partner_status === PARTNER_STATUS.PASSED ||
    lead.partner_status === PARTNER_STATUS.NOT_PASSED
  )
}

/** Высокоуровневый этап без дублирования строки «Статус». */
function phaseLabel(lead: LeadRecord): string {
  if (lead.status === LEAD_STATUS.NEW) return 'Новый лид'
  if (terminalMain(lead)) return 'Закрыт'
  if (lead.status === LEAD_STATUS.PARTNER_SENT) {
    if (partnerOutcomeDone(lead)) return 'Партнёры · исход'
    return 'Партнёры'
  }
  return 'Наша линия'
}

function stagnationShort(lead: LeadRecord): string {
  if (terminalMain(lead)) return '—'
  const h = (Date.now() - new Date(lead.updated_at).getTime()) / 3600000
  if (h >= 24) return `давно нет шагов (~${Math.floor(h)} ч)`
  return 'в норме'
}

function showPartnerBlock(lead: LeadRecord): boolean {
  if (lead.status === LEAD_STATUS.PARTNER_SENT) return true
  if (lead.partner_status !== PARTNER_STATUS.NONE) return true
  return (
    lead.result === LEAD_RESULT.PARTNER_PASSED || lead.result === LEAD_RESULT.PARTNER_NOT_PASSED
  )
}

/** Следующий шаг — коротко, в одном стиле с кнопками. */
function nextStepLine(lead: LeadRecord): string {
  const s = lead.status

  if (s === LEAD_STATUS.NEW) {
    return 'Взять заявку в работу или отметить отказ / спам.'
  }
  if (s === LEAD_STATUS.REFUSED || s === LEAD_STATUS.SPAM) {
    return 'Действия не требуются.'
  }
  if (s === LEAD_STATUS.CLOSED_WON || s === LEAD_STATUS.CLOSED_LOST) {
    return 'Действия не требуются.'
  }

  if (s === LEAD_STATUS.PARTNER_SENT) {
    if (partnerOutcomeDone(lead)) {
      return 'Действия не требуются.'
    }
    if (lead.partner_status === PARTNER_STATUS.AGREEMENTS) {
      return 'Зафиксировать договорённость с партнёром или обновить стадию.'
    }
    if (lead.partner_status === PARTNER_STATUS.IN_PROGRESS) {
      return 'Контролировать ответ партнёра.'
    }
    return 'Контролировать ответ партнёра и зафиксировать исход.'
  }

  switch (s) {
    case LEAD_STATUS.IN_PROGRESS:
      return 'Связаться с пациентом и зафиксировать результат.'
    case LEAD_STATUS.CONTACTED:
      return 'Зафиксировать договорённость или следующий шаг.'
    case LEAD_STATUS.NO_ANSWER:
      return 'Назначить повторный контакт или закрыть исход.'
    case LEAD_STATUS.CALLBACK_LATER:
      return 'Перезвонить в согласованное время.'
    case LEAD_STATUS.AWAITING_DECISION:
      return 'Контролировать решение и не потерять лид.'
    case LEAD_STATUS.CONSULTATION:
      return 'Довести до записи или следующего шага.'
    case LEAD_STATUS.BOOKED:
      return 'Контролировать факт записи и визита.'
    case LEAD_STATUS.AGREEMENTS:
      return 'Завершить ввод договорённости в ответ боту или сменить статус.'
    default:
      return 'Зафиксировать следующий шаг кнопками или договорённостью.'
  }
}

function agreementSectionLines(lead: LeadRecord): string[] {
  const openN = countOpenAgreements(lead.id)
  const snap = getLatestOpenAgreementSnapshot(lead.id)

  if (openN === 0) {
    return ['<b>Договорённости</b>', 'Нет открытых договорённостей.']
  }

  if (!snap) {
    return ['<b>Договорённости</b>', `Открыто записей: ${openN}`]
  }

  const preview =
    esc(snap.text.slice(0, 72)) + (snap.text.length > 72 ? '…' : '')
  let dueHuman = 'без даты следующего контакта'
  let overdueMark = ''
  if (snap.next_contact_at) {
    dueHuman = `${formatMsk(snap.next_contact_at)} МСК`
    if (new Date(snap.next_contact_at).getTime() < Date.now()) {
      overdueMark = ' · <b>просрочено</b>'
    }
  }

  return [
    '<b>Договорённости</b>',
    `Последняя открытая: ${preview}`,
    `Следующий контакт: ${dueHuman}${overdueMark}`,
    `Кто зафиксировал: ${esc(snap.created_by_display ?? '—')}`,
    `Открыто: ${openN}`,
  ]
}

function partnerOutcomeHuman(lead: LeadRecord): string {
  if (
    lead.partner_status === PARTNER_STATUS.PASSED ||
    lead.result === LEAD_RESULT.PARTNER_PASSED
  ) {
    return 'Принято'
  }
  if (
    lead.partner_status === PARTNER_STATUS.NOT_PASSED ||
    lead.result === LEAD_RESULT.PARTNER_NOT_PASSED
  ) {
    return 'Не принято'
  }
  return 'В процессе'
}

function partnerSectionLines(lead: LeadRecord): string[] {
  return [
    '<b>Партнёры</b>',
    `Стадия: ${PARTNER_STAGE[lead.partner_status] ?? lead.partner_status}`,
    `Исход: ${partnerOutcomeHuman(lead)}`,
  ]
}

function extraFooterLine(lead: LeadRecord): string {
  const page = [lead.page_path, lead.page_query].filter(Boolean).join('?')
  const pageShort = page ? (page.length > 48 ? `${page.slice(0, 48)}…` : page) : '—'
  return `🆔 <code>${esc(lead.public_id)}</code> · Страница: ${esc(pageShort)}`
}

/**
 * Карточка для sendMessage / editMessageText (HTML).
 * Структура стабильна для всех статусов: основное → сейчас → договорённости → партнёры (если нужно) → дальше → доп.
 */
export function buildLeadCardHtml(lead: LeadRecord): string {
  const title =
    lead.status === LEAD_STATUS.NEW
      ? `🆕 <b>Новая заявка</b> · ${esc(BRAND_DISPLAY_NAME)}`
      : `📌 <b>Заявка</b> · ${esc(BRAND_DISPLAY_NAME)}`

  const sourceLine = `${esc(lead.form_id)} · ${esc(lead.site_domain)}`
  const typeLine = LEAD_TYPE_SHORT[lead.lead_type] ?? esc(lead.lead_type)
  const name = lead.name ? esc(lead.name) : '—'
  const ask = lead.comment ? esc(lead.comment.slice(0, 160)) + (lead.comment.length > 160 ? '…' : '') : '—'

  const statusOne = CARD_STATUS[lead.status] ?? lead.status

  const lines: string[] = [
    title,
    '',
    `<b>Основное</b>`,
    `🏙 ${esc(lead.city_label)} · ${typeLine}`,
    `📞 <code>${esc(lead.phone_e164)}</code>`,
    `📋 Источник: ${sourceLine}`,
    `🕐 Создано: ${formatMsk(lead.created_at)} <i>МСК</i>`,
    `👤 ${name} · 💬 ${ask}`,
    '',
    `<b>Сейчас</b>`,
    `Этап: ${esc(phaseLabel(lead))}`,
    `Статус: ${esc(statusOne)}`,
    `Ответственный: ${lead.owner_display ? esc(lead.owner_display) : 'не назначен'}`,
    `В работе с: ${lead.taken_at ? formatMsk(lead.taken_at) + ' МСК' : '—'}`,
    `Итог: ${CARD_RESULT[lead.result] ?? lead.result}`,
    `Без обновления: ${esc(stagnationShort(lead))}`,
    '',
    ...agreementSectionLines(lead),
    '',
  ]

  if (showPartnerBlock(lead)) {
    lines.push(...partnerSectionLines(lead), '')
  }

  lines.push(`➡️ <b>Дальше:</b> ${esc(nextStepLine(lead))}`, '', extraFooterLine(lead))

  return lines.join('\n')
}
