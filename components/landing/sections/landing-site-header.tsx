'use client'

import { useEffect, useState } from 'react'
import type { City } from '@/data/cities'
import { CallbackButton } from '../ui/callback-button'

export function LandingSiteHeader({ city }: { city: City }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-[70] border-b border-[rgba(220,230,241,0.85)] bg-[rgba(255,255,255,0.82)] pt-[env(safe-area-inset-top,0px)] backdrop-blur-[18px] transition-shadow ${
        scrolled ? 'shadow-[0_10px_28px_rgba(10,25,45,0.08)]' : ''
      }`}
    >
      <div className="mockup-container header-inner grid min-h-[84px] w-full max-w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-[clamp(20px,2.6vw,36px)] py-2.5 max-md:min-h-[76px] max-md:grid-cols-[auto_auto] max-md:justify-between min-[1025px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <a className="brand flex min-w-0 shrink-0 items-center gap-[14px] justify-self-start min-[1025px]:justify-self-end" href="#">
          <div className="mockup-brand-mark flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px]">
            <svg className="h-[26px] w-[26px] stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden>
              <path d="M12 3 4 7.5 12 12l8-4.5L12 3Z" />
              <path d="M4 12l8 4.5 8-4.5" />
              <path d="M4 16.5 12 21l8-4.5" />
            </svg>
          </div>
          <div className="flex min-w-0 flex-col gap-[3px] text-[22px] font-extrabold leading-[1.12] tracking-[-0.04em] text-deep">
            InterClinics
            <span className="text-[10px] font-extrabold uppercase leading-[1.25] tracking-[0.18em] text-ink-muted-2">
              Сеть наркологических клиник
            </span>
          </div>
        </a>

        <nav className="header-nav hidden min-w-0 w-auto max-w-[min(100%,680px)] justify-self-center min-[1025px]:flex min-[1025px]:flex-nowrap min-[1025px]:justify-center min-[1025px]:gap-2.5">
          <a className="landing-header-nav-link" href="#services">
            Услуги
          </a>
          <a className="landing-header-nav-link" href="#how">
            Как это работает
          </a>
          <a className="landing-header-nav-link" href="#pricing">
            Цены
          </a>
          <a className="landing-header-nav-link" href="#coverage">
            География
          </a>
          <a className="landing-header-nav-link" href="#doctors">
            Врачи
          </a>
          <a className="landing-header-nav-link" href="#faq">
            FAQ
          </a>
        </nav>

        <div className="header-actions header-actions--cluster min-w-0 shrink-0 justify-self-end max-md:justify-self-end">
          <div className="header-actions__row header-actions__row--main">
            <a
              className="header-phone hidden min-[769px]:block"
              href={`tel:${city.phone}`}
            >
              {city.phoneDisplay}
            </a>
            <CallbackButton className="btn-primary-mock max-md:hidden">Обратный звонок</CallbackButton>
          </div>
          <div className="header-actions__row header-actions__row--meta hidden min-[769px]:flex">
            <div className="city-chip inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-3 py-[9px] text-[12px] font-extrabold text-deep-2 whitespace-nowrap">
              <svg className="h-[15px] w-[15px] stroke-emerald" viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden>
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {city.name}
            </div>
            <span className="header-phone-note hidden min-[1025px]:inline">
              Бесплатно по РФ, круглосуточно
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
