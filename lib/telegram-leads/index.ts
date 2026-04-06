/**
 * Контракт Telegram-бота заявок и отчётов.
 * @see docs/telegram-leads-bot-spec.md
 */

export * from './model'
export { buildCallbackData, parseCallbackData } from './callback-data'
export { sendLeadCardMessage, editLeadCardMessage, answerCallbackQuery } from './telegram-client'
export { buildLeadCardHtml } from './lead-card'
export { buildLeadInlineKeyboard } from './inline-keyboard'
export { ingestSiteLead } from './site-ingest'
export { applyLeadCallback } from './apply-callback-action'
export {
  aggregateMonthlyReport,
  aggregateWeeklyFunnel,
  listLeadIdsForDailyDigest,
} from '@/lib/leads/lead-reports'
export { queryDailyDigestRows } from '@/lib/leads/daily-digest-query'
export { runDailyDigestCron } from './daily-digest-cron'
export {
  aggregateLeadSlicesCreatedInPeriod,
  type SliceRow,
} from '@/lib/leads/lead-reports-slices'
export {
  previousCompletedMonthMskBounds,
  previousCompletedWeekMskBounds,
} from '@/lib/leads/report-periods-msk'
export { runMonthlyStatsCron, runWeeklyStatsCron } from './periodic-stats-cron'
