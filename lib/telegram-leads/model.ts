/**
 * Модель заявок для Telegram-бота операторов (спецификация: docs/telegram-leads-bot-spec.md).
 * Использовать как единственный источник констант статусов/кнопок при реализации бота и CRM-слоя.
 */

/** Основная воронка (наша линия). После partner_sent основная ветка «заморожена» до смены партнёрского исхода или отката. */
export const LEAD_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  CONTACTED: 'contacted',
  NO_ANSWER: 'no_answer',
  AGREEMENTS: 'agreements',
  CALLBACK_LATER: 'callback_later',
  AWAITING_DECISION: 'awaiting_decision',
  CONSULTATION: 'consultation',
  BOOKED: 'booked',
  PARTNER_SENT: 'partner_sent',
  REFUSED: 'refused',
  SPAM: 'spam',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost',
} as const

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS]

/** Партнёрская под-воронка (имеет смысл при status === partner_sent или после него до финала). */
export const PARTNER_STATUS = {
  NONE: 'none',
  IN_PROGRESS: 'partner_in_progress',
  AGREEMENTS: 'partner_agreements',
  PASSED: 'partner_passed',
  NOT_PASSED: 'partner_not_passed',
} as const

export type PartnerStatus = (typeof PARTNER_STATUS)[keyof typeof PARTNER_STATUS]

/** Итог сделки / линии (для отчётов и карточки). */
export const LEAD_RESULT = {
  NONE: 'none',
  IN_PIPELINE: 'in_pipeline',
  BOOKED_OWN: 'booked_own',
  PARTNER_PASSED: 'partner_passed',
  PARTNER_NOT_PASSED: 'partner_not_passed',
  REFUSED: 'refused',
  SPAM: 'spam',
  NO_CONTACT: 'no_contact',
} as const

export type LeadResult = (typeof LEAD_RESULT)[keyof typeof LEAD_RESULT]

/** Статус одной записи договорённости. */
export const AGREEMENT_RECORD_STATUS = {
  OPEN: 'open',
  DONE: 'done',
  SUPERSEDED: 'superseded',
} as const

export type AgreementRecordStatus = (typeof AGREEMENT_RECORD_STATUS)[keyof typeof AGREEMENT_RECORD_STATUS]

/**
 * Действия inline-кнопок → переход статуса (основная ветка).
 * Значения — суффиксы callback_data после id заявки (см. спецификацию).
 */
export const INLINE_ACTION = {
  TAKE: 'take',
  CONTACTED: 'contacted',
  NO_ANSWER: 'no_answer',
  AGREEMENTS: 'agreements',
  CALLBACK_LATER: 'callback_later',
  AWAITING_DECISION: 'awaiting_decision',
  CONSULTATION: 'consultation',
  BOOKED: 'booked',
  PARTNER_SENT: 'partner_sent',
  REFUSED: 'refused',
  SPAM: 'spam',
} as const

export type InlineAction = (typeof INLINE_ACTION)[keyof typeof INLINE_ACTION]

export const PARTNER_INLINE_ACTION = {
  IN_PROGRESS: 'p_in_progress',
  AGREEMENTS: 'p_agreements',
  PASSED: 'p_passed',
  NOT_PASSED: 'p_not_passed',
} as const

export type PartnerInlineAction = (typeof PARTNER_INLINE_ACTION)[keyof typeof PARTNER_INLINE_ACTION]

/**
 * Ядро ежедневных сводок 10:00 / 18:00 — явно из ТЗ (активные сценарии без закрытия).
 * Остальные follow-up — в DAILY_DIGEST_EXTENDED.
 */
export const DAILY_DIGEST_CORE_LEAD_STATUSES: readonly LeadStatus[] = [
  LEAD_STATUS.AGREEMENTS,
  LEAD_STATUS.CALLBACK_LATER,
  LEAD_STATUS.AWAITING_DECISION,
] as const

/** Расширение: реально активные сценарии (не дозвон, в работе, линия, консультация, передано партнёрам). */
export const DAILY_DIGEST_EXTENDED_LEAD_STATUSES: readonly LeadStatus[] = [
  LEAD_STATUS.NO_ANSWER,
  LEAD_STATUS.IN_PROGRESS,
  LEAD_STATUS.CONTACTED,
  LEAD_STATUS.CONSULTATION,
  LEAD_STATUS.PARTNER_SENT,
] as const

/** Сводка по умолчанию: ядро + расширение (реализация может фильтровать). */
export const DAILY_DIGEST_LEAD_STATUSES: readonly LeadStatus[] = [
  ...DAILY_DIGEST_CORE_LEAD_STATUSES,
  ...DAILY_DIGEST_EXTENDED_LEAD_STATUSES,
] as const

/** Партнёрские подстатусы, при которых лид в «контролируемом» активном хвосте. */
export const DAILY_DIGEST_PARTNER_STATUSES: readonly PartnerStatus[] = [
  PARTNER_STATUS.IN_PROGRESS,
  PARTNER_STATUS.AGREEMENTS,
] as const

/** Недельная воронка: метрики по переходам/исходам за период (см. docs). */
export const WEEKLY_FUNNEL_KEYS = [
  'received_total',
  'taken_in_progress',
  'contacted',
  'no_answer',
  'consultation',
  'booked',
  'partner_sent',
  'refused',
  'spam',
  'partner_in_progress',
  'partner_agreements',
  'partner_passed',
  'partner_not_passed',
] as const

export type WeeklyFunnelKey = (typeof WEEKLY_FUNNEL_KEYS)[number]

/** Месячный отчёт: агрегаты по заявкам и партнёрам. */
export const MONTHLY_REPORT_KEYS = [
  'total_leads',
  'passed_own',
  'not_passed_own',
  'in_progress_open',
  'refused',
  'spam',
  'sent_to_partners',
  'partner_passed',
  'partner_not_passed',
  'partner_in_progress_open',
  'partner_agreements_open',
] as const

export type MonthlyReportKey = (typeof MONTHLY_REPORT_KEYS)[number]

/** Человекочитаемые подписи кнопок (UI Telegram). */
export const INLINE_BUTTON_LABEL: Record<InlineAction, string> = {
  [INLINE_ACTION.TAKE]: 'Взять в работу',
  [INLINE_ACTION.CONTACTED]: 'Связались',
  [INLINE_ACTION.NO_ANSWER]: 'Не дозвонились',
  [INLINE_ACTION.AGREEMENTS]: 'Договорённости',
  [INLINE_ACTION.CALLBACK_LATER]: 'Перезвонить позже',
  [INLINE_ACTION.AWAITING_DECISION]: 'Ждём решения',
  [INLINE_ACTION.CONSULTATION]: 'Консультация',
  [INLINE_ACTION.BOOKED]: 'Записан',
  [INLINE_ACTION.PARTNER_SENT]: 'Передано партнёрам',
  [INLINE_ACTION.REFUSED]: 'Отказ',
  [INLINE_ACTION.SPAM]: 'Спам',
}

export const PARTNER_INLINE_BUTTON_LABEL: Record<PartnerInlineAction, string> = {
  [PARTNER_INLINE_ACTION.IN_PROGRESS]: 'Партнёры: в работе',
  [PARTNER_INLINE_ACTION.AGREEMENTS]: 'Партнёры: договорённости',
  [PARTNER_INLINE_ACTION.PASSED]: 'Партнёры: прошла',
  [PARTNER_INLINE_ACTION.NOT_PASSED]: 'Партнёры: не прошла',
}
