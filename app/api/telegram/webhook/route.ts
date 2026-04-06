import { NextRequest, NextResponse } from 'next/server'

import { parseCallbackData } from '@/lib/telegram-leads/callback-data'
import { applyLeadCallback } from '@/lib/telegram-leads/apply-callback-action'
import {
  handleAgreementFlowCallbackCancel,
  handleAgreementFlowMessage,
} from '@/lib/telegram-leads/agreement-message-handler'
import { AGREEMENT_FLOW_CANCEL_CALLBACK } from '@/lib/telegram-leads/agreement-input-ui'
import { answerCallbackQuery } from '@/lib/telegram-leads/telegram-client'
import { normalizeTelegramWebhookSecret, verifyTelegramWebhookSecret } from '@/lib/telegram-leads/webhook-secret'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type WebhookUpdate = {
  update_id?: number
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
    inline_message_id?: string
    from?: { id: number; username?: string; first_name?: string; last_name?: string }
    message?: {
      message_id: number
      chat: { id: number }
    }
  }
}

/**
 * Webhook Telegram Bot API: callback_query по inline-кнопкам карточки лида и message — ввод договорённости.
 * Настройка: setWebhook + optional secret_token → TG_WEBHOOK_SECRET и заголовок X-Telegram-Bot-Api-Secret-Token (exact match после trim/BOM).
 */
export async function POST(request: NextRequest) {
  const configuredSecret = normalizeTelegramWebhookSecret(process.env.TG_WEBHOOK_SECRET)
  const headerRaw = request.headers.get('x-telegram-bot-api-secret-token')
  const secretAuth = verifyTelegramWebhookSecret(configuredSecret, headerRaw)

  if (!secretAuth.ok) {
    console.error(
      '[tg-webhook] secret_reject',
      JSON.stringify({
        reason: secretAuth.reason,
        detail: secretAuth.detail,
        header_present: Boolean(headerRaw?.trim()),
        header_length: headerRaw?.trim().length ?? 0,
        env_secret_length: configuredSecret?.length ?? 0,
      }),
    )
    return NextResponse.json(
      { error: 'forbidden', webhook_secret: secretAuth.reason },
      { status: 403 },
    )
  }

  let update: WebhookUpdate
  try {
    update = (await request.json()) as WebhookUpdate
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 })
  }

  const cq = update.callback_query

  console.log(
    '[tg-webhook] update',
    JSON.stringify({
      update_id: update.update_id,
      has_message: Boolean(update.message),
      has_callback_query: Boolean(cq),
    }),
  )

  if (update.message && process.env.TG_BOT_TOKEN?.trim()) {
    try {
      await handleAgreementFlowMessage(update.message)
    } catch (e) {
      console.error('[tg-webhook] handleAgreementFlowMessage:', e)
    }
  }

  if (cq) {
    console.log(
      '[tg-webhook] callback_query',
      JSON.stringify({
        update_id: update.update_id,
        callback_query_id: cq.id,
        has_data: Boolean(cq.data),
        data_length: cq.data?.length ?? 0,
        data_preview: cq.data != null ? cq.data.slice(0, 48) : null,
        from_id: cq.from?.id ?? null,
        message_message_id: cq.message?.message_id ?? null,
        message_chat_id: cq.message?.chat?.id ?? null,
        inline_message_id: cq.inline_message_id ?? null,
      }),
    )

    if (
      cq.data === AGREEMENT_FLOW_CANCEL_CALLBACK &&
      cq.from &&
      cq.message &&
      process.env.TG_BOT_TOKEN?.trim()
    ) {
      try {
        await handleAgreementFlowCallbackCancel({
          callbackQueryId: cq.id,
          chatId: String(cq.message.chat.id),
          tgUserId: cq.from.id,
          serviceMessageId: cq.message.message_id,
        })
      } catch (e) {
        console.error('[tg-webhook] agreement_flow_cancel', e)
      }
      return NextResponse.json({ ok: true, route: 'telegram-webhook' })
    }

    if (!cq.data?.length) {
      console.warn('[tg-webhook] callback_query_missing_data', { callback_query_id: cq.id })
      if (process.env.TG_BOT_TOKEN?.trim()) {
        try {
          await answerCallbackQuery({
            callbackQueryId: cq.id,
            text: 'Пустой callback_data',
            showAlert: true,
          })
        } catch (e) {
          console.error('[tg-webhook] answerCallbackQuery (no data):', e)
        }
      }
      return NextResponse.json({ ok: true })
    }

    if (!cq.from) {
      console.warn('[tg-webhook] callback_query_missing_from', { callback_query_id: cq.id })
      if (process.env.TG_BOT_TOKEN?.trim()) {
        try {
          await answerCallbackQuery({
            callbackQueryId: cq.id,
            text: 'Нет данных пользователя в callback',
            showAlert: true,
          })
        } catch (e) {
          console.error('[tg-webhook] answerCallbackQuery (no from):', e)
        }
      }
      return NextResponse.json({ ok: true })
    }

    const parsed = parseCallbackData(cq.data)
    console.log(
      '[tg-webhook] callback_parse',
      JSON.stringify({
        ok: Boolean(parsed),
        public_id: parsed?.publicId ?? null,
        action: parsed?.action ?? null,
      }),
    )

    if (!parsed) {
      if (process.env.TG_BOT_TOKEN?.trim()) {
        try {
          await answerCallbackQuery({
            callbackQueryId: cq.id,
            text: 'Некорректный callback',
            showAlert: true,
          })
        } catch (e) {
          console.error('[tg-webhook] answerCallbackQuery (bad parse):', e)
        }
      }
      return NextResponse.json({ ok: true })
    }

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
      const errText = e instanceof Error ? e.message : String(e)
      console.error('[tg-webhook] applyLeadCallback_fatal', errText, e)
      if (process.env.TG_BOT_TOKEN?.trim()) {
        try {
          await answerCallbackQuery({
            callbackQueryId: cq.id,
            text: 'Ошибка сервера. Проверьте логи VPS.',
            showAlert: true,
          })
        } catch (e2) {
          const msg = e2 instanceof Error ? e2.message : String(e2)
          if (!/query is too old|QUERY_ID_INVALID|already/i.test(msg)) {
            console.error('[tg-webhook] answerCallbackQuery_after_fatal:', e2)
          }
        }
      }
    }
  }

  return NextResponse.json({ ok: true, route: 'telegram-webhook' })
}

export async function GET() {
  return NextResponse.json({ ok: true, route: 'telegram-webhook' })
}
