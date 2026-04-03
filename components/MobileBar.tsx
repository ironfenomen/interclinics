// components/MobileBar.tsx
'use client'
import { City } from '@/data/cities'

export default function MobileBar({ city }: { city: City }) {
  return (
    <div style={{
      display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--deep)', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
      zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,.3)'
    }} className="mobile-bar">
      <div style={{ display: 'flex', gap: 8 }}>
        <a href={`tel:${city.phone}`} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          padding: 14, background: 'var(--em)', color: '#fff', borderRadius: 12,
          fontWeight: 700, fontSize: 15
        }}>
          📞 Позвонить
        </a>
        <a href={`https://wa.me/${city.whatsapp}`} target="_blank" rel="noopener" style={{
          width: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#25D366', color: '#fff', borderRadius: 12, fontSize: 22
        }}>
          💬
        </a>
      </div>
      <style jsx>{`@media(max-width:768px){.mobile-bar{display:block!important}}`}</style>
    </div>
  )
}
