// components/CookieConsent.tsx
'use client'
import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('ic_cookies')) {
      setTimeout(() => setShow(true), 2500)
    }
  }, [])

  function accept() { localStorage.setItem('ic_cookies', '1'); setShow(false) }
  function decline() { localStorage.setItem('ic_cookies', '0'); setShow(false) }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 20, right: 20, maxWidth: 480,
      background: 'var(--deep)', color: 'rgba(255,255,255,.7)',
      padding: '18px 22px', borderRadius: 16, zIndex: 150,
      boxShadow: '0 8px 32px rgba(0,0,0,.3)', fontSize: 13, lineHeight: 1.6,
      animation: 'fadeUp .4s ease'
    }}>
      Мы используем файлы cookie и при необходимости метрические сервисы для стабильной работы сайта и обезличенной
      статистики. Подробнее — в{' '}
      <a href="/cookies" style={{ color: 'var(--em)', textDecoration: 'underline' }}>политике cookie</a>
      {' '}и{' '}
      <a href="/privacy" style={{ color: 'var(--em)', textDecoration: 'underline' }}>политике ПДн</a>.
      Продолжая пользоваться сайтом или нажав «Принять», вы соглашаетесь с ними в части cookie и аналитики.
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={accept} style={{ padding: '8px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', background: 'var(--em)', color: '#fff', border: 'none' }}>Принять</button>
        <button onClick={decline} style={{ padding: '8px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)', border: 'none' }}>Отклонить</button>
      </div>
    </div>
  )
}
