'use client'

import { useEffect, useState } from 'react'

const LS_KEY = 'interclinics-cookie'

export function CookieConsentBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      if (!window.localStorage.getItem(LS_KEY)) {
        const t = window.setTimeout(() => setVisible(true), 1800)
        return () => window.clearTimeout(t)
      }
    } catch {
      /* private mode */
    }
  }, [])

  const accept = () => {
    try {
      window.localStorage.setItem(LS_KEY, '1')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  const decline = () => {
    try {
      window.localStorage.setItem(LS_KEY, '0')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-[18px] left-[18px] z-[90] w-[min(460px,calc(100%-36px))] rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(7,20,35,0.92)] p-[18px] pb-4 text-[13px] leading-relaxed text-[rgba(255,255,255,0.76)] shadow-landingLg"
      role="dialog"
      aria-label="Согласие на cookie"
    >
      <p>
        Мы используем файлы cookie и при необходимости метрические сервисы, чтобы сайт работал стабильно и чтобы
        понимать, как посетители пользуются страницами (в обезличенном виде). Подробности — в{' '}
        <a className="text-white underline underline-offset-[3px]" href="/cookies">
          политике cookie и метрических сервисов
        </a>{' '}
        и в{' '}
        <a className="text-white underline underline-offset-[3px]" href="/privacy">
          политике в отношении персональных данных
        </a>
        . Продолжая пользоваться сайтом после показа этого уведомления или нажав «Принять», вы соглашаетесь с
        указанными документами в части cookie и аналитики.
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn-primary-mock rounded-[14px] px-3.5 py-3 text-[13px]" onClick={accept}>
          Принять
        </button>
        <button type="button" className="btn-dark-mock rounded-[14px] px-3.5 py-3 text-[13px]" onClick={decline}>
          Отклонить
        </button>
      </div>
    </div>
  )
}
