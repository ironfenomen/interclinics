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
      <section className="final" id="narkolog-final-cta">
        <div className="c final-inner">
          <p className={styles.kicker}>Линия вызова</p>
          <h2 className={styles.titleVyvod}>Позвоните по линии или оставьте номер для звонка</h2>
          <p className={`final-lead ${styles.leadAlign}`}>
            Подойдёт и для себя, и за взрослого близкого. Коротко согласуем следующий шаг: адрес, ориентир по времени и формат выезда — спокойно и по делу. До согласования визита с врачом вы ни к чему не обязаны.
          </p>
          <a className="final-phone" href={`tel:${city.phone}`}>
            {city.phoneDisplay}
          </a>
          <div className="final-form final-form--narkolog">
            <LeadForm city={city} variant="cta" ctaVariant="narkolog" />
          </div>
          <div className="final-proof">
            <span>Конфиденциально</span>
            <span>Можно за близкого</span>
            <span>По состоянию подбираем помощь</span>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'kodirovanie') {
    return (
      <section className="final" id="kodirovanie-final-cta">
        <div className="c final-inner">
          <p className={styles.kicker}>Консультация и запись</p>
          <h2 className={styles.titleVyvod}>Позвоните по линии или оставьте номер — обсудим кодирование в {city.namePrep}</h2>
          <p className={`final-lead ${styles.leadAlign}`}>
            Подойдёт и для себя, и за взрослого близкого. Коротко согласуем следующий шаг: запись, какие форматы имеет смысл обсуждать с врачом и ориентир по
            стоимости — спокойно и по делу. До приёма вы ни к чему не обязаны.
          </p>
          <a className="final-phone" href={`tel:${city.phone}`}>
            {city.phoneDisplay}
          </a>
          <div className="final-form final-form--kodirovanie">
            <LeadForm city={city} variant="cta" ctaVariant="kodirovanie" />
          </div>
          <div className="final-proof">
            <span>Метод подбирает врач</span>
            <span>После трезвости по показаниям</span>
            <span>Можно за близкого</span>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'reabilitaciya') {
    return (
      <section className="final" id="reabilitaciya-final-cta">
        <div className="c final-inner">
          <p className={styles.kicker}>Спокойный следующий шаг</p>
          <h2 className={styles.titleVyvod}>Обсудим программу в {city.namePrep} — без срочного давления</h2>
          <p className={`final-lead ${styles.leadAlign}`}>
            Позвоните или оставьте номер: коротко разберём запрос, ориентир по сроку и глубине, стоимость и логистику. Подойдёт и для себя, и за
            взрослого близкого. До записи в программу вы ни к чему не обязаны.
          </p>
          <a className="final-phone" href={`tel:${city.phone}`}>
            {city.phoneDisplay}
          </a>
          <div className="final-form final-form--reabilitaciya">
            <LeadForm city={city} variant="cta" ctaVariant="reabilitaciya" />
          </div>
          <div className="final-proof">
            <span>Консультация без обязательств</span>
            <span>Устойчивость, не «быстрый фикс»</span>
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
