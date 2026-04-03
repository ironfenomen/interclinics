// components/CTASection.tsx
import { City } from '@/data/cities'
import LeadForm from './LeadForm'

export default function CTASection({ city }: { city: City }) {
  return (
    <section style={{ padding: '80px 0 88px', background: 'var(--deep)', textAlign: 'center' as const, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(16,185,129,.08) 0%,transparent 55%)', borderRadius: '50%' }} />
      <div className="ctr" style={{ position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontSize: 'clamp(24px, 5.5vw, 34px)', fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-.02em', textWrap: 'balance' }}>Не откладывайте — позвоните сейчас</h2>
        <p style={{ fontSize: 'clamp(15px, 3.2vw, 17px)', color: 'rgba(255,255,255,.4)', marginBottom: 32, lineHeight: 1.5 }}>Бесплатная консультация нарколога, круглосуточно</p>
        <a href={`tel:${city.phone}`} style={{ display: 'inline-block', fontSize: 'clamp(22px, 7vw, 40px)', fontWeight: 800, color: 'var(--em)', marginBottom: 26, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>
          {city.phoneDisplay}
        </a>
        <LeadForm city={city} variant="cta" />
      </div>
    </section>
  )
}
