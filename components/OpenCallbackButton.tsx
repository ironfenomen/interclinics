'use client'

import { CSSProperties, ReactNode } from 'react'

export default function OpenCallbackButton({
  children,
  style,
  className,
}: {
  children: ReactNode
  style?: CSSProperties
  className?: string
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const m = document.getElementById('callbackModal')
        if (m) {
          m.classList.add('open')
          document.body.style.overflow = 'hidden'
        }
      }}
      style={style}
    >
      {children}
    </button>
  )
}
