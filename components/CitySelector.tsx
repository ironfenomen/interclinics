'use client'

// components/CitySelector.tsx
// ============================================================
// ВЫБОР ГОРОДА — ГЕО + COOKIE + SEO-ПЕРЕЛИНКОВКА
//
// Логика:
// 1. Cookie ic_city есть → мгновенный редирект (0 мерцания)
// 2. Нет cookie → определяем по IP (ip-api.com, бесплатно, РФ)
// 3. Определили → попап «Ваш город — X?» [Да] / [Выбрать другой]
// 4. Не определили → сетка всех городов
// 5. Выбрал → cookie на 30 дней → редирект на /city/
//
// SEO: страница содержит ссылки на ВСЕ города × услуги × районы
// Яндекс проиндексирует их как внутренние ссылки
// ============================================================

import { useEffect, useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { useRouter } from 'next/navigation'

interface CityData {
  slug: string
  name: string
  region: string
  priceBase: number
  arrivalTime: number
  districts: string[]
  hasStacionar: boolean
  phone: string
  phoneDisplay: string
}

interface ServiceData {
  slug: string
  name: string
}

interface Props {
  cities: CityData[]
  services: ServiceData[]
}

// ============================================================
// COOKIE UTILS
// ============================================================
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
  return m ? m.pop() || null : null
}
function setCookie(name: string, value: string, days: number) {
  const d = new Date()
  d.setTime(d.getTime() + days * 86400000)
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`
}

// ============================================================
// КОМПОНЕНТ
// ============================================================
export default function CitySelector({ cities, services }: Props) {
  const router = useRouter()
  const [detected, setDetected] = useState<CityData | null>(null)
  const [phase, setPhase] = useState<'loading' | 'confirm' | 'select'>('loading')

  const selectCity = useCallback(
    (city: CityData) => {
      setCookie('ic_city', city.slug, 30)
      router.replace(`/${city.slug}/`)
    },
    [router],
  )

  useEffect(() => {
    // 1. Cookie → мгновенный редирект
    const saved = getCookie('ic_city')
    if (saved) {
      const match = cities.find((c) => c.slug === saved)
      if (match) {
        router.replace(`/${match.slug}/`)
        return
      }
    }

    // 2. Гео-определение по IP
    const ctrl = new AbortController()
    ;(async () => {
      try {
        // ip-api.com — бесплатно, отлично работает для РФ, возвращает город на русском
        const res = await fetch('http://ip-api.com/json/?lang=ru&fields=city', {
          signal: ctrl.signal,
        })
        if (res.ok) {
          const data = await res.json()
          const cityName = (data.city || '').toLowerCase().trim()
          const match = cities.find(
            (c) =>
              c.name.toLowerCase() === cityName ||
              c.slug === cityName.replace(/\s+/g, '-'),
          )
          if (match) {
            setDetected(match)
            setPhase('confirm')
            return
          }
        }
      } catch {
        /* таймаут или ошибка — не страшно */
      }
      setPhase('select')
    })()

    return () => ctrl.abort()
  }, [cities, router])

  // ============================================================
  // ФАЗА 1: Загрузка
  // ============================================================
  if (phase === 'loading') {
    return (
      <div style={S.page}>
        <div style={{ textAlign: 'center' }}>
          <div style={S.mark}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" width="26" height="26">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14, marginTop: 14 }}>
            Определяем ваш город…
          </p>
        </div>
      </div>
    )
  }

  // ============================================================
  // ФАЗА 2: «Ваш город — X?»
  // ============================================================
  if (phase === 'confirm' && detected) {
    return (
      <div style={S.page}>
        <div style={S.wrap}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={S.mark}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" width="26" height="26">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div style={S.logo}>InterClinics</div>
            <div style={S.logoSub}>Сеть наркологических клиник</div>
          </div>

          <div style={S.confirmCard}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              Ваш город — {detected.name}?
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', marginBottom: 24 }}>
              Подберём помощь в {detected.name}: выезд ~{detected.arrivalTime} мин, стационар,
              реабилитация
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={S.btnGreen} onClick={() => selectCity(detected)}>
                Да, перейти
              </button>
              <button style={S.btnGhost} onClick={() => setPhase('select')}>
                Выбрать другой город
              </button>
            </div>
          </div>

          {/* Телефон */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href={`tel:${detected.phone}`} style={S.phoneNum}>
              {detected.phoneDisplay}
            </a>
            <p style={S.phoneSub}>Бесплатно по РФ, круглосуточно</p>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // ФАЗА 3: Выбор города (основная)
  // ============================================================
  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* Шапка */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={S.mark}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" width="26" height="26">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div style={S.logo}>InterClinics</div>
          <div style={S.logoSub}>Сеть наркологических клиник</div>
        </div>

        <h1 style={S.h1}>Выберите город</h1>
        <p style={S.h1sub}>
          Наркологическая помощь в Ставропольском крае — выезд на дом, стационар, реабилитация
        </p>

        {/* ============================================================
            СЕТКА ГОРОДОВ
            Каждая карточка — <a> ссылка для SEO-индексации
            ============================================================ */}
        <div style={S.grid}>
          {cities.map((city) => (
            <a
              key={city.slug}
              href={`/${city.slug}/`}
              onClick={(e) => {
                e.preventDefault()
                selectCity(city)
              }}
              style={S.card}
            >
              {city.hasStacionar && <span style={S.badge}>Стационар 24/7</span>}
              <div style={S.cardCity}>{city.name}</div>
              <div style={S.cardRegion}>{city.region}</div>

              {/* Районы — для SEO по «вывод из запоя [район]» */}
              {city.districts.length > 0 && (
                <div style={S.cardDistricts}>
                  {city.districts.slice(0, 4).map((d) => (
                    <span key={d} style={S.districtTag}>{d}</span>
                  ))}
                  {city.districts.length > 4 && (
                    <span style={S.districtMore}>+{city.districts.length - 4}</span>
                  )}
                </div>
              )}

              <div style={S.cardBottom}>
                <span style={S.cardPrice}>от {city.priceBase.toLocaleString('ru')} ₽</span>
                <span style={S.cardTime}>~{city.arrivalTime} мин</span>
              </div>
            </a>
          ))}
        </div>

        {/* ============================================================
            SEO-БЛОК: ссылки на ВСЕ города × услуги
            Яндекс проиндексирует каждую комбинацию
            ============================================================ */}
        <div style={S.seo}>
          <h2 style={S.seoH2}>Наркологическая помощь по городам Ставропольского края</h2>

          {cities.map((city) => (
            <div key={city.slug} style={S.seoCity}>
              <h3 style={S.seoH3}>
                <a href={`/${city.slug}/`} style={S.seoLink}>
                  {city.name}
                </a>
              </h3>

              {/* Ссылки на услуги в этом городе */}
              <div style={S.seoServices}>
                {services.map((svc) => (
                  <a
                    key={svc.slug}
                    href={`/${city.slug}/${svc.slug}/`}
                    style={S.seoServiceLink}
                  >
                    {svc.name}
                  </a>
                ))}
              </div>

              {/* Районы — текстом для SEO */}
              {city.districts.length > 0 && (
                <p style={S.seoDistricts}>
                  Районы: {city.districts.join(', ')}
                </p>
              )}
            </div>
          ))}

          <p style={S.seoText}>
            InterClinics — сеть наркологических клиник с присутствием в {cities.length} городах
            Ставропольского края. Вывод из запоя на дому от {Math.min(...cities.map((c) => c.priceBase)).toLocaleString('ru')} ₽,
            вызов нарколога, кодирование от алкоголизма, круглосуточный стационар с наблюдением врача,
            программа реабилитации и восстановления. Анонимно. Работаем без выходных.
          </p>
        </div>

        {/* Телефон */}
        <div style={{ textAlign: 'center', marginTop: 36, paddingBottom: 20 }}>
          <a href="tel:+78001005849" style={S.phoneNum}>
            8 (800) 100-58-49
          </a>
          <p style={S.phoneSub}>Бесплатно по РФ, круглосуточно</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// СТИЛИ — совпадают с дизайн-системой InterClinics
// ============================================================
const S: Record<string, CSSProperties> = {
  page: {
    minHeight: '100dvh',
    background: 'linear-gradient(180deg,#071224 0%,#0B1D35 50%,#10294a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding:
      'max(24px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left))',
    fontFamily: "'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif",
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  wrap: { maxWidth: 920, width: '100%' },

  // Logo
  mark: {
    width: 52,
    height: 52,
    background: 'linear-gradient(135deg,#10B981,#059669)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  logo: { fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 14, letterSpacing: '-.02em', textAlign: 'center' },
  logoSub: {
    fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 4,
    textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600, textAlign: 'center',
  },

  // Heading
  h1: { fontSize: 26, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 8 },
  h1sub: { fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,.42)', textAlign: 'center', marginBottom: 36, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' },

  // Confirm
  confirmCard: {
    background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
    borderRadius: 20, padding: '32px 28px', textAlign: 'center',
  },
  btnGreen: {
    padding: '14px 36px', background: '#10B981', color: '#fff', borderRadius: 12,
    fontWeight: 700, fontSize: 15, cursor: 'pointer', border: 'none',
  },
  btnGhost: {
    padding: '14px 36px', background: 'transparent', color: 'rgba(255,255,255,.55)',
    borderRadius: 12, fontWeight: 600, fontSize: 15, cursor: 'pointer',
    border: '1px solid rgba(255,255,255,.12)',
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
    gap: 16,
  },
  card: {
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.07)',
    borderRadius: 16,
    padding: '24px 22px',
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative',
    display: 'block',
    transition: 'border-color .25s, transform .25s',
  },
  badge: {
    position: 'absolute', top: 14, right: 14,
    background: 'rgba(16,185,129,.12)', color: '#10B981',
    padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
  },
  cardCity: { fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 3 },
  cardRegion: { fontSize: 12, color: 'rgba(255,255,255,.3)', marginBottom: 14 },
  cardDistricts: { display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 },
  districtTag: {
    padding: '3px 9px', borderRadius: 100, fontSize: 11, fontWeight: 500,
    background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.4)',
  },
  districtMore: {
    padding: '3px 9px', borderRadius: 100, fontSize: 11, fontWeight: 600,
    color: '#10B981',
  },
  cardBottom: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.5)',
  },
  cardPrice: { color: '#fff', fontWeight: 700 },
  cardTime: {},

  // SEO block
  seo: {
    marginTop: 52, paddingTop: 36,
    borderTop: '1px solid rgba(255,255,255,.06)',
  },
  seoH2: { fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,.5)', marginBottom: 24 },
  seoCity: { marginBottom: 20 },
  seoH3: { fontSize: 15, fontWeight: 700, marginBottom: 6 },
  seoLink: { color: '#10B981', textDecoration: 'none' },
  seoServices: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  seoServiceLink: {
    fontSize: 12, color: 'rgba(255,255,255,.35)', textDecoration: 'none',
    padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,.04)',
  },
  seoDistricts: { fontSize: 12, color: 'rgba(255,255,255,.2)', lineHeight: 1.6 },
  seoText: { fontSize: 13, color: 'rgba(255,255,255,.25)', lineHeight: 1.7, marginTop: 20 },

  // Phone
  phoneNum: { fontSize: 26, fontWeight: 800, color: '#10B981', textDecoration: 'none', letterSpacing: '-.02em' },
  phoneSub: { fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 4 },
}
