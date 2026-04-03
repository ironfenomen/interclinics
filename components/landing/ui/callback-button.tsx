'use client'

import type { ReactNode } from 'react'
import { useLandingModal } from '../providers/landing-ui-context'

type Props = { className?: string; children: ReactNode }

export function CallbackButton({ className, children }: Props) {
  const { openModal } = useLandingModal()
  return (
    <button type="button" className={className} onClick={openModal}>
      {children}
    </button>
  )
}
