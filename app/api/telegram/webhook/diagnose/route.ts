import { NextRequest, NextResponse } from 'next/server'

import {
  fetchTelegramWebhookInfo,
  type TelegramWebhookInfo,
  webhookSubscribesToCallbackQuery,
} from '@/lib/telegram-leads/telegram-webhook-info'
import { normalizeTelegramWebhookSecret } from '@/lib/telegram-leads/webhook-secret'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Боевой чеклист: URL webhook, last_error_*, allowed_updates (должен включать callback_query),
 * наличие TG_WEBHOOK_SECRET в env (совпадение с secret_token в setWebhook проверяйте вручную).
 *
 * GET + Authorization: Bearer CRON_SECRET
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const whSecret = normalizeTelegramWebhookSecret(process.env.TG_WEBHOOK_SECRET)

  let telegram: TelegramWebhookInfo
  try {
    telegram = await fetchTelegramWebhookInfo()
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      {
        ok: false,
        error: msg,
        env: {
          tgBotTokenConfigured: !!process.env.TG_BOT_TOKEN?.trim(),
          tgWebhookSecretConfigured: !!whSecret,
          tgWebhookSecretLength: whSecret?.length ?? 0,
        },
      },
      { status: 502 },
    )
  }

  const allowed = telegram.allowed_updates
  const callbackOk = webhookSubscribesToCallbackQuery(allowed)

  const analysis: Record<string, unknown> = {
    subscribesToCallbackQuery: callbackOk,
    expectedWebhookPathSuffix: '/api/telegram/webhook',
    urlEndsWithExpectedPath: telegram.url?.replace(/\/$/, '').endsWith('/api/telegram/webhook') ?? false,
  }

  if (!callbackOk) {
    analysis.warning =
      'В allowed_updates нет callback_query — Telegram не шлёт нажатия inline-кнопок на webhook. ' +
      'Исправление: вызвать setWebhook без параметра allowed_updates или добавить в список callback_query ' +
      '(см. npm run telegram:set-webhook).'
  }

  if (whSecret) {
    analysis.webhookSecretNote =
      'На сервере задан TG_WEBHOOK_SECRET: в setWebhook должен быть тот же secret_token; прокси (nginx/Caddy) ' +
      'обязан пробрасывать заголовок X-Telegram-Bot-Api-Secret-Token без вырезания.'
  }

  return NextResponse.json({
    ok: true,
    env: {
      tgBotTokenConfigured: true,
      tgWebhookSecretConfigured: !!whSecret,
      tgWebhookSecretLength: whSecret?.length ?? 0,
    },
    telegram: {
      url: telegram.url ?? null,
      pending_update_count: telegram.pending_update_count ?? 0,
      last_error_date: telegram.last_error_date ?? null,
      last_error_message: telegram.last_error_message ?? null,
      max_connections: telegram.max_connections ?? null,
      ip_address: telegram.ip_address ?? null,
      allowed_updates: allowed ?? null,
    },
    analysis,
  })
}
