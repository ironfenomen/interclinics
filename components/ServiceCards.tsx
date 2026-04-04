// components/ServiceCards.tsx
import { City } from '@/data/cities'
import { Service } from '@/data/services'

export default function ServiceCards({ city, services }: { city: City; services: Service[] }) {
  return (
    <section style={{ padding: '72px 0', background: 'var(--bg)' }}>
      <div className="ctr">
        <div className="shdr">
          <div className="shdr__label">Наши услуги</div>
          <h2 className="shdr__title">Наркологическая помощь в&nbsp;{city.namePrep}</h2>
          <p className="shdr__desc">Полный спектр услуг на дому и в стационаре. Все врачи лицензированы.</p>
        </div>
        <div className="ic-service-grid">
          {services.map(svc => {
            const priceValue = (city as unknown as Record<string, unknown>)[svc.priceKey]
            const price = typeof priceValue === 'number' ? priceValue : city.priceBase
            return (
              <a href={`/${city.slug}/${svc.slug}/`} key={svc.slug} style={{
                background: '#fff', borderRadius: 16, padding: '28px 24px',
                border: '1px solid var(--b2)', transition: 'all .3s', display: 'block',
                textDecoration: 'none', color: 'inherit'
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: 'var(--em-glow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                    <path d={svc.iconPath} />
                  </svg>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--deep)', marginBottom: 7 }}>{svc.name}</div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, marginBottom: 16 }}>{svc.description}</div>
                <div style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 500 }}>
                  от <b style={{ fontSize: 20, fontWeight: 800, color: 'var(--deep)' }}>{price.toLocaleString('ru')} ₽</b>
                  {svc.priceLabel && ` ${svc.priceLabel}`}
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
