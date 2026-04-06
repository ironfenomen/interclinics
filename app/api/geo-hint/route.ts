import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Подсказка города по IP посетителя (заголовки прокси).
 * Нужна, чтобы не зависеть от клиентских fetch к ip-api / ipapi (блокировки на iOS, блокировщики).
 */
function clientIp(request: NextRequest): string | null {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const real = request.headers.get('x-real-ip')?.trim()
  if (real) return real
  const cf = request.headers.get('cf-connecting-ip')?.trim()
  if (cf) return cf
  return null
}

function isLikelyPublicIp(ip: string): boolean {
  if (!ip) return false
  if (ip === '::1' || ip === '127.0.0.1') return false
  if (ip.startsWith('10.')) return false
  if (ip.startsWith('192.168.')) return false
  if (ip.startsWith('172.')) {
    const p = ip.split('.')
    const n = Number(p[1])
    if (!Number.isNaN(n) && n >= 16 && n <= 31) return false
  }
  if (ip.startsWith('fe80:') || ip.startsWith('fc') || ip.startsWith('fd')) return false
  return true
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request)
  if (!ip || !isLikelyPublicIp(ip)) {
    return NextResponse.json({ city: null })
  }

  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 2500)
    const res = await fetch(
      `https://ip-api.com/json/${encodeURIComponent(ip)}?lang=ru&fields=status,message,city`,
      { signal: ctrl.signal, headers: { Accept: 'application/json' }, cache: 'no-store' },
    )
    clearTimeout(timer)
    if (!res.ok) return NextResponse.json({ city: null })
    let parsed: unknown
    try {
      parsed = await res.json()
    } catch {
      return NextResponse.json({ city: null })
    }
    if (parsed === null || typeof parsed !== 'object') {
      return NextResponse.json({ city: null })
    }
    const data = parsed as { status?: unknown; city?: unknown }
    if (data.status !== 'success') return NextResponse.json({ city: null })
    const city =
      typeof data.city === 'string' && data.city.trim() ? data.city.trim() : null
    return NextResponse.json({ city })
  } catch {
    return NextResponse.json({ city: null })
  }
}
