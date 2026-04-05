// components/CTASection.tsx — секция .final; variant="vyvod" | "stacionar" | "narkolog" | "kodirovanie" | "reabilitaciya" — усиленные финалы посадочных
import { City } from '@/data/cities'
import LeadForm from './LeadForm'
import styles from './CTASection.module.css'

export default function CTASection({ city, variant }: { city: City; variant?: 'vyvod' | 'stacionar' | 'narkolog' | 'kodirovanie' | 'reabilitaciya' }) {
  if (variant === 'vyvod') {
    return (
      <section className={`final ${styles.finalLanding}`} id="vyvod-final-cta" aria-labelledby="vyvod-final-heading">
        <div className="c final-inner">
          <p className={styles.kicker}>Связь с линией</p>
          <h2 id="vyvod-final-heading" className={styles.titleVyvod}>
            Если хотите обсудить ситуацию — позвоните или оставьте номер
          </h2>
          <p className={`final-lead ${styles.leadAlign}`}>
            Подойдёт и для себя, и за близкого взрослого. Коротко подскажем следующий шаг без давления: до выезда врача вы ни к чему не обязаны.
          </p>
          <a className="final-phone" href={`tel:${city.phone}`}>
            {city.phoneDisplay}
          </a>
          <div className="final-form final-form--vyvod">
            <LeadForm city={city} variant="cta" ctaVariant="vyvod" />
          </div>
          <div className="final-proof">
            <span>Конфиденциально</span>
            <span>Круглосуточная линия</span>
            <span>Можно за близкого</span>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'stacionar') {
    return (
      <section
        className={`final ${styles.finalStacionar} ic-final-stacionar`}
        id="stacionar-final-cta"
        aria-labelledby="stacionar-final-heading"
      >
        <div className="c final-inner">
          <p className={`${styles.kicker} ${styles.kickerStacionar}`}>Линия отделения</p>
          <h2 id="stacionar-final-heading">Разговор о поступлении</h2>
          <p className={`final-lead ${styles.leadAlign} ${styles.leadStacionar}`}>
            Для вас или за взрослого близкого. На линии — показания, места, порядок. До приёма врача — без давления и
            обязательств.
          </p>
          <a className={`final-phone ${styles.phoneStacionar}`} href={`tel:${city.phone}`}>
            {city.phoneDisplay}
          </a>
          <div className="final-form final-form--vyvod final-form--stacionar">
            <LeadForm city={city} variant="cta" ctaVariant="stacionar" />
          </div>
          <div className="final-proof">
            <span>Конфиденциально</span>
            <span>Линия 24/7</span>
            <span>Можно за близкого</span>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'narkolog') {
    return (
      <section
        className={`final ${styles.finalNarkolog} ic-final-narkolog`}
        id="narkolog-final-cta"
        aria-labelledby="narkolog-final-heading"
      >
        <div className="c final-inner">
          <p className={`${styles.kicker} ${styles.kickerNarkolog}`}>Линия вызова</p>
          <h2 id="narkolog-final-heading">
            Согласуем выезд: звонок или номер для обратной связи
          </h2>
          <p className={`final-lead ${styles.leadAlign} ${styles.leadNarkolog}`}>
            Для себя или за взрослого близкого. На линии — адрес, время и формат выезда; до визита врача вы ни к чему не обязаны.
          </p>
          <a className={`final-phone ${styles.phoneNarkolog}`} href={`tel:${city.phone}`}>
            {city.phoneDisplay}
          </a>
          <div className="final-form final-form--narkolog">
            <LeadForm city={city} variant="cta" ctaVariant="narkolog" />
          </div>
          <div className="final-proof">
            <span>Конфиденциально</span>
            <span>Можно за близкого</span>
            <span>Помощь по показаниям</span>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'kodirovanie') {
    return (
      <section
        className={`final ${styles.finalKodirovanie} ic-final-kodirovanie`}
        id="kodirovanie-final-cta"
        aria-labelledby="kodirovanie-final-heading"
      >
        <div className="c final-inner">
          <p className={`${styles.kicker} ${styles.kickerKodirovanie}`}>Запись на консультацию</p>
          <h2 id="kodirovanie-final-heading">Кодирование в {city.namePrep}</h2>
          <p className={`final-lead ${styles.leadAlign} ${styles.leadKodirovanie}`}>
            Для себя или за взрослого близкого. Ориентиры по форматам и стоимости — на линии. До визита к врачу вы ни к чему не обязаны.
          </p>
          <a className={`final-phone ${styles.phoneKodirovanie}`} href={`tel:${city.phone}`}>
            {city.phoneDisplay}
          </a>
          <div className="final-form final-form--kodirovanie">
            <LeadForm city={city} variant="cta" ctaVariant="kodirovanie" />
          </div>
          <div className="final-proof">
            <span>Осмотр до процедуры</span>
            <span>Трезвость по показаниям</span>
            <span>Можно за близкого</span>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'reabilitaciya') {
    return (
      <section
        className={`final ${styles.finalReabilitaciya} ic-final-reabilitaciya`}
        id="reabilitaciya-final-cta"
        aria-labelledby="reabilitaciya-final-heading"
      >
        <div className="c final-inner">
          <p className={`${styles.kicker} ${styles.kickerReabilitaciya}`}>Согласование программы</p>
          <h2 id="reabilitaciya-final-heading" className={styles.titleReabilitaciya}>
            {city.hasRehab
              ? `Программа в ${city.namePrep}: спокойно, без давления`
              : `Программа сети для жителей ${city.nameGen}: спокойно, без давления`}
          </h2>
          <p className={`final-lead ${styles.leadAlign} ${styles.leadReabilitaciya}`}>
            Позвоните или оставьте номер — разберём запрос и ориентир по сроку и стоимости. Для себя или за взрослого близкого. До записи вы ни к чему
            не обязаны.
          </p>
          <a className={`final-phone ${styles.phoneReabilitaciya}`} href={`tel:${city.phone}`}>
            {city.phoneDisplay}
          </a>
          <div className="final-form final-form--reabilitaciya">
            <LeadForm city={city} variant="cta" ctaVariant="reabilitaciya" />
          </div>
          <div className="final-proof">
            <span>Без обязательств до записи</span>
            <span>Опора, не «быстрый фикс»</span>
            <span>Можно за близкого</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="final">
      <div className="c final-inner">
        <h2>Не откладывайте — позвоните сейчас</h2>
        <p className="final-lead">Бесплатная консультация нарколога, круглосуточно</p>
        <a className="final-phone" href={`tel:${city.phone}`}>
          {city.phoneDisplay}
        </a>
        <div className="ic-final-form-glass">
          <LeadForm city={city} variant="cta" />
        </div>
      </div>
    </section>
  )
}
