'use client'

// components/Steps.tsx — variant="vyvod" | "narkolog" для усиленных блоков; иначе — базовая сетка
import { City, isStavropolCity } from '@/data/cities'
import OpenCallbackButton from '@/components/OpenCallbackButton'
import styles from './Steps.module.css'

type StepsVariant = 'vyvod' | 'narkolog' | undefined

export default function Steps({ city, variant }: { city: City; variant?: StepsVariant }) {
  if (variant === 'narkolog') {
    const steps = [
      {
        n: 1,
        title: 'Звонок или заявка',
        text: isStavropolCity(city)
          ? 'Обращаетесь на круглосуточную линию или оставляете номер: согласуем адрес, ориентир по времени приезда и срочность. До выезда врача вы не обязаны продолжать — решаете вы.'
          : 'Обращаетесь на круглосуточную линию или оставляете номер: согласуем адрес, срочность и порядок выезда. До выезда врача вы не обязаны продолжать — решаете вы.',
      },
      {
        n: 2,
        title: 'Короткое уточнение',
        text:
          'На линии уточняем симптомы и контекст, чтобы согласовать срочность выезда и маршрут. Это не осмотр и не диагноз по телефону — только организация вызова.',
      },
      {
        n: 3,
        title: 'Выезд и осмотр на дому',
        text: isStavropolCity(city)
          ? `Врач‑нарколог приезжает в согласованный интервал (ориентир ~${city.arrivalTime} мин), проводит осмотр и обсуждает с вами объём помощи на месте.`
          : 'Врач‑нарколог приезжает в согласованный интервал, проводит осмотр и обсуждает с вами объём помощи на месте — время приезда согласуют на линии, без «одних минут для всех».',
      },
      {
        n: 4,
        title: 'Помощь на месте и дальнейший шаг',
        text:
          'Терапия и процедуры по показаниям, рекомендации на ближайшее время. При необходимости наблюдения или другого формата обсудим стационар и маршрут — без давления и без обещаний «всё за один визит».',
      },
    ]

    return (
      <section className={`${styles.section} ${styles.sectionNarkolog} ic-steps-narkolog`} aria-labelledby="narkolog-steps-title">
        <div className={`c ${styles.inner}`}>
          <header className={styles.header}>
            <p className={styles.kicker}>Маршрут после обращения</p>
            <h2 id="narkolog-steps-title" className={styles.title}>
              Как организован выезд нарколога
            </h2>
            <p className={styles.lead}>
              Связь → уточнение → приезд → осмотр и помощь на дому. Понятный порядок шагов — без лишней тревоги после звонка.
            </p>
          </header>

          <div className={styles.routeTrack}>
            <div className={styles.grid}>
              {steps.map(s => (
                <article key={s.n} className={styles.card}>
                  <div className={styles.stepMeta}>
                    <span className={styles.stepIndex} aria-hidden>
                      {s.n}
                    </span>
                    <span className={styles.stepLine} aria-hidden />
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p className={styles.stepText}>{s.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.routeFooter}>
            <OpenCallbackButton className={`btn btn-primary ${styles.routeCta}`}>
              Запросить выезд нарколога
            </OpenCallbackButton>
            <p className={styles.routeHint}>Время и адрес — на линии; до выезда врача вы ни к чему не обязаны.</p>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'vyvod') {
    const steps = [
      {
        n: 1,
        title: 'Звонок или заявка',
        text: isStavropolCity(city)
          ? 'Обращаетесь на круглосуточную линию или оставляете номер: уточняем адрес и ориентир по времени. До приезда врача решение за вами — без обязательств.'
          : 'Обращаетесь на круглосуточную линию или оставляете номер: уточняем адрес и порядок выезда. До приезда врача решение за вами — без обязательств.',
      },
      {
        n: 2,
        title: 'Короткое уточнение',
        text:
          'По телефону спокойно выясняем симптомы и обстановку, чтобы согласовать адрес, срочность и время выезда. Это не замена очному осмотру и не дистанционный диагноз.',
      },
      {
        n: 3,
        title: 'Выезд и осмотр',
        text: isStavropolCity(city)
          ? `Врач приезжает в согласованный интервал (ориентир ~${city.arrivalTime} мин), оценивает состояние и согласует с вами объём помощи на месте.`
          : 'Врач приезжает в согласованный интервал, оценивает состояние и согласует с вами объём помощи на месте — срок приезда согласуют на линии, без универсальных цифр до звонка.',
      },
      {
        n: 4,
        title: 'Помощь и рекомендации',
        text:
          'Медицинская и симптоматическая поддержка по показаниям, письменные рекомендации и контакт врача. При необходимости круглосуточного наблюдения обсудим стационар — без давления.',
      },
    ]

    return (
      <section className={styles.section} aria-labelledby="vyvod-steps-title">
        <div className={`c ${styles.inner}`}>
          <header className={styles.header}>
            <p className={styles.kicker}>Маршрут помощи</p>
            <h2 id="vyvod-steps-title" className={styles.title}>
              Как проходит выезд после обращения
            </h2>
            <p className={styles.lead}>
              Понятный порядок: сначала контакт и уточнение, затем приезд врача, осмотр и помощь на дому. Так вы заранее понимаете, чего ожидать — без хаоса и
              лишней тревоги.
            </p>
          </header>

          <div className={styles.grid}>
            {steps.map(s => (
              <article key={s.n} className={styles.card}>
                <div className={styles.stepMeta}>
                  <span className={styles.stepIndex} aria-hidden>
                    {s.n}
                  </span>
                  <span className={styles.stepLine} aria-hidden />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepText}>{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const steps = [
    { n: 1, title: 'Звонок', text: 'Вы звоните или оставляете заявку. Нарколог проконсультирует бесплатно.' },
    {
      n: 2,
      title: 'Выезд бригады',
      text: isStavropolCity(city)
        ? `Врачи выезжают к вам. Среднее время прибытия — ${city.arrivalTime} минут.`
        : 'Врачи выезжают к вам; порядок и срок приезда согласуют на линии — с учётом адреса и загрузки.',
    },
    { n: 3, title: 'Осмотр и лечение', text: 'Диагностика, подбор терапии и проведение процедуры на месте.' },
    { n: 4, title: 'Наблюдение', text: 'План лечения, рецепты, телефон врача для связи. Контрольный звонок.' },
  ]

  return (
    <section style={{ padding: 'var(--ic-y-section, 88px) 0' }}>
      <div className="c">
        <div className="shdr">
          <div className="shdr__label">Как мы работаем</div>
          <h2 className="shdr__title">4 шага к помощи</h2>
        </div>
        <div className="ic-grid-4">
          {steps.map(s => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'var(--em)',
                  color: '#fff',
                  fontSize: 22,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                {s.n}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--deep)', marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
