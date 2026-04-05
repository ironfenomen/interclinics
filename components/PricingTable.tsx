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

function AllInclusiveLine({ className }: { className: string }) {
  return (
    <p className={className}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="1.5" />
        <path
          d="M8 12l2.5 2.5L16 9"
          stroke="#10B981"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Всё включено · без доплат на месте</span>
    </p>
  )
}

export default function PricingTable({ city }: { city: City }) {
  const nearest = city.nearestStacionarSlug ? getCityBySlug(city.nearestStacionarSlug) : undefined

  const packages = [
    {
      name: 'Стандартная',
      tagline: 'Лёгкое состояние, короткий запой — базовый ориентир помощи на дому',
      price: city.priceBase,
      sessionHint: 'Ориентир по времени на месте: 1–1,5 ч',
      popular: false,
      features: [
        'Осмотр врача‑нарколога и сбор анамнеза',
        'Медицинская помощь по показаниям в рамках ориентира пакета',
        'Симптоматическая поддержка по решению врача',
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
        'Более глубокая помощь по показаниям — по решению врача на месте',
        'Симптоматическая и поддерживающая терапия по показаниям',
        'Рекомендации и наблюдение по плану врача; контрольный звонок',
      ],
    },
    {
      name: 'Максимальная',
      tagline: 'Тяжёлая интоксикация — максимальный ориентир помощи на дому',
      price: city.priceMax,
      sessionHint: 'Ориентир по времени на месте: 3–4 ч',
      popular: false,
      features: [
        'Полная оценка состояния и рисков на месте',
        'Интенсивная помощь по показаниям в рамках выездного формата',
        'Плотное наблюдение до стабилизации по решению врача',
        'При необходимости — до дополнительных визитов и обсуждение стационара без давления',
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
            Цифры ниже — ориентир по уровню выездной помощи. Окончательный формат и цена определяются после осмотра врача, до продолжения процедур, без скрытых
            доплат после согласования. Если круглосуточного наблюдения на дому недостаточно, врач спокойно подскажет формат стационара — без давления.
          </p>
        </header>

        <p className={styles.pricingIntro}>
          В сумму входят выезд, осмотр врача и помощь в рамках плана, который согласуют с вами после осмотра. До начала процедур фиксируют объём и стоимость; скрытых
          доплат после этого нет.
        </p>

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
              <AllInclusiveLine className={styles.allInclusive} />
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

        <p className={styles.pricingFootnote}>
          Ориентир по пакету виден на странице; окончательную сумму фиксируют после осмотра, до продолжения помощи. Если нужен стационар — обсудим отдельно, без
          давления.
        </p>

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
                Стационар сети — {nearest.name}
              </Link>
              <span className={styles.bridgeMeta}>
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
              Направление в стационар сети при необходимости согласуют на линии — подскажем подходящий формат наблюдения.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
