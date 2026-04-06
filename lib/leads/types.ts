import type { LeadResult, LeadStatus, PartnerStatus } from '@/lib/telegram-leads/model'

/** Строка `leads` из SQLite (серверное хранилище). */
export type LeadRecord = {
  id: number
  public_id: string
  status: LeadStatus
  partner_status: PartnerStatus
  result: LeadResult
  owner_tg_user_id: number | null
  owner_display: string | null
  agreement_summary: string | null
  taken_at: string | null
  updated_at: string
  created_at: string
  closed_at: string | null
  site_domain: string
  form_id: string
  page_path: string | null
  page_query: string | null
  device_class: string | null
  cta_label: string | null
  referrer: string | null
  utm: string | null
  consent_pd: number
  name: string | null
  phone_e164: string
  city_slug: string
  city_label: string
  lead_type: string
  comment: string | null
  telegram_chat_id: string | null
  telegram_message_id: number | null
  site_payload_raw: string | null
  /** 1 = тревога активна (только при status=new в логике тика) */
  alarm_active: number
  alarm_started_at: string | null
  alarm_last_sent_at: string | null
}

export type SiteLeadPayload = {
  phoneDigits: string
  citySlug: string
  cityLabel: string
  leadType: string
  source: string
  siteDomain: string
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
}
