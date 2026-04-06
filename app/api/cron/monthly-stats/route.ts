import { NextRequest, NextResponse } from 'next/server'

import { runMonthlyStatsCron } from '@/lib/telegram-leads/periodic-stats-cron'

/**
 * Месячная статистика в Telegram (предыдущий полный календарный месяц МСК).
 * Вызывать внешним cron, например 1-го числа 09:00 МСК.
 * GET /api/cron/monthly-stats[&force=1][&secret=...] · Authorization: Bearer CRON_SECRET
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  const auth = request.headers.get('authorization')
  if (auth === `Bearer ${secret}`) return true
  return request.nextUrl.searchParams.get('secret') === secret
}

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }
  if (!authorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const force = request.nextUrl.searchParams.get('force') === '1'
  const result = await runMonthlyStatsCron({ force })

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }
  if ('skipped' in result) {
    return NextResponse.json({ ok: true, skipped: 'dedup' })
  }
  return NextResponse.json({ ok: true, chunks: result.chunks })
}
