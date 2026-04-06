import type { InlineKeyboardMarkup } from '@/lib/telegram-leads/telegram-client'

/**
 * Отдельный callback от карточки лида (`ic:…`). Обрабатывается в webhook до parseCallbackData.
 */
export const AGREEMENT_FLOW_CANCEL_CALLBACK = 'ic_agr:cancel'

export function agreementFlowCancelKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [[{ text: '❌ Отменить ввод', callback_data: AGREEMENT_FLOW_CANCEL_CALLBACK }]],
  }
}
