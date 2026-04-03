'use client'

// components/Advantages.tsx

export default function Advantages() {
  const advs = [
    { icon: 'M3 11h18M7 11V7a5 5 0 0110 0v4', title: 'Полная анонимность', text: 'Не ставим на учёт. Машины без маркировки. Лечение под псевдонимом.' },
    { icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M9 15l2 2 4-4', title: 'Лицензированные врачи', text: 'Дипломы и сертификаты. Стаж от 10 лет в наркологии.' },
    { icon: 'M12 6v6l4 2', circle: true, title: 'Круглосуточно, 24/7', text: 'Без выходных и праздников. Вызов в любое время.' },
    { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Гарантия при срыве', text: 'Бесплатный повторный курс в гарантийный период.' },
  ]
  return (
    <section style={{ padding:'72px 0', background:'var(--deep)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize:'24px 24px' }} />
      <div className="ctr" style={{ position:'relative', zIndex:2 }}>
        <div className="shdr" style={{ marginBottom:44 }}>
          <div className="shdr__label" style={{ color:'var(--em)' }}>Почему InterClinics</div>
          <h2 className="shdr__title" style={{ color:'#fff' }}>Профессиональная помощь без рисков</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
          {advs.map((a, i) => (
            <div key={i} style={{ textAlign:'center', padding:'32px 20px', borderRadius:16, background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.05)' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--em-glow)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
                  {a.circle && <circle cx="12" cy="12" r="10" />}
                  <path d={a.icon} />
                </svg>
              </div>
              <div style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:6 }}>{a.title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.4)', lineHeight:1.6 }}>{a.text}</div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`@media(max-width:1024px){div[style*="grid-template-columns: repeat(4"]{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:768px){div[style*="grid-template-columns: repeat(4"]{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
