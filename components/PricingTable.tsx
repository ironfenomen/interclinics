'use client'

// components/PricingTable.tsx — блок цен только для «Вывод из запоя»
import Link from 'next/link'
import { City, getCityBySlug } from '@/data/cities'
import styles from './PricingTable.module.css'

function openCallback() {
  const m = document.getElementById('callbackModal')
  if (m) m.classList.add('open')
  document.body.style.overflow = 'hidden'
}

export default function PricingTable({ city }: { city: City }) {
  const nearest = city.nearestStacionarSlug ? getCityBySlug(city.nearestStacionarSlug) : undefined

  const packages = [
    {
      name: 'Стандартная',
      tagline: 'Лёгкое состояние, короткий запой, минимальный объём инфузий',
      price: city.priceBase,
      sessionHint: 'Ориентир по времени на месте: 1–1,5 ч',
      popular: false,
      features: [
        'Осмотр врача‑нарколога и сбор анамнеза',
        'Капельница базового объёма (ориентир 250 мл)',
        'Витамины и симптоматика по показаниям',
        'Рекомендации врача на 3 дня',
      ],
    },
    {
      name: 'Усиленная',
      tagline: 'Средняя тяжесть, выраженные симптомы — расширенный контроль',
      price: city.priceEnhanced,
      sessionHint: 'Ориентир по времени на месте: 2–3 ч',
      popular: true,
      features: [
        'Расширенный осмотр; ЭКГ при необходимости',
        'Две инфузии суммарно до ~500 мл — по схеме врача',
        'Гепатопротекторы, седация при показаниях',
        'Медикаменты на 5 дней, контрольный звонок врача',
      ],
    },
    {
      name: 'Максимальная',
      tagline: 'Тяжёлая интоксикация — максимальный объём помощи на дому',
      price: city.priceMax,
      sessionHint: 'Ориентир по времени на месте: 3–4 ч',
      popular: false,
      features: [
        'Полная оценка состояния и рисков на месте',
        'Несколько инфузий суммарно до ~750 мл — по показаниям',
        'Нейро- и кардиопротекторы, усиленная симптоматика',
        'Терапия до 7 дней, до 2 визитов врача; при необходимости психотерапевт',
      ],
    },
  ]

  return (
    <section className={styles.section} aria-labelledby="pricing-vyvod-title">
      <div className={`c ${styles.inner}`}>
        <header className={styles.header}>
          <p className={styles.kicker}>Ориентиры по стоимости</p>
          <h2 id="pricing-vyvod-title" className={styles.title}>
            Стоимость выезда: три формата помощи
          </h2>
          <p className={styles.lead}>
            Цифры ниже — честный ориентир по объёму инфузий и сопровождения до звонка. Окончательный формат и цена согласуются после осмотра, без скрытых доплат
            после приезда. Если круглосуточного наблюдения на дому недостаточно, врач спокойно подскажет формат стационара — без давления.
          </p>
        </header>

        <div className={styles.grid}>
          {packages.map((pkg, i) => (
            <article
              key={i}
              className={`${styles.card} ${pkg.popular ? styles.cardPopular : ''}`}
            >
              {pkg.popular ? (
                <div className={styles.popularBadge}>Чаще выбирают</div>
              ) : null}
              <h3 className={styles.cardName}>{pkg.name}</h3>
              <p className={styles.cardTagline}>{pkg.tagline}</p>
              <div className={styles.priceBundle} aria-label={`Ориентир ${pkg.price.toLocaleString('ru')} рублей за выезд`}>
                <div className={styles.priceMain}>
                  <span className={styles.priceNum}>{pkg.price.toLocaleString('ru')}</span>
                  <span className={styles.priceCurrency}>₽</span>
                </div>
                <span className={styles.priceSuffix}>/ выезд</span>
              </div>
              <p className={styles.sessionHint}>{pkg.sessionHint}</p>
              <ul className={styles.featureList}>
                {pkg.features.map((f, fi) => (
                  <li key={fi} className={styles.featureItem}>
                    <svg className={styles.check} viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`${styles.cta} ${pkg.popular ? styles.ctaPopular : styles.ctaOutline}`}
                onClick={openCallback}
              >
                Уточнить этот формат
              </button>
            </article>
          ))}
        </div>

        <div className={styles.bridge}>
          <p className={styles.bridgeEyebrow}>Стационар — отдельный маршрут</p>
          <p className={styles.bridgeLead}>
            Стационар с круглосуточным наблюдением — отдельный формат: при показаниях врач на выезде или диспетчер подскажут госпитализацию и маршрут, без спешки и
            без навязывания.
          </p>
          {city.hasStacionar ? (
            <div className={styles.bridgeRow}>
              <Link href={`/${city.slug}/stacionar/`} className={styles.bridgeLink}>
                Стационар 24/7 в {city.namePrep}
              </Link>
              <span className={styles.bridgeMeta}>
                ориентир от {city.priceStacionarDay.toLocaleString('ru')} ₽ / сутки · подробности на странице
              </span>
            </div>
          ) : city.nearestStacionarSlug && nearest ? (
            <div className={styles.bridgeRow}>
              <Link href={`/${city.nearestStacionarSlug}/stacionar/`} className={styles.bridgeLink}>
                Ближайший стационар сети — {nearest.name}
              </Link>
              <span className={styles.bridgeMeta}>
                {typeof city.nearestStacionarDistance === 'number'
                  ? `ориентир ~${city.nearestStacionarDistance} км · `
                  : ''}
                от {city.priceStacionarDay.toLocaleString('ru')} ₽ / сутки · маршрут и детали на странице
              </span>
            </div>
          ) : city.nearestStacionarSlug ? (
            <div className={styles.bridgeRow}>
              <Link href={`/${city.nearestStacionarSlug}/stacionar/`} className={styles.bridgeLink}>
                Стационар сети — подробности и маршрут
              </Link>
              <span className={styles.bridgeMeta}>ориентир от {city.priceStacionarDay.toLocaleString('ru')} ₽ / сутки</span>
            </div>
          ) : (
            <p className={styles.bridgeFallback}>
              Направление в стационар сети при необходимости согласуют на линии — подскажем ближайший формат наблюдения.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
