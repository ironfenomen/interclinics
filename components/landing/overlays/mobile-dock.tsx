'use client'

import type { City } from '@/data/cities'
import { MobileStickyMessengerPick } from '@/components/MobileStickyMessengerPick'
import { CALLBACK_MODAL_TITLE } from '@/lib/callback-modal-copy'
import { SITE_WHATSAPP_HREF } from '@/lib/site-phone'
import { useLandingModal } from '../providers/landing-ui-context'

/** Параллель city mobile-bar: тот же full-bleed dock и сетка, что в mockup-literal .mobile-bar */
export function LandingMobileDock({ city }: { city: City }) {
  const { openModal } = useLandingModal()

  return (
    <>
      <div
        className="landing-mobile-bar fixed bottom-0 left-0 right-0 z-[80] hidden rounded-t-[20px] border border-b-0 border-white/[0.09] bg-gradient-to-b from-[rgba(10,24,42,0.97)] to-[rgba(6,17,32,0.992)] px-4 pb-[max(12px,env(safe-area-inset-bottom,0px))] pt-[11px] shadow-[0_-14px_44px_rgba(0,0,0,0.22),0_-6px_24px_rgba(6,17,32,0.38),inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-[22px] backdrop-saturate-[1.12] max-md:block"
        style={{ WebkitBackdropFilter: 'blur(22px) saturate(1.12)' }}
      >
        <div className="mx-auto grid w-full max-w-[640px] grid-cols-[minmax(0,1fr)_52px_52px] items-stretch gap-2.5">
          <a
            className="mobile-action flex min-h-[54px] items-center justify-center rounded-[17px] bg-gradient-to-b from-[#14DCA0] to-emerald-600 px-[18px] py-0 text-[15px] font-extrabold leading-[1.15] tracking-[-0.022em] text-white shadow-[0_10px_28px_rgba(16,185,129,0.33),inset_0_1px_0_rgba(255,255,255,0.15)] transition-[transform,filter] duration-200 ease-out active:scale-[0.987] active:brightness-[0.97]"
            href={`tel:${city.phone}`}
          >
            Позвонить сейчас
          </a>
          <MobileStickyMessengerPick variant="dock" />
          <button
            type="button"
            className="flex min-h-[54px] min-w-[52px] items-center justify-center rounded-[16px] border border-white/11 bg-gradient-to-b from-white/[0.11] to-white/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_0_rgba(0,0,0,0.1)] transition-transform duration-200 ease-out active:scale-[0.96]"
            onClick={openModal}
            aria-label={CALLBACK_MODAL_TITLE}
            title={CALLBACK_MODAL_TITLE}
          >
            <svg className="h-[22px] w-[22px]" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
            </svg>
          </button>
        </div>
      </div>

      <a
        className="landing-float-wa fixed z-[65] hidden h-[58px] min-h-[48px] w-[58px] min-w-[48px] items-center justify-center rounded-full bg-[#25D366] shadow-[0_18px_38px_rgba(37,211,102,0.36)] max-md:flex max-md:bottom-[calc(88px+max(12px,env(safe-area-inset-bottom,0px)))] max-md:right-[max(18px,env(safe-area-inset-right,0px))]"
        href={SITE_WHATSAPP_HREF}
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
