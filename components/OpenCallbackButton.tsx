'use client'

import { CSSProperties, ReactNode } from 'react'

export default function OpenCallbackButton({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <button
      type="button"
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
