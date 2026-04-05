// app/[city]/narkolog-na-dom/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug, getCitySlugs, isStavropolCity } from '@/data/cities'
import { getServiceBySlug } from '@/data/services'
import Header from '@/components/Header'
import Steps from '@/components/Steps'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import MobileBar from '@/components/MobileBar'
import CallbackModal from '@/components/CallbackModal'
import CookieConsent from '@/components/CookieConsent'
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
  const title = isStavropolCity(city)
    ? `Нарколог на дом в ${city.namePrep} — выезд за ${city.arrivalTime} мин | ${BRAND_DISPLAY_NAME}`
    : `Нарколог на дом в ${city.namePrep} — выезд и осмотр на месте | ${BRAND_DISPLAY_NAME}`
  const description = isStavropolCity(city)
    ? `Вызов нарколога на дом в ${city.namePrep}. От ${city.priceNarkolog.toLocaleString('ru')}₽. Приедем за ${city.arrivalTime} мин. Анонимно. ☎ ${city.phoneDisplay}`
    : `Вызов нарколога на дом в ${city.namePrep}. От ${city.priceNarkolog.toLocaleString('ru')}₽. Согласование выезда на линии. Анонимно. ☎ ${city.phoneDisplay}`
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
  const stv = isStavropolCity(city)

  return (
    <div className={`${styles.pageRoot} ${styles.pageNarkolog} page-narkolog-na-dom`}>
      <Header city={city} />
      <main>
        <section className={styles.hero} aria-labelledby="narkolog-hero-heading">
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroMesh} aria-hidden />
          <div className={`c ${styles.heroShell}`}>
            <div className={styles.heroMain}>
              <p className={styles.eyebrow}>Выезд врача · наркология · на адрес в {city.namePrep}</p>

              <div className={styles.heroBadges} aria-label="Формат выезда">
                <span className={styles.heroBadge}>
                  <span className={styles.heroBadgeDot} aria-hidden />
                  Врач‑нарколог на ваш адрес
                </span>
                <span className={styles.heroBadge}>
                  <span className={styles.heroBadgeDot} aria-hidden />
                  Помощь подбирается по состоянию
                </span>
              </div>

              <h1 id="narkolog-hero-heading" className={styles.title}>
                <span className={styles.titleKicker}>Вызов нарколога на дом</span>
                <span className={styles.titleMain}>
                  Очный осмотр и врачебная помощь на месте в&nbsp;{city.namePrep}
                </span>
              </h1>

              <p className={styles.heroSubline} aria-label="Стоимость выезда и согласование на линии">
                <span className={styles.heroSublineRest}>
                  {stv ? `ориентир ~${city.arrivalTime} мин до приезда` : 'срок выезда — на линии'}
                </span>
                <span className={styles.heroSublineSep} aria-hidden>
                  ·
                </span>
                <span className={styles.heroSublinePrice}>
                  <span className={styles.heroPriceFrom}>от</span>{' '}
                  <span className={styles.heroPriceValue}>{city.priceNarkolog.toLocaleString('ru')}</span>{' '}
                  <span className={styles.heroPriceCurrency}>₽</span>
                  <span className={styles.heroPricePer}>за выезд</span>
                </span>
              </p>

              <p className={styles.lead}>
                Врач‑нарколог приезжает по адресу: осмотр, оценка, помощь на дому — по показаниям. Стационар или другой формат обсуждаем спокойно, без
                давления.{' '}
                {stv
                  ? 'Время приезда и ориентир по стоимости — на линии; итог согласуем после осмотра.'
                  : 'Стоимость и порядок выезда — на линии; итог согласуем после осмотра.'}
              </p>

              <p className={styles.heroTrustStrip}>
                Лицензия · конфиденциально · без рекламы на авто · линия 24/7
              </p>

              <div className={styles.heroActionWell}>
                <OpenCallbackButton className={`btn btn-primary ${styles.heroCta} ${styles.ctaPremium}`}>
                  Запросить выезд нарколога
                </OpenCallbackButton>
                <p className={styles.heroCtaHint}>
                  Или наберите сами:{' '}
                  <a className={styles.heroTelLink} href={`tel:${city.phone}`}>
                    {city.phoneDisplay}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.includesSection} ic-narkolog-includes`} aria-labelledby="narkolog-includes-heading">
          <div className={`c ${styles.includesInner}`}>
            <header className={styles.includesHeader}>
              <p className={styles.includesKicker}>Формат выездной помощи</p>
              <h2 id="narkolog-includes-heading" className={styles.includesTitle}>
                Что входит в вызов нарколога
              </h2>
              <p className={styles.includesLead}>
                Шаги визита — ниже. Объём помощи — после осмотра, по показаниям; без универсального «пакета». При необходимости — разговор о стационаре или другом
                формате, без шаблонных обещаний.
              </p>
            </header>

            <ul className={styles.includesList}>
              {service.includes.map((item, i) => (
                <li key={i} className={styles.featureCard}>
                  <span className={styles.featureIcon} aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span className={styles.featureText}>{item}</span>
                </li>
              ))}
            </ul>

            <div className={styles.geoCard}>
              <p className={styles.geoKicker}>Выезд и срок</p>
              <h3 className={styles.geoTitle}>{stv ? 'По городу и ориентир по времени' : 'По городу и согласование выезда'}</h3>
              <p className={styles.geoLead}>
                {stv ? (
                  <>
                    Выезд в {city.namePrep} и по согласованию рядом с городом. Ориентир до приезда — около {city.arrivalTime} мин; фактическое время зависит от
                    района, дороги и загрузки линии — уточняем при звонке.
                  </>
                ) : (
                  <>
                    Выезд в {city.namePrep} и по согласованию с диспетчером. Порядок и срок приезда согласуют на линии — с учётом адреса, района и загрузки, без
                    универсальных «минут для всех» до разговора.
                  </>
                )}
              </p>
              {city.localText ? <p className={styles.geoLocal}>{city.localText}</p> : null}
            </div>

            {city.districts.length > 0 ? (
              <div className={styles.districtsBlock}>
                <h3 className={styles.districtsTitle}>Ориентиры по районам</h3>
                <p className={styles.districtsSubtitle}>В {city.namePrep}, в том числе:</p>
                <p className={styles.districtsNote}>Ориентиры; выезд за эти зоны — по согласованию на линии.</p>
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
    </div>
  )
}
