import { getLeadById, listLeadsNeedingAlarmTick, recordAlarmLastSent } from '@/lib/leads/repository'
import { LEAD_STATUS } from '@/lib/telegram-leads/model'

import { sendLeadAlarmBurst } from '@/lib/telegram-leads/alarm-send'

const INTERVAL_MS = 30_000

/**
 * Один проход планировщика: все лиды с alarm_active и status=new, у которых прошло ≥30 с с последнего тревожного отправления.
 */
export async function runLeadAlarmTick(): Promise<void> {
  if (!process.env.TG_BOT_TOKEN?.trim() || !process.env.TG_CHAT_ID?.trim()) {
    return
  }
  if (process.env.LEAD_ALARM_DISABLED === '1') {
    return
  }

  const due = listLeadsNeedingAlarmTick(INTERVAL_MS)
  if (due.length === 0) return

  console.log(`[lead-alarm] tick candidates=${due.length}`)

  for (const row of due) {
    const lead = getLeadById(row.id)
    if (!lead) continue
    if (lead.status !== LEAD_STATUS.NEW || !lead.alarm_active) continue

    const startedAt = new Date(lead.alarm_started_at || lead.created_at).getTime()
    const ordinal = Math.max(1, Math.floor((Date.now() - startedAt) / INTERVAL_MS))

    const result = await sendLeadAlarmBurst(lead, 'tick', ordinal)

    if (result.groupOk) {
      recordAlarmLastSent(lead.id)
    }
  }
}
