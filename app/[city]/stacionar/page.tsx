import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCityBySlug, getCitySlugs } from '@/data/cities'
import Header from '@/components/Header'
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
  const canonical = `https://interclinics.ru/${city.slug}/stacionar/`
  const title = `Наркологический стационар в ${city.namePrep} — от ${city.priceStacionarDay}₽/сутки | ${BRAND_DISPLAY_NAME}`
  const description = `Стационар 24/7 в ${city.namePrep}: детоксикация, наблюдение врача, палаты. От ${city.priceStacionarDay.toLocaleString('ru')} ₽/сутки. ☎ ${city.phoneDisplay}`
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

export default function StacionarPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()
  const nearest =
    city.hasStacionar || !city.nearestStacionarSlug ? null : getCityBySlug(city.nearestStacionarSlug)

  const galleryLead =
    city.hasStacionar
      ? 'Реальные помещения и фасад клиники — без постановочных рендеров. Так проще оценить обстановку до разговора о госпитализации.'
      : nearest
        ? `Фото стационара сети в ${nearest.namePrep}, куда при показаниях направляют из ${city.nameGen}. Реальные помещения — без постановочных рендеров; адрес и маршрут уточняем при звонке.`
        : 'Реальные помещения и фасад клиники — без постановочных рендеров. Так проще оценить обстановку до разговора о госпитализации.'

  const facadeAlt = city.hasStacionar
    ? 'Здание клиники и вывеска — ориентир для приезда'
    : nearest
      ? `Фасад стационара сети в ${nearest.namePrep}`
      : 'Здание клиники и вывеска — ориентир для приезда'

  const programs: {
    id: string
    name: string
    duration: string
    price: number
    desc: string
    featured?: boolean
    featuredNote?: string
  }[] = [
    {
      id: 'detox',
      name: 'Детокс и стабилизация',
      duration: '3–5 дней',
      price: city.priceStacionarDetox,
      desc: 'Короткий стационарный этап: снятие интоксикации и клиническая стабилизация. Дальнейший объём терапии оценивается по динамике и показаниям.',
    },
    {
      id: 'standard',
      name: 'Стационар «Стандарт»',
      duration: '7–14 дней',
      price: city.priceStacionarStandard,
      desc: 'Базовая полноценная программа: наблюдение врача, детоксикация и медикаментозная терапия, психотерапия по показаниям, режим и контроль состояния.',
      featured: true,
      featuredNote: 'Часто согласуется как стартовый формат при устойчивых показаниях к госпитализации.',
    },
    {
      id: 'full',
      name: 'Расширенное наблюдение',
      duration: '14–21 день',
      price: city.priceStacionarFull,
      desc: 'Удлинённый срок при необходимости более глубокой терапии, выраженной симптоматике или подготовки к последующему восстановлению вне острой фазы.',
    },
  ]

  const careStages: { title: string; text: string }[] = [
    {
      title: 'Поступление и осмотр',
      text: 'Оформление, очный приём нарколога и согласование программы: объём помощи подбирают под клиническую картину, а не «по шаблону».',
    },
    {
      title: 'Детоксикация и стабилизация',
      text: 'Снятие острой интоксикации и медикаментозная поддержка, наблюдение до стабилизации состояния — по показаниям и динамике.',
    },
    {
      title: 'Терапия и наблюдение',
      text: 'Лечение по индивидуальному плану: при необходимости психотерапия и консультации, круглосуточный контроль и коррекция терапии по ходу.',
    },
    {
      title: 'Выписка и следующий шаг',
      text: 'Рекомендации на период после стационара и обсуждение дальнейшего маршрута восстановления — вместе с вами и лечащим врачом, без навязанных обещаний.',
    },
  ]

  const relativesPoints: { title: string; text: string }[] = [
    {
      title: 'Связь и посещения',
      text: 'Визиты и звонки — по правилам отделения и после согласования с лечащим врачом: так учитываются и клиническая ситуация, и безопасность пациента.',
    },
    {
      title: 'Прозрачность процесса',
      text: 'Родственникам объясняют, как устроена помощь и на что ориентироваться, чтобы вы не оставались в неведении посреди лечения.',
    },
    {
      title: 'Разговор о помощи',
      text: 'По запросу — спокойные ориентиры, как обсуждать лечение и госпитализацию с близким: без давления, морализаторства и провоцирования конфликта.',
    },
    {
      title: 'Опора на связи',
      text: 'Вопросы можно уточнять на линии и с персоналом отделения — семья не «теряется» в процессе, пока пациент под наблюдением.',
    },
  ]

  return (
    <div className={styles.pageRoot}>
      <Header city={city} />
      <main>
        <section className={styles.hero} aria-labelledby="stacionar-hero-heading">
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroMesh} aria-hidden />
          <div className={`c ${styles.heroInner}`}>
            <p className={styles.eyebrow}>Стационар · наркология · круглосуточно</p>

            <ul className={styles.heroTrustRow} aria-label="Условия и ориентиры">
              <li className={styles.trustPill}>
                <span className={styles.trustPillDot} aria-hidden />
                от {city.priceStacionarDay.toLocaleString('ru')} ₽ / сутки
              </li>
              <li className={styles.trustPill}>Наблюдение врача 24/7</li>
              <li className={styles.trustPill}>Палаты и питание</li>
              <li className={styles.trustPill}>Пациент и семья</li>
            </ul>

            <h1 id="stacionar-hero-heading" className={styles.title}>
              <span className={styles.titleKicker}>Наркологический стационар 24/7</span>
              <span className={styles.titleSub}>в {city.namePrep}</span>
              <span className={styles.titleRoute}>
                Детоксикация, круглосуточное наблюдение и терапия в стационаре — единый медицинский маршрут, а не только размещение
              </span>
            </h1>

            <p className={styles.lead}>
              Круглосуточное наблюдение нарколога, палаты, питание по режиму, детоксикация и медикаментозная терапия по показаниям. После
              стабилизации — согласование дальнейшего восстановления. Без давления на решение и без обещаний «быстрого излечения» — врач
              определяет план лечения при очном осмотре.
            </p>

            {!city.hasStacionar && nearest && (
              <p className={styles.heroNote}>
                В {city.namePrep} госпитализация в стационаре сети — по направлению в {nearest.namePrep}
                {typeof city.nearestStacionarDistance === 'number' && ` (ориентир ~${city.nearestStacionarDistance} км)`}. Адрес и маршрут
                уточняем при звонке.
              </p>
            )}

            {city.hasStacionar && city.stacionarAddress && (
              <div className={styles.heroAddressCard}>
                <p className={styles.heroAddressLabel}>Стационар</p>
                <p className={styles.heroAddressText}>{city.stacionarAddress}</p>
              </div>
            )}

            <OpenCallbackButton className={styles.heroCta}>Обсудить госпитализацию</OpenCallbackButton>
            <p className={styles.heroCtaHint}>
              Перезвоним, уточним показания и доступность мест — до решения о поступлении вы ни к чему не обязаны.
            </p>
          </div>
        </section>

        <section className={styles.programsSection} aria-labelledby="stacionar-programs-heading">
          <div className={`c ${styles.sectionInner}`}>
            <header className={styles.sectionHeader}>
              <p className={styles.sectionKicker}>Форматы стационара</p>
              <h2 id="stacionar-programs-heading" className={styles.sectionTitle}>
                Три программы разной глубины и срока
              </h2>
              <p className={styles.sectionLead}>
                Ниже — не «тарифы за койко-место», а ориентиры по полным программам разной продолжительности: от короткой стабилизации до углублённого наблюдения. Окончательный формат и срок определяет врач после осмотра и согласования с вами.
              </p>
            </header>
            <div className={styles.programGrid}>
              {programs.map(p => (
                <article
                  key={p.id}
                  className={`${styles.programCard} ${p.featured ? styles.programCardFeatured : ''}`}
                >
                  {p.featured && p.featuredNote ? (
                    <p className={styles.programFeaturedNote}>{p.featuredNote}</p>
                  ) : null}
                  <p className={styles.programDuration}>{p.duration}</p>
                  <h3 className={styles.programName}>{p.name}</h3>
                  <p className={styles.programDesc}>{p.desc}</p>
                  <div className={styles.programPriceBlock}>
                    <div className={styles.programPrice}>{p.price.toLocaleString('ru')} ₽</div>
                    <div className={styles.programPriceHint}>за программу полного срока</div>
                  </div>
                </article>
              ))}
            </div>
            <p className={styles.programsFooterNote}>
              Выбор программы и решение о поступлении обсуждаются на линии и с врачом: ориентиры по цене не заменяют очный осмотр и индивидуальный план.
            </p>
            <div className={styles.programsBlockCta}>
              <OpenCallbackButton className={styles.programsCtaBtn}>Уточнить формат программы</OpenCallbackButton>
            </div>
          </div>
        </section>

        <section className="stacionar-section" aria-labelledby="stacionar-gallery-heading">
          <div className="stacionar-section__glow" aria-hidden />
          <div className={`c ${styles.stacionarRoomsBlock}`}>
            <div className="stacionar-gallery">
              <header className="stacionar-gallery__head">
                <h2 id="stacionar-gallery-heading" className="stacionar-gallery__title">
                  Палаты и условия пребывания
                </h2>
                <p className="stacionar-gallery__lead">{galleryLead}</p>
              </header>
              <div className="stacionar-gallery__top">
                <figure className="stacionar-gallery__figure stacionar-gallery__figure--hero">
                  <Image
                    src="/images/stacionar/room-single.png"
                    alt="Одноместная палата стационара: кровать, стол, телевизор"
                    width={1200}
                    height={900}
                    priority
                    sizes="(max-width: 980px) 100vw, min(1080px, 92vw)"
                  />
                </figure>
                <div className="stacionar-gallery__stack">
                  <figure className="stacionar-gallery__figure stacionar-gallery__figure--stack">
                    <Image
                      src="/images/stacionar/room-double.png"
                      alt="Двухместное размещение в палате"
                      width={800}
                      height={600}
                      loading="lazy"
                      sizes="(max-width: 980px) 100vw, 34vw"
                    />
                  </figure>
                  <figure className="stacionar-gallery__figure stacionar-gallery__figure--stack">
                    <Image
                      src="/images/stacionar/room-detail.png"
                      alt="Палата: рабочая зона и бытовые детали"
                      width={800}
                      height={600}
                      loading="lazy"
                      sizes="(max-width: 980px) 100vw, 34vw"
                    />
                  </figure>
                </div>
              </div>
              <figure className="stacionar-gallery__figure stacionar-gallery__figure--facade">
                <Image
                  src="/images/stacionar/facade.png"
                  alt={facadeAlt}
                  width={1600}
                  height={700}
                  loading="lazy"
                  sizes="(max-width: 980px) 100vw, min(1080px, 92vw)"
                />
              </figure>
            </div>

            <div className="stacionar-conditions">
              <h3 id="stacionar-conditions-heading" className="stacionar-conditions__title">
                Условия размещения
              </h3>
              <ul className="stacionar-conditions__list">
                <li>Одно- и двухместные палаты; постельное бельё и санузел — в палате или в отделении по корпусу.</li>
                <li>Питание три раза в сутки по режиму; диетические варианты — по назначению врача.</li>
                <li>Наблюдение нарколога и среднего медперсонала круглосуточно; терапия корректируется по клинической динамике.</li>
                <li>Режим дня: процедуры, психотерапия по показаниям, отдых — в рамках индивидуального плана.</li>
                <li>Конфиденциальность и понятные правила контактов с близкими — без лишнего шума и давления.</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className={`${styles.contentSection} ${styles.contentSectionMuted} ${styles.stacionarRouteBand}`}
          aria-labelledby="stacionar-stages-heading"
        >
          <div className={`c ${styles.stacionarRouteInner}`}>
            <header className={styles.stacionarRouteHead}>
              <p className={styles.stacionarRouteKicker}>Маршрут пациента</p>
              <h2 id="stacionar-stages-heading" className={styles.stacionarRouteTitle}>
                Как проходит пребывание
              </h2>
              <p className={styles.stacionarRouteLead}>
                Четыре понятных этапа — от поступления до плана после выписки. Конкретные сроки и объём терапии определяет врач по осмотру и динамике.
              </p>
            </header>
            <ol className={styles.stacionarStagesGrid}>
              {careStages.map((stage, index) => (
                <li key={stage.title} className={styles.stacionarStageCard}>
                  <span className={styles.stacionarStageNum} aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3 className={styles.stacionarStageName}>{stage.title}</h3>
                  <p className={styles.stacionarStageText}>{stage.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className={`${styles.contentSection} ${styles.stacionarRelativesBand}`}
          aria-labelledby="stacionar-relatives-heading"
        >
          <div className={`c ${styles.stacionarRouteInner}`}>
            <header className={styles.stacionarRelHead}>
              <h2 id="stacionar-relatives-heading" className={styles.stacionarRelTitle}>
                Для родственников
              </h2>
              <p className={styles.stacionarRelLead}>
                Когда понятен порядок действий в стационаре, семье проще сохранять спокойную поддержку рядом — без хаоса, суеты и ощущения, что «человека просто увезли и замолчали».
              </p>
            </header>
            <ul className={styles.stacionarRelList}>
              {relativesPoints.map(point => (
                <li key={point.title} className={styles.stacionarRelItem}>
                  <p className={styles.stacionarRelItemTitle}>{point.title}</p>
                  <p className={styles.stacionarRelItemText}>{point.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.midCta} aria-labelledby="stacionar-mid-cta-heading">
          <div className={`c ${styles.midCtaInner}`}>
            <h2 id="stacionar-mid-cta-heading" className={styles.midCtaTitle}>
              Запись на госпитализацию
            </h2>
            <p className={styles.midCtaLead}>Позвоните или оставьте заявку — подберём программу и ответим на вопросы.</p>
            <a className={styles.midCtaPhone} href={`tel:${city.phone}`}>
              {city.phoneDisplay}
            </a>
          </div>
        </section>

        <FAQ city={city} variant="stacionar" />
        <CTASection city={city} variant="stacionar" />
      </main>

      <Footer city={city} activeHref={`/${city.slug}/stacionar/`} />
      <div className="ic-mockup-scroll-pad" aria-hidden="true" />
      <MobileBar city={city} variant="stacionar" />
      <CallbackModal city={city} />
      <CookieConsent />
      <FloatingWhatsApp city={city} />
    </div>
  )
}
