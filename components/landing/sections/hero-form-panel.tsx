'use client'

import { useState } from 'react'
import type { City } from '@/data/cities'
import { SiteMessengerRowHero } from '@/components/site-messenger-chips'
import { digitsOnly, formatRuPhoneInput, isPhoneComplete } from '../lib/phone-format'
import { LiveTeamsCount } from '../live/live-teams-count'

const HERO_INITIAL_COPY = {
  title: 'Получите помощь сейчас',
  sub: 'Прототип формы собран так, чтобы работать под звонковый трафик: максимум доверия, минимум действий, быстрый путь к контакту.',
} as const

const SCENARIOS = [
  {
    key: 'urgent',
    labelShort: 'Срочный вызов',
    hint: 'Вывод из запоя / немедленный контакт',
    title: 'Получите срочную помощь сейчас',
    sub: 'Сценарий для горячего интента: минимальный путь к звонку, срочный перезвон и ясный следующий шаг.',
    cta: 'Перезвоните мне за 30 секунд',
  },
  {
    key: 'home',
    labelShort: 'Нарколог на дом',
    hint: 'Домашний выезд врача и семьи',
    title: 'Вызовите нарколога на дом',
    sub: 'Сценарий для тех, кто хочет осмотр и лечение дома: больше уверенности, меньше стресса, понятный маршрут обращения.',
    cta: 'Оставить заявку на выезд',
  },
  {
    key: 'code',
    labelShort: 'Кодирование',
    hint: 'Консультация и выбор метода',
    title: 'Подберите формат кодирования',
    sub: 'Менее срочный, но более тревожный интент: здесь важны экспертность, безопасность и мягкий путь к консультации.',
    cta: 'Получить консультацию по кодированию',
  },
  {
    key: 'rehab',
    labelShort: 'Реабилитация',
    hint: 'Длинный цикл, родные, мотивация',
    title: 'Обсудить реабилитацию и маршрут',
    sub: 'Длинный цикл принятия решения: нужен спокойный разговор, доверие и понятная траектория восстановления.',
    cta: 'Обсудить план реабилитации',
  },
] as const

