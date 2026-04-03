// components/SocialProof.tsx
'use client'

export default function SocialProof() {
  const items = [
    { value: '4 200', suffix: '+', label: 'Вылеченных пациентов' },
    { value: '7', suffix: ' лет', label: 'Опыт работы' },
    { value: '24', suffix: '/7', label: 'Без выходных' },
    { value: '12', suffix: '+', label: 'Городов присутствия' },
  ]
  return (
    <section style={{ padding: '56px 0' }}>
      <div className="ctr">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, textAlign: 'center' }}>
          {items.map((it, i) => (
            <div key={i} style={{ padding: '24px 16px' }}>
              <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--deep)', letterSpacing: '-.03em', lineHeight: 1 }}>
                {it.value}<span style={{ color: 'var(--em)' }}>{it.suffix}</span>
              </div>
              <div style={{ fontSize: 14, color: 'var(--t3)', marginTop: 6, fontWeight: 500 }}>{it.label}</div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`@media(max-width:768px){div[style*="grid-template-columns: repeat(4"]{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </section>
  )
}
