'use client'

import { City } from '@/data/cities'
import { CALLBACK_MODAL_TITLE } from '@/lib/callback-modal-copy'

function openCallbackModal() {
  const m = document.getElementById('callbackModal')
  if (m) {
    m.classList.add('open')
    document.body.style.overflow = 'hidden'
  }
}

export default function MidCTA({ city }: { city: City }) {
  return (
    <section
      style={{
        padding: '22px 0',
        background: 'linear-gradient(90deg, rgba(16,185,129,.12), rgba(16,185,129,.04))',
        borderTop: '1px solid rgba(16,185,129,.2)',
        borderBottom: '1px solid rgba(16,185,129,.15)',
      }}
    >
      <div className="ctr">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap' as const,
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--deep)', lineHeight: 1.45, flex: '1 1 280px' }}>
            Бесплатная консультация нарколога — позвоните прямо сейчас:{' '}
            <a href={`tel:${city.phone}`} style={{ color: 'var(--em)', fontWeight: 800, whiteSpace: 'nowrap' as const }}>
              {city.phoneDisplay}
            </a>
          </p>
          <button
            type="button"
            onClick={openCallbackModal}
            style={{
              padding: '12px 22px',
              background: 'var(--em)',
              color: '#fff',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {CALLBACK_MODAL_TITLE}
          </button>
        </div>
      </div>
    </section>
  )
}
