// app/[city]/narkolog-na-dom/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug, getCitySlugs } from '@/data/cities'
import { getServiceBySlug } from '@/data/services'
import Header from '@/components/Header'
import Steps from '@/components/Steps'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import MobileBar from '@/components/MobileBar'
import CallbackModal from '@/components/CallbackModal'
import CookieConsent from '@/components/CookieConsent'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import OpenCallbackButton from '@/components/OpenCallbackButton'
import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'
import styles from './page.module.css'

export async function generateStaticParams() {
  return getCitySlugs().map(slug => ({ city: slug }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}
  const pageUrl = `https://interclinics.ru/${city.slug}/narkolog-na-dom/`
  const title = `Нарколог на дом в ${city.namePrep} — выезд за ${city.arrivalTime} мин | ${BRAND_DISPLAY_NAME}`
  const description = `Вызов нарколога на дом в ${city.namePrep}. От ${city.priceNarkolog.toLocaleString('ru')}₽. Приедем за ${city.arrivalTime} мин. Анонимно. ☎ ${city.phoneDisplay}`
  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      locale: 'ru_RU',
      type: 'website',
      siteName: BRAND_DISPLAY_NAME,
    },
  }
}

export default function NarkologNaDomPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()
  const service = getServiceBySlug('narkolog-na-dom')
  if (!service) notFound()

  return (
    <div className={styles.pageRoot}>
      <Header city={city} />
      <main>
        <section className={styles.hero} aria-labelledby="narkolog-hero-heading">
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroMesh} aria-hidden />
          <div className={`c ${styles.heroInner}`}>
            <p className={styles.eyebrow}>Выезд врача · наркология · на адрес в {city.namePrep}</p>

            <ul className={styles.heroBadges} aria-label="Условия выезда">
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                Врач‑нарколог на ваш адрес
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                Ориентир ~{city.arrivalTime} мин до приезда
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                От {city.priceNarkolog.toLocaleString('ru')} ₽ — ориентир за выезд
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                Помощь подбирается по состоянию
              </li>
            </ul>

            <h1 id="narkolog-hero-heading" className={styles.title}>
              <span className={styles.titleKicker}>Вызов нарколога на дом</span>
              <span className={styles.titleMain}>
                Очный осмотр и врачебная помощь на месте в&nbsp;{city.namePrep}
              </span>
            </h1>

            <p className={styles.lead}>
              Врач‑нарколог приезжает по адресу: осмотр, оценка состояния, подбор терапии и процедур на дому — по показаниям, а не «для галочки». При
              необходимости спокойно обсудим стационар или дальнейший маршрут — без давления. Ориентир по времени приезда и стоимости уточняем при
              звонке; итог — после осмотра.
            </p>

            <div className={styles.heroCtaBlock}>
              <OpenCallbackButton className={styles.heroCta}>Запросить выезд нарколога</OpenCallbackButton>
              <p className={styles.heroCtaHint}>
                Или наберите сами:{' '}
                <a className={styles.heroTelLink} href={`tel:${city.phone}`}>
                  {city.phoneDisplay}
                </a>
              </p>
            </div>

            <p className={styles.heroMicroTrust}>
              Лицензированная помощь · конфиденциально · автомобиль без рекламной маркировки · круглосуточная линия
            </p>
          </div>
        </section>

        <section className={styles.includesSection} aria-labelledby="narkolog-includes-heading">
          <div className={`c ${styles.includesInner}`}>
            <header className={styles.includesHeader}>
              <p className={styles.includesKicker}>Формат выездной помощи</p>
              <h2 id="narkolog-includes-heading" className={styles.includesTitle}>
                Что входит в вызов нарколога
              </h2>
              <p className={styles.includesLead}>
                Ниже — состав типового визита. Объём процедур, препаратов и длительность наблюдения врач определяет после осмотра, с учётом состояния и
                показаний; при необходимости спокойно обсудит стационар или дальнейший маршрут — без обещаний «универсального» плана.
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
                Врач‑нарколог выезжает в {city.namePrep} и по согласованным направлениям рядом с городом. Ориентир до приезда — около {city.arrivalTime}{' '}
                минут; фактическое время зависит от района, маршрута и загрузки линии — диспетчер уточнит при звонке.
              </p>
              {city.localText ? <p className={styles.geoLocal}>{city.localText}</p> : null}
            </div>

            {city.districts.length > 0 ? (
              <div className={styles.districtsBlock}>
                <h3 className={styles.districtsTitle}>Районы и ориентиры на карте города</h3>
                <p className={styles.districtsSubtitle}>В {city.namePrep} — в том числе:</p>
                <p className={styles.districtsNote}>
                  Перечень не исчерпывающий: при необходимости согласуем выезд и за пределы перечисленных зон — уточняйте на линии.
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

        <Steps city={city} variant="narkolog" />
        <FAQ city={city} variant="narkolog" />
        <CTASection city={city} variant="narkolog" />
      </main>
      <Footer city={city} activeHref={`/${city.slug}/narkolog-na-dom/`} />
      <div className="ic-mockup-scroll-pad" aria-hidden="true" />
      <MobileBar city={city} variant="narkolog" />
      <CallbackModal city={city} />
      <CookieConsent />
      <FloatingWhatsApp city={city} />
    </div>
  )
}
