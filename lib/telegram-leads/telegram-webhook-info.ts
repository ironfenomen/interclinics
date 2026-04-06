/**
 * getWebhookInfo — диагностика URL, ошибок доставки и allowed_updates (без callback_query кнопки «молчат»).
 */

export type TelegramWebhookInfo = {
  url?: string
  has_custom_certificate?: boolean
  pending_update_count?: number
  last_error_date?: number
  last_error_message?: string
  max_connections?: number
  ip_address?: string
  allowed_updates?: string[]
}

type ApiOk<T> = { ok: true; result: T }
type ApiErr = { ok: false; description?: string; error_code?: number }

export async function fetchTelegramWebhookInfo(): Promise<TelegramWebhookInfo> {
  const token = process.env.TG_BOT_TOKEN?.trim()
  if (!token) throw new Error('TG_BOT_TOKEN is not set')

  const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  const json = (await res.json()) as ApiOk<TelegramWebhookInfo> | ApiErr
  if (!json.ok) {
    throw new Error(json.description || 'getWebhookInfo failed')
  }
  return json.result
}

/**
 * Если allowed_updates задан и непустой, в нём должен быть callback_query — иначе inline-кнопки не приходят на webhook.
 * Поле отсутствует или пустой массив трактуем как «все типы» (как у дефолта setWebhook без списка).
 */
export function webhookSubscribesToCallbackQuery(allowed: string[] | undefined): boolean {
  if (allowed == null) return true
  if (allowed.length === 0) return true
  return allowed.includes('callback_query')
}
