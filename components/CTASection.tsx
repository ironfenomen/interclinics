// components/CTASection.tsx
import { City } from '@/data/cities'
import LeadForm from './LeadForm'

export default function CTASection({ city }: { city: City }) {
  return (
    <section style={{ padding: '72px 0', background: 'var(--deep)', textAlign: 'center' as const, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(16,185,129,.08) 0%,transparent 55%)', borderRadius: '50%' }} />
      <div className="ctr" style={{ position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-.02em' }}>Не откладывайте — позвоните сейчас</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.4)', marginBottom: 32 }}>Бесплатная консультация нарколога, круглосуточно</p>
        <a href={`tel:${city.phone}`} style={{ display: 'inline-block', fontSize: 40, fontWeight: 800, color: 'var(--em)', marginBottom: 26, letterSpacing: '-.02em' }}>
          {city.phoneDisplay}
        </a>
        <LeadForm city={city} variant="cta" />
      </div>
    </section>
  )
}
