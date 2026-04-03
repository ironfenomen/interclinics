'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLandingModal } from '../providers/landing-ui-context'
import { digitsOnly, formatRuPhoneInput, isPhoneComplete } from '../lib/phone-format'

export function ExitIntentOverlay() {
  const { openModalSuccess } = useLandingModal()
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState(false)
  const shownRef = useRef(false)

  useEffect(() => {
    const onOut = (e: MouseEvent) => {
      if (shownRef.current) return
      if (e.clientY <= 8) {
        shownRef.current = true
        setOpen(true)
        document.body.style.overflow = 'hidden'
      }
    }
    document.addEventListener('mouseout', onOut)
    return () => document.removeEventListener('mouseout', onOut)
  }, [])

  const closeExit = useCallback(() => {
    setOpen(false)
    document.body.style.overflow = ''
  }, [])

  const onPhone = (v: string) => setPhone(formatRuPhoneInput(v))

  const submit = () => {
    if (!isPhoneComplete(phone)) {
      setErr(true)
      window.setTimeout(() => setErr(false), 1800)
      return
    }
    const payload = { phone: digitsOnly(phone), source: 'exit-intent' as const }
    void payload
    // TODO: fetch /api/lead
    closeExit()
    openModalSuccess()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-[rgba(6,17,32,.72)] px-[18px] backdrop-blur-[8px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-overlay-title"
    >
      <div className="relative w-full max-w-[560px] rounded-[32px] border border-[rgba(226,232,241,.95)] bg-gradient-to-b from-white to-[#f8fbff] p-8 pb-[30px] shadow-landingLg [background:radial-gradient(circle_at_top_right,rgba(215,180,105,.14),transparent_20%),linear-gradient(180deg,#ffffff,#F8FBFF)]">
        <button
          type="button"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(226,232,240,.95)] text-[17px] font-semibold leading-none text-ink-muted-2 transition-colors hover:border-emerald-500/30 hover:text-deep-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          onClick={closeExit}
          aria-label="Закрыть"
        >
          ×
        </button>
        <h3
          id="exit-overlay-title"
          className="pr-10 text-[clamp(26px,4.2vw,34px)] font-extrabold leading-[1.08] tracking-tight text-deep-2"
        >
          Не уходите без бесплатной консультации
        </h3>
        <p className="mt-3.5 max-w-[46em] text-[15px] leading-[1.65] text-ink-muted">
          Если решение пока неясно, оставьте номер. Коротко перезвоним, спокойно уточним ситуацию и подскажем следующий шаг —
          без давления и лишних разговоров.
        </p>
        <div className="mt-[22px] grid grid-cols-2 gap-3 max-md:grid-cols-1">
          {[
            { key: 'short', label: 'Короткий разговор по делу' },
            { key: 'forms', label: 'Без длинных анкет' },
            { key: 'relative', label: 'Можно обратиться за близкого человека' },
            { key: 'rush', label: 'Без спешки с решением' },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="flex min-h-[3.25rem] items-center rounded-2xl border border-line bg-[rgba(248,250,252,.9)] px-3.5 py-2.5 text-[13px] font-semibold leading-snug tracking-tight text-ink"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="mt-[22px] grid grid-cols-[1fr_auto] gap-3 max-md:grid-cols-1">
          <input
            className={`input-mock ${err ? 'input-mock-error' : ''} focus:border-emerald-500/45 focus:shadow-[0_0_0_3px_rgba(16,185,129,.1)]`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Ваш телефон *"
            value={phone}
            onChange={e => onPhone(e.target.value)}
          />
          <button
            type="button"
            className="btn-primary-mock whitespace-nowrap rounded-[14px] px-[22px] py-3.5 font-bold max-md:w-full"
            onClick={submit}
          >
            Перезвоните мне
          </button>
        </div>
        <p className="mt-4 max-w-[42em] text-xs leading-[1.55] text-ink-muted-2">
          Обычно хватает короткого разговора, чтобы понять следующий шаг.
        </p>
      </div>
    </div>
  )
}
