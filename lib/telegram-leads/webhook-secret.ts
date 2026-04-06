/**
 * Секрет webhook Telegram: env и заголовок X-Telegram-Bot-Api-Secret-Token должны совпадать побайтово
 * (после trim и снятия BOM — частая ошибка копипаста из редактора).
 */

export function normalizeTelegramWebhookSecret(raw: string | undefined): string | undefined {
  if (raw == null) return undefined
  const s = raw.trim().replace(/^\uFEFF/, '')
  return s.length > 0 ? s : undefined
}

export type WebhookSecretAuth =
  | { ok: true; mode: 'disabled' }
  | { ok: true; mode: 'verified' }
  | { ok: false; reason: 'header_missing' | 'mismatch'; detail: string }

export function verifyTelegramWebhookSecret(
  configuredSecret: string | undefined,
  headerRaw: string | null,
): WebhookSecretAuth {
  if (!configuredSecret) return { ok: true, mode: 'disabled' }
  const header = headerRaw?.trim().replace(/^\uFEFF/, '') ?? ''
  if (!header) {
    return {
      ok: false,
      reason: 'header_missing',
      detail:
        'Telegram не прислал X-Telegram-Bot-Api-Secret-Token: webhook зарегистрирован без secret_token, либо прокси вырезал заголовок.',
    }
  }
  if (header !== configuredSecret) {
    return {
      ok: false,
      reason: 'mismatch',
      detail: `Секрет в заголовке не совпадает с TG_WEBHOOK_SECRET (длина header=${header.length}, env=${configuredSecret.length}).`,
    }
  }
  return { ok: true, mode: 'verified' }
}
