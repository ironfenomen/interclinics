'use client'

import { useMemo, useState } from 'react'
import type { City } from '@/data/cities'
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

function waHref(whatsapp: string) {
  return `https://wa.me/${whatsapp.replace(/\D/g, '')}`
}

export function HeroFormPanel({ city }: { city: City }) {
  const [active, setActive] = useState(0)
  const [copyPrimed, setCopyPrimed] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneErr, setPhoneErr] = useState(false)
  const scenario = SCENARIOS[active]
  const title = copyPrimed && active === 0 ? HERO_INITIAL_COPY.title : scenario.title
  const sub = copyPrimed && active === 0 ? HERO_INITIAL_COPY.sub : scenario.sub

  const tg = useMemo(() => {
    const h = city.telegram?.trim()
    if (!h) return 'https://t.me/'
    return h.startsWith('http') ? h : `https://t.me/${h.replace(/^@/, '')}`
  }, [city.telegram])

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
              className={`rounded-2xl border px-[14px] py-3 text-left shadow-xs transition-[transform,box-shadow] duration-[220ms] ease-out hover:-translate-y-0.5 hover:shadow-landing ${
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

        <div className="mt-[16px] flex gap-[10px] border-t border-line pt-[16px]">
          <a
            className="messenger flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-white p-[12px] text-[13px] font-extrabold text-deep-2"
            href={waHref(city.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.298-.018-.458.13-.606.135-.134.298-.347.447-.52.149-.174.198-.298.297-.497.099-.199.05-.372-.025-.521-.074-.148-.668-1.611-.916-2.206-.241-.579-.486-.5-.668-.51l-.571-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.214 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            WhatsApp
          </a>
          <a
            className="messenger flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-white p-[12px] text-[13px] font-extrabold text-deep-2"
            href={tg}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#2AABEE" aria-hidden>
              <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16c-.18 1.896-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.46-1.9-.903-1.056-.692-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.14a.506.506 0 0 1 .169.337c.016.11.036.317.02.49z" />
            </svg>
            Telegram
          </a>
        </div>

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
