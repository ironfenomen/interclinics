// components/DoctorCards.tsx
'use client'

import { Doctor } from '@/data/doctors'

export default function DoctorCards({ doctors }: { doctors: Doctor[] }) {
  const colors = ['var(--deep)', 'var(--em-d)', '#6366F1', '#0EA5E9']
  return (
    <section style={{ padding: '72px 0', background: 'var(--bg)' }}>
      <div className="ctr">
        <div className="shdr">
          <div className="shdr__label">Специалисты</div>
          <h2 className="shdr__title">Наши врачи</h2>
          <p className="shdr__desc">Дипломированные специалисты с подтверждённой квалификацией</p>
        </div>
        <div className="ic-grid-4-tight">
          {doctors.map((doc, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--b2)' }}>
              <div style={{ height: 200, background: `linear-gradient(135deg, var(--deep), var(--deep2))`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.08)', border: '2px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,.5)' }}>
                  {doc.initials}
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,.4)', color: '#fff', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>
                  {doc.experience} лет
                </div>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--deep)', marginBottom: 3 }}>{doc.name}</div>
                <div style={{ fontSize: 12, color: 'var(--em-d)', fontWeight: 600, marginBottom: 8 }}>{doc.role}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--t3)' }}>
                  <span>{doc.category}</span>
                  <span style={{ color: 'var(--amber)', fontWeight: 600 }}>⭐ {doc.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
