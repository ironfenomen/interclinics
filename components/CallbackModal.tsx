// components/CallbackModal.tsx
'use client'
import { useState, useRef } from 'react'
import { City } from '@/data/cities'

export default function CallbackModal({ city }: { city: City }) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handlePhone(value: string) {
    let d = value.replace(/\D/g, '')
    if (d.length > 11) d = d.slice(0, 11)
    if (!d) { setPhone(''); return }
    if (d[0] === '7' || d[0] === '8') d = d.slice(1)
    let f = '+7 ('
    if (d.length > 0) f += d.slice(0, 3)
    if (d.length >= 3) f += ') ' + d.slice(3, 6)
    if (d.length >= 6) f += '-' + d.slice(6, 8)
    if (d.length >= 8) f += '-' + d.slice(8, 10)
    setPhone(f); setError(false)
  }

  function submit() {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) { setError(true); inputRef.current?.focus(); return }
    console.log('LEAD (modal):', { phone: digits, city: city.slug })
    setSent(true)
    setTimeout(() => { close(); setSent(false); setPhone('') }, 3000)
  }

  function close() {
    const overlay = document.getElementById('callbackModal')
    if (overlay) overlay.classList.remove('open')
    document.body.style.overflow = ''
  }

  return (
    <div id="callbackModal" onClick={e => { if ((e.target as HTMLElement).id === 'callbackModal') close() }}
      style={{
        display: 'none', position: 'fixed', inset: 0,
        background: 'rgba(11,29,53,.7)', backdropFilter: 'blur(4px)',
        zIndex: 200, alignItems: 'center', justifyContent: 'center',
        padding: 'max(20px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left))',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        boxSizing: 'border-box',
      }}
      className="callback-overlay"
    >
      <div style={{
        background: '#fff', borderRadius: 24, padding: '36px 32px', maxWidth: 420, width: '100%', position: 'relative', animation: 'fadeUp .3s ease',
        maxHeight: 'min(88dvh, calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 40px))',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}>
        <div onClick={close} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          ✕
        </div>

        {!sent ? (
          <>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--deep)', marginBottom: 6 }}>Обратный звонок</div>
            <div style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 20 }}>Перезвоним через 30 секунд. Бесплатно.</div>
            <input ref={inputRef} className={`fi ${error ? 'fi--err' : ''}`} type="tel" placeholder="Ваш телефон *" value={phone} onChange={e => handlePhone(e.target.value)} style={{ marginBottom: 12 }} />
            <button className="fbtn" onClick={submit}>Жду звонка</button>
            <p style={{ marginTop: 10, fontSize: 11, color: 'var(--t3)', textAlign: 'center' as const, lineHeight: 1.5 }}>
              Нажимая кнопку, вы соглашаетесь с <a href="/privacy/" style={{ color: 'var(--em-d)', textDecoration: 'underline' }}>политикой конфиденциальности</a>
            </p>
          </>
        ) : (
          <div style={{ textAlign: 'center' as const, padding: '20px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--em-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: 'var(--em)' }}>✓</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--deep)', marginBottom: 6 }}>Заявка отправлена!</h3>
            <p style={{ fontSize: 14, color: 'var(--t2)' }}>Нарколог перезвонит через 30 секунд</p>
          </div>
        )}
      </div>
      <style jsx>{`.callback-overlay.open{display:flex!important}`}</style>
    </div>
  )
}
