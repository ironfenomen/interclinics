'use client'

// components/Steps.tsx

import { City } from '@/data/cities'
export default function Steps({ city }: { city: City }) {
  const steps = [
    { n: 1, title: 'Звонок', text: 'Вы звоните или оставляете заявку. Нарколог проконсультирует бесплатно.' },
    { n: 2, title: 'Выезд бригады', text: `Врачи выезжают к вам. Среднее время прибытия — ${city.arrivalTime} минут.` },
    { n: 3, title: 'Осмотр и лечение', text: 'Диагностика, подбор терапии и проведение процедуры на месте.' },
    { n: 4, title: 'Наблюдение', text: 'План лечения, рецепты, телефон врача для связи. Контрольный звонок.' },
  ]
  return (
    <section style={{ padding: '72px 0' }}>
      <div className="ctr">
        <div className="shdr"><div className="shdr__label">Как мы работаем</div><h2 className="shdr__title">4 шага к помощи</h2></div>
        <div className="ic-grid-4">
          {steps.map(s => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--em)', color:'#fff', fontSize:22, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>{s.n}</div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--deep)', marginBottom:6 }}>{s.title}</div>
              <div style={{ fontSize:13, color:'var(--t2)', lineHeight:1.6 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
