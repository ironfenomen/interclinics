'use client'

import type { CSSProperties, ReactNode } from 'react'
import { SITE_MAX_HREF, SITE_TELEGRAM_HREF, SITE_WHATSAPP_HREF } from '@/lib/site-phone'

/** Единые стили чипов в светлой форме (hero landing / LeadForm). */
const heroChipClass =
  'messenger flex min-h-[44px] min-w-0 items-center justify-center gap-1.5 rounded-2xl border border-line bg-white px-2 py-2.5 text-center text-[12px] font-extrabold leading-tight tracking-[-0.02em] text-deep-2 sm:gap-2 sm:px-3 sm:py-3 sm:text-[13px]'

function IconWa({ className }: { className?: string }) {
  return (
    <svg className={`shrink-0 h-4 w-4 sm:h-[17px] sm:w-[17px] ${className ?? ''}`} viewBox="0 0 24 24" fill="#25D366" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.298-.018-.458.13-.606.135-.134.298-.347.447-.52.149-.174.198-.298.297-.497.099-.199.05-.372-.025-.521-.074-.148-.668-1.611-.916-2.206-.241-.579-.486-.5-.668-.51l-.571-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.214 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
  )
}

function IconTg({ className }: { className?: string }) {
  return (
    <svg className={`shrink-0 h-4 w-4 sm:h-[17px] sm:w-[17px] ${className ?? ''}`} viewBox="0 0 24 24" fill="#2AABEE" aria-hidden>
      <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16c-.18 1.896-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.46-1.9-.903-1.056-.692-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.14a.506.506 0 0 1 .169.337c.016.11.036.317.02.49z" />
    </svg>
  )
}

function IconMax({ className }: { className?: string }) {
  return (
    <svg className={`shrink-0 h-4 w-4 sm:h-[17px] sm:w-[17px] ${className ?? ''}`} viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="#818CF8" />
      <path
        fill="#fff"
        d="M7.25 17V7.35h1.45l2.8 6.95 2.8-6.95H16V17h-1.35v-6.1l-2.45 6.1h-1.4l-2.45-6.1V17H7.25Z"
      />
    </svg>
  )
}

function Chip({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: ReactNode
}) {
  return (
    <a className={heroChipClass} href={href} target="_blank" rel="noopener noreferrer">
      {icon}
      <span className="truncate">{label}</span>
    </a>
  )
}

/** Ряд под hero-формой (Tailwind / city landing прототип). */
export function SiteMessengerRowHero() {
  return (
    <div className="mt-4 grid w-full grid-cols-3 gap-2 border-t border-line pt-4 max-[340px]:grid-cols-1 sm:gap-2.5">
      <Chip href={SITE_WHATSAPP_HREF} label="WhatsApp" icon={<IconWa />} />
      <Chip href={SITE_TELEGRAM_HREF} label="Telegram" icon={<IconTg />} />
      <Chip href={SITE_MAX_HREF} label="Max" icon={<IconMax />} />
    </div>
  )
}

const leadGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 8,
  marginTop: 8,
  width: '100%',
}

const leadChipStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
  minHeight: 42,
  padding: '9px 5px',
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 700,
  border: '1px solid var(--b1)',
  background: '#fff',
  color: '#0B1D35',
  textDecoration: 'none',
  lineHeight: 1.2,
  textAlign: 'center',
}

/** Блок под формой LeadForm (inline-стили как в макете сервисных страниц). */
export function SiteMessengerRowLeadForm() {
  return (
    <div
      style={{
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid var(--b2)',
        width: '100%',
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: 11,
          color: 'var(--t3)',
          fontWeight: 500,
          marginBottom: 2,
        }}
      >
        Или напишите:
      </span>
      <div style={leadGridStyle}>
        <a href={SITE_WHATSAPP_HREF} target="_blank" rel="noopener" style={leadChipStyle}>
          <IconWa className="!h-[14px] !w-[14px]" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>WhatsApp</span>
        </a>
        <a href={SITE_TELEGRAM_HREF} target="_blank" rel="noopener" style={leadChipStyle}>
          <IconTg className="!h-[14px] !w-[14px]" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Telegram</span>
        </a>
        <a href={SITE_MAX_HREF} target="_blank" rel="noopener" style={leadChipStyle}>
          <IconMax className="!h-[14px] !w-[14px]" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Max</span>
        </a>
      </div>
    </div>
  )
}
