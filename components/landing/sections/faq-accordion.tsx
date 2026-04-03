'use client'

import { useState } from 'react'
import type { FaqItemData } from '@/data/faq-landing'

export function FaqAccordion({ items }: { items: FaqItemData[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className="px-[26px] py-2.5 max-md:px-5">
      {items.map(item => {
        const open = openId === item.id
        return (
          <div key={item.id} className="border-b border-line">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
            >
              <span className="text-lg font-extrabold text-deep-2">
                <small className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.13em] text-ink-muted-2">
                  {item.kicker}
                </small>
                {item.question}
              </span>
              <span
                className={`flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                  open ? 'bg-emerald' : 'bg-surface-bg'
                }`}
              >
                <svg
                  className={`h-4 w-4 stroke-[1.5] transition-transform duration-200 ${open ? 'rotate-45 stroke-white' : 'stroke-ink-muted'}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden text-[15px] leading-[1.85] text-ink-muted transition-[max-height,padding] duration-300 ${
                open ? 'max-h-[320px] pb-5' : 'max-h-0'
              }`}
            >
              {item.answer}
            </div>
          </div>
        )
      })}
    </div>
  )
}
