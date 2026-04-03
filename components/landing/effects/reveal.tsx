'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = { children: ReactNode; className?: string }

export function Reveal({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.13 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`translate-y-[24px] opacity-0 transition-[opacity,transform] duration-[700ms] [transition-timing-function:ease] ${
        visible ? 'translate-y-0 opacity-100' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
