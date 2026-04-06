import type { LeadRecord } from '@/lib/leads/types'
import {
  INLINE_ACTION,
  INLINE_BUTTON_LABEL,
  LEAD_STATUS,
  PARTNER_INLINE_ACTION,
  PARTNER_INLINE_BUTTON_LABEL,
  PARTNER_STATUS,
} from '@/lib/telegram-leads/model'

import { buildCallbackData } from '@/lib/telegram-leads/callback-data'
import type { InlineKeyboardMarkup } from '@/lib/telegram-leads/telegram-client'

function btn(publicId: string, action: string, label: string) {
  return { text: label, callback_data: buildCallbackData(publicId, action) }
}

function isTerminalLead(lead: LeadRecord): boolean {
  return (
    lead.status === LEAD_STATUS.REFUSED ||
    lead.status === LEAD_STATUS.SPAM ||
    lead.status === LEAD_STATUS.CLOSED_WON ||
    lead.status === LEAD_STATUS.CLOSED_LOST
  )
}

function partnerOutcomeTerminal(lead: LeadRecord): boolean {
  return (
    lead.partner_status === PARTNER_STATUS.PASSED ||
    lead.partner_status === PARTNER_STATUS.NOT_PASSED
  )
}

/** Inline-клавиатура по статусу лида и утверждённым правилам спеки. */
export function buildLeadInlineKeyboard(lead: LeadRecord): InlineKeyboardMarkup {
  const pid = lead.public_id

  if (isTerminalLead(lead) || partnerOutcomeTerminal(lead)) {
    return { inline_keyboard: [] }
  }

  if (lead.status === LEAD_STATUS.PARTNER_SENT && !partnerOutcomeTerminal(lead)) {
    return {
      inline_keyboard: [
        [
          btn(pid, PARTNER_INLINE_ACTION.IN_PROGRESS, PARTNER_INLINE_BUTTON_LABEL[PARTNER_INLINE_ACTION.IN_PROGRESS]),
          btn(pid, PARTNER_INLINE_ACTION.AGREEMENTS, PARTNER_INLINE_BUTTON_LABEL[PARTNER_INLINE_ACTION.AGREEMENTS]),
        ],
        [
          btn(pid, PARTNER_INLINE_ACTION.PASSED, PARTNER_INLINE_BUTTON_LABEL[PARTNER_INLINE_ACTION.PASSED]),
          btn(pid, PARTNER_INLINE_ACTION.NOT_PASSED, PARTNER_INLINE_BUTTON_LABEL[PARTNER_INLINE_ACTION.NOT_PASSED]),
        ],
      ],
    }
  }

  if (lead.status === LEAD_STATUS.NEW) {
    return {
      inline_keyboard: [
        [
          btn(pid, INLINE_ACTION.TAKE, INLINE_BUTTON_LABEL[INLINE_ACTION.TAKE]),
          btn(pid, INLINE_ACTION.REFUSED, INLINE_BUTTON_LABEL[INLINE_ACTION.REFUSED]),
          btn(pid, INLINE_ACTION.SPAM, INLINE_BUTTON_LABEL[INLINE_ACTION.SPAM]),
        ],
      ],
    }
  }

  const mainRows: { text: string; callback_data: string }[][] = [
    [
      btn(pid, INLINE_ACTION.CONTACTED, INLINE_BUTTON_LABEL[INLINE_ACTION.CONTACTED]),
      btn(pid, INLINE_ACTION.NO_ANSWER, INLINE_BUTTON_LABEL[INLINE_ACTION.NO_ANSWER]),
      btn(pid, INLINE_ACTION.AGREEMENTS, INLINE_BUTTON_LABEL[INLINE_ACTION.AGREEMENTS]),
    ],
    [
      btn(pid, INLINE_ACTION.CALLBACK_LATER, INLINE_BUTTON_LABEL[INLINE_ACTION.CALLBACK_LATER]),
      btn(pid, INLINE_ACTION.AWAITING_DECISION, INLINE_BUTTON_LABEL[INLINE_ACTION.AWAITING_DECISION]),
      btn(pid, INLINE_ACTION.CONSULTATION, INLINE_BUTTON_LABEL[INLINE_ACTION.CONSULTATION]),
    ],
    [
      btn(pid, INLINE_ACTION.BOOKED, INLINE_BUTTON_LABEL[INLINE_ACTION.BOOKED]),
      btn(pid, INLINE_ACTION.PARTNER_SENT, INLINE_BUTTON_LABEL[INLINE_ACTION.PARTNER_SENT]),
    ],
    [
      btn(pid, INLINE_ACTION.REFUSED, INLINE_BUTTON_LABEL[INLINE_ACTION.REFUSED]),
      btn(pid, INLINE_ACTION.SPAM, INLINE_BUTTON_LABEL[INLINE_ACTION.SPAM]),
    ],
  ]

  return { inline_keyboard: mainRows }
}
