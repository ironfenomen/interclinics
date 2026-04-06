// lib/site-phone.ts
// Единый основной телефон сети (display, tel:, мессенджеры).
// Города в data/cities.ts ссылаются на эти константы в полях phone / phoneDisplay.

/** Для отображения в UI и в текстах (meta, SEO). */
export const SITE_PHONE_DISPLAY = '8 (928) 359-50-53'

/** E.164 — для tel:, schema.org telephone, мессенджеров. */
export const SITE_PHONE_E164 = '+79283595053'

/** Локальный формат без «+» и пробелов (ведущая 8), если нужны сырые цифры. */
export const SITE_PHONE_LOCAL_DIGITS = '89283595053'

/** Цифры для https://wa.me/… (код страны 7…, без «+», как ожидает WhatsApp). */
export const SITE_WHATSAPP_WA_ME_DIGITS = SITE_PHONE_E164.replace(/^\+/, '')

/** Полная ссылка «Написать в WhatsApp» на единый номер сети. */
export const SITE_WHATSAPP_HREF = `https://wa.me/${SITE_WHATSAPP_WA_ME_DIGITS}`

/**
 * Telegram: чат по номеру в международном формате (тот же, что SITE_PHONE_E164).
 * Не username — чтобы ссылка однозначно соответствовала линии +79283595053.
 */
export const SITE_TELEGRAM_HREF = `https://t.me/${SITE_PHONE_E164}`

/**
 * Точка входа в MAX (профиль, бот или общая страница).
 * Для боевого чата задайте `NEXT_PUBLIC_MAX_CONTACT_HREF` в `.env` (например диплинк бота с dev.max.ru).
 */
export const SITE_MAX_HREF =
  typeof process.env.NEXT_PUBLIC_MAX_CONTACT_HREF === 'string' &&
  process.env.NEXT_PUBLIC_MAX_CONTACT_HREF.trim() !== ''
    ? process.env.NEXT_PUBLIC_MAX_CONTACT_HREF.trim()
    : 'https://max.ru/'
