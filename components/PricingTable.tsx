'use client'

// components/PricingTable.tsx

import { City } from '@/data/cities'

export default function PricingTable({ city }: { city: City }) {
  const packages = [
    {
      name: 'Стандартная', desc: 'Запой до 3 дней, лёгкое похмелье',
      price: city.priceBase, dur: '1–1.5 часа', popular: false,
      features: ['Осмотр врачом-наркологом', 'Капельница 250 мл', 'Витамины группы B', 'Противорвотная терапия', 'Рекомендации на 3 дня']
    },
    {
      name: 'Усиленная', desc: 'Запой до недели, выраженные симптомы',
      price: city.priceEnhanced, dur: '2–3 часа', popular: true,
      features: ['Расширенный осмотр + ЭКГ', 'Двойная капельница 500 мл', 'Гепатопротекторы', 'Седативная терапия', 'Медикаменты на 5 дней', 'Контрольный звонок врача']
    },
    {
      name: 'Максимальная', desc: 'Длительный запой, тяжёлое состояние',
      price: city.priceMax, dur: '3–4 часа', popular: false,
      features: ['Полное обследование', 'Тройная капельница 750 мл', 'Нейро- и кардиопротекторы', 'Терапия на 7 дней', '2 визита врача', 'Консультация психотерапевта']
    },
  ]

  return (
    <section style={{ padding: '72px 0', background: 'var(--bg)' }}>
      <div className="ctr">
        <div className="shdr">
          <div className="shdr__label">Стоимость</div>
          <h2 className="shdr__title">Вывод из запоя — цены</h2>
          <p className="shdr__desc">Прозрачные цены без скрытых доплат. Окончательная стоимость — после осмотра врача.</p>
        </div>
        <div className="ic-pricing-grid">
          {packages.map((pkg, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 16, padding: '32px 24px',
              border: `2px solid ${pkg.popular ? 'var(--em)' : 'var(--b2)'}`,
              boxShadow: pkg.popular ? 'var(--sh-g)' : 'none',
              position: 'relative'
            }}>
              {pkg.popular && (
                <div style={{
                  position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--em)', color: '#fff', padding: '3px 16px', borderRadius: 100,
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.05em', whiteSpace: 'nowrap' as const
                }}>Чаще выбирают</div>
              )}
              <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--deep)', marginBottom: 4 }}>{pkg.name}</div>
              <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 18 }}>{pkg.desc}</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--deep)', marginBottom: 3 }}>
                {pkg.price.toLocaleString('ru')} ₽ <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--t3)' }}>/ выезд</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 20 }}>{pkg.dur}</div>
              <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                {pkg.features.map((f, fi) => (
                  <li key={fi} style={{ padding: '7px 0', fontSize: 13, color: 'var(--t2)', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--em)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { const m = document.getElementById('callbackModal'); if(m) m.classList.add('open'); document.body.style.overflow='hidden' }}
                style={{
                  display: 'block', width: '100%', padding: 13, textAlign: 'center' as const,
                  borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  background: pkg.popular ? 'var(--em)' : 'transparent',
                  color: pkg.popular ? '#fff' : 'var(--deep)',
                  border: `2px solid ${pkg.popular ? 'var(--em)' : 'var(--b1)'}`,
                  transition: 'all .25s'
                }}>
                Вызвать врача
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
