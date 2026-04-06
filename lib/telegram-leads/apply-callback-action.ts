import {
  deactivateLeadAlarm,
  getLeadByPublicId,
  insertActivity,
  patchLead,
  upsertAgreementInputSession,
} from '@/lib/leads/repository'
import type { LeadRecord } from '@/lib/leads/types'
import {
  INLINE_ACTION,
  type InlineAction,
  LEAD_RESULT,
  LEAD_STATUS,
  type LeadStatus,
  PARTNER_INLINE_ACTION,
  type PartnerInlineAction,
  PARTNER_STATUS,
  type PartnerStatus,
} from '@/lib/telegram-leads/model'

import { sendLeadTakenAck } from '@/lib/telegram-leads/alarm-send'
import { ensureLeadAlarmScheduler } from '@/lib/telegram-leads/alarm-scheduler'
import { buildLeadCardHtml } from '@/lib/telegram-leads/lead-card'
import { buildLeadInlineKeyboard } from '@/lib/telegram-leads/inline-keyboard'
import {
  answerCallbackQuery,
  editLeadCardMessage,
  sendPlainMessage,
} from '@/lib/telegram-leads/telegram-client'
import {
  agreementAutoPromptHint,
  AUTO_AGREEMENT_PROMPT_AFTER_ACTION,
} from '@/lib/telegram-leads/agreement-auto-prompt'
import { agreementFlowCancelKeyboard } from '@/lib/telegram-leads/agreement-input-ui'
import { resolveLeadOpsChatId } from '@/lib/telegram-leads/resolve-ops-chat-id'

const INLINE_SET = new Set<string>(Object.values(INLINE_ACTION))
const PARTNER_SET = new Set<string>(Object.values(PARTNER_INLINE_ACTION))

function actorLabel(u: {
  id: number
  username?: string
  first_name?: string
  last_name?: string
}): string {
  if (u.username) return `@${u.username}`
  const n = [u.first_name, u.last_name].filter(Boolean).join(' ')
  return n || `user:${u.id}`
}

function partnerTerminal(lead: LeadRecord): boolean {
  return (
    lead.partner_status === PARTNER_STATUS.PASSED ||
    lead.partner_status === PARTNER_STATUS.NOT_PASSED
  )
}

function terminalMain(lead: LeadRecord): boolean {
  return (
    lead.status === LEAD_STATUS.REFUSED ||
    lead.status === LEAD_STATUS.SPAM ||
    lead.status === LEAD_STATUS.CLOSED_WON ||
    lead.status === LEAD_STATUS.CLOSED_LOST
  )
}

