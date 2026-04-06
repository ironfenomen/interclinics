#!/usr/bin/env node
/**
 * Регистрирует webhook без ограничивающего allowed_updates (все типы обновлений, включая callback_query).
 * Использование на VPS:
 *   TG_BOT_TOKEN=... TELEGRAM_WEBHOOK_BASE_URL=https://example.ru TG_WEBHOOK_SECRET=... node scripts/telegram-set-webhook.mjs
 *
 * TELEGRAM_WEBHOOK_BASE_URL — origin без слэша в конце, путь /api/telegram/webhook добавится сам.
 */

const token = process.env.TG_BOT_TOKEN?.trim()
const base = process.env.TELEGRAM_WEBHOOK_BASE_URL?.trim().replace(/\/$/, '')
const secret = process.env.TG_WEBHOOK_SECRET?.trim().replace(/^\uFEFF/, '') || undefined

if (!token) {
  console.error('Missing TG_BOT_TOKEN')
  process.exit(1)
}
if (!base) {
  console.error('Missing TELEGRAM_WEBHOOK_BASE_URL (e.g. https://interclinics.ru)')
  process.exit(1)
}

const url = `${base}/api/telegram/webhook`

const body = {
  url,
  drop_pending_updates: false,
  ...(secret ? { secret_token: secret } : {}),
}

const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

const json = await res.json()
if (!json.ok) {
  console.error('setWebhook failed:', json.description || json)
  process.exit(1)
}

console.log('setWebhook ok:', url, secret ? '(with secret_token)' : '(no secret_token)')
const info = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}',
}).then(r => r.json())

console.log('getWebhookInfo:', JSON.stringify(info.result, null, 2))
