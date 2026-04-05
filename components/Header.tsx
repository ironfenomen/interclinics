'use client'

// components/Header.tsx — та же сетка и классы, что у городского лендинга (mockup-literal + globals)
import { useState, useEffect } from 'react'
import { City } from '@/data/cities'
import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'

function openCallbackModal() {
  const modal = document.getElementById('callbackModal')
  if (modal) modal.classList.add('open')
  document.body.style.overflow = 'hidden'
}

export default function Header({ city }: { city: City }) {
  const [scrolled, setScrolled] = useState(false)
  const homeHref = `/${city.slug}/`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const nav = [
    { href: `${homeHref}#services`, label: 'Услуги' },
    { href: `${homeHref}#how`, label: 'Как это работает' },
    { href: `${homeHref}#pricing`, label: 'Цены' },
    { href: `${homeHref}#coverage`, label: 'География' },
    { href: `${homeHref}#doctors`, label: 'Врачи' },
    { href: `${homeHref}#faq`, label: 'FAQ' },
  ]

  return (
    <>
      <div className="topbar">
        <div className="c topbar-inner">
          <div className="topbar-slot topbar-slot--left">
            <div className="status-pill">
              <span className="status-dot" />
              Онлайн — {city.teamsAvailable} бригады свободны
            </div>
          </div>
          <div className="topbar-slot topbar-slot--center">
            <div className="topbar-trust">Ежедневно, круглосуточно · подбор формата помощи под ситуацию</div>
          </div>
          <div className="topbar-slot topbar-slot--right">
            <span className="topbar-disclaimer">Лицензия № {city.partnerLicense}</span>
            <a className="mini-link" href="/privacy/">
              Конфиденциальность
            </a>
          </div>
        </div>
      </div>

      <header className={`header ${scrolled ? 'scrolled' : ''}`} id="ic-service-header">
        <div className="c header-inner">
          <a className="brand" href={homeHref}>
            <div className="brand-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M12 3 4 7.5 12 12l8-4.5L12 3Z" />
                <path d="M4 12l8 4.5 8-4.5" />
                <path d="M4 16.5 12 21l8-4.5" />
              </svg>
            </div>
            <div className="brand-name">
              {BRAND_DISPLAY_NAME}
              <span className="brand-tagline">Сеть наркологических клиник</span>
            </div>
          </a>

          <nav className="header-nav" aria-label="Разделы главной страницы города">
            {nav.map(item => (
              <a key={item.href} className="landing-header-nav-link" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions header-actions--cluster">
            <div className="header-actions__row header-actions__row--main">
              <a className="header-phone header-phone--desktop-only" href={`tel:${city.phone}`}>
                {city.phoneDisplay}
              </a>
              <button type="button" className="btn-primary-mock header-callback-btn" onClick={openCallbackModal}>
                Обратный звонок
              </button>
            </div>
            <div className="header-actions__row header-actions__row--meta">
              <a className="city-chip" href={homeHref}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="city-chip__label">{city.name}</span>
              </a>
              <a
                className="header-phone header-phone--mobile-stack"
                href={`tel:${city.phone}`}
                aria-label={`Позвонить ${city.phoneDisplay}`}
              >
                {city.phoneDisplay}
              </a>
              <span className="header-phone-note hidden min-[1025px]:inline">Бесплатно по РФ, круглосуточно</span>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
