import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCityBySlug, getCitySlugs, getNearestStacionarCity } from '@/data/cities'
import Header from '@/components/Header'
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
  const canonical = `https://interclinics.ru/${city.slug}/stacionar/`
  const title = `Наркологический стационар в ${city.namePrep} — от ${city.priceStacionarDay.toLocaleString('ru')} ₽/сутки | ${BRAND_DISPLAY_NAME}`
  const description = `Наркологический стационар 24/7 в ${city.namePrep}: стационарное лечение, детоксикация, круглосуточное наблюдение, палаты. От ${city.priceStacionarDay.toLocaleString('ru')} ₽/сутки. ☎ ${city.phoneDisplay}`
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
  const nearest = getNearestStacionarCity(city)

  const galleryLead = city.hasStacionar
    ? 'Реальные палаты и среда — спокойный ориентир до разговора о поступлении.'
    : nearest
      ? `Те же стандарты — стационар сети в ${nearest.namePrep} при направлении из ${city.nameGen}. Заезд — на линии.`
      : 'Спокойная среда и режим отделения — без декора вместо факта.'

  const facadeAlt = city.hasStacionar
    ? 'Фасад и вход: ориентир на дороге к отделению'
    : nearest
      ? `Здание стационара сети в ${nearest.namePrep} — ориентир для приезда`
      : 'Фасад и вход: ориентир на дороге к отделению'

  const programs: {
    id: string
    tierLabel: string
    name: string
    duration: string
    price: number
    desc: string
    fitFor: string
    featured?: boolean
    featuredNote?: string
  }[] = [
    {
      id: 'detox',
      tierLabel: 'Старт',
      name: 'Детокс и стабилизация',
      duration: '3–5 дней',
      price: city.priceStacionarDetox,
      desc: 'Снятие интоксикации и выход в устойчивое состояние под наблюдением; дальше — динамика и план по врачу.',
      fitFor: 'Острое ухудшение, риск осложнений, короткий контролируемый старт.',
    },
    {
      id: 'standard',
      tierLabel: 'Основной формат',
      name: 'Стационар «Стандарт»',
      duration: '7–14 дней',
      price: city.priceStacionarStandard,
      desc: 'Детокс и терапия по показаниям, режим и наблюдение — полный этап при показаниях к госпитализации.',
      fitFor: 'Нужен цельный этап в отделении с горизонтом, не разовая стабилизация.',
      featured: true,
      featuredNote: 'Базовый сбалансированный маршрут при типичных показаниях — без урезания глубины ради цены.',
    },
    {
      id: 'full',
      tierLabel: 'Расширенный',
      name: 'Расширенное наблюдение',
      duration: '14–21 день',
      price: city.priceStacionarFull,
      desc: 'Удлинённое наблюдение и терапия: горизонт шире стандарта, динамику можно довести без спешки.',
      fitFor: 'Сложная картина, срывы после коротких этапов или продление по врачу.',
    },
  ]

  const careStages: { title: string; text: string }[] = [
    {
      title: 'Поступление и осмотр',
      text: 'Оформление, осмотр нарколога, объём госпитализации под ситуацию — без шаблонной «коробки».',
    },
    {
      title: 'Детоксикация и стабилизация',
      text: 'Снятие интоксикации, выход в устойчивое состояние под наблюдением; глубина этапа — по показаниям и динамике.',
    },
    {
      title: 'Терапия и наблюдение',
      text: 'Медикаментозная терапия, по показаниям психотерапия; план корректируют по ходу лечения.',
    },
    {
      title: 'Выписка и следующий шаг',
      text: 'Рекомендации после отделения и маршрут дальше — амбулаторно, реабилитация или иной шаг по показаниям; с врачом, без навязанного сценария.',
    },
  ]

  const relativesPoints: { title: string; text: string }[] = [
    {
      title: 'Первый контакт',
      text: 'По звонку или заявке — ситуация, места, очной приём. Госпитализация после осмотра; линия не подменяет решение врача.',
    },
    {
      title: 'Информация для семьи',
      text: 'Поступление, сроки, связь, передачи — по правилам отделения, ясно и без размытых обещаний.',
    },
    {
      title: 'Связь и посещения',
      text: 'Звонки и визиты — по режиму и плану лечащего врача, предсказуемо и без хаоса у палаты.',
    },
    {
      title: 'Если нужна помощь сегодня',
      text: 'Линия 24/7: срочность, места, дорога, что взять. Стационар не показан — скажут прямо и подскажут формат.',
    },
    {
      title: 'Разговор о помощи',
      text: 'По запросу — как говорить с близким о лечении без ультиматума: тише тон, меньше риска срыва контакта.',
    },
    {
      title: 'Обратная связь',
      text: 'Вопросы на линии и в отделении — по существу; семья не остаётся с неопределённостью после первого звонка.',
    },
  ]

  const whenReasons: { title: string; text: string }[] = [
    {
      title: 'Тяжёлая динамика',
      text: 'Состояние меняется быстро — нужны решения врача и непрерывное наблюдение без разрыва.',
    },
    {
      title: 'Наблюдение день и ночь',
      text: 'Режим отделения и присутствие врача такого уровня дома или «только амбулаторно» не закрывают.',
    },
    {
      title: 'Дома не держит безопасность',
      text: 'Риск ухудшения, травмы или конфликта без круглосуточного контроля.',
    },
    {
      title: 'После помощи дома',
      text: 'Срыв или нет прогресса после амбулаторного формата — возможна стабилизация в стационаре.',
    },
    {
      title: 'Сложно семье одной',
      text: 'Семья не всегда тянет суточный уход; в отделении режим ведут специалисты.',
    },
    {
      title: 'Перед следующим этапом',
      text: 'Короткая стабилизация перед другой терапией — срок и объём по осмотру и динамике.',
    },
  ]

  const trustFacts: { title: string; text: string }[] = [
    {
      title: 'Лицензированная основа',
      text: 'Помощь в рамках лицензии — проверяемая опора, не декларация.',
    },
    {
      title: city.hasStacionar ? 'Реальное отделение' : 'Госпитализация по показаниям',
      text: city.hasStacionar
        ? `Отделение в ${city.namePrep}: палаты, режим, маршрут поступления — конкретное место, не абстракция.`
        : nearest
          ? `При показаниях — стационар сети в ${nearest.namePrep}; заезд и порядок — на линии.`
          : 'Стационар сети; география и формат — по ситуации на линии.',
    },
    {
      title: 'Наблюдение без разрыва',
      text: 'Нарколог и персонал без «окон» в контроле; план по динамике.',
    },
    {
      title: 'Палаты и среда',
      text: city.hasStacionar
        ? 'Фото ниже — с объекта; среду можно оценить до разговора о поступлении.'
        : 'Условия и фото — по стационару сети при направлении; детали на линии.',
    },
    {
      title: 'За себя или за близкого',
      text: 'Звонок за взрослого родственника — обычный запрос; на линии помогут сформулировать без навязанного решения.',
    },
    {
      title: 'Конфиденциальность',
      text: 'Персональные данные — по закону и политике; сведения о лечении — врачебная тайна.',
    },
  ]

  const todaySteps: { lead: string; detail: string }[] = [
    {
      lead: 'Звонок или заявка',
      detail: 'Линия 24/7 — и при остром случае, и если нужен только следующий шаг.',
    },
    {
      lead: 'Разбор на линии',
      detail: 'Состояние, места, формат помощи. Поступление без осмотра не обещают.',
    },
    {
      lead: 'Порядок поступления',
      detail: 'Документы, вещи, заезд в отделение — объясняют спокойно, по шагам.',
    },
    {
      lead: 'Время и маршрут',
      detail: 'Согласуют удобно. До решения врача вы ни к чему не обязаны.',
    },
  ]

  return (
    <div className={`${styles.pageRoot} ${styles.pageStacionar} page-stacionar`}>
      <Header city={city} />
      <main lang="ru">
        <section className={styles.hero} aria-labelledby="stacionar-hero-heading">
          <div className={`c ${styles.heroShell}`}>
            <div className={styles.heroMain}>
              <p className={styles.eyebrow}>Наркологический стационар · круглосуточно</p>

              <div className={styles.heroBadges} aria-label="Ключевые ориентиры">
                <span className={`${styles.heroBadge} ${styles.heroBadgeStacionar}`}>
                  <span className={styles.heroBadgeDot} aria-hidden />
                  Стационар 24/7
                </span>
                <span className={styles.heroBadge}>
                  <span className={styles.heroBadgeDot} aria-hidden />
                  Наблюдение врача 24/7
                </span>
                <span className={`${styles.heroBadge} ${styles.heroBadgeThird}`}>
                  <span className={styles.heroBadgeDot} aria-hidden />
                  Лицензия
                </span>
              </div>

              <h1 id="stacionar-hero-heading" className={styles.title}>
                <span className={styles.titleGold}>Наркологический стационар</span>
                <span className={styles.titleSubline}>
                  <span className={styles.title24}>24/7</span>
                  <span className={styles.titleGeoSep} aria-hidden>
                    ·
                  </span>
                  <em className={styles.titleGeoEm}>в {city.namePrep}</em>
                </span>
              </h1>

              <p className={styles.heroSubline} aria-label="Ориентир стоимости и условия">
                <span className={styles.heroSublinePrice}>
                  <span className={styles.heroPriceFrom}>от</span>{' '}
                  <span className={styles.heroPriceValue}>{city.priceStacionarDay.toLocaleString('ru')}</span>{' '}
                  <span className={styles.heroPriceCurrency}>₽</span>
                  <span className={styles.heroPricePer}>/ сутки</span>
                </span>
                <span className={styles.heroSublineSep} aria-hidden>
                  ·
                </span>
                <span className={styles.heroSublineRest}>палаты и питание по режиму</span>
              </p>

              <p className={styles.lead}>
                Стационарное лечение и наблюдение по показаниям — единый маршрут. Срок и план задаёт врач после осмотра.
              </p>

              <p className={styles.heroTrustStrip}>
                Конфиденциальность · можно за себя или за близкого
                {city.hasStacionar
                  ? ` · формат в ${city.namePrep}`
                  : nearest
                    ? ` · направление при показаниях — ${nearest.namePrep}`
                    : ` · сеть клиник ${BRAND_DISPLAY_NAME}`}
              </p>

              {city.hasStacionar && city.stacionarAddress && (
                <div className={styles.heroLocation} aria-label="Адрес стационара">
                  <p className={styles.heroLocationKicker}>Стационар</p>
                  <p className={styles.heroLocationAddress}>{city.stacionarAddress}</p>
                  <p className={styles.heroLocationMeta}>Очный приём · линия 24/7</p>
                </div>
              )}

              {!city.hasStacionar && nearest && (
                <p className={styles.heroNote}>
                  Из {city.nameGen} при показаниях — стационар сети в {nearest.namePrep}
                  {typeof city.nearestStacionarDistance === 'number' && ` (~${city.nearestStacionarDistance} км)`}. Адрес и заезд — на
                  линии.
                </p>
              )}

              <div className={styles.heroActionWell}>
                <div className={styles.heroPhoneRow}>
                  <span className={styles.heroPhoneLabel}>Линия</span>
                  <a className={styles.heroPhoneLink} href={`tel:${city.phone}`}>
                    {city.phoneDisplay}
                  </a>
                </div>
                <OpenCallbackButton className={`btn btn-primary ${styles.heroCta} ${styles.ctaPremium}`}>
                  Обсудить госпитализацию
                </OpenCallbackButton>
                <p className={styles.heroCtaHint}>
                  Перезвоним по показаниям и местам. До решения врача — без обязательств.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.whenSection} aria-labelledby="stacionar-when-heading">
          <div className={`c ${styles.whenInner}`}>
            <header className={styles.whenHead}>
              <p className={styles.whenKicker}>Стационар и показания</p>
              <h2 id="stacionar-when-heading" className={styles.whenTitle}>
                Когда обычно уместен наркологический стационар
              </h2>
              <p className={styles.whenLead}>
                Дома и амбулаторно часто достаточно. Стационар — когда нужны непрерывное наблюдение и лечение в отделении по
                показаниям, не «на всякий случай». Объём и уместность решает врач после осмотра.
              </p>
            </header>
            <ul className={styles.whenGrid}>
              {whenReasons.map((r, idx) => (
                <li key={r.title} className={styles.whenCard}>
                  <div className={styles.whenCardHead}>
                    <span className={styles.whenCardIndex} aria-hidden>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className={styles.whenCardTitle}>{r.title}</p>
                  </div>
                  <p className={styles.whenCardText}>{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.trustSection} aria-labelledby="stacionar-trust-heading">
          <div className={`c ${styles.trustInner}`}>
            <header className={styles.trustHead}>
              <p className={styles.trustKicker}>Опора маршрута</p>
              <h2 id="stacionar-trust-heading" className={styles.trustHeading}>
                На чём держится маршрут наркологического стационара
              </h2>
              <p className={styles.trustSub}>
                Лицензия, режим отделения, непрерывное наблюдение — управляемый клинический процесс: правила, условия, ответственность
                врача. Без декора и пустых обещаний.
              </p>
            </header>
            <ul className={styles.trustGrid}>
              {trustFacts.map((f, idx) => (
                <li key={f.title} className={styles.trustCard}>
                  <span className={styles.trustCardIndex} aria-hidden>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.trustCardBody}>
                    <p className={styles.trustCardTitle}>{f.title}</p>
                    <p className={styles.trustCardText}>{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.todaySection} aria-labelledby="stacionar-today-heading">
          <div className={`c ${styles.todayInner}`}>
            <header className={styles.todayHead}>
              <p className={styles.todayKicker}>До отделения</p>
              <h2 id="stacionar-today-heading" className={styles.todayTitle}>
                Как проходит путь до поступления в стационар
              </h2>
              <p className={styles.todayLead}>
                Понятный порядок без давления: объём и поступление решает врач после осмотра, не «вслепую» по телефону.
              </p>
            </header>
            <ol className={styles.todayList}>
              {todaySteps.map((step, i) => (
                <li key={step.lead} className={styles.todayStep}>
                  <span className={styles.todayStepNum} aria-hidden>
                    {i + 1}
                  </span>
                  <div className={styles.todayStepBody}>
                    <p className={styles.todayStepLead}>{step.lead}</p>
                    <p className={styles.todayStepDetail}>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={styles.todayCta}>
              <OpenCallbackButton className={`btn btn-primary ${styles.todayCtaBtn} ${styles.ctaPremium}`}>
                Обсудить поступление в стационар
              </OpenCallbackButton>
            </div>
          </div>
        </section>

        <section className={styles.programsSection} aria-labelledby="stacionar-programs-heading">
          <div className={`c ${styles.sectionInner}`}>
            <header className={styles.sectionHeader}>
              <p className={styles.sectionKicker}>Глубина маршрута</p>
              <h2 id="stacionar-programs-heading" className={styles.sectionTitle}>
                Три уровня стационарного лечения
              </h2>
              <p className={styles.sectionLead}>
                Стабилизация, полный этап или расширенное наблюдение — разная глубина, не витрина тарифов. Сумма в карточке за
                типичный полный срок; суточный ориентир — ниже. Итоговый план после осмотра.
              </p>
            </header>

            <div className={styles.programExplainer} role="note">
              <div className={styles.programExplainerInner}>
                <div className={styles.programExplainerCell}>
                  <p className={styles.programExplainerLabel}>Суточный ориентир</p>
                  <p className={styles.programExplainerDetail}>
                    от {city.priceStacionarDay.toLocaleString('ru')} ₽ / сутки — размещение и наблюдение.
                  </p>
                </div>
                <div className={styles.programExplainerCell}>
                  <p className={styles.programExplainerLabel}>Сумма в карточке</p>
                  <p className={styles.programExplainerDetail}>за полный типичный срок программы — терапия за период, не «сутки × дни».</p>
                </div>
              </div>
            </div>

            <div className={styles.programGrid}>
              {programs.map(p => (
                <article
                  key={p.id}
                  className={`${styles.programCard} ${p.featured ? styles.programCardFeatured : ''}`}
                >
                  <div className={styles.programTierRow}>
                    <span className={styles.programTier}>{p.tierLabel}</span>
                    {p.featured ? <span className={styles.programTierBadge}>Базовый полный маршрут</span> : null}
                  </div>
                  <div className={styles.programCardMain}>
                    <p className={styles.programDuration}>{p.duration}</p>
                    <h3 className={styles.programName}>{p.name}</h3>
                    {p.featured && p.featuredNote ? <p className={styles.programFeaturedNote}>{p.featuredNote}</p> : null}
                    <p className={styles.programDesc}>{p.desc}</p>
                    <p className={styles.programFit}>
                      <span className={styles.programFitLabel}>Когда уместно</span>
                      <span className={styles.programFitText}>{p.fitFor}</span>
                    </p>
                  </div>
                  <div className={styles.programPriceBlock}>
                    <div className={styles.programPrice}>
                      <span className={styles.programPriceValue}>{p.price.toLocaleString('ru')}</span>
                      <span className={styles.programPriceCurrency}>₽</span>
                    </div>
                    <div className={styles.programPriceHint}>ориентир за полный типичный срок</div>
                  </div>
                </article>
              ))}
            </div>
            <div className={styles.programsClosing}>
              <p className={styles.programsFooterNote}>
                Цифры не заменяют осмотр: план и объём — после оценки врача.
              </p>
              <div className={styles.programsBlockCta}>
                <OpenCallbackButton className={`btn btn-secondary ${styles.programsCtaBtn} ${styles.ctaPremiumSecondary}`}>
                  Согласовать программу и поступление
                </OpenCallbackButton>
              </div>
            </div>
          </div>
        </section>

        <section className={`stacionar-section ${styles.evidenceSection}`} aria-labelledby="stacionar-gallery-heading">
          <div className="stacionar-section__glow" aria-hidden />
          <div className={`c ${styles.stacionarRoomsBlock}`}>
            <div className={styles.stacionarEvidencePanel}>
              <div className="stacionar-gallery">
                <header className="stacionar-gallery__head">
                  <p className={styles.evidenceKicker}>Среда отделения</p>
                  <h2 id="stacionar-gallery-heading" className="stacionar-gallery__title">
                    Палаты стационара: среда и быт при лечении
                  </h2>
                  <p className="stacionar-gallery__lead">{galleryLead}</p>
                </header>
                <div className="stacionar-gallery__top">
                  <figure className="stacionar-gallery__figure stacionar-gallery__figure--hero">
                    <Image
                      src="/images/stacionar/room-single.png"
                      alt="Одноместная палата: дневной свет, спокойная обстановка для отдыха"
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
                        alt="Двухместная палата — привычное размещение в отделении"
                        width={800}
                        height={600}
                        loading="lazy"
                        sizes="(max-width: 980px) 100vw, 34vw"
                      />
                    </figure>
                    <figure className="stacionar-gallery__figure stacionar-gallery__figure--stack">
                      <Image
                        src="/images/stacionar/room-detail.png"
                        alt="Быт в палате: зона отдыха без лишней суеты"
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

              <div className={styles.stacionarEvidenceFoot}>
                <p className={styles.stacionarEvidenceBridge}>
                  Снимки — пространство; блок ниже — режим быта и наблюдения в том же отделении.
                </p>

                <div className="stacionar-conditions">
                  <h3 id="stacionar-conditions-heading" className="stacionar-conditions__title">
                    Пребывание в отделении
                  </h3>
                  <ul className="stacionar-conditions__list">
                    <li>Одно- и двухместные палаты; бельё и гигиена по режиму. Санузел — в палате или по корпусу.</li>
                    <li>Питание по графику; диета — по назначению врача.</li>
                    <li>Наблюдение нарколога и персонала; план корректируют по динамике.</li>
                    <li>Режим дня: процедуры, психотерапия по показаниям, отдых — в индивидуальном плане.</li>
                    <li>Персональные данные и врачебная тайна — по закону. Связь с близкими — по регламенту и с врачом.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.contentSection} ${styles.contentSectionMuted} ${styles.stacionarRouteBand}`}
          aria-labelledby="stacionar-stages-heading"
        >
          <div className={`c ${styles.stacionarRouteInner}`}>
            <header className={styles.stacionarRouteHead}>
              <p className={styles.stacionarRouteKicker}>Госпитализация и этапы лечения</p>
              <h2 id="stacionar-stages-heading" className={styles.stacionarRouteTitle}>
                Как проходит пребывание и лечение в стационаре
              </h2>
              <p className={styles.stacionarRouteLead}>
                Четыре шага — от оформления до плана после выписки. Ведёт врач; сроки и объём — по осмотру и динамике, не по
                шаблону.
              </p>
            </header>
            <div className={styles.stacionarProcessShell}>
              <ol className={styles.stacionarStagesGrid}>
                {careStages.map((stage, index) => (
                  <li key={stage.title} className={styles.stacionarStageCard}>
                    <div className={styles.stacionarStageCardRow}>
                      <span className={styles.stacionarStageNum} aria-hidden="true">
                        {index + 1}
                      </span>
                      <div className={styles.stacionarStageCardMain}>
                        <h3 className={styles.stacionarStageName}>{stage.title}</h3>
                        <p className={styles.stacionarStageText}>{stage.text}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          className={`${styles.contentSection} ${styles.stacionarRelativesBand}`}
          aria-labelledby="stacionar-relatives-heading"
        >
          <div className={`c ${styles.stacionarRelativesInner}`}>
            <header className={styles.stacionarRelHead}>
              <p className={styles.relativesKicker}>Рядом с близким</p>
              <h2 id="stacionar-relatives-heading" className={styles.stacionarRelTitle}>
                Для родственников: понятный маршрут
              </h2>
              <p className={styles.stacionarRelLead}>
                Порядок госпитализации, связь и контакты — объясняют спокойно, шаг за шагом, без «пустоты после увоза».
              </p>
            </header>
            <div className={styles.stacionarRelativesShell}>
              <ul className={styles.stacionarRelList}>
                {relativesPoints.map(point => (
                  <li key={point.title} className={styles.stacionarRelItem}>
                    <p className={styles.stacionarRelItemTitle}>{point.title}</p>
                    <p className={styles.stacionarRelItemText}>{point.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.midCta} aria-labelledby="stacionar-mid-cta-heading">
          <div className={`c ${styles.midCtaInner}`}>
            <h2 id="stacionar-mid-cta-heading" className={styles.midCtaTitle}>
              Госпитализация в стационар — линия 24/7
            </h2>
            <p className={styles.midCtaLead}>
              Показания, палаты, поступление — на линии. Номер для перезвона — по желанию.
            </p>
            <a className={`${styles.midCtaPhone} ${styles.ctaPremiumPhone}`} href={`tel:${city.phone}`}>
              {city.phoneDisplay}
            </a>
          </div>
        </section>

        <FAQ city={city} variant="stacionar" />
        <CTASection city={city} variant="stacionar" />
      </main>

      <Footer city={city} activeHref={`/${city.slug}/stacionar/`} />
      <div className="ic-mockup-scroll-pad" aria-hidden="true" />
      <MobileBar city={city} />
      <CallbackModal city={city} />
      <CookieConsent />
    </div>
  )
}
