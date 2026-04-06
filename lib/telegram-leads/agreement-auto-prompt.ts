/**
 * После смены статуса на эти действия автоматически открывается тот же сценарий,
 * что и по кнопке «Договорённости» (callback остаётся прежним — только UX).
 */
import { INLINE_ACTION } from '@/lib/telegram-leads/model'

export const AUTO_AGREEMENT_PROMPT_AFTER_ACTION: ReadonlySet<string> = new Set([
  INLINE_ACTION.CONTACTED,
  INLINE_ACTION.NO_ANSWER,
  INLINE_ACTION.CALLBACK_LATER,
  INLINE_ACTION.AWAITING_DECISION,
  INLINE_ACTION.CONSULTATION,
  INLINE_ACTION.BOOKED,
])

export function agreementAutoPromptHint(action: string): string | undefined {
  switch (action) {
    case INLINE_ACTION.CONTACTED:
      return 'Итог разговора и следующий шаг (если есть).'
    case INLINE_ACTION.NO_ANSWER:
      return 'Когда перезвонить и что сделать дальше.'
    case INLINE_ACTION.CALLBACK_LATER:
      return 'Когда перезвонить и о чём договорились.'
    case INLINE_ACTION.AWAITING_DECISION:
      return 'Что ждём от клиента и до какого срока.'
    case INLINE_ACTION.CONSULTATION:
      return 'Итог консультации и договорённости (если есть).'
    case INLINE_ACTION.BOOKED:
      return 'Куда записан, дата и время, важные детали.'
    default:
      return undefined
  }
}