function computeNextState(
  lead: LeadRecord,
  action: string,
  actor: { id: number; username?: string; first_name?: string; last_name?: string },
): {
  patch: Parameters<typeof patchLead>[1]
  activityMeta?: Record<string, unknown>
} | null {
  const now = new Date().toISOString()
  const display = actorLabel(actor)

  if (PARTNER_SET.has(action)) {
    if (lead.status !== LEAD_STATUS.PARTNER_SENT || partnerTerminal(lead)) {
      return null
    }
    const pa = action as PartnerInlineAction
    const fromPs = lead.partner_status
    let toPs: PartnerStatus = fromPs
    let result = lead.result
    let closedAt: string | undefined

    switch (pa) {
      case PARTNER_INLINE_ACTION.IN_PROGRESS:
        toPs = PARTNER_STATUS.IN_PROGRESS
        break
      case PARTNER_INLINE_ACTION.AGREEMENTS:
        toPs = PARTNER_STATUS.AGREEMENTS
        break
      case PARTNER_INLINE_ACTION.PASSED:
        toPs = PARTNER_STATUS.PASSED
        result = LEAD_RESULT.PARTNER_PASSED
        closedAt = now
        break
      case PARTNER_INLINE_ACTION.NOT_PASSED:
        toPs = PARTNER_STATUS.NOT_PASSED
        result = LEAD_RESULT.PARTNER_NOT_PASSED
        closedAt = now
        break
      default:
        return null
    }

    const patch: Parameters<typeof patchLead>[1] = { partner_status: toPs, result }
    if (closedAt !== undefined) patch.closed_at = closedAt

    return {
      patch,
      activityMeta: { partnerAction: pa },
    }
  }

  if (!INLINE_SET.has(action)) return null

  const ia = action as InlineAction

  if (lead.status === LEAD_STATUS.PARTNER_SENT && !partnerTerminal(lead)) {
    return null
  }

  if (terminalMain(lead) && ia !== INLINE_ACTION.SPAM && ia !== INLINE_ACTION.REFUSED) {
    return null
  }

  if (lead.status === LEAD_STATUS.NEW) {
    if (ia === INLINE_ACTION.TAKE) {
      return {
        patch: {
          status: LEAD_STATUS.IN_PROGRESS,
          owner_tg_user_id: actor.id,
          owner_display: display,
          taken_at: now,
          result: LEAD_RESULT.IN_PIPELINE,
        },
      }
    }
    if (ia === INLINE_ACTION.REFUSED) {
      return {
        patch: {
          status: LEAD_STATUS.REFUSED,
          result: LEAD_RESULT.REFUSED,
          closed_at: now,
        },
      }
    }
    if (ia === INLINE_ACTION.SPAM) {
      return {
        patch: {
          status: LEAD_STATUS.SPAM,
          result: LEAD_RESULT.SPAM,
          closed_at: now,
        },
      }
    }
    return null
  }

  if (ia === INLINE_ACTION.TAKE) {
    return {
      patch: {
        status: LEAD_STATUS.IN_PROGRESS,
        owner_tg_user_id: actor.id,
        owner_display: display,
        taken_at: lead.taken_at ?? now,
        result: LEAD_RESULT.IN_PIPELINE,
      },
      activityMeta: { reassigned: true },
    }
  }

  const mapStatus: Partial<Record<InlineAction, LeadStatus>> = {
    [INLINE_ACTION.CONTACTED]: LEAD_STATUS.CONTACTED,
    [INLINE_ACTION.NO_ANSWER]: LEAD_STATUS.NO_ANSWER,
    [INLINE_ACTION.AGREEMENTS]: LEAD_STATUS.AGREEMENTS,
    [INLINE_ACTION.CALLBACK_LATER]: LEAD_STATUS.CALLBACK_LATER,
    [INLINE_ACTION.AWAITING_DECISION]: LEAD_STATUS.AWAITING_DECISION,
    [INLINE_ACTION.CONSULTATION]: LEAD_STATUS.CONSULTATION,
    [INLINE_ACTION.BOOKED]: LEAD_STATUS.BOOKED,
    [INLINE_ACTION.PARTNER_SENT]: LEAD_STATUS.PARTNER_SENT,
    [INLINE_ACTION.REFUSED]: LEAD_STATUS.REFUSED,
    [INLINE_ACTION.SPAM]: LEAD_STATUS.SPAM,
  }

  const nextStatus = mapStatus[ia]
  if (!nextStatus) return null

  let result: LeadRecord['result'] = lead.result
  let closedAt: string | undefined
  let partnerPatch: PartnerStatus | undefined

  switch (ia) {
    case INLINE_ACTION.BOOKED:
      result = LEAD_RESULT.BOOKED_OWN
      break
    case INLINE_ACTION.REFUSED:
      result = LEAD_RESULT.REFUSED
      closedAt = now
      break
    case INLINE_ACTION.SPAM:
      result = LEAD_RESULT.SPAM
      closedAt = now
      break
    case INLINE_ACTION.PARTNER_SENT:
      result = LEAD_RESULT.IN_PIPELINE
      partnerPatch = PARTNER_STATUS.IN_PROGRESS
      break
    case INLINE_ACTION.NO_ANSWER:
      result = LEAD_RESULT.NO_CONTACT
      break
    default:
      result = LEAD_RESULT.IN_PIPELINE
  }

  const patch: Parameters<typeof patchLead>[1] = {
    status: nextStatus,
    result,
  }
  if (closedAt !== undefined) patch.closed_at = closedAt
  if (partnerPatch !== undefined) {
    patch.partner_status = partnerPatch
  }

  return { patch }
}

async function startAgreementInputFlowIfPossible(
  fresh: LeadRecord,
  actor: { id: number; username?: string; first_name?: string; last_name?: string },
  callbackMessage?: { chatId: string; messageId: number },
  contextHint?: string,
): Promise<boolean> {
  if (!process.env.TG_BOT_TOKEN?.trim()) return false
  const chatId = resolveLeadOpsChatId(fresh, callbackMessage?.chatId)
  if (!chatId) return false
  try {
    const hintBlock = contextHint ? `\n\n${contextHint}` : ''
    const sent = await sendPlainMessage({
      chatId,
      text:
        `Заявка ${fresh.public_id}: опишите договорённость одним сообщением.${hintBlock}\n\n` +
        `Ответьте (Reply) на это сообщение. /agr_cancel или кнопка ниже — отмена.`,
      replyToMessageId: callbackMessage?.messageId,
      replyMarkup: agreementFlowCancelKeyboard(),
    })
    upsertAgreementInputSession({
      chatId,
      tgUserId: actor.id,
      leadId: fresh.id,
      leadPublicId: fresh.public_id,
      step: 'await_text',
      draftText: null,
      promptMessageId: sent.message_id,
      actorDisplay: actorLabel(actor),
    })
    return true
  } catch (e) {
    console.error('agreement flow: start prompt', e)
    return false
  }
}

