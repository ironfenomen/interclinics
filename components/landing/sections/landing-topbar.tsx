'use client'

import type { City } from '@/data/cities'
import { brigadePluralPhrase, TOPBAR_DISCLAIMER_SHORT, TOPBAR_MICRO_LINK, topbarTrustLine } from '@/lib/topbar'
import { useLiveTopbarTeams } from '../providers/landing-ui-context'

function LiveTopbarPill() {
  const teams = useLiveTopbarTeams()
  return (
    <>
      <span className="h-[7px] w-[7px] shrink-0 animate-pulse-dot rounded-full bg-[#42e0a6]" aria-hidden />
      <span className="whitespace-nowrap">
        Сейчас на линии: <b>{teams}</b> {brigadePluralPhrase(teams)}
      </span>
    </>
  )
}

export function LandingTopbar({ city }: { city: City }) {
  const trust = topbarTrustLine(city)
  return (
    <div className="mockup-topbar-bg border-b border-[rgba(255,255,255,0.055)] text-[rgba(255,255,255,0.68)] max-md:hidden">
      {/* Те же правила ширины, что у LandingSiteHeader: mockup-container + w-full max-w-full */}
      <div className="mockup-container landing-topbar-inner w-full max-w-full">
        <div className="landing-topbar-row text-[11px] leading-snug tracking-[0.01em]" role="group" aria-label="Информационная строка">
          <div className="topbar-slot-left">
            <div className="topbar-pill inline-flex h-[26px] items-center gap-[6px] whitespace-nowrap rounded-full bg-[rgba(16,185,129,0.11)] px-[11px] text-[11px] font-semibold text-[#e8fdf4]">
              <LiveTopbarPill />
            </div>
          </div>

          <div className="topbar-slot-center">
            <span className="topbar-trust" title={trust}>
              {trust}
            </span>
          </div>

          <div className="topbar-slot-right">
            <span className="topbar-disclaimer">{TOPBAR_DISCLAIMER_SHORT}</span>
            <a
              className="topbar-mini-link inline-flex h-[26px] items-center whitespace-nowrap rounded-[10px] px-[11px] text-[rgba(255,255,255,0.92)] transition-[background,opacity,color] duration-150 hover:bg-[rgba(255,255,255,0.07)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(16,185,129,0.45)]"
              href={TOPBAR_MICRO_LINK.href}
            >
              {TOPBAR_MICRO_LINK.label}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
