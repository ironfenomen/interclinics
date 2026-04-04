'use client'

// components/MobileBar.tsx — разметка и классы как в mockup-literal (mobile-bar / mobile-bar-inner / fab)
import { City } from '@/data/cities'

function openCallbackModal() {
  const modal = document.getElementById('callbackModal')
  if (modal) modal.classList.add('open')
  document.body.style.overflow = 'hidden'
}

export default function MobileBar({ city, variant }: { city: City; variant?: 'vyvod' | 'narkolog' | 'kodirovanie' | 'reabilitaciya' }) {
  const phoneCta =
    variant === 'vyvod' || variant === 'narkolog' || variant === 'kodirovanie' || variant === 'reabilitaciya'
      ? 'Позвонить'
      : 'Позвонить сейчас'
  const barMod =
    variant === 'narkolog' || variant === 'kodirovanie' || variant === 'reabilitaciya'
      ? ` mobile-bar--stacionar${variant === 'narkolog' ? ' mobile-bar--narkolog' : ''}${variant === 'kodirovanie' ? ' mobile-bar--kodirovanie' : ''}${variant === 'reabilitaciya' ? ' mobile-bar--reabilitaciya' : ''}`
      : ''
  const callbackAria = variant ? 'Заявка на госпитализацию — обратный звонок' : 'Обратный звонок'
  return (
    <div className={`mobile-bar${barMod}`}>
      <div className="mobile-bar-inner">
        <a className="mobile-action" href={`tel:${city.phone}`} aria-label={`${phoneCta}: ${city.phoneDisplay}`}>
          {phoneCta}
        </a>
        <a
          className="fab fab--wa"
          href={`https://wa.me/${city.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="#25D366" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.298-.018-.458.13-.606.135-.134.298-.347.447-.52.149-.174.198-.298.297-.497.099-.199.05-.372-.025-.521-.074-.148-.668-1.611-.916-2.206-.241-.579-.486-.5-.668-.51l-.571-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.214 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
        </a>
        <button type="button" className="fab" onClick={openCallbackModal} aria-label={callbackAria}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" aria-hidden>
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
