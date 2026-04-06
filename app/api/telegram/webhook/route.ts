import { NextRequest, NextResponse } from 'next/server'

import { parseCallbackData } from '@/lib/telegram-leads/callback-data'
import { applyLeadCallback } from '@/lib/telegram-leads/apply-callback-action'
import { handleAgreementFlowMessage } from '@/lib/telegram-leads/agreement-message-handler'
import { answerCallbackQuery } from '@/lib/telegram-leads/telegram-client'

export const runtime = 'nodejs'

/**
 * Webhook Telegram Bot API: callback_query по inline-кнопкам карточки лида и message — ввод договорённости.
 * Настройка: setWebhook + optional secret_token → TG_WEBHOOK_SECRET и заголовок X-Telegram-Bot-Api-Secret-Token.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.TG_WEBHOOK_SECRET?.trim()
  if (secret) {
    const header = request.headers.get('x-telegram-bot-api-secret-token')
    if (header !== secret) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
  }

  let update: {
    message?: {
      message_id: number
      chat: { id: number }
      from?: { id: number; is_bot?: boolean; username?: string; first_name?: string; last_name?: string }
      text?: string
      reply_to_message?: { message_id: number }
    }
    callback_query?: {
      id: string
      data?: string
      from: { id: number; username?: string; first_name?: string; last_name?: string }
      message?: {
        message_id: number
        chat: { id: number }
      }
    }
  }
  try {
    update = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 })
  }

  if (update.message && process.env.TG_BOT_TOKEN?.trim()) {
    try {
      await handleAgreementFlowMessage(update.message)
    } catch (e) {
      console.error('handleAgreementFlowMessage:', e)
    }
  }

  const cq = update.callback_query
  if (cq?.data && cq.from) {
    const parsed = parseCallbackData(cq.data)
    if (parsed) {
      try {
        await applyLeadCallback({
          publicId: parsed.publicId,
          action: parsed.action,
          actor: cq.from,
          callbackQueryId: cq.id,
          callbackMessage:
            cq.message != null
              ? {
                  chatId: String(cq.message.chat.id),
                  messageId: cq.message.message_id,
                }
              : undefined,
        })
      } catch (e) {
        console.error('applyLeadCallback:', e)
      }
    } else if (process.env.TG_BOT_TOKEN?.trim()) {
      try {
        await answerCallbackQuery({
          callbackQueryId: cq.id,
          text: 'Некорректный callback',
          showAlert: true,
        })
      } catch {
        /* ignore */
      }
    }
  }

  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ ok: true, route: 'telegram-webhook' })
}
