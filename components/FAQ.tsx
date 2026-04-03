'use client'

// components/FAQ.tsx
import { useState } from 'react'
import { City } from '@/data/cities'

export default function FAQ({ city }: { city: City }) {
  const [openIdx, setOpenIdx] = useState(0)
  const items = [
    { q: 'Сколько стоит вызов нарколога на дом?', a: `Стоимость начинается от ${city.priceNarkolog.toLocaleString('ru')} ₽. Окончательная цена зависит от состояния пациента. Консультация по телефону — бесплатная.` },
    { q: 'Как обеспечивается анонимность?', a: 'Мы не передаём данные в государственные органы. Машины без маркировки. Возможно лечение под псевдонимом. Информация не влияет на трудоустройство и получение прав.' },
    { q: `Через какое время приедет врач?`, a: `Среднее время прибытия в ${city.namePrep} — ${city.arrivalTime} минут. В отдалённые районы — до 60 минут. Работаем круглосуточно.` },
    { q: 'Какие методы кодирования используете?', a: 'Медикаментозное (Эспераль, Торпедо, Вивитрол, Налтрексон), психотерапевтическое (Довженко, гипноз) и комбинированные методы. Выбор — индивидуально с врачом.' },
    { q: 'Можно ли вызвать врача без согласия пациента?', a: 'Принудительное лечение возможно только по решению суда. Но наши специалисты проводят мотивационную беседу для получения добровольного согласия.' },
    { q: 'Есть ли гарантия результата?', a: 'Мы гарантируем качество медицинской помощи и сертифицированные препараты. Бесплатный повторный курс при рецидиве в гарантийный период.' },
    {
      q: 'Как устроен стационар?',
      a: `В стационаре пациент находится под круглосуточным наблюдением врача. Размещение в одно- или двухместных палатах. Питание 3 раза в день. Программа включает детоксикацию, медикаментозную терапию и психотерапию. Стоимость — от ${city.priceStacionarDay.toLocaleString('ru')} ₽/сутки.`,
    },
    {
      q: 'Чем реабилитация отличается от стационара?',
      a: 'Стационар — это медицинский этап: детоксикация и стабилизация состояния (3-21 день). Реабилитация — психосоциальное восстановление после стационара: психотерапия, группы поддержки, адаптация к трезвой жизни (28-90 дней). Рекомендуем проходить оба этапа последовательно.',
    },
  ]
  return (
    <section style={{ padding: '72px 0', background: 'var(--bg)' }}>
      <div className="ctr">
        <div className="shdr"><div className="shdr__label">Вопросы</div><h2 className="shdr__title">Частые вопросы</h2></div>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {items.map((it, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--b1)' }}>
              <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} style={{
                width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', background: 'none', fontSize: 16, fontWeight: 600, color: 'var(--deep)', textAlign: 'left' as const, gap: 16
              }}>
                {it.q}
                <span style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: openIdx === i ? 'var(--em)' : 'var(--b2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'all .3s', transform: openIdx === i ? 'rotate(45deg)' : 'none'
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={openIdx === i ? '#fff' : 'var(--t3)'} strokeWidth="2" width="14" height="14">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <div style={{ maxHeight: openIdx === i ? 420 : 0, overflow: 'hidden', transition: 'max-height .4s ease', paddingBottom: openIdx === i ? 20 : 0 }}>
                <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.7 }}>{it.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
