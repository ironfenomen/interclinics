'use client'
// components/CitySelector.tsx
// ============================================================
// ГЕО-ОПРЕДЕЛЕНИЕ + ВЫБОР ГОРОДА — PRODUCTION
//
// ЦЕПОЧКА ОПРЕДЕЛЕНИЯ (каждый шаг — fallback предыдущего):
//   1. Cookie ic_city → мгновенный redirect, 0ms
//   2. ip-api.com (бесплатно, РФ, русские названия) → 1-2s
//   3. ipapi.co (backup, англ. названия) → 1-2s
//   4. Ручной выбор из сетки городов
//
// СБОИ: таймаут 3s на каждый API, AbortController, try/catch
// Любая ошибка → следующий шаг, никогда не зависает
//
// UI: три фазы — loading → confirm → select
// Переходы: CSS-анимации fadeIn/slideUp
// ============================================================

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ── Типы ──────────────────────────────────────────────────────
interface CityData {
  slug: string
  name: string
  namePrep: string
  region: string
  priceBase: number
  arrivalTime: number
  districts: string[]
  hasStacionar: boolean
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

type Phase = 'loading' | 'confirm' | 'select'

// ── Cookie утилиты ───────────────────────────────────────────
function getCookie(n: string): string | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match('(^|;)\\s*' + n + '\\s*=\\s*([^;]+)')
  return m ? m.pop() ?? null : null
}
function setCookie(n: string, v: string, days: number) {
  const d = new Date()
  d.setTime(d.getTime() + days * 86400000)
  document.cookie = `${n}=${v};expires=${d.toUTCString()};path=/;SameSite=Lax`
}

// ── Маппинг английских названий → slug ───────────────────────
const EN_MAP: Record<string, string> = {
  stavropol: 'stavropol',
  pyatigorsk: 'pyatigorsk',
  kislovodsk: 'kislovodsk',
  yessentuki: 'essentuki',
  essentuki: 'essentuki',
  nevinnomyssk: 'nevinnomyssk',
  'mineralnye vody': 'mineralnye-vody',
  'mineral waters': 'mineralnye-vody',
  mikhaylovsk: 'mikhaylovsk',
  georgievsk: 'georgievsk',
}

