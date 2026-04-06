/**
 * Один глобальный setInterval на процесс Next.js (long-running `next start` / Docker).
 * Импорт alarm-tick только динамически — иначе instrumentation.ts тянет better-sqlite3 в общий бандл.
 */

const INTERVAL_MS = 30_000

const g = globalThis as typeof globalThis & {
  __icLeadAlarmSchedulerStarted?: boolean
  __icLeadAlarmInterval?: ReturnType<typeof setInterval>
}

export function ensureLeadAlarmScheduler(): void {
  if (g.__icLeadAlarmSchedulerStarted) return
  if (process.env.LEAD_ALARM_DISABLED === '1') {
    console.log('[lead-alarm] scheduler disabled (LEAD_ALARM_DISABLED=1)')
    return
  }
  if (!process.env.TG_BOT_TOKEN?.trim() || !process.env.TG_CHAT_ID?.trim()) {
    return
  }

  g.__icLeadAlarmSchedulerStarted = true
  console.log('[lead-alarm] scheduler started interval_ms=', INTERVAL_MS)

  g.__icLeadAlarmInterval = setInterval(() => {
    void import('./alarm-tick')
      .then(m => m.runLeadAlarmTick())
      .catch(err => console.error('[lead-alarm] tick error', err))
  }, INTERVAL_MS)
}
