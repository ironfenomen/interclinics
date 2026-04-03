'use client'

import { City } from '@/data/cities'

function openCallbackModal() {
  const m = document.getElementById('callbackModal')
  if (m) {
    m.classList.add('open')
    document.body.style.overflow = 'hidden'
  }
}

export default function RehabBlock({ city }: { city: City }) {
  const cards = [
    {
      title: '28 дней',
      subtitle: 'Базовая программа адаптации',
      price: city.priceRehab28,
      label: 'за программу',
    },
    {
      title: '90 дней',
      subtitle: 'Углублённое восстановление',
      price: city.priceRehab90,
      label: 'за программу',
    },
    {
      title: '6 месяцев',
      subtitle: 'Длительная программа поддержки',
      price: city.priceRehab6Mo,
      label: 'за программу',
    },
  ]

  return (
    <section style={{ padding: '72px 0', background: '#fff', borderTop: '1px solid var(--b1)' }}>
      <div className="ctr">
        <div className="shdr">
          <div className="shdr__label">Реабилитация</div>
          <h2 className="shdr__title">Программы психосоциального восстановления</h2>
          <p className="shdr__desc">
            Индивидуальная и групповая работа, адаптация к трезвой жизни
            {city.rehabProgram && ` · ${city.rehabProgram}`}.
            Сутки — от {city.priceRehabDay.toLocaleString('ru')} ₽.
          </p>
        </div>

        {city.hasRehab && city.rehabAddress && (
          <p style={{ fontSize: 14, color: 'var(--t2)', marginBottom: 28, textAlign: 'center' as const }}>
            {city.rehabAddress}
          </p>
        )}

        {!city.hasRehab && (
          <p
            style={{
              fontSize: 15,
              color: 'var(--t2)',
              lineHeight: 1.7,
              maxWidth: 680,
              margin: '0 auto 28px',
              textAlign: 'center' as const,
            }}
          >
            Программы реабилитации для жителей {city.nameGen} проходят в нашем центре в Ставрополе. Уточните сроки и
            формат — подберём вариант под вашу ситуацию.
          </p>
        )}

        <div className="ic-grid-autofit-sm" style={{ gap: 18, marginBottom: 32 }}>
          {cards.map(c => (
            <div
              key={c.title}
              style={{
                background: 'var(--bg)',
                borderRadius: 16,
                padding: '26px 22px',
                border: '1px solid var(--b2)',
                boxShadow: '0 1px 0 rgba(15,23,42,.04)',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--deep)', marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 16, lineHeight: 1.5 }}>{c.subtitle}</div>
              <div style={{ fontSize: 13, color: 'var(--t3)' }}>
                от{' '}
                <b style={{ fontSize: 24, fontWeight: 800, color: 'var(--deep)' }}>
                  {c.price.toLocaleString('ru')} ₽
                </b>
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' as const }}>
          <button
            type="button"
            onClick={openCallbackModal}
            style={{
              display: 'inline-block',
              padding: '16px 36px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: '#fff',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Получить консультацию по реабилитации
          </button>
        </div>
      </div>
    </section>
  )
}
