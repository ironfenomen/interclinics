'use client'

import type { City } from '@/data/cities'
import { useLandingModal } from '../providers/landing-ui-context'

function digits(s: string) {
  return s.replace(/\D/g, '')
}

export function LandingMobileDock({ city }: { city: City }) {
  const { openModal } = useLandingModal()
  const wa = `https://wa.me/${digits(city.whatsapp)}`

  return (
    <>
      <div className="landing-mobile-bar fixed bottom-3 left-3 right-3 z-[80] hidden rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(7,20,35,0.92)] p-2.5 shadow-landingLg backdrop-blur-[14px] max-md:block">
        <div className="grid grid-cols-[1fr_54px_54px] gap-2">
          <a
            className="mobile-action flex items-center justify-center rounded-2xl bg-gradient-to-b from-emerald to-emerald-2 py-3 text-[15px] font-extrabold text-white shadow-cta"
            href={`tel:${city.phone}`}
          >
            Позвонить сейчас
          </a>
          <a
            className="fab flex min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.08)]"
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.298-.018-.458.13-.606.135-.134.298-.347.447-.52.149-.174.198-.298.297-.497.099-.199.05-.372-.025-.521-.074-.148-.668-1.611-.916-2.206-.241-.579-.486-.5-.668-.51l-.571-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.214 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
          </a>
          <button
            type="button"
            className="fab flex items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.08)]"
            onClick={openModal}
            aria-label="Обратный звонок"
            title="Обратный звонок"
          >
            <svg className="h-[22px] w-[22px]" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
            </svg>
          </button>
        </div>
      </div>

      <a
        className="landing-float-wa fixed z-[65] hidden h-[58px] min-h-[48px] w-[58px] min-w-[48px] items-center justify-center rounded-full bg-[#25D366] shadow-[0_18px_38px_rgba(37,211,102,0.36)] max-md:flex max-md:bottom-[calc(94px+env(safe-area-inset-bottom,0px))] max-md:right-[max(18px,env(safe-area-inset-right,0px))]"
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <svg className="h-7 w-7 fill-white" viewBox="0 0 24 24" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.298-.018-.458.13-.606.135-.134.298-.347.447-.52.149-.174.198-.298.297-.497.099-.199.05-.372-.025-.521-.074-.148-.668-1.611-.916-2.206-.241-.579-.486-.5-.668-.51l-.571-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.214 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
      </a>
    </>
  )
}
