'use client'

// components/CallbackModal.tsx
import { useState, useRef } from 'react'
import { City } from '@/data/cities'
import {
  CALLBACK_MODAL_CONSENT_PREFIX,
  CALLBACK_MODAL_LEAD,
  CALLBACK_MODAL_PLACEHOLDER_PHONE,
  CALLBACK_MODAL_PRIVACY_LINK_TEXT,
  CALLBACK_MODAL_SUBMIT_LABEL,
  CALLBACK_MODAL_SUCCESS_TEXT,
  CALLBACK_MODAL_SUCCESS_TITLE,
  CALLBACK_MODAL_TITLE,
} from '@/lib/callback-modal-copy'
import styles from './CallbackModal.module.css'

export default function CallbackModal({ city }: { city: City }) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handlePhone(value: string) {
    let d = value.replace(/\D/g, '')
    if (d.length > 11) d = d.slice(0, 11)
    if (!d) {
      setPhone('')
      return
    }
    if (d[0] === '7' || d[0] === '8') d = d.slice(1)
    let f = '+7 ('
    if (d.length > 0) f += d.slice(0, 3)
    if (d.length >= 3) f += ') ' + d.slice(3, 6)
    if (d.length >= 6) f += '-' + d.slice(6, 8)
    if (d.length >= 8) f += '-' + d.slice(8, 10)
    setPhone(f)
    setError(false)
  }

  async function submit() {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      setError(true)
      inputRef.current?.focus()
      return
    }
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: digits,
          city: city.slug,
          source: 'modal:callback',
          leadType: 'general',
        }),
      })
    } catch {
      console.warn('LEAD (modal offline/fallback):', { phone: digits, city: city.slug })
    }
    setSent(true)
    setTimeout(() => {
      close()
      setSent(false)
      setPhone('')
    }, 3000)
  }

  function close() {
    const overlay = document.getElementById('callbackModal')
    if (overlay) overlay.classList.remove('open')
    document.body.style.overflow = ''
  }

  return (
    <div
      id="callbackModal"
      className={`${styles.overlay} callback-overlay`}
      onClick={e => {
        if ((e.target as HTMLElement).id === 'callbackModal') close()
      }}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={sent ? 'callback-success-title' : 'callback-modal-title'}
      >
        <button type="button" className={styles.close} aria-label="Закрыть" onClick={close}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {!sent ? (
          <>
            <div className={styles.head}>
              <h2 id="callback-modal-title" className={styles.title}>
                {CALLBACK_MODAL_TITLE}
              </h2>
              <p className={styles.lead}>{CALLBACK_MODAL_LEAD}</p>
            </div>

            <div className={styles.form}>
              <input
                ref={inputRef}
                className={`fi ${error ? 'fi--err' : ''} ${styles.telInput}`}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={CALLBACK_MODAL_PLACEHOLDER_PHONE}
                value={phone}
                onChange={e => handlePhone(e.target.value)}
                aria-invalid={error}
              />
              <button type="button" className={styles.cta} onClick={submit}>
                {CALLBACK_MODAL_SUBMIT_LABEL}
              </button>
              <p className={styles.microcopy}>
                {CALLBACK_MODAL_CONSENT_PREFIX}{' '}
                <a href="/privacy/">{CALLBACK_MODAL_PRIVACY_LINK_TEXT}</a>
              </p>
            </div>
          </>
        ) : (
          <div className={styles.success}>
            <div className={styles.successIcon} aria-hidden>
              ✓
            </div>
            <h3 id="callback-success-title" className={styles.successTitle}>
              {CALLBACK_MODAL_SUCCESS_TITLE}
            </h3>
            <p className={styles.successText}>{CALLBACK_MODAL_SUCCESS_TEXT}</p>
          </div>
        )}
      </div>
    </div>
  )
}
