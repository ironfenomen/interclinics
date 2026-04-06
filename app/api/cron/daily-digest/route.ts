import { NextRequest, NextResponse } from 'next/server'

import { runDailyDigestCron } from '@/lib/telegram-leads/daily-digest-cron'

/**
 * Ежедневная оперативная сводка в Telegram (10:00 и 18:00 МСК — по внешнему расписанию).
 * GET /api/cron/daily-digest?slot=10|18[&force=1][&secret=...]
 * Заголовок: Authorization: Bearer CRON_SECRET (как у lead-alarm), либо query secret=CRON_SECRET.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  const auth = request.headers.get('authorization')
  if (auth === `Bearer ${secret}`) return true
  const q = request.nextUrl.searchParams.get('secret')
  return q === secret
}

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }
  if (!authorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const slotRaw = request.nextUrl.searchParams.get('slot')
  if (slotRaw !== '10' && slotRaw !== '18') {
    return NextResponse.json({ error: 'slot must be 10 or 18' }, { status: 400 })
  }

  const force = request.nextUrl.searchParams.get('force') === '1'
  const result = await runDailyDigestCron({ slot: slotRaw, force })

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }
  if ('skipped' in result) {
    if (result.skipped === 'empty') {
      return NextResponse.json({ ok: true, skipped: 'empty', message: 'no follow-up leads' })
    }
    return NextResponse.json({ ok: true, skipped: 'dedup' })
  }
  return NextResponse.json({
    ok: true,
    sent: result.sent,
    chunks: result.chunks,
  })
}