export function HeroFormPanel({ city: _city }: { city: City }) {
  const [active, setActive] = useState(0)
  const [copyPrimed, setCopyPrimed] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneErr, setPhoneErr] = useState(false)
  const scenario = SCENARIOS[active]
  const title = copyPrimed && active === 0 ? HERO_INITIAL_COPY.title : scenario.title
  const sub = copyPrimed && active === 0 ? HERO_INITIAL_COPY.sub : scenario.sub

  const submitHero = () => {
    if (!isPhoneComplete(phone)) {
      setPhoneErr(true)
      window.setTimeout(() => setPhoneErr(false), 1800)
      return
    }
    const payload = { phone: digitsOnly(phone), name, source: 'hero' as const, scenario: scenario.key }
    void payload
    setPhone('')
    const prev = 'Ваш телефон *'
    const input = document.getElementById('heroPhone') as HTMLInputElement | null
    if (input) {
      input.placeholder = '✓ Заявка отправлена'
      window.setTimeout(() => {
        input.placeholder = prev
      }, 2200)
    }
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-[22px] right-[-16px] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(215,180,105,.18),transparent_64%)]" />
      <div className="landing-form-card relative rounded-[28px] border border-[rgba(255,255,255,0.8)] bg-gradient-to-b from-[rgba(255,255,255,.98)] to-[rgba(250,253,255,.96)] p-[26px] shadow-landingLg">
        <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[10px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(215,180,105,.14)] px-[14px] py-[7px] text-[12px] font-bold tracking-[0.04em] text-[#8A6A25]">
            Горячий интент / urgent-first UX
          </span>
          <div className="rounded-full bg-[rgba(233,94,94,.1)] px-[12px] py-[9px] text-[12px] font-extrabold text-[#BE4A4A]">
            Свободные бригады: <LiveTeamsCount />
          </div>
        </div>

        <div className="text-[26px] font-extrabold leading-[1.08] tracking-[-0.04em] text-deep">{title}</div>
        <p className="mt-[10px] text-[15px] font-normal leading-[1.7] text-ink-muted">{sub}</p>

        <div className="mt-[18px] grid grid-cols-4 gap-[10px] max-lg:grid-cols-2 max-md:grid-cols-1">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                setActive(i)
                setCopyPrimed(false)
              }}
              className={`min-h-[48px] rounded-2xl border px-[14px] py-3 text-left shadow-xs transition-[transform,box-shadow] duration-[220ms] ease-out hover:-translate-y-0.5 hover:shadow-landing md:min-h-0 ${
                i === active
                  ? 'border-[rgba(16,185,129,0.35)] bg-gradient-to-b from-[rgba(16,185,129,0.10)] to-[rgba(255,255,255,0.95)] shadow-[0_16px_28px_rgba(16,185,129,0.12)]'
                  : 'border-line bg-gradient-to-b from-white to-[#F8FBFE]'
              }`}
            >
              <b className="block text-[13px] font-extrabold tracking-[-0.02em] text-deep-2">{s.labelShort}</b>
              <span className="mt-1 block text-[11px] font-bold leading-[1.45] text-ink-muted">{s.hint}</span>
            </button>
          ))}
        </div>

        <div className="mt-[14px] rounded-2xl border border-dashed border-[rgba(16,185,129,0.3)] bg-white px-[14px] py-3 text-[13px] font-semibold leading-[1.65] text-ink-muted">
          <b className="text-deep-2">Что усилили относительно прошлой версии:</b> сценарии перестали жить только в карточках ниже.
          Теперь разделение интентов начинается уже в hero-форме, то есть прямо в точке первого контакта.
        </div>

        <div className="mt-[18px] grid grid-cols-2 gap-[10px] max-md:grid-cols-1">
          <input
            id="heroName"
            className="input-mock"
            placeholder="Как к вам обращаться"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            id="heroPhone"
            className={`input-mock ${phoneErr ? 'input-mock-error' : ''}`}
            type="tel"
            inputMode="tel"
            placeholder="Ваш телефон *"
            value={phone}
            onChange={e => setPhone(formatRuPhoneInput(e.target.value))}
          />
        </div>

        <div className="mt-[10px] grid grid-cols-[1.1fr_0.9fr] gap-[10px] max-md:grid-cols-1">
          <button type="button" className="btn-primary-mock w-full" onClick={submitHero}>
            {scenario.cta}
          </button>
          <a className="btn-secondary-mock w-full text-center" href="#pricing">
            Посмотреть цены
          </a>
        </div>

        <div className="mt-[16px] grid grid-cols-3 gap-[10px] max-md:grid-cols-1">
          {['Телефон виден сразу', 'Форма без перегруза', 'Доверие рядом с CTA'].map(t => (
            <div
              key={t}
              className="rounded-2xl border border-line bg-surface-bg px-[10px] py-[11px] text-center text-xs font-bold leading-[1.45] text-ink-muted"
            >
              {t}
            </div>
          ))}
        </div>

        <SiteMessengerRowHero />

        <div className="mt-[14px] rounded-[18px] border border-line bg-gradient-to-b from-white to-[#F7FBFF] px-4 py-[14px] text-[13px] leading-[1.6] text-ink-muted">
          На уровне прототипа здесь уже заложены: микродоверие возле формы, явный срочный интент, возможность звонка без
          скролла и мостик к ценам для менее горячего пользователя.
        </div>

        <p className="mt-[14px] text-[12px] leading-[1.6] text-ink-muted-2">
          Нажимая кнопку, вы соглашаетесь с{' '}
          <a className="text-emerald-2 underline underline-offset-[3px]" href="/privacy">
            политикой конфиденциальности
          </a>{' '}
          и{' '}
          <a className="text-emerald-2 underline underline-offset-[3px]" href="/privacy">
            обработкой персональных данных
          </a>
          .
        </p>
      </div>
    </div>
  )
}
