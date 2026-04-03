'use client'

// components/MobileBar.tsx
import { City } from '@/data/cities'

export default function MobileBar({ city }: { city: City }) {
  return (
    <div style={{
      display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--deep)',
      padding: '10px max(16px, env(safe-area-inset-right)) calc(10px + env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))',
      zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,.3)',
      boxSizing: 'border-box',
    }} className="mobile-bar">
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <a href={`tel:${city.phone}`} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          padding: 14, background: 'var(--em)', color: '#fff', borderRadius: 12,
          fontWeight: 700, fontSize: 15, minHeight: 48
        }}>
          Позвонить
        </a>
        <a href={`https://wa.me/${city.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
          width: 52, minWidth: 48, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#25D366', color: '#fff', borderRadius: 12, fontSize: 22
        }} aria-label="WhatsApp">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.298-.018-.458.13-.606.135-.134.298-.347.447-.52.149-.174.198-.298.297-.497.099-.199.05-.372-.025-.521-.074-.148-.668-1.611-.916-2.206-.241-.579-.486-.5-.668-.51l-.571-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.214 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
        </a>
      </div>
      <style jsx>{`@media(max-width:768px){.mobile-bar{display:block!important}}`}</style>
    </div>
  )
}
