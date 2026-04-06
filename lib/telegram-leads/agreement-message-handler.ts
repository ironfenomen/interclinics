import {
  deleteAgreementInputSession,
  getAgreementInputSession,
  getLeadById,
  insertActivity,
  insertAgreement,
  refreshAgreementSummary,
  updateAgreementInputSessionPrompt,
} from '@/lib/leads/repository'

import { parseAgreementDeadlineInput } from '@/lib/telegram-leads/agreement-deadline-parse'
import { buildLeadCardHtml } from '@/lib/telegram-leads/lead-card'
import { buildLeadInlineKeyboard } from '@/lib/telegram-leads/inline-keyboard'
import { editLeadCardMessage, sendPlainMessage } from '@/lib/telegram-leads/telegram-client'

function actorDisplay(u: {
  id: number
  username?: string
  first_name?: string
  last_name?: string
}): string {
  if (u.username) return `@${u.username}`
  const n = [u.first_name, u.last_name].filter(Boolean).join(' ')
  return n || `user:${u.id}`
}

function normalizeCommand(text: string): string | null {
  if (!text.startsWith('/')) return null
  const part = text.trim().split(/\s/)[0]
  if (!part) return null
  return part.split('@')[0]!.toLowerCase()
}

const MAX_AGREEMENT_TEXT = 4000

async function syncLeadCard(leadId: number): Promise<void> {
  const lead = getLeadById(leadId)
  if (!lead || lead.telegram_chat_id == null || lead.telegram_message_id == null) return
  const text = buildLeadCardHtml(lead)
  const replyMarkup = buildLeadInlineKeyboard(lead)
  try {
    await editLeadCardMessage({
      chatId: lead.telegram_chat_id,
      messageId: lead.telegram_message_id,
      text,
      replyMarkup,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('message is not modified')) return
    if (msg.includes('message to edit not found')) return
    console.error('agreement flow syncLeadCard', e)
  }
}

export type TelegramMessageUpdate = {
  message_id: number
  chat: { id: number }
  from?: { id: number; is_bot?: boolean; username?: string; first_name?: string; last_name?: string }
  text?: string
  reply_to_message?: { message_id: number }
}

/**
 * Обрабатывает сообщения в группе в рамках сессии ввода договорённости.
 * @returns true если update обработан (сессия была или команда отмены).
 */
export async function handleAgreementFlowMessage(
  msg: TelegramMessageUpdate,
): Promise<boolean> {
  if (msg.from?.is_bot) return false

  const chatId = String(msg.chat.id)
  const operator = msg.from
  if (!operator) return false
  const userId = operator.id

  const textRaw = msg.text?.trim()
  if (textRaw == null) return false

  const cmd = normalizeCommand(textRaw)
  if (cmd === '/agr_cancel') {
    const session = getAgreementInputSession(chatId, userId)
    if (!session) return false
    deleteAgreementInputSession(chatId, userId)
    await sendPlainMessage({
      chatId,
      text: 'Ввод договорённости отменён.',
      replyToMessageId: msg.message_id,
    })
    return true
  }

  const session = getAgreementInputSession(chatId, userId)
  if (!session) return false

  const replyToId = msg.reply_to_message?.message_id
  const expectedPrompt = session.prompt_message_id
  if (expectedPrompt == null || replyToId !== expectedPrompt) {
    await sendPlainMessage({
      chatId,
      text:
        'Чтобы продолжить ввод договорённости, ответьте (Reply) на последнее сообщение бота в этом диалоге.',
      replyToMessageId: msg.message_id,
    })
    return true
  }

  if (session.step === 'await_text') {
    if (textRaw.length > MAX_AGREEMENT_TEXT) {
      await sendPlainMessage({
        chatId,
        text: `Текст слишком длинный (макс. ${MAX_AGREEMENT_TEXT} символов). Сократите и ответьте снова на то же сообщение бота.`,
        replyToMessageId: msg.message_id,
      })
      return true
    }
    const prompt2 = await sendPlainMessage({
      chatId,
      text:
        `Заявка ${session.lead_public_id}: следующий контакт с клиентом.\n` +
        `• относительно: +1d, +24h\n` +
        `• дата/время МСК: ДД.ММ.ГГГГ [ЧЧ:ММ] (время по умолчанию 10:00)\n` +
        `• без дедлайна: нет\n\n` +
        `Ответьте (Reply) на это сообщение. Отмена: /agr_cancel`,
      replyToMessageId: msg.message_id,
    })
    updateAgreementInputSessionPrompt({
      chatId,
      tgUserId: userId,
      step: 'await_deadline',
      draftText: textRaw,
      promptMessageId: prompt2.message_id,
    })
    return true
  }

  const draft = session.draft_text
  if (!draft) {
    deleteAgreementInputSession(chatId, userId)
    return true
  }

  const parsed = parseAgreementDeadlineInput(textRaw)
  if (!parsed) {
    await sendPlainMessage({
      chatId,
      text:
        'Не разобрал дедлайн. Примеры: +1d, +8h, 15.04.2026 14:00, или «нет» без даты. Ответьте на сообщение бота выше.',
      replyToMessageId: msg.message_id,
    })
    return true
  }

  const nextContactAt = parsed.kind === 'none' ? null : parsed.iso
  const display = actorDisplay(operator)

  const agreementId = insertAgreement({
    leadId: session.lead_id,
    actorTgUserId: userId,
    actorDisplay: display,
    text: draft,
    nextContactAt: nextContactAt,
  })

  refreshAgreementSummary(session.lead_id)

  const fresh = getLeadById(session.lead_id)
  if (fresh) {
    insertActivity({
      leadId: fresh.id,
      actorTgUserId: userId,
      action: 'agreement:create',
      fromStatus: fresh.status,
      toStatus: fresh.status,
      fromPartnerStatus: fresh.partner_status,
      toPartnerStatus: fresh.partner_status,
      meta: {
        agreementId,
        next_contact_at: nextContactAt,
        textPreview: draft.slice(0, 200),
      },
    })
  }

  deleteAgreementInputSession(chatId, userId)

  await syncLeadCard(session.lead_id)

  const dueLine =
    nextContactAt == null
      ? 'без заданного дедлайна'
      : `след. контакт: ${new Date(nextContactAt).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК`

  await sendPlainMessage({
    chatId,
    text: `Договорённость сохранена (${dueLine}).`,
    replyToMessageId: msg.message_id,
  })

  return true
}