// ── Компонент ─────────────────────────────────────────────────
export default function CitySelector({ cities, services }: Props) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [detected, setDetected] = useState<CityData | null>(null)
  const [fadeKey, setFadeKey] = useState(0) // для ре-анимации при смене фазы
  const mounted = useRef(true)

  const goToCity = useCallback(
    (city: CityData) => {
      setCookie('ic_city', city.slug, 30)
      router.replace(`/${city.slug}/`)
    },
    [router],
  )

  // ── Поиск города по строке (RU или EN) ─────────────────────
  const findCity = useCallback(
    (raw: string | undefined | null): CityData | null => {
      if (!raw) return null
      const q = raw.trim().toLowerCase()
      // Прямое совпадение по русскому имени
      const byName = cities.find((c) => c.name.toLowerCase() === q)
      if (byName) return byName
      // По slug
      const bySlug = cities.find((c) => c.slug === q)
      if (bySlug) return bySlug
      // По английскому маппингу
      const mapped = EN_MAP[q]
      if (mapped) {
        const byMap = cities.find((c) => c.slug === mapped)
        if (byMap) return byMap
      }
      // Частичное совпадение (Минеральные Воды → mineralnye-vody)
      const partial = cities.find(
        (c) => q.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(q),
      )
      return partial ?? null
    },
    [cities],
  )

  // ── Цепочка определения ────────────────────────────────────
  useEffect(() => {
    mounted.current = true

    // ШАГ 0: Cookie
    const saved = getCookie('ic_city')
    if (saved) {
      const match = cities.find((c) => c.slug === saved)
      if (match) {
        router.replace(`/${match.slug}/`)
        return
      }
    }

    // ШАГ 1-2: IP-определение с fallback
    ;(async () => {
      let city: CityData | null = null

      // Попытка 1: ip-api.com (русские названия, бесплатно)
      try {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 3000)
        const res = await fetch('https://ip-api.com/json/?lang=ru&fields=city', {
          signal: ctrl.signal,
        })
        clearTimeout(timer)
        if (res.ok) {
          const data = await res.json()
          city = findCity(data.city)
        }
      } catch {
        /* таймаут или сбой — идём дальше */
      }

      // Попытка 2: ipapi.co (английские названия, backup)
      if (!city) {
        try {
          const ctrl = new AbortController()
          const timer = setTimeout(() => ctrl.abort(), 3000)
          const res = await fetch('https://ipapi.co/json/', { signal: ctrl.signal })
          clearTimeout(timer)
          if (res.ok) {
            const data = await res.json()
            city = findCity(data.city)
          }
        } catch {
          /* backup тоже не сработал */
        }
      }

      if (!mounted.current) return

      if (city) {
        setDetected(city)
        setPhase('confirm')
      } else {
        setPhase('select')
      }
      setFadeKey((k) => k + 1)
    })()

    return () => {
      mounted.current = false
    }
  }, [cities, router, findCity])

  // ── Переход к выбору ───────────────────────────────────────
  const switchToSelect = () => {
    setDetected(null)
    setPhase('select')
    setFadeKey((k) => k + 1)
  }

  // ==================================================================
  // РЕНДЕР
  // ==================================================================
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cs-page">
        {/* ── Фон: градиентные сферы ── */}
        <div className="cs-bg">
          <div className="cs-orb cs-orb--1" />
          <div className="cs-orb cs-orb--2" />
          <div className="cs-orb cs-orb--3" />
        </div>

        <div className="cs-wrap" key={fadeKey}>
          {/* ── Лого (всегда) ── */}
          <div className="cs-brand">
            <div className="cs-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" width="24" height="24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="cs-brand-name">InterClinics</div>
            <div className="cs-brand-sub">Сеть наркологических клиник</div>
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* ФАЗА: ЗАГРУЗКА                                    */}
          {/* ══════════════════════════════════════════════════ */}
          {phase === 'loading' && (
            <div className="cs-loading fade-in">
              <div className="cs-spinner" />
              <p className="cs-loading-text">Определяем ваш город…</p>
            </div>
          )}

          {/* ══════════════════════════════════════════════════ */}
          {/* ФАЗА: ПОДТВЕРЖДЕНИЕ ГОРОДА                        */}
          {/* ══════════════════════════════════════════════════ */}
          {phase === 'confirm' && detected && (
            <div className="cs-confirm slide-up">
              <div className="cs-confirm-card">
                <div className="cs-confirm-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" width="28" height="28">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>

                <h1 className="cs-confirm-q">Ваш город — {detected.name}?</h1>
                <p className="cs-confirm-sub">
                  Наркологическая помощь в {detected.namePrep}: выезд ~{detected.arrivalTime} мин
                  {detected.hasStacionar ? ', стационар 24/7' : ''}, реабилитация
                </p>

                {/* Мини-карточки инфо */}
                <div className="cs-confirm-stats">
                  <div className="cs-stat">
                    <span className="cs-stat-val">{detected.arrivalTime} мин</span>
                    <span className="cs-stat-lbl">выезд</span>
                  </div>
                  <div className="cs-stat">
                    <span className="cs-stat-val">от {detected.priceBase.toLocaleString('ru')} ₽</span>
                    <span className="cs-stat-lbl">капельница</span>
                  </div>
                  <div className="cs-stat">
                    <span className="cs-stat-val">24/7</span>
                    <span className="cs-stat-lbl">круглосуточно</span>
                  </div>
                </div>

                {/* Кнопки */}
                <div className="cs-confirm-btns">
                  <button className="cs-btn cs-btn--primary" onClick={() => goToCity(detected)}>
                    Да, перейти в {detected.name}
                  </button>
                  <button className="cs-btn cs-btn--ghost" onClick={switchToSelect}>
                    Выбрать другой город
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════ */}
          {/* ФАЗА: ВЫБОР ГОРОДА                                */}
          {/* ══════════════════════════════════════════════════ */}
          {phase === 'select' && (
            <div className="cs-select slide-up">
              <h1 className="cs-h1">Выберите город</h1>
              <p className="cs-h1-sub">
                Наркологическая помощь в Ставропольском крае — выезд на дом, стационар, реабилитация
              </p>

              {/* Сетка городов */}
              <div className="cs-grid">
                {cities.map((city, i) => (
                  <a
                    key={city.slug}
                    href={`/${city.slug}/`}
                    className="cs-card"
                    style={{ animationDelay: `${0.05 * i}s` }}
                    onClick={(e) => {
                      e.preventDefault()
                      goToCity(city)
                    }}
                  >
                    {city.hasStacionar && (
                      <span className="cs-card-badge" title="Круглосуточный стационар в городе">
                        Стационар 24/7
                      </span>
                    )}

                    <div className="cs-card-main">
                      <div className="cs-card-city">{city.name}</div>
                      <div className="cs-card-region">{city.region}</div>

                      {city.districts.length > 0 && (
                        <div className="cs-card-districts">
                          {city.districts.slice(0, 3).map((d) => (
                            <span key={d} className="cs-dtag">
                              {d}
                            </span>
                          ))}
                          {city.districts.length > 3 && (
                            <span className="cs-dtag cs-dtag--more">+{city.districts.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="cs-card-foot">
                      <div className="cs-card-metrics">
                        <div className="cs-card-metric">
                          <span className="cs-card-metric-label">Капельница</span>
                          <span className="cs-card-metric-value">
                            от {city.priceBase.toLocaleString('ru')}{' '}
                            <span className="cs-card-metric-currency">₽</span>
                          </span>
                        </div>
                        <div className="cs-card-metric cs-card-metric--time">
                          <span className="cs-card-metric-label">Ориентир выезда</span>
                          <span className="cs-card-metric-value">~{city.arrivalTime} мин</span>
                        </div>
                      </div>
                      <span className="cs-card-arrow" aria-hidden="true">
                        →
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {/* ── Навигация по сети + SEO: города × услуги (данные из props) ── */}
              <nav className="cs-seo" aria-labelledby="cs-seo-heading">
                <div className="cs-seo-intro">
                  <p className="cs-seo-kicker">Сеть в регионе</p>
                  <h2 id="cs-seo-heading" className="cs-seo-h2">
                    Услуги и маршруты по городам
                  </h2>
                  <p className="cs-seo-lead">
                    Те же направления, что и в карточках: быстрый переход к выбранной услуге в нужном населённом пункте.
                  </p>
                </div>

                <ul className="cs-seo-entries">
                  {cities.map((city) => (
                    <li key={city.slug} className="cs-seo-entry">
                      <h3 className="cs-seo-h3">
                        <a href={`/${city.slug}/`}>{city.name}</a>
                      </h3>
                      <div className="cs-seo-links">
                        {services.map((s) => (
                          <a key={s.slug} href={`/${city.slug}/${s.slug}/`}>
                            {s.name} в {city.namePrep}
                          </a>
                        ))}
                      </div>
                      {city.districts.length > 0 && (
                        <p className="cs-seo-districts">
                          <span className="cs-seo-districts-label">Районы работы</span>
                          <span className="cs-seo-districts-text">{city.districts.join(', ')}</span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="cs-seo-closing">
                  <p className="cs-seo-text">
                    InterClinics — выездная помощь, стационар и программы восстановления в {cities.length} городах
                    Ставропольского края. Конфиденциальность, круглосуточная линия, работа по лицензии и согласованию с
                    пациентом. Выберите город в списке выше или перейдите сразу к нужной услуге.
                  </p>
                </div>
              </nav>
            </div>
          )}

          {/* ── Линия связи: телефон сети (всегда под контентом фазы) ── */}
          <div className={`cs-phone fade-in${phase === 'select' ? ' cs-phone--with-nav' : ''}`}>
            <div className="cs-phone-inner">
              <p className="cs-phone-kicker">Единая линия сети</p>
              <a href="tel:+78001005849" className="cs-phone-num">
                8 (800) 100-58-49
              </a>
              <p className="cs-phone-sub">Бесплатно по РФ · Круглосуточно</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ==================================================================
// CSS
// ==================================================================
const CSS = `
/* ── Анимации ──────────────────────────────────────────────── */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes orbFloat1{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
@keyframes orbFloat2{0%,100%{transform:translate(0,0)}50%{transform:translate(-25px,15px)}}
@keyframes cardIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.fade-in{animation:fadeIn .5s ease both}
.slide-up{animation:slideUp .6s ease both}

/* ── Страница ──────────────────────────────────────────────── */
.cs-page{
  min-height:100vh;position:relative;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
  padding:40px 20px;
  font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif;
  background:#060e1c;color:#fff;
}
.cs-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.cs-orb{position:absolute;border-radius:50%;filter:blur(80px)}
.cs-orb--1{width:500px;height:500px;top:-10%;left:-8%;background:rgba(16,185,129,.10);animation:orbFloat1 12s ease-in-out infinite}
.cs-orb--2{width:400px;height:400px;bottom:-5%;right:-5%;background:rgba(16,185,129,.07);animation:orbFloat2 15s ease-in-out infinite}
.cs-orb--3{width:300px;height:300px;top:40%;left:55%;background:rgba(99,102,241,.05);animation:orbFloat1 18s ease-in-out infinite reverse}

.cs-wrap{position:relative;z-index:2;max-width:920px;width:100%}

/* ── Бренд ─────────────────────────────────────────────────── */
.cs-brand{text-align:center;margin-bottom:36px;animation:fadeIn .6s ease both}
.cs-mark{
  width:52px;height:52px;margin:0 auto;
  background:linear-gradient(135deg,#10B981,#059669);
  border-radius:14px;display:flex;align-items:center;justify-content:center;
  box-shadow:0 12px 32px rgba(16,185,129,.2);
}
.cs-brand-name{font-size:28px;font-weight:800;margin-top:14px;letter-spacing:-.03em}
.cs-brand-sub{font-size:11px;color:rgba(255,255,255,.3);margin-top:3px;text-transform:uppercase;letter-spacing:.14em;font-weight:600}

/* ── Загрузка ──────────────────────────────────────────────── */
.cs-loading{text-align:center;padding:48px 0}
.cs-spinner{
  width:36px;height:36px;margin:0 auto 16px;
  border:3px solid rgba(255,255,255,.08);border-top-color:#10B981;
  border-radius:50%;animation:spin .8s linear infinite;
}
.cs-loading-text{font-size:14px;color:rgba(255,255,255,.35)}

/* ── Подтверждение ─────────────────────────────────────────── */
.cs-confirm{padding:12px 0}
.cs-confirm-card{
  max-width:520px;margin:0 auto;text-align:center;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
  border-radius:24px;padding:40px 32px;
  backdrop-filter:blur(12px);
  box-shadow:0 24px 64px rgba(0,0,0,.3);
}
.cs-confirm-icon{
  width:60px;height:60px;margin:0 auto 20px;
  background:rgba(16,185,129,.1);border-radius:50%;
  display:flex;align-items:center;justify-content:center;
}
.cs-confirm-q{font-size:26px;font-weight:800;margin-bottom:8px;letter-spacing:-.02em}
.cs-confirm-sub{font-size:15px;color:rgba(255,255,255,.4);margin-bottom:28px;line-height:1.6}
.cs-confirm-stats{
  display:flex;justify-content:center;gap:16px;margin-bottom:28px;flex-wrap:wrap;
}
.cs-stat{
  padding:12px 20px;border-radius:14px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);
  min-width:100px;
}
.cs-stat-val{display:block;font-size:18px;font-weight:800;color:#fff}
.cs-stat-lbl{font-size:11px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.08em;font-weight:600}
.cs-confirm-btns{display:flex;flex-direction:column;gap:10px;align-items:center}

/* ── Кнопки ────────────────────────────────────────────────── */
.cs-btn{
  padding:15px 36px;border-radius:14px;font-size:15px;font-weight:700;
  cursor:pointer;border:none;transition:all .25s;font-family:inherit;
}
.cs-btn--primary{
  background:#10B981;color:#fff;width:100%;max-width:360px;
  box-shadow:0 12px 32px rgba(16,185,129,.25);
}
.cs-btn--primary:hover{background:#34D399;transform:translateY(-2px);box-shadow:0 16px 40px rgba(16,185,129,.3)}
.cs-btn--ghost{
  background:transparent;color:rgba(255,255,255,.5);
  border:1px solid rgba(255,255,255,.1);width:100%;max-width:360px;
}
.cs-btn--ghost:hover{color:#fff;border-color:rgba(255,255,255,.25)}

/* ── Выбор города ──────────────────────────────────────────── */
.cs-h1{font-size:28px;font-weight:800;text-align:center;margin-bottom:8px;letter-spacing:-.02em}
.cs-h1-sub{font-size:14px;color:rgba(255,255,255,.35);text-align:center;margin-bottom:36px;max-width:500px;margin-left:auto;margin-right:auto;line-height:1.6}

.cs-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(272px,1fr));
  gap:18px;
  align-items:stretch;
}

/* ── Карточка города (premium entry) ───────────────────────── */
.cs-card{
  position:relative;display:flex;flex-direction:column;
  min-height:228px;
  padding:0;border-radius:16px;
  text-decoration:none;color:inherit;cursor:pointer;
  background:
    linear-gradient(165deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,.02) 45%,rgba(11,29,53,.35) 100%);
  border:1px solid rgba(255,255,255,.09);
  box-shadow:
    0 1px 0 rgba(255,255,255,.06) inset,
    0 12px 40px rgba(0,0,0,.22);
  transition:border-color .25s ease,box-shadow .25s ease,transform .25s ease,background .25s ease;
  animation:cardIn .5s ease both;
  outline:none;
  -webkit-tap-highlight-color:transparent;
}
.cs-card:hover{
  border-color:rgba(16,185,129,.28);
  background:
    linear-gradient(165deg,rgba(255,255,255,.09) 0%,rgba(255,255,255,.035) 50%,rgba(16,185,129,.06) 100%);
  box-shadow:
    0 1px 0 rgba(255,255,255,.08) inset,
    0 20px 48px rgba(0,0,0,.28),
    0 0 0 1px rgba(16,185,129,.12);
  transform:translateY(-2px);
}
.cs-card:focus-visible{
  border-color:rgba(16,185,129,.45);
  box-shadow:
    0 1px 0 rgba(255,255,255,.08) inset,
    0 0 0 3px rgba(16,185,129,.25),
    0 16px 44px rgba(0,0,0,.25);
}
.cs-card:active{
  transform:translateY(0);
  transition-duration:.12s;
}

.cs-card-main{
  flex:1;
  padding:22px 20px 14px;
  padding-right:20px;
}
.cs-card-city{
  font-size:21px;font-weight:800;line-height:1.2;
  letter-spacing:-.03em;color:#fff;
  margin:0 0 6px;
}
.cs-card:has(.cs-card-badge) .cs-card-city{
  padding-right:min(112px,40%);
}
.cs-card-region{
  font-size:12.5px;line-height:1.45;
  color:rgba(226,232,240,.42);
  margin:0 0 14px;
  font-weight:500;
}

.cs-card-badge{
  position:absolute;z-index:2;top:16px;right:16px;
  max-width:calc(100% - 32px);
  padding:5px 11px 5px 10px;
  border-radius:999px;
  font-size:10px;font-weight:800;
  letter-spacing:.06em;text-transform:uppercase;
  color:rgba(214,179,106,.95);
  background:linear-gradient(180deg,rgba(214,179,106,.14),rgba(214,179,106,.06));
  border:1px solid rgba(214,179,106,.22);
  box-shadow:0 2px 8px rgba(0,0,0,.15);
  line-height:1.2;
}

.cs-card-districts{
  display:flex;flex-wrap:wrap;gap:6px;
  margin:0;
}
.cs-dtag{
  display:inline-flex;align-items:center;
  padding:4px 10px;
  border-radius:999px;
  font-size:11px;font-weight:600;
  line-height:1.25;
  letter-spacing:-.01em;
  color:rgba(241,245,249,.72);
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.08);
  max-width:100%;
}
.cs-dtag--more{
  color:#34d399;
  background:rgba(16,185,129,.1);
  border-color:rgba(16,185,129,.2);
  font-weight:700;
}

.cs-card-foot{
  display:flex;align-items:flex-end;justify-content:space-between;gap:12px;
  margin-top:auto;
  padding:14px 16px 16px;
  border-top:1px solid rgba(255,255,255,.07);
  background:rgba(5,12,22,.45);
  border-radius:0 0 15px 15px;
}

.cs-card-metrics{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px 16px;
  flex:1;min-width:0;
}

.cs-card-metric{
  display:flex;flex-direction:column;gap:4px;min-width:0;
}
.cs-card-metric-label{
  font-size:9px;font-weight:700;
  letter-spacing:.1em;text-transform:uppercase;
  color:rgba(148,163,184,.75);
}
.cs-card-metric-value{
  font-size:15px;font-weight:800;
  letter-spacing:-.02em;color:#fff;line-height:1.2;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.cs-card-metric-currency{
  font-weight:700;font-size:13px;opacity:.88;
}
.cs-card-metric--time .cs-card-metric-value{
  font-size:14px;font-weight:700;
  color:rgba(226,232,240,.95);
}

.cs-card-arrow{
  flex-shrink:0;
  width:36px;height:36px;
  display:flex;align-items:center;justify-content:center;
  border-radius:10px;
  font-size:16px;font-weight:400;
  color:rgba(16,185,129,.85);
  background:rgba(16,185,129,.1);
  border:1px solid rgba(16,185,129,.18);
  opacity:.85;
  transition:opacity .2s ease,background .2s ease,border-color .2s ease,color .2s ease;
}
.cs-card:hover .cs-card-arrow{
  opacity:1;
  color:#fff;
  background:rgba(16,185,129,.35);
  border-color:rgba(16,185,129,.4);
}
.cs-card:focus-visible .cs-card-arrow{
  opacity:1;
}

/* ── Нижний блок: навигация по сети + SEO ───────────────────── */
.cs-seo{
  margin-top:56px;
  padding:36px 0 8px;
  border-top:1px solid rgba(255,255,255,.08);
  background:linear-gradient(180deg,rgba(255,255,255,.02) 0%,transparent 48%);
  border-radius:0 0 4px 4px;
}
.cs-seo-intro{
  text-align:center;
  max-width:34rem;
  margin:0 auto 32px;
  padding:0 4px;
}
.cs-seo-kicker{
  margin:0 0 10px;
  font-size:10px;font-weight:800;
  letter-spacing:.16em;text-transform:uppercase;
  color:rgba(16,185,129,.65);
}
.cs-seo-h2{
  margin:0 0 12px;
  font-size:clamp(18px,2.5vw,22px);
  font-weight:800;
  letter-spacing:-.03em;
  line-height:1.2;
  color:rgba(248,250,252,.94);
}
.cs-seo-lead{
  margin:0;
  font-size:13.5px;
  line-height:1.55;
  font-weight:500;
  color:rgba(203,213,225,.55);
}

.cs-seo-entries{
  list-style:none;
  margin:0;
  padding:0;
  display:flex;
  flex-direction:column;
  gap:0;
}
.cs-seo-entry{
  margin:0;
  padding:22px 0 20px;
  border-bottom:1px solid rgba(255,255,255,.06);
}
.cs-seo-entry:first-child{padding-top:4px}
.cs-seo-entry:last-child{border-bottom:none;padding-bottom:8px}

.cs-seo-h3{
  margin:0 0 12px;
  font-size:15px;
  font-weight:800;
  letter-spacing:-.02em;
  line-height:1.25;
}
.cs-seo-h3 a{
  color:#fff;
  text-decoration:none;
  border-bottom:1px solid transparent;
  transition:border-color .2s ease,color .2s ease;
}
.cs-seo-h3 a:hover{
  color:#6ee7b7;
  border-bottom-color:rgba(110,231,183,.35);
}
.cs-seo-h3 a:focus-visible{
  outline:2px solid rgba(16,185,129,.45);
  outline-offset:3px;
  border-radius:4px;
}

.cs-seo-links{
  display:flex;
  flex-wrap:wrap;
  gap:8px 10px;
  margin:0 0 12px;
}
.cs-seo-links a{
  display:inline-flex;
  align-items:center;
  font-size:12px;
  font-weight:600;
  letter-spacing:-.01em;
  line-height:1.3;
  color:rgba(226,232,240,.78);
  text-decoration:none;
  padding:7px 12px;
  border-radius:10px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
  box-shadow:0 1px 0 rgba(255,255,255,.04) inset;
  transition:
    background .2s ease,
    border-color .2s ease,
    color .2s ease,
    box-shadow .2s ease;
}
.cs-seo-links a:hover{
  color:#fff;
  background:rgba(16,185,129,.12);
  border-color:rgba(16,185,129,.28);
  box-shadow:0 4px 16px rgba(0,0,0,.15);
}
.cs-seo-links a:active{
  transform:translateY(1px);
}
.cs-seo-links a:focus-visible{
  outline:2px solid rgba(16,185,129,.5);
  outline-offset:2px;
}

.cs-seo-districts{
  margin:0;
  font-size:12.5px;
  line-height:1.55;
  display:flex;
  flex-wrap:wrap;
  gap:6px 10px;
  align-items:baseline;
}
.cs-seo-districts-label{
  flex-shrink:0;
  font-size:9px;
  font-weight:800;
  letter-spacing:.1em;
  text-transform:uppercase;
  color:rgba(148,163,184,.55);
}
.cs-seo-districts-text{
  color:rgba(203,213,225,.42);
  font-weight:500;
}

.cs-seo-closing{
  margin-top:28px;
  padding:22px 20px 24px;
  border-radius:16px;
  background:rgba(5,11,22,.55);
  border:1px solid rgba(255,255,255,.06);
  box-shadow:0 12px 40px rgba(0,0,0,.18);
}
.cs-seo-text{
  margin:0;
  font-size:13.5px;
  line-height:1.65;
  font-weight:500;
  color:rgba(203,213,225,.48);
  text-wrap:pretty;
}

/* ── Телефон: завершение страницы ──────────────────────────── */
.cs-phone{
  margin-top:8px;
  padding:32px 16px 28px;
  text-align:center;
}
.cs-phone--with-nav{
  margin-top:4px;
  padding-top:36px;
  border-top:1px solid rgba(255,255,255,.07);
  background:linear-gradient(180deg,rgba(16,185,129,.03) 0%,transparent 55%);
}
.cs-phone-inner{
  max-width:22rem;
  margin:0 auto;
  padding:24px 20px 20px;
  border-radius:18px;
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.07);
  box-shadow:0 16px 48px rgba(0,0,0,.2);
}
.cs-phone-kicker{
  margin:0 0 10px;
  font-size:10px;
  font-weight:800;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:rgba(148,163,184,.55);
}
.cs-phone-num{
  display:inline-block;
  font-size:26px;
  font-weight:800;
  color:#34d399;
  text-decoration:none;
  letter-spacing:-.03em;
  transition:color .2s ease,filter .2s ease;
}
.cs-phone-num:hover{
  color:#6ee7b7;
  filter:drop-shadow(0 0 20px rgba(16,185,129,.25));
}
.cs-phone-num:focus-visible{
  outline:2px solid rgba(16,185,129,.5);
  outline-offset:4px;
  border-radius:6px;
}
.cs-phone-sub{
  margin:10px 0 0;
  font-size:12.5px;
  font-weight:500;
  color:rgba(148,163,184,.55);
}

/* ── Мобильные ─────────────────────────────────────────────── */
@media(max-width:600px){
  .cs-page{padding:28px 16px;align-items:flex-start;padding-top:60px}
  .cs-brand-name{font-size:24px}
  .cs-confirm-card{padding:28px 20px}
  .cs-confirm-q{font-size:22px}
  .cs-confirm-stats{gap:8px}
  .cs-stat{padding:10px 14px;min-width:80px}
  .cs-stat-val{font-size:16px}
  .cs-h1{font-size:22px}
  .cs-grid{grid-template-columns:1fr;gap:14px}
  .cs-card{min-height:0}
  .cs-card-main{padding:20px 18px 12px}
  .cs-card-city{font-size:19px}
  .cs-card:has(.cs-card-badge) .cs-card-city{padding-right:min(100px,36%)}
  .cs-card-badge{top:14px;right:14px;font-size:9px;padding:4px 9px}
  .cs-card-foot{padding:12px 14px 14px;align-items:stretch}
  .cs-card-metrics{gap:10px 12px}
  .cs-card-metric-value{font-size:14px}
  .cs-card-metric--time .cs-card-metric-value{font-size:13px}
  .cs-card-arrow{width:32px;height:32px;font-size:14px}
  .cs-seo{margin-top:40px;padding:26px 0 4px}
  .cs-seo-intro{margin-bottom:22px;padding:0}
  .cs-seo-h2{font-size:18px}
  .cs-seo-lead{font-size:13px}
  .cs-seo-entry{padding:18px 0 16px}
  .cs-seo-entry:first-child{padding-top:0}
  .cs-seo-h3{font-size:14px;margin-bottom:10px}
  .cs-seo-links{gap:6px 8px;margin-bottom:10px}
  .cs-seo-links a{font-size:11.5px;padding:6px 10px;border-radius:9px}
  .cs-seo-districts{font-size:12px;flex-direction:column;align-items:flex-start;gap:4px}
  .cs-seo-closing{padding:16px 14px 18px;margin-top:20px;border-radius:14px}
  .cs-seo-text{font-size:13px;line-height:1.62}
  .cs-phone{padding:22px 10px 20px}
  .cs-phone--with-nav{padding-top:28px}
  .cs-phone-inner{padding:18px 14px 16px}
  .cs-phone-num{font-size:22px}
  .cs-phone-sub{font-size:12px}
}
`
