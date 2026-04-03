'use client'

import { useState } from 'react'
import type { City } from '@/data/cities'
import { digitsOnly, formatRuPhoneInput, isPhoneComplete } from '../lib/phone-format'

export function FinalLeadForm({ city }: { city: City }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState(false)

  const submit = () => {
    if (!isPhoneComplete(phone)) {
      setErr(true)
      window.setTimeout(() => setErr(false), 1800)
      return
    }
    void { phone: digitsOnly(phone), name, source: 'final', city: city.slug }
    // TODO: POST /api/lead
    setPhone('')
    const el = document.getElementById('finalPhone') as HTMLInputElement | null
    if (el) {
      const prev = 'Ваш телефон *'
      el.placeholder = '✓ Заявка отправлена'
      window.setTimeout(() => {
        el.placeholder = prev
      }, 2200)
    }
  }

  return (
    <div className="mx-auto mt-7 grid max-w-[760px] grid-cols-[1fr_1fr_auto] gap-2.5 rounded-[26px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.07)] p-3.5 backdrop-blur-[10px] max-md:grid-cols-1">
      <input
        className="input-mock bg-[rgba(255,255,255,.96)]"
        placeholder="Как к вам обращаться"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        id="finalPhone"
        className={`input-mock bg-[rgba(255,255,255,.96)] ${err ? 'input-mock-error' : ''}`}
        type="tel"
        inputMode="tel"
        placeholder="Ваш телефон *"
        value={phone}
        onChange={e => setPhone(formatRuPhoneInput(e.target.value))}
      />
      <button type="button" className="btn-primary-mock px-5 max-md:w-full" onClick={submit}>
        Жду звонка
      </button>
    </div>
  )
}
