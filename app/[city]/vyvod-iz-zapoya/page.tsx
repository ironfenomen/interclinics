// app/[city]/vyvod-iz-zapoya/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug, getCitySlugs } from '@/data/cities'
import { getServiceBySlug } from '@/data/services'
import Header from '@/components/Header'
import PricingTable from '@/components/PricingTable'
import Steps from '@/components/Steps'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import MobileBar from '@/components/MobileBar'
import CallbackModal from '@/components/CallbackModal'
import CookieConsent from '@/components/CookieConsent'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'
import VyvodHeroActions from './VyvodHeroActions'
import styles from './page.module.css'

export async function generateStaticParams() {
  return getCitySlugs().map(slug => ({ city: slug }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}
  const canonical = `https://interclinics.ru/${city.slug}/vyvod-iz-zapoya/`
  const description = `Вывод из запоя на дому в ${city.namePrep}: осмотр врача‑нарколога, инфузионная терапия. От ${city.priceVyvodFrom.toLocaleString('ru')} ₽ после осмотра. Ориентир ${city.arrivalTime} мин. Конфиденциально, круглосуточно. ☎ ${city.phoneDisplay}`
  const title = `Вывод из запоя на дому в ${city.namePrep} — врач‑нарколог и капельница | ${BRAND_DISPLAY_NAME}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: BRAND_DISPLAY_NAME,
      locale: 'ru_RU',
      type: 'website',
    },
  }
}

export default function VyvodIzZapoyaPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()
  const service = getServiceBySlug('vyvod-iz-zapoya')
  if (!service) notFound()

  return (
    <div className={styles.pageRoot}>
      <Header city={city} />
      <main>
        <section className={styles.hero} aria-labelledby="vyvod-hero-heading">
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroMesh} aria-hidden />
          <div className={`c ${styles.heroInner}`}>
            <p className={styles.eyebrow}>Услуга · вывод из запоя на дому</p>

            <ul className={styles.heroBadges} aria-label="Ключевые условия">
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                От {city.priceVyvodFrom.toLocaleString('ru')} ₽ — после осмотра
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                Ориентир ~{city.arrivalTime} мин до приезда
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                Конфиденциально
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                Круглосуточно
              </li>
            </ul>

            <h1 id="vyvod-hero-heading" className={styles.title}>
              <span className={styles.titleKicker}>Вывод из запоя на дому</span>
              <span className={styles.titleMain}>
                Врач‑нарколог и инфузионная помощь в&nbsp;{city.namePrep}
              </span>
            </h1>

            <p className={styles.lead}>
              Врач‑нарколог приезжает к вам, проводит осмотр и подбирает инфузионную терапию на месте — под ваше состояние и показания. При необходимости
              круглосуточного наблюдения обсудим стационар и следующий шаг без давления. Ориентир по времени приезда и стоимость — после короткого разговора
              по телефону.
            </p>

            <VyvodHeroActions city={city} />

            <p className={styles.heroMicroTrust}>
              Лицензия {city.partnerLicense} · анонимно · без опознавательных знаков на машине
            </p>
          </div>
        </section>

        <section className={styles.includesSection} aria-labelledby="vyvod-includes-heading">
          <div className={`c ${styles.includesInner}`}>
            <header className={styles.includesHeader}>
              <p className={styles.includesKicker}>Формат помощи на дому</p>
              <h2 id="vyvod-includes-heading" className={styles.includesTitle}>
                Что входит в выезд врача
              </h2>
              <p className={styles.includesLead}>
                Ниже — типовые шаги при выводе из запоя на дому. Состав инфузий и препаратов врач определяет после осмотра, с учётом состояния и сопутствующих факторов.
              </p>
            </header>

            <ul className={styles.includesList}>
              {service.includes.map((item, i) => (
                <li key={i} className={styles.featureCard}>
                  <span className={styles.featureIcon} aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span className={styles.featureText}>{item}</span>
                </li>
              ))}
            </ul>

            <div className={styles.geoCard}>
              <h3 className={styles.geoTitle}>Выезд по городу и ориентир по времени</h3>
              <p className={styles.geoLead}>
                Бригады работают в {city.namePrep} и по ближайшим направлениям.
              </p>
              <p className={styles.geoLead}>
                Ориентир по времени до приезда — около {city.arrivalTime} минут; фактический интервал зависит от района,
                маршрута и загрузки линии — диспетчер уточнит при звонке.
              </p>
              {city.localText ? <p className={styles.geoLocal}>{city.localText}</p> : null}
            </div>

            {city.districts.length > 0 ? (
              <div className={styles.districtsBlock}>
                <h3 className={styles.districtsTitle}>Районы и локальные ориентиры</h3>
                <p className={styles.districtsSubtitle}>В {city.namePrep} — в том числе:</p>
                <p className={styles.districtsNote}>
                  Список не исчерпывающий: выезд возможен и за пределы перечисленных зон — уточняйте по телефону.
                </p>
                <ul className={styles.districtsList}>
                  {city.districts.map((d, i) => (
                    <li key={i} className={styles.districtChip}>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        <PricingTable city={city} />
        <Steps city={city} variant="vyvod" />
        <FAQ city={city} variant="vyvod" />
        <CTASection city={city} variant="vyvod" />
      </main>

      <Footer city={city} />
      <div className="ic-mockup-scroll-pad" aria-hidden="true" />
      <MobileBar city={city} variant="vyvod" />
      <CallbackModal city={city} />
      <CookieConsent />
      <FloatingWhatsApp city={city} />
    </div>
  )
}
