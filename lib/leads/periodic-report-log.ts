import { getLeadsDb } from './sqlite-db'

export function reservePeriodicReportSlot(reportKey: string): boolean {
  const db = getLeadsDb()
  const info = db
    .prepare(`INSERT OR IGNORE INTO periodic_report_log (report_key, sent_at) VALUES (?, ?)`)
    .run(reportKey, new Date().toISOString())
  return Number(info.changes) > 0
}

export function releasePeriodicReportSlot(reportKey: string): void {
  const db = getLeadsDb()
  db.prepare(`DELETE FROM periodic_report_log WHERE report_key = ?`).run(reportKey)
}
