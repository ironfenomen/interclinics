// app/api/lead/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCityBySlug } from '@/data/cities'
import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, city: citySlugRaw, source, leadType } = body
    const citySlug = typeof citySlugRaw === 'string' ? citySlugRaw.trim() : ''
    const cityRow = citySlug ? getCityBySlug(citySlug) : undefined
    const cityLabel = cityRow ? `${cityRow.name} · ${citySlug}` : citySlug || '—'

    const typeLabels: Record<string, string> = {
      vyzov: '🚑 Выезд',
      stacionar: '🏥 Стационар',
      rehab: '🔄 Реабилитация',
      general: '📋 Общая',
    }
    const leadTypeKey =
      leadType === 'vyzov' || leadType === 'stacionar' || leadType === 'rehab' || leadType === 'general'
        ? leadType
        : 'general'

    const digits = phone?.replace(/\D/g, '')
    if (!digits || digits.length < 10) {
      return NextResponse.json({ error: 'Некорректный номер' }, { status: 400 })
    }

    // ============================================================
    // ИНТЕГРАЦИЯ С CRM — раскомментировать и настроить
    // ============================================================
    
    // --- AmoCRM ---
    // const amoRes = await fetch(`https://${process.env.AMO_DOMAIN}.amocrm.ru/api/v4/leads`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.AMO_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify([{
    //     name: `Заявка ${BRAND_DISPLAY_NAME} — ${cityRow?.name ?? citySlug}`,
    //     custom_fields_values: [
    //       { field_id: Number(process.env.AMO_PHONE_FIELD), values: [{ value: digits }] },
    //       { field_id: Number(process.env.AMO_CITY_FIELD), values: [{ value: citySlug }] },
    //       { field_id: Number(process.env.AMO_SOURCE_FIELD), values: [{ value: source }] },
    //     ],
    //   }]),
    // })

    // ============================================================
    // TELEGRAM УВЕДОМЛЕНИЕ
    // ============================================================
    
    if (process.env.TG_BOT_TOKEN && process.env.TG_CHAT_ID) {
      const tgText = [
        `🔔 <b>Новая заявка ${BRAND_DISPLAY_NAME}</b>`,
        `📞 Телефон: <code>${digits}</code>`,
        `🏙 Город: ${cityLabel}`,
        `📌 Тип: ${typeLabels[leadTypeKey] || typeLabels.general}`,
        `📍 Источник: ${source}`,
        `⏰ ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
      ].join('\n')

      await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TG_CHAT_ID,
          text: tgText,
          parse_mode: 'HTML',
        }),
      }).catch(err => console.error('TG error:', err))
    }

    console.log('✅ Lead:', {
      phone: digits,
      city: citySlug,
      cityName: cityRow?.name,
      source,
      leadType: leadTypeKey,
      ts: new Date().toISOString(),
    })
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Lead error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
