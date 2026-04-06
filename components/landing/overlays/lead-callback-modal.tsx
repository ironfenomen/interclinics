'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CALLBACK_MODAL_CONSENT_PREFIX,
  CALLBACK_MODAL_LEAD,
  CALLBACK_MODAL_PLACEHOLDER_NAME,
  CALLBACK_MODAL_PLACEHOLDER_PHONE,
  CALLBACK_MODAL_PRIVACY_LINK_TEXT,
  CALLBACK_MODAL_SUBMIT_LABEL,
  CALLBACK_MODAL_SUCCESS_TEXT,
  CALLBACK_MODAL_SUCCESS_TITLE,
  CALLBACK_MODAL_TITLE,
} from '@/lib/callback-modal-copy'
import { useLandingModal } from '../providers/landing-ui-context'
import { digitsOnly, formatRuPhoneInput, isPhoneComplete } from '../lib/phone-format'

/**
 * Модалка по UX мокапа. Сеть: заглушка (TODO: POST /api/lead).
 */
export function LeadCallbackModal() {
  const { modalOpen, modalView, closeModal, setModalSuccessView } = useLandingModal()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneErr, setPhoneErr] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const resetForm = useCallback(() => {
    setName('')
    setPhone('')
    setPhoneErr(false)
  }, [])

  useEffect(() => {
    if (!modalOpen) {
      resetForm()
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalOpen, resetForm])

  const handleClose = useCallback(() => {
    closeModal()
    resetForm()
  }, [closeModal, resetForm])

  const onPhoneInput = (v: string) => setPhone(formatRuPhoneInput(v))

  const sendStub = useCallback(() => {
    const payload = { phone: digitsOnly(phone), name, source: 'modal' as const }
    void payload
    // TODO: fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  }, [phone, name])

  useEffect(() => {
    if (!modalOpen || modalView !== 'success') return
    const t = window.setTimeout(handleClose, 2200)
    return () => window.clearTimeout(t)
  }, [modalOpen, modalView, handleClose])

  if (!modalOpen) return null

  const showSuccess = modalView === 'success'

  const onSubmit = () => {
    if (!isPhoneComplete(phone)) {
      setPhoneErr(true)
      window.setTimeout(() => setPhoneErr(false), 1800)
      return
    }
    sendStub()
    setModalSuccessView()
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(6,17,32,.64)] px-[18px] backdrop-blur-[7px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={e => {
        if (e.target === overlayRef.current) handleClose()
      }}
    >
      <div className="relative my-auto max-h-[88dvh] w-full max-w-[480px] overflow-y-auto overscroll-contain rounded-[30px] bg-white p-7 shadow-landingLg">
        <button
          type="button"
          className="absolute right-3 top-3 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-surface-bg text-lg font-extrabold text-ink-muted-2 sm:right-4 sm:top-4"
          onClick={handleClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        {!showSuccess ? (
          <div>
            <h3 id="modal-title" className="text-[28px] font-extrabold leading-tight tracking-tight text-deep-2">
              {CALLBACK_MODAL_TITLE}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{CALLBACK_MODAL_LEAD}</p>
            <div className="mt-[18px] grid gap-2.5">
              <input
                className="input-mock"
                placeholder={CALLBACK_MODAL_PLACEHOLDER_NAME}
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                className={`input-mock ${phoneErr ? 'input-mock-error' : ''}`}
                type="tel"
                inputMode="tel"
                placeholder={CALLBACK_MODAL_PLACEHOLDER_PHONE}
                value={phone}
                onChange={e => onPhoneInput(e.target.value)}
              />
              <button type="button" className="btn-primary-mock w-full" onClick={onSubmit}>
                {CALLBACK_MODAL_SUBMIT_LABEL}
              </button>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-ink-muted-2">
              {CALLBACK_MODAL_CONSENT_PREFIX}{' '}
              <a className="text-emerald-2 underline underline-offset-[3px]" href="/privacy">
                {CALLBACK_MODAL_PRIVACY_LINK_TEXT}
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="px-2.5 pb-2 pt-[18px] text-center">
            <div className="mx-auto mb-3.5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(16,185,129,.12)] text-[30px] font-extrabold text-emerald">
              ✓
            </div>
            <h3 className="text-[28px] font-extrabold leading-tight tracking-tight text-deep-2">
              {CALLBACK_MODAL_SUCCESS_TITLE}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{CALLBACK_MODAL_SUCCESS_TEXT}</p>
          </div>
        )}
      </div>
    </div>
  )
}
