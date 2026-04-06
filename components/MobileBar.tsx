'use client'

// components/MobileBar.tsx — разметка и классы как в mockup-literal (mobile-bar / mobile-bar-inner / fab)
import { MobileStickyMessengerPick } from '@/components/MobileStickyMessengerPick'
import { City } from '@/data/cities'
import { CALLBACK_MODAL_TITLE } from '@/lib/callback-modal-copy'

function openCallbackModal() {
  const modal = document.getElementById('callbackModal')
  if (modal) modal.classList.add('open')
  document.body.style.overflow = 'hidden'
}

export default function MobileBar({ city, variant }: { city: City; variant?: 'vyvod' | 'narkolog' | 'kodirovanie' | 'reabilitaciya' }) {
  /* Как на городской главной (mockup mobile-bar + LandingMobileDock): одна подпись у кнопки звонка */
  const phoneCta = 'Позвонить сейчас'
  const barMod =
    variant === 'narkolog' || variant === 'kodirovanie' || variant === 'reabilitaciya'
      ? ` mobile-bar--stacionar${variant === 'narkolog' ? ' mobile-bar--narkolog' : ''}${variant === 'kodirovanie' ? ' mobile-bar--kodirovanie' : ''}${variant === 'reabilitaciya' ? ' mobile-bar--reabilitaciya' : ''}`
      : ''
  const callbackLabel = CALLBACK_MODAL_TITLE
  return (
    <div className={`mobile-bar${barMod}`}>
      <div className="mobile-bar-inner">
        <a className="mobile-action" href={`tel:${city.phone}`} aria-label={`${phoneCta}: ${city.phoneDisplay}`}>
          {phoneCta}
        </a>
        <MobileStickyMessengerPick variant="literal" />
        <button type="button" className="fab" onClick={openCallbackModal} aria-label={callbackLabel} title={callbackLabel}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" aria-hidden>
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
