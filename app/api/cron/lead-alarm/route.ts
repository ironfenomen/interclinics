import { NextRequest, NextResponse } from 'next/server'

import { runLeadAlarmTick } from '@/lib/telegram-leads/alarm-tick'

/**
 * Резервный тик тревоги для окружений без долгоживущего процесса (serverless).
 * Вызывать внешним планировщиком каждые 30 с с заголовком Authorization: Bearer CRON_SECRET.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  await runLeadAlarmTick()
  return NextResponse.json({ ok: true })
}
