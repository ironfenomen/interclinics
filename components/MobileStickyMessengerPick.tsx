'use client'

import { useCallback, useEffect, useId, useState, type ReactNode } from 'react'
import { SITE_MAX_HREF, SITE_TELEGRAM_HREF, SITE_WHATSAPP_HREF } from '@/lib/site-phone'

export type MobileStickyMessengerPickVariant = 'literal' | 'dock'

function MessengerHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3l-4 3v-3Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Единый размер глифа внутри колодца (24 viewBox). */
const GLYPH = 'h-[19px] w-[19px]'

function IconWell({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-inset ring-white/[0.09]">
      {children}
    </span>
  )
}

function IconWhatsApp() {
  return (
    <svg className={GLYPH} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fill="#25D366"
        d="M12.04 2c5.46 0 9.9 4.44 9.9 9.9 0 5.46-4.44 9.9-9.9 9.9a9.86 9.86 0 0 1-5.05-1.38L2 22l1.62-4.74A9.86 9.86 0 0 1 2.14 11.9C2.14 6.44 6.58 2 12.04 2Zm0 1.8c-4.47 0-8.1 3.63-8.1 8.1 0 1.59.46 3.08 1.25 4.34l-.09 2.66 2.7-.87a8.28 8.28 0 0 0 4.24 1.17c4.47 0 8.1-3.63 8.1-8.1s-3.63-8.1-8.1-8.1Zm4.42 11.35c-.19-.1-1.14-.56-1.31-.62-.18-.07-.31-.1-.44.1-.13.19-.5.62-.62.75-.11.13-.23.14-.42.05-.19-.1-.8-.3-1.53-.94-.56-.5-.94-1.12-1.05-1.31-.11-.19-.01-.29.08-.38.08-.08.19-.23.28-.35.09-.11.13-.19.19-.32.06-.13.03-.24-.02-.34-.05-.1-.44-1.07-.6-1.46-.16-.38-.33-.33-.44-.34-.11-.01-.24-.01-.37-.01-.13 0-.34.05-.52.24-.18.19-.68.67-.68 1.63s.7 1.89.79 2.02c.1.13 1.37 2.09 3.31 2.93.46.2.82.32 1.1.41.46.15.88.13 1.21.08.37-.06 1.14-.47 1.3-.92.16-.46.16-.85.11-.92-.05-.08-.18-.13-.37-.22Z"
      />
    </svg>
  )
}

function IconTelegram() {
  return (
    <svg className={GLYPH} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#2AABEE"
        d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16c-.18 1.896-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.46-1.9-.903-1.056-.692-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.14a.506.506 0 0 1 .169.337c.016.11.036.317.02.49z"
      />
    </svg>
  )
}

function IconMax() {
  return (
    <svg className={GLYPH} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="#818CF8" />
      <path
        d="M7.25 17V7.35h1.45l2.8 6.95 2.8-6.95H16V17h-1.35v-6.1l-2.45 6.1h-1.4l-2.45-6.1V17H7.25Z"
        fill="#fff"
      />
    </svg>
  )
}

const menuItemBase =
  'group/menu-item flex min-h-[48px] items-center gap-2.5 rounded-[13px] px-2 py-1.5 text-left outline-none transition-[background-color,transform] duration-200 ease-out [-webkit-tap-highlight-color:transparent] hover:bg-white/[0.06] active:bg-white/[0.1] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#10B981]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#081424]'

const menuLabelClass =
  'min-w-0 flex-1 text-[14px] font-medium leading-[1.25] tracking-[-0.012em] text-white/[0.9]'

/** Панель: те же градиент / blur / скругление, что у .mobile-bar — продолжение dock. */
const menuPanelClass =
  [
    'ic-msger-panel absolute z-[100] w-[min(218px,calc(100vw-32px))]',
    'left-1/2 -translate-x-1/2',
    'bottom-[calc(100%+4px)]',
    'rounded-[20px]',
    'border border-white/[0.09]',
    'bg-gradient-to-b from-[rgba(10,24,42,0.97)] to-[rgba(6,17,32,0.992)]',
    'backdrop-blur-[22px] backdrop-saturate-[1.12]',
    'shadow-[0_-6px_24px_rgba(6,17,32,0.35),0_16px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.07)_inset,0_0_0_1px_rgba(0,0,0,0.12)_inset,0_-8px_28px_rgba(16,185,129,0.07)]',
    'p-1.5',
  ].join(' ')

export function MobileStickyMessengerPick({ variant }: { variant: MobileStickyMessengerPickVariant }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen(o => !o), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const triggerClass =
    variant === 'literal'
      ? 'fab fab--wa ic-msger-trigger'
      : 'flex min-h-[54px] min-w-[52px] items-center justify-center rounded-[16px] border border-white/11 bg-gradient-to-b from-white/[0.11] to-white/[0.055] text-[#3EE08F] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_0_rgba(0,0,0,0.1)] transition-[transform,background-color,border-color] duration-200 ease-out active:scale-[0.96]'

  const iconClass = variant === 'literal' ? 'h-[22px] w-[22px]' : 'h-[22px] w-[22px]'

  const rootClass =
    variant === 'literal'
      ? 'ic-msger-root'
      : 'flex min-h-[54px] min-w-[52px] flex-1 items-stretch justify-center'

  return (
    <div className={rootClass}>
      {open && (
        <div
          className="ic-msger-backdrop fixed inset-0 z-[70] bg-[#0B1D35]/50 backdrop-blur-[2px] motion-reduce:backdrop-blur-none"
          aria-hidden
          onClick={close}
        />
      )}
      <div className="relative z-[10] flex h-full min-h-0 w-full min-w-0 flex-1 items-stretch justify-center">
        <button
          type="button"
          className={triggerClass}
          aria-label="Выбрать мессенджер"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={menuId}
          onClick={toggle}
        >
          <MessengerHubIcon className={iconClass} />
        </button>
        {open && (
          <div
            id={menuId}
            role="menu"
            aria-label="Мессенджеры"
            className={menuPanelClass}
          >
            <div className="flex flex-col gap-0.5">
              <a
                role="menuitem"
                className={menuItemBase}
                href={SITE_WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
              >
                <IconWell>
                  <IconWhatsApp />
                </IconWell>
                <span className={menuLabelClass}>WhatsApp</span>
              </a>
              <a
                role="menuitem"
                className={menuItemBase}
                href={SITE_TELEGRAM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
              >
                <IconWell>
                  <IconTelegram />
                </IconWell>
                <span className={menuLabelClass}>Telegram</span>
              </a>
              <a
                role="menuitem"
                className={menuItemBase}
                href={SITE_MAX_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
              >
                <IconWell>
                  <IconMax />
                </IconWell>
                <span className={menuLabelClass}>Max</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
