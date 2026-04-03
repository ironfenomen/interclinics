// components/FloatingWhatsApp.tsx
'use client'
import { City } from '@/data/cities'

export default function FloatingWhatsApp({ city }: { city: City }) {
  return (
    <a href={`https://wa.me/${city.whatsapp}`} target="_blank" rel="noopener"
      className="fwa-btn"
      style={{
        display: 'none', position: 'fixed',
        bottom: 'calc(86px + env(safe-area-inset-bottom, 0px))',
        right: 'max(20px, env(safe-area-inset-right, 0px))',
        width: 56, height: 56, minWidth: 48, minHeight: 48, background: '#25D366', borderRadius: '50%',
        boxShadow: '0 4px 16px rgba(37,211,102,.35)', zIndex: 90,
        alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        fontSize: 28, boxSizing: 'border-box',
      }}>
      💬
      <style jsx>{`@media(max-width:768px){.fwa-btn{display:flex!important}}`}</style>
    </a>
  )
}
