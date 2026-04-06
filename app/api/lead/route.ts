// app/api/lead/route.ts
// Целевая карточка/воронка в Telegram: docs/telegram-leads-bot-spec.md · lib/telegram-leads/
import { NextRequest, NextResponse } from 'next/server'
import { getCityBySlug } from '@/data/cities'
import { ingestSiteLead } from '@/lib/telegram-leads/site-ingest'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      phone,
      city: citySlugRaw,
      source,
      leadType,
      name,
      comment,
      formId,
      pagePath,
      pageQuery,
      deviceClass,
      ctaLabel,
      referrer,
      utm,
      consentPd,
    } = body

    const citySlug = typeof citySlugRaw === 'string' ? citySlugRaw.trim() : ''
    const cityRow = citySlug ? getCityBySlug(citySlug) : undefined
    const cityLabel = cityRow ? `${cityRow.name} · ${citySlug}` : citySlug || '—'

    const leadTypeKey =
      leadType === 'vyzov' || leadType === 'stacionar' || leadType === 'rehab' || leadType === 'general'
        ? leadType
        : 'general'

    const digits = String(phone ?? '').replace(/\D/g, '')
    if (!digits || digits.length < 10) {
      return NextResponse.json({ error: 'Некорректный номер' }, { status: 400 })
    }

    const src = typeof source === 'string' ? source : 'unknown'

    const { leadId, publicId, telegramSent } = await ingestSiteLead({
      phoneDigits: digits,
      citySlug: citySlug || 'unknown',
      cityLabel,
      leadType: leadTypeKey,
      source: src,
      name: typeof name === 'string' ? name : null,
      comment: typeof comment === 'string' ? comment : null,
      formId: typeof formId === 'string' ? formId : null,
      pagePath: typeof pagePath === 'string' ? pagePath : null,
      pageQuery: typeof pageQuery === 'string' ? pageQuery : null,
      deviceClass: typeof deviceClass === 'string' ? deviceClass : null,
      ctaLabel: typeof ctaLabel === 'string' ? ctaLabel : null,
      referrer: typeof referrer === 'string' ? referrer : null,
      utm: typeof utm === 'string' ? utm : null,
      consentPd: consentPd === true,
    })

    console.log('✅ Lead:', {
      leadId,
      publicId,
      telegramSent,
      phone: digits,
      city: citySlug,
      cityName: cityRow?.name,
      source: src,
      leadType: leadTypeKey,
      ts: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Lead error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