async function syncTelegramCard(lead: LeadRecord): Promise<void> {
  if (lead.telegram_chat_id == null || lead.telegram_message_id == null) return
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
    throw e
  }
}

export async function applyLeadCallback(input: {
  publicId: string
  action: string
  actor: { id: number; username?: string; first_name?: string; last_name?: string }
  callbackQueryId: string
  /** Сообщение с карточкой (inline): для сценария «Договорённости» — reply и привязка сессии. */
  callbackMessage?: { chatId: string; messageId: number }
}): Promise<void> {
  ensureLeadAlarmScheduler()

  const lead = getLeadByPublicId(input.publicId)
  if (!lead) {
    await answerCallbackQuery({
      callbackQueryId: input.callbackQueryId,
      text: 'Заявка не найдена',
      showAlert: true,
    })
    return
  }

  const next = computeNextState(lead, input.action, input.actor)
  if (!next) {
    await answerCallbackQuery({
      callbackQueryId: input.callbackQueryId,
      text: 'Действие недоступно для текущего статуса',
      showAlert: true,
    })
    return
  }

  const fromStatus = lead.status
  const fromPartner = lead.partner_status

  patchLead(lead.id, next.patch)

  const fresh = getLeadByPublicId(input.publicId)
  if (!fresh) {
    console.error('[applyLeadCallback] lead missing after patch', { publicId: input.publicId })
    await answerCallbackQuery({
      callbackQueryId: input.callbackQueryId,
      text: 'Ошибка: заявка не найдена после сохранения. Проверьте БД.',
      showAlert: true,
    })
    return
  }

  try {
    insertActivity({
      leadId: fresh.id,
      actorTgUserId: input.actor.id,
      action: `inline:${input.action}`,
      fromStatus,
      toStatus: fresh.status,
      fromPartnerStatus: fromPartner,
      toPartnerStatus: fresh.partner_status,
      meta: next.activityMeta ?? null,
    })
  } catch (e) {
    console.error('[applyLeadCallback] insertActivity failed (статус уже изменён)', e)
  }

  if (fromStatus === LEAD_STATUS.NEW && fresh.status !== LEAD_STATUS.NEW) {
    deactivateLeadAlarm(fresh.id)
    console.log(`[lead-alarm] stopped lead=${fresh.id} reason=exit_new status=${fresh.status}`)
  }

  if (input.action === INLINE_ACTION.TAKE) {
    const gid = resolveLeadOpsChatId(fresh, input.callbackMessage?.chatId)
    if (gid) {
      await sendLeadTakenAck({
        groupChatId: gid,
        publicId: fresh.public_id,
        leadId: fresh.id,
        actorDisplay: actorLabel(input.actor),
      })
    }
  }

  const explicitAgreementButton =
    input.action === INLINE_ACTION.AGREEMENTS || input.action === PARTNER_INLINE_ACTION.AGREEMENTS

  const wantsAgreementInputFlow =
    explicitAgreementButton || AUTO_AGREEMENT_PROMPT_AFTER_ACTION.has(input.action)

  let agreementFlowStarted = false
  if (input.action === INLINE_ACTION.AGREEMENTS) {
    agreementFlowStarted = await startAgreementInputFlowIfPossible(
      fresh,
      input.actor,
      input.callbackMessage,
    )
  } else if (input.action === PARTNER_INLINE_ACTION.AGREEMENTS) {
    agreementFlowStarted = await startAgreementInputFlowIfPossible(
      fresh,
      input.actor,
      input.callbackMessage,
    )
  } else if (AUTO_AGREEMENT_PROMPT_AFTER_ACTION.has(input.action)) {
    agreementFlowStarted = await startAgreementInputFlowIfPossible(
      fresh,
      input.actor,
      input.callbackMessage,
      agreementAutoPromptHint(input.action),
    )
  }

  const agreementFlowFailed = wantsAgreementInputFlow && !agreementFlowStarted

  const hints: string[] = []
  try {
    await syncTelegramCard(fresh)
  } catch (e) {
    console.error('syncTelegramCard', e)
    hints.push('Статус сохранён. Карточка в Telegram не обновилась — см. лог сервера.')
  }
  if (agreementFlowFailed) {
    hints.push(
      'Сценарий договорённости не открылся: проверьте TG_BOT_TOKEN, chat id и что бот может писать в этот чат.',
    )
  }

  const alertText = hints.length > 0 ? hints.join(' ') : undefined

  const agreementToast = agreementFlowStarted
    ? explicitAgreementButton
      ? 'Ответьте на сообщение бота текстом договорённости.'
      : 'Статус обновлён. Зафиксируйте договорённость ответом боту (отмена: /agr_cancel).'
    : undefined

  await answerCallbackQuery({
    callbackQueryId: input.callbackQueryId,
    text: alertText ?? agreementToast,
    showAlert: Boolean(alertText),
  })
}
