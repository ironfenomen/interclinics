import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'
import {
  getLeadById,
  insertActivity,
  insertLeadFromSite,
  recordAlarmLastSent,
  updateLeadTelegramPointers,
} from '@/lib/leads/repository'
import type { SiteLeadPayload } from '@/lib/leads/types'

import { alarmBurstWarrantsThrottle, sendLeadAlarmBurst } from '@/lib/telegram-leads/alarm-send'
import { ensureLeadAlarmScheduler } from '@/lib/telegram-leads/alarm-scheduler'
import { buildLeadCardHtml } from '@/lib/telegram-leads/lead-card'
import { buildLeadInlineKeyboard } from '@/lib/telegram-leads/inline-keyboard'
import { sendLeadCardMessage } from '@/lib/telegram-leads/telegram-client'

function siteDomain(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  if (u) {
    try {
      return new URL(u.startsWith('http') ? u : `https://${u}`).hostname
    } catch {
      /* fallthrough */
    }
  }
  return 'interclinics.ru'
}

/**
 * Сохраняет лид в SQLite, пишет первую запись активности, шлёт карточку в Telegram (если заданы env).
 */
export async function ingestSiteLead(input: {
  phoneDigits: string
  citySlug: string
  cityLabel: string
  leadType: string
  source: string
  name?: string | null
  comment?: string | null
  formId?: string | null
  pagePath?: string | null
  pageQuery?: string | null
  deviceClass?: string | null
  ctaLabel?: string | null
  referrer?: string | null
  utm?: string | null
  consentPd?: boolean | null
}): Promise<{ leadId: number; publicId: string; telegramSent: boolean }> {
  const payload: SiteLeadPayload = {
    phoneDigits: input.phoneDigits,
    citySlug: input.citySlug,
    cityLabel: input.cityLabel,
    leadType: input.leadType,
    source: input.source,
    siteDomain: siteDomain(),
    name: input.name,
    comment: input.comment,
    formId: input.formId,
    pagePath: input.pagePath,
    pageQuery: input.pageQuery,
    deviceClass: input.deviceClass,
    ctaLabel: input.ctaLabel ?? input.source,
    referrer: input.referrer,
    utm: input.utm,
    consentPd: input.consentPd ?? false,
  }

  const { id, public_id } = insertLeadFromSite(payload)

  insertActivity({
    leadId: id,
    actorTgUserId: null,
    action: 'site:submit',
    fromStatus: null,
    toStatus: 'new',
    fromPartnerStatus: null,
    toPartnerStatus: 'none',
    meta: { source: input.source, brand: BRAND_DISPLAY_NAME },
  })

  const chatId = process.env.TG_CHAT_ID?.trim()
  const token = process.env.TG_BOT_TOKEN?.trim()
  const alarmDisabled = process.env.LEAD_ALARM_DISABLED === '1'

  if (!alarmDisabled) {
    ensureLeadAlarmScheduler()
  }

  const lead = getLeadById(id)
  if (!lead) {
    return { leadId: id, publicId: public_id, telegramSent: false }
  }

  let telegramSent = false
  if (chatId && token) {
    const text = buildLeadCardHtml(lead)
    const replyMarkup = buildLeadInlineKeyboard(lead)
    try {
      const sent = await sendLeadCardMessage({ chatId, text, replyMarkup })
      updateLeadTelegramPointers(id, String(sent.chat.id), sent.message_id)
      telegramSent = true
    } catch (e) {
      console.error('Telegram sendLeadCardMessage:', e)
    }
  }

  const leadForAlarm = getLeadById(id) ?? lead
  if (chatId && token && !alarmDisabled) {
    console.log(`[lead-alarm] ingest_started lead=${id} public=${public_id}`)
    const burst = await sendLeadAlarmBurst(leadForAlarm, 'ingest', 0)
    if (alarmBurstWarrantsThrottle(burst)) {
      recordAlarmLastSent(id)
    }
  } else if (alarmDisabled) {
    console.log(`[lead-alarm] skipped ingest burst (LEAD_ALARM_DISABLED=1) lead=${id}`)
  }

  return { leadId: id, publicId: public_id, telegramSent }
}
