'use client'

// components/LeadForm.tsx
import { useState, useRef } from 'react'
import type { City } from '@/data/cities'

interface Props {
  city: City
  variant: 'hero' | 'modal' | 'cta' | 'inline'
  /** Усиленная финальная форма (только с variant="cta") */
  ctaVariant?: 'default' | 'vyvod' | 'stacionar' | 'narkolog' | 'kodirovanie' | 'reabilitaciya'
}

type HeroScenario = 'urgent' | 'home' | 'stacionar' | 'rehab'

export default function LeadForm({ city, variant, ctaVariant = 'default' }: Props) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [heroScenario, setHeroScenario] = useState<HeroScenario>('urgent')
  const inputRef = useRef<HTMLInputElement>(null)

  function handlePhone(value: string) {
    let digits = value.replace(/\D/g, '')
    if (digits.length > 11) digits = digits.slice(0, 11)
    if (digits.length === 0) { setPhone(''); return }
    if (digits[0] === '7' || digits[0] === '8') digits = digits.slice(1)

    let formatted = '+7 ('
    if (digits.length > 0) formatted += digits.slice(0, 3)
    if (digits.length >= 3) formatted += ') ' + digits.slice(3, 6)
    if (digits.length >= 6) formatted += '-' + digits.slice(6, 8)
    if (digits.length >= 8) formatted += '-' + digits.slice(8, 10)
    setPhone(formatted)
    setError(false)
  }

  function heroLeadType(sc: HeroScenario): 'vyzov' | 'stacionar' | 'rehab' {
    if (sc === 'stacionar') return 'stacionar'
    if (sc === 'rehab') return 'rehab'
    return 'vyzov'
  }

  function heroButtonLabel(sc: HeroScenario): string {
    switch (sc) {
      case 'stacionar':
        return 'Обсудить стационар'
      case 'rehab':
        return 'Узнать о программе'
      default:
        return 'Перезвоните мне'
    }
  }

  async function handleSubmit() {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      setError(true)
      inputRef.current?.focus()
      setTimeout(() => setError(false), 2000)
      return
    }

    if (
      variant === 'cta' &&
      (ctaVariant === 'vyvod' ||
        ctaVariant === 'stacionar' ||
        ctaVariant === 'narkolog' ||
        ctaVariant === 'kodirovanie' ||
        ctaVariant === 'reabilitaciya') &&
      !consent
    ) {
      setConsentError(true)
      return
    }
    setConsentError(false)

    const leadType =
      variant === 'hero'
        ? heroLeadType(heroScenario)
        : variant === 'cta' && ctaVariant === 'stacionar'
          ? 'stacionar'
          : variant === 'cta' && ctaVariant === 'reabilitaciya'
            ? 'rehab'
            : 'general'
    const source =
      variant === 'hero'
        ? `hero:${heroScenario}`
        : variant === 'cta' && ctaVariant === 'vyvod'
          ? 'cta:vyvod-final'
          : variant === 'cta' && ctaVariant === 'stacionar'
            ? 'cta:stacionar-final'
            : variant === 'cta' && ctaVariant === 'narkolog'
              ? 'cta:narkolog-final'
              : variant === 'cta' && ctaVariant === 'kodirovanie'
                ? 'cta:kodirovanie-final'
                : variant === 'cta' && ctaVariant === 'reabilitaciya'
                  ? 'cta:reabilitaciya-final'
                  : variant

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: digits,
          city: city.slug,
          source,
          leadType,
        }),
      })
      if (!res.ok) {
        console.warn('LEAD: API error', res.status, { phone: digits, city: city.slug, source, leadType })
      }
    } catch {
      console.warn('LEAD (offline/fallback):', { phone: digits, city: city.slug, source, leadType })
    }

    setSent(true)
    setPhone('')
    setTimeout(() => setSent(false), 4000)
  }

  if (variant === 'hero') {
    const scenarios: { id: HeroScenario; title: string; sub: string }[] = [
      { id: 'urgent', title: 'Срочный вызов', sub: 'Запой, ломка, резкое ухудшение' },
      { id: 'home', title: 'Нарколог на дом', sub: 'Осмотр на дому, без лишней суеты' },
      { id: 'stacionar', title: 'Стационар 24/7', sub: 'Наблюдение, палата, питание' },
      { id: 'rehab', title: 'Реабилитация', sub: 'После стационара или острой фазы' },
    ]

    return (
      <div style={{
        background: '#fff', borderRadius: 22, padding: '26px 24px 28px',
        boxShadow: '0 20px 56px rgba(7,20,35,.14)', position: 'relative', border: '1px solid rgba(220,230,241,.9)'
      }}>
        <div style={{
          position: 'absolute', inset: -1,
          background: 'linear-gradient(135deg, var(--em), transparent 50%, var(--em))',
          borderRadius: 23, zIndex: -1, opacity: .22
        }} />

        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--deep)', marginBottom: 4, letterSpacing: '-.02em' }}>
            {sent ? '✓ Заявка отправлена!' : 'Запросите звонок нарколога'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.45 }}>
            {sent
              ? 'Нарколог перезвонит в ближайшее время'
              : 'Круглосуточно подберём формат: выезд, приём, стационар при показаниях. Восстановление — следующий этап.'}
          </div>
        </div>

        {!sent && (
          <>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6, textAlign: 'left' }}>
                Чем помочь
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {scenarios.map(row => {
                  const active = heroScenario === row.id
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => setHeroScenario(row.id)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                        padding: '10px 12px', borderRadius: 12, border: '1px solid',
                        borderColor: active ? 'var(--em)' : 'var(--b2)',
                        background: active ? 'rgba(16,185,129,.07)' : '#fff',
                        transition: 'border-color .2s, background .2s',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--deep)',
                          lineHeight: 1.25,
                          ...(row.id === 'rehab' ? { whiteSpace: 'nowrap' as const } : {}),
                        }}
                      >
                        {row.title}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2, lineHeight: 1.3 }}>{row.sub}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'var(--red-bg)', color: 'var(--red)',
              padding: '7px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, marginBottom: 12
            }}>
              <span style={{ width:5, height:5, background:'var(--red)', borderRadius:'50%', animation:'blink 1s ease-in-out infinite', flexShrink:0 }} />
              Круглосуточно · бригад в {city.namePrep}: {city.teamsAvailable}
            </div>

            <input
              ref={inputRef}
              className={`fi ${error ? 'fi--err' : ''}`}
              type="tel"
              placeholder="Ваш телефон *"
              value={phone}
              onChange={e => handlePhone(e.target.value)}
              style={{ marginBottom: 10 }}
            />

            <button type="button" className="fbtn" onClick={handleSubmit}>
              {heroButtonLabel(heroScenario)}
            </button>

            <p style={{ marginTop: 8, fontSize: 11, color: 'var(--t3)', textAlign: 'center', lineHeight: 1.45 }}>
              Нажимая кнопку, вы соглашаетесь с{' '}
              <a href="/privacy/" style={{ color: 'var(--em-d)', textDecoration: 'underline' }}>политикой конфиденциальности</a>
            </p>

            <div style={{
              display: 'flex', gap: 8, marginTop: 12, paddingTop: 12,
              borderTop: '1px solid var(--b2)'
            }}>
              <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500, alignSelf: 'center', flexShrink: 0 }}>
                Или напишите:
              </span>
              <a href={`https://wa.me/${city.whatsapp}`} target="_blank" rel="noopener"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 10px', minHeight: 40, borderRadius: 12, fontSize: 12, fontWeight: 700, border: '1px solid var(--b1)', color: '#25D366', background: '#fff' }}>
                WhatsApp
              </a>
              {city.telegram && (
                <a href={`https://t.me/${city.telegram}`} target="_blank" rel="noopener"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 10px', minHeight: 40, borderRadius: 12, fontSize: 12, fontWeight: 700, border: '1px solid var(--b1)', color: '#2AABEE', background: '#fff' }}>
                  Telegram
                </a>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  if (variant === 'cta' && ctaVariant === 'vyvod') {
    if (sent) {
      return (
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.65,
            fontWeight: 600,
            color: 'rgba(241, 245, 249, 0.92)',
            textAlign: 'center',
          }}
        >
          Спасибо. Перезвоним в ближайшее время — обычно в течение нескольких минут.
        </p>
      )
    }
    return (
      <>
        <input
          ref={inputRef}
          className={`fi fi--on-dark ${error ? 'fi--err' : ''}`}
          type="tel"
          autoComplete="tel"
          placeholder="Телефон для связи *"
          value={phone}
          onChange={e => {
            handlePhone(e.target.value)
            setConsentError(false)
          }}
          aria-invalid={error}
        />
        <label
          className={`form-consent-check ${consentError ? 'form-consent--invalid' : ''}`}
          htmlFor="vyvod-final-pd"
        >
          <input
            id="vyvod-final-pd"
            type="checkbox"
            checked={consent}
            onChange={e => {
              setConsent(e.target.checked)
              setConsentError(false)
            }}
          />
          <span>
            Я согласен(на) на{' '}
            <a href="/privacy/">обработку персональных данных</a>
          </span>
        </label>
        <button type="button" className="fbtn" onClick={handleSubmit}>
          Оставить номер — перезвоним
        </button>
      </>
    )
  }

  if (variant === 'cta' && ctaVariant === 'narkolog') {
    if (sent) {
      return (
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.65,
            fontWeight: 600,
            color: 'rgba(241, 245, 249, 0.92)',
            textAlign: 'center',
          }}
        >
          Спасибо. Перезвоним в ближайшее время — обычно в течение нескольких минут, чтобы спокойно согласовать детали выезда.
        </p>
      )
    }
    return (
      <>
        <input
          ref={inputRef}
          className={`fi fi--on-dark ${error ? 'fi--err' : ''}`}
          type="tel"
          autoComplete="tel"
          placeholder="Телефон для обратного звонка *"
          value={phone}
          onChange={e => {
            handlePhone(e.target.value)
            setConsentError(false)
          }}
          aria-invalid={error}
          aria-describedby="narkolog-final-hint"
        />
        <p id="narkolog-final-hint" className="ic-narkolog-form-hint">
          Перезвоним, чтобы уточнить адрес, время и выезд — до согласования с врачом вы не обязаны.
        </p>
        <label
          className={`form-consent-check ${consentError ? 'form-consent--invalid' : ''}`}
          htmlFor="narkolog-final-pd"
        >
          <input
            id="narkolog-final-pd"
            type="checkbox"
            checked={consent}
            onChange={e => {
              setConsent(e.target.checked)
              setConsentError(false)
            }}
          />
          <span>
            Я согласен(на) на{' '}
            <a href="/privacy/">обработку персональных данных</a>
          </span>
        </label>
        <button type="button" className="fbtn" onClick={handleSubmit}>
          Запросить обратный звонок
        </button>
      </>
    )
  }

  if (variant === 'cta' && ctaVariant === 'kodirovanie') {
    if (sent) {
      return (
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.65,
            fontWeight: 600,
            color: 'rgba(241, 245, 249, 0.92)',
            textAlign: 'center',
          }}
        >
          Спасибо. Перезвоним в ближайшее время — обычно в течение нескольких минут, чтобы согласовать консультацию.
        </p>
      )
    }
    return (
      <>
        <input
          ref={inputRef}
          className={`fi fi--on-dark ${error ? 'fi--err' : ''}`}
          type="tel"
          autoComplete="tel"
          placeholder="Телефон для связи *"
          value={phone}
          onChange={e => {
            handlePhone(e.target.value)
            setConsentError(false)
          }}
          aria-invalid={error}
          aria-describedby="kodirovanie-final-hint"
        />
        <p id="kodirovanie-final-hint" className="ic-kodirovanie-form-hint">
          Перезвоним для записи и короткого обсуждения вариантов — до визита к врачу вы не обязаны.
        </p>
        <label
          className={`form-consent-check ${consentError ? 'form-consent--invalid' : ''}`}
          htmlFor="kodirovanie-final-pd"
        >
          <input
            id="kodirovanie-final-pd"
            type="checkbox"
            checked={consent}
            onChange={e => {
              setConsent(e.target.checked)
              setConsentError(false)
            }}
          />
          <span>
            Я согласен(на) на{' '}
            <a href="/privacy/">обработку персональных данных</a>
          </span>
        </label>
        <button type="button" className="fbtn" onClick={handleSubmit}>
          Записаться на консультацию
        </button>
      </>
    )
  }

  if (variant === 'cta' && ctaVariant === 'reabilitaciya') {
    if (sent) {
      return (
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.65,
            fontWeight: 600,
            color: 'rgba(241, 245, 249, 0.92)',
            textAlign: 'center',
          }}
        >
          Спасибо. Перезвоним в ближайшее время — обычно в течение нескольких минут, чтобы согласовать консультацию по программе восстановления.
        </p>
      )
    }
    return (
      <>
        <input
          ref={inputRef}
          className={`fi fi--on-dark ${error ? 'fi--err' : ''}`}
          type="tel"
          autoComplete="tel"
          placeholder="Телефон для связи *"
          value={phone}
          onChange={e => {
            handlePhone(e.target.value)
            setConsentError(false)
          }}
          aria-invalid={error}
          aria-describedby="reabilitaciya-final-hint"
        />
        <p id="reabilitaciya-final-hint" className="ic-reabilitaciya-form-hint">
          Перезвоним, чтобы спокойно сориентировать по сроку, глубине программы и следующему шагу — без обязательств до записи.
        </p>
        <label
          className={`form-consent-check ${consentError ? 'form-consent--invalid' : ''}`}
          htmlFor="reabilitaciya-final-pd"
        >
          <input
            id="reabilitaciya-final-pd"
            type="checkbox"
            checked={consent}
            onChange={e => {
              setConsent(e.target.checked)
              setConsentError(false)
            }}
          />
          <span>
            Я согласен(на) на{' '}
            <a href="/privacy/">обработку персональных данных</a>
          </span>
        </label>
        <button type="button" className="fbtn" onClick={handleSubmit}>
          Получить консультацию по программе
        </button>
      </>
    )
  }

  if (variant === 'cta' && ctaVariant === 'stacionar') {
    if (sent) {
      return (
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.65,
            fontWeight: 600,
            color: 'rgba(241, 245, 249, 0.92)',
            textAlign: 'center',
          }}
        >
          Спасибо. Перезвоним, чтобы спокойно уточнить показания и порядок поступления — обычно в течение нескольких минут.
        </p>
      )
    }
    return (
      <>
        <input
          ref={inputRef}
          className={`fi fi--on-dark ${error ? 'fi--err' : ''}`}
          type="tel"
          autoComplete="tel"
          placeholder="Номер для перезвона *"
          value={phone}
          onChange={e => {
            handlePhone(e.target.value)
            setConsentError(false)
          }}
          aria-invalid={error}
          aria-describedby="stacionar-final-hint"
        />
        <p id="stacionar-final-hint" className="ic-stacionar-form-hint">
          Перезвоним: показания, места, порядок поступления — до визита к врачу без обязательств.
        </p>
        <label
          className={`form-consent-check ${consentError ? 'form-consent--invalid' : ''}`}
          htmlFor="stacionar-final-pd"
        >
          <input
            id="stacionar-final-pd"
            type="checkbox"
            checked={consent}
            onChange={e => {
              setConsent(e.target.checked)
              setConsentError(false)
            }}
          />
          <span>
            Я согласен(на) на{' '}
            <a href="/privacy/">обработку персональных данных</a> для обратного звонка
          </span>
        </label>
        <button type="button" className="fbtn" onClick={handleSubmit}>
          Обсудить госпитализацию
        </button>
      </>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 10, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap' }}>
      <input
        ref={inputRef}
        className={`fi ${error ? 'fi--err' : ''}`}
        type="tel"
        placeholder={sent ? '✓ Заявка отправлена!' : 'Ваш телефон'}
        value={phone}
        onChange={e => handlePhone(e.target.value)}
        style={{
          flex: 1,
          marginBottom: 0,
          minWidth: 200,
          ...(variant === 'cta' ? { background: 'rgba(255,255,255,.07)', borderColor: 'rgba(255,255,255,.1)', color: '#fff' } : {}),
        }}
      />
      <button type="button" className="fbtn" onClick={handleSubmit} style={{ width: 'auto', padding: '14px 28px', whiteSpace: 'nowrap' }}>
        Перезвоните мне
      </button>
    </div>
  )
}
