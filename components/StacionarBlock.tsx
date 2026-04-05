'use client'

import { City, getCityBySlug } from '@/data/cities'

function openCallbackModal() {
  const m = document.getElementById('callbackModal')
  if (m) {
    m.classList.add('open')
    document.body.style.overflow = 'hidden'
  }
}

export default function StacionarBlock({ city }: { city: City }) {
  const nearest =
    city.hasStacionar || !city.nearestStacionarSlug
      ? null
      : getCityBySlug(city.nearestStacionarSlug)

  const programs = [
    {
      title: 'Детокс 3–5 дней',
      subtitle: 'Стабилизация, выведение токсинов',
      price: city.priceStacionarDetox,
      label: 'за курс',
    },
    {
      title: 'Стандарт 7–14 дней',
      subtitle: 'Терапия и наблюдение',
      price: city.priceStacionarStandard,
      label: 'за программу',
    },
    {
      title: 'Полный курс 14–21 день',
      subtitle: 'Комплексная программа',
      price: city.priceStacionarFull,
      label: 'за программу',
    },
  ]

  return (
    <section
      style={{
        padding: '72px 0',
        background: 'var(--deep)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: 480,
          height: 480,
          background: 'radial-gradient(circle,rgba(16,185,129,.08) 0%,transparent 65%)',
          borderRadius: '50%',
        }}
      />
      <div className="ctr" style={{ position: 'relative', zIndex: 2 }}>
        <div className="shdr" style={{ marginBottom: 36 }}>
          <div className="shdr__label" style={{ color: 'var(--em)' }}>
            Стационар 24/7
          </div>
          <h2 className="shdr__title" style={{ color: '#fff' }}>
            Наркологический стационар в&nbsp;{city.namePrep}
          </h2>
          <p className="shdr__desc" style={{ color: 'rgba(255,255,255,.45)' }}>
            Круглосуточное наблюдение, палаты, питание, детоксикация и терапия под наблюдением врача.
          </p>
        </div>

        {!city.hasStacionar && nearest && (
          <p
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,.65)',
              lineHeight: 1.7,
              maxWidth: 720,
              marginBottom: 28,
              padding: '16px 20px',
              background: 'rgba(255,255,255,.06)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,.08)',
            }}
          >
            Стационар для пациентов из {city.name} — в нашем центре в {nearest.namePrep}. Направление и логистику согласуют на линии.
          </p>
        )}

        {city.hasStacionar && city.stacionarAddress && (
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', marginBottom: 24 }}>
            {city.stacionarAddress}
            {typeof city.stacionarBeds === 'number' && ` · до ${city.stacionarBeds} коек`}
          </p>
        )}

        <div className="ic-grid-autofit-md" style={{ gap: 18, marginBottom: 32 }}>
          {programs.map(p => (
            <div
              key={p.title}
              style={{
                background: 'rgba(255,255,255,.06)',
                borderRadius: 16,
                padding: '24px 22px',
                border: '1px solid rgba(255,255,255,.1)',
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 16 }}>{p.subtitle}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>
                от{' '}
                <b style={{ fontSize: 26, fontWeight: 800, color: 'var(--em)' }}>
                  {p.price.toLocaleString('ru')} ₽
                </b>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>{p.label}</div>
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
              background: 'var(--em)',
              color: '#fff',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Записаться на госпитализацию
          </button>
        </div>
      </div>
    </section>
  )
}
