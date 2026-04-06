/**
 * Тонкая обёртка над Telegram Bot API (без размазывания fetch по проекту).
 */

type TelegramApiResponse<T> = { ok: true; result: T } | { ok: false; description?: string; error_code?: number }

function botToken(): string {
  const t = process.env.TG_BOT_TOKEN
  if (!t?.trim()) throw new Error('TG_BOT_TOKEN is not set')
  return t.trim()
}

function apiUrl(method: string): string {
  return `https://api.telegram.org/bot${botToken()}/${method}`
}

async function callTelegram<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(apiUrl(method), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = (await res.json()) as TelegramApiResponse<T>
  if (!json.ok) {
    const code = json.error_code != null ? ` #${json.error_code}` : ''
    throw new Error(`${json.description || `telegram_${method}_failed`}${code}`)
  }
  return json.result
}

export type InlineKeyboardMarkup = {
  inline_keyboard: { text: string; callback_data: string }[][]
}

export type SendMessageResult = {
  message_id: number
  chat: { id: number; type?: string }
}

export async function sendLeadCardMessage(input: {
  chatId: string
  text: string
  replyMarkup: InlineKeyboardMarkup
}): Promise<SendMessageResult> {
  return callTelegram<SendMessageResult>('sendMessage', {
    chat_id: input.chatId,
    text: input.text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: input.replyMarkup,
  })
}

export async function editLeadCardMessage(input: {
  chatId: string
  messageId: number
  text: string
  replyMarkup: InlineKeyboardMarkup
}): Promise<boolean> {
  const r = await callTelegram<boolean | { message_id: number }>('editMessageText', {
    chat_id: input.chatId,
    message_id: input.messageId,
    text: input.text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: input.replyMarkup,
  })
  return typeof r === 'boolean' ? r : true
}

export async function answerCallbackQuery(input: {
  callbackQueryId: string
  text?: string
  showAlert?: boolean
}): Promise<void> {
  await callTelegram<true>('answerCallbackQuery', {
    callback_query_id: input.callbackQueryId,
    text: input.text,
    show_alert: input.showAlert ?? false,
  })
}

/** Простое HTML-сообщение без клавиатуры (тревога, ack). */
export async function sendHtmlMessage(input: {
  chatId: string
  text: string
  disableWebPagePreview?: boolean
}): Promise<SendMessageResult> {
  return callTelegram<SendMessageResult>('sendMessage', {
    chat_id: input.chatId,
    text: input.text,
    parse_mode: 'HTML',
    disable_web_page_preview: input.disableWebPagePreview ?? true,
  })
}

/** Текст без parse_mode (сценарии ввода договорённости — безопасно для произвольных символов в подсказках). */
export async function sendPlainMessage(input: {
  chatId: string
  text: string
  replyToMessageId?: number
  replyMarkup?: InlineKeyboardMarkup
}): Promise<SendMessageResult> {
  const body: Record<string, unknown> = {
    chat_id: input.chatId,
    text: input.text,
  }
  if (input.replyToMessageId != null) body.reply_to_message_id = input.replyToMessageId
  if (input.replyMarkup != null) body.reply_markup = input.replyMarkup
  return callTelegram<SendMessageResult>('sendMessage', body)
}

/** Убрать inline-клавиатуру со служебного сообщения (после отмены или завершения ввода). */
export async function clearMessageReplyMarkup(input: {
  chatId: string
  messageId: number
}): Promise<void> {
  await callTelegram<true>('editMessageReplyMarkup', {
    chat_id: input.chatId,
    message_id: input.messageId,
    reply_markup: { inline_keyboard: [] },
  })
}
