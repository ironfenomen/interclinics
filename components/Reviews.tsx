// components/Reviews.tsx
'use client'

export default function Reviews() {
  return (
    <section style={{ padding: '72px 0' }}>
      <div className="ctr">
        <div className="shdr"><div className="shdr__label">Отзывы</div><h2 className="shdr__title">Что говорят пациенты</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {/* Аудио-отзыв */}
          <div style={{ background: 'var(--deep)', borderRadius: 16, padding: 24, border: '1px solid var(--deep)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--em)', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>АР</div>
              <div><div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Артур Р.</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Март 2026</div></div>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.55)', lineHeight: 1.65 }}>Процедура прошла отлично. Делали усиленную капельницу, врачи молодцы, приехали быстро.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '10px 14px', background: 'rgba(255,255,255,.06)', borderRadius: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--em)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="#fff" width="16" height="16"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div style={{ flex: 1, height: 32, background: 'rgba(255,255,255,.08)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%', background: 'linear-gradient(90deg,var(--em),var(--em-h))', borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', fontWeight: 500 }}>0:42</span>
            </div>
          </div>
          {/* Текстовые отзывы */}
          {[
            { init: 'ОН', name: 'Ольга Н.', date: 'Март 2026', text: 'Вызывали нарколога мужу. Приехали за 25 минут, всё сделали профессионально. Муж пошёл на поправку. Спасибо!', color: 'var(--em-d)' },
            { init: 'СВ', name: 'Сергей В.', date: 'Февраль 2026', text: 'Закодировался полгода назад. Держусь. Врачи объяснили подробно, не давили, дали выбор метода. Рекомендую.', color: '#6366F1' },
          ].map((r, i) => (
            <div key={i} style={{ background: 'var(--bg)', borderRadius: 16, padding: 24, border: '1px solid var(--b2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: r.color, color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.init}</div>
                <div><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--deep)' }}>{r.name}</div><div style={{ fontSize: 12, color: 'var(--t3)' }}>{r.date}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                {[1,2,3,4,5].map(s => <svg key={s} viewBox="0 0 24 24" fill="var(--amber)" width="16" height="16"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>)}
              </div>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.65 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`@media(max-width:1024px){div[style*="grid-template-columns: repeat(3"]{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:768px){div[style*="grid-template-columns: repeat(3"]{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
