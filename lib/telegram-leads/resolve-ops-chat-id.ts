import type { LeadRecord } from '@/lib/leads/types'

/**
 * Чат для операторских сообщений (промпт договорённости, ack «взял в работу»):
 * 1) чат из callback (сообщение с карточкой)
 * 2) chat_id, куда ушла карточка (SQLite)
 * 3) TG_CHAT_ID из env
 */
export function resolveLeadOpsChatId(lead: LeadRecord, callbackChatId?: string | null): string {
  const a = callbackChatId?.trim()
  if (a) return a
  const b = lead.telegram_chat_id?.trim()
  if (b) return b
  return process.env.TG_CHAT_ID?.trim() || ''
}
