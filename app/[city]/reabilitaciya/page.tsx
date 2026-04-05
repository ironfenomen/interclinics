// app/[city]/reabilitaciya/page.tsx — психосоциальная реабилитация (один шаблон на все города; отличия только от данных City)
import { Metadata } from 'next'
import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'
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
import styles from './page.module.css'

/** Не показывать заглушки вида «ул. ХХХХ» — ломают доверие. */
function isPlaceholderRehabAddress(addr: string): boolean {
  return /[ХX]{3,}|ХХХХ|XXXX|ул\.\s*[ХX]{2,}/i.test(addr)
}

/** Эталонный каркас «что входит» — психосоциальная программа, без мед. обещаний */
const PROGRAM_INCLUDES: { title: string; desc: string }[] = [
  {
    title: 'Проживание и дневной режим',
    desc: 'Структурированные дни: сон, питание, активности — чтобы снять хаос и вернуть опору телу и вниманию.',
  },
  {
    title: 'Индивидуальная и групповая работа',
    desc: 'Встречи с психологом и групповые форматы — про мотивацию, срывы, отношения и опору без оценки «слабости».',
  },
  {
    title: 'Группы поддержки',
    desc: 'Общение с теми, кто проходит похожий путь: меньше одиночества, больше ясности, как жить дальше.',
  },
  {
    title: 'Кураторы и сопровождение',
    desc: 'Понятный контакт по программе: к кому с вопросом по режиму, границам и следующему шагу.',
  },
  {
    title: 'Сопровождение между этапами',
    desc: 'Не «выписали и забыли»: договорённости, как держать курс после напряжённых дней и перед возвращением домой.',
  },
  {
    title: 'Навыки и адаптация',
    desc: 'Практики для быта, общения, работы с тягой и стрессом — то, что переносится в обычную жизнь.',
  },
  {
    title: 'Подготовка к возвращению',
    desc: 'Спокойная разборка сценариев: дом, работа, круг общения — чтобы снизить риск хаотичного срыва.',
  },
]

export async function generateStaticParams() {
  return getCitySlugs().map(slug => ({ city: slug }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}
  const pageUrl = `https://interclinics.ru/${city.slug}/reabilitaciya/`
  const title = `Реабилитация и восстановление в ${city.namePrep} — программа сопровождения | ${BRAND_DISPLAY_NAME}`
  const description = `Психосоциальное восстановление в ${city.namePrep}: этапность, сопровождение, работа с семьёй. Ориентир от ${city.priceRehabDay.toLocaleString('ru')} ₽/сутки. Консультация по срокам. ☎ ${city.phoneDisplay}`
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

export default function ReabilitaciyaPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()

  /** Центр сети для логистики программы, если в городе нет своей реабилитации — единый хелпер из data/cities */
  const routeCenter = !city.hasRehab ? getNearestStacionarCity(city) : undefined

  const programs: {
    horizon: string
    title: string
    tagline: string
    price: number
    term: string
    body: string
    diff: string
  }[] = [
    {
      horizon: 'Вход в маршрут',
      title: '28 дней',
      tagline: 'Старт восстановления',
      price: city.priceRehab28,
      term: 'вход в программу',
      body: 'Первый цикл: стабилизировать режим, познакомиться с группой и правилами, начать работу с запросом «зачем я здесь».',
      diff: 'Подходит как первый шаг после стационара или если нужен короткий, структурированный ввод без обещания «полной перестройки за месяц».',
    },
    {
      horizon: 'Углубление',
      title: '90 дней',
      tagline: 'Углубление и устойчивость',
      price: city.priceRehab90,
      term: 'средняя глубина',
      body: 'Больше времени на привыкание к трезвости, повторяющиеся ситуации и отношения — меньше иллюзии «я уже справился».',
      diff: 'Имеет смысл, когда важна не скорость, а закрепление: навыки, доверие к процессу, ясность следующего этапа.',
    },
    {
      horizon: 'Длинный горизонт',
      title: '6 месяцев',
      tagline: 'Длительное сопровождение',
      price: city.priceRehab6Mo,
      term: 'долгий горизонт',
      body: 'Формат для тех, кому нужен спокойный темп и сопровождение при серьёзной перестройке жизни, а не рывок.',
      diff: 'Срок не «гарантирует результат» — он даёт пространство для устойчивости, а итог по-прежнему зависит от участия человека и контекста.',
    },
  ]

  return (
    <div className={`${styles.pageRoot} ${styles.pageReabilitaciya} page-reabilitaciya`}>
      <Header city={city} />
      <main>
        <section className={styles.hero} aria-labelledby="reabilitaciya-hero-heading">
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroGlowWarm} aria-hidden />
          <div className={styles.heroMesh} aria-hidden />
          <div className={`c ${styles.heroInner}`}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowPrefix}>Психосоциальное восстановление · следующий этап</span>
              <span className={styles.eyebrowCity}>{city.namePrep}</span>
            </p>

            <h1 id="reabilitaciya-hero-heading" className={styles.title}>
              <span className={styles.titleKicker}>Реабилитация и сопровождение</span>
              <span className={styles.titleMain}>
                В {city.namePrep} — опора после стабилизации, без срочного «выхода в ноль»
              </span>
            </h1>

            <ul className={styles.heroBadges} aria-label="Ключевые условия программы">
              <li className={styles.heroBadge}>
                Ориентир от {city.priceRehabDay.toLocaleString('ru')} ₽ / сутки
              </li>
              <li className={styles.heroBadge}>После стабилизации, не острая фаза</li>
              <li className={styles.heroBadge}>Срок и глубина — по задаче, не «чудо за 28 дней»</li>
              <li className={styles.heroBadge}>Семья — по правилам программы, без давления</li>
            </ul>

            <div className={styles.leadBlock}>
              <p className={styles.lead}>
                Здесь не лечат острую фазу и не обещают излечение «навсегда» за один заезд. Структура, сопровождение и работа с поведением — чтобы
                трезвость стала длительной опорой, а не разовым подвигом.
              </p>
              <p className={styles.leadSecondary}>
                Формат и срок согласуют после разговора; на линии — спокойная ориентация без обязательств до записи.
              </p>
            </div>

            <div className={styles.heroCtaBlock}>
              <div className={styles.heroActionWell}>
                <OpenCallbackButton className={`${styles.heroCta} ${styles.heroCtaPremium}`}>
                  Согласовать консультацию по программе
                </OpenCallbackButton>
                <p className={styles.heroCtaHint}>
                  Или наберите линию:{' '}
                  <a className={styles.heroTelLink} href={`tel:${city.phone}`}>
                    {city.phoneDisplay}
                  </a>
                </p>
              </div>
            </div>

            <p className={styles.heroMicroTrust}>
              Без обещаний «быстрого результата» · спокойный ритм · конфиденциальность · линия 24/7
            </p>
          </div>
        </section>

        <section
          className={`${styles.methodsSection} ${styles.programsSelector}`}
          aria-labelledby="reabilitaciya-programs-heading"
        >
          <div className={`c ${styles.methodsInner}`}>
            <header className={`${styles.methodsHeader} ${styles.programsSelectorHeader}`}>
              <p className={styles.methodsKicker}>Глубина программы</p>
              <h2 id="reabilitaciya-programs-heading" className={styles.methodsTitle}>
                Три ориентира по сроку — не «тарифы», а длина пути
              </h2>
              <p className={`${styles.methodsLead} ${styles.programsSelectorLead}`}>
                Сроки задают глубину; сумма — ориентир. Формат и стоимость — после разговора, не «по прайсу на экране».
              </p>
            </header>

            {city.hasRehab && city.rehabAddress && !isPlaceholderRehabAddress(city.rehabAddress) && (
              <p className={styles.programsContextLine}>{city.rehabAddress}</p>
            )}

            {!city.hasRehab && routeCenter && (
              <p className={styles.programsContextLine}>
                Программы для жителей {city.nameGen} проходят в центре сети в {routeCenter.namePrep}
                {typeof city.nearestStacionarDistance === 'number'
                  ? ` (ориентир ~${city.nearestStacionarDistance} км).`
                  : '.'}{' '}
                Сроки и логистику согласуем при обращении.
              </p>
            )}

            {!city.hasRehab && !routeCenter && (
              <p className={styles.programsContextLine}>
                Формат и место прохождения программы уточняются на линии — подберём вариант под вашу ситуацию.
              </p>
            )}

            <div className={styles.programsGrid}>
              {programs.map((p, i) => (
                <article key={i} className={styles.programCard}>
                  <p className={styles.programHorizon}>{p.horizon}</p>
                  <h3 className={styles.programCardTitle}>
                    <span className={styles.programDuration}>{p.title}</span>
                    <span className={styles.programTitleSep} aria-hidden>
                      {' '}
                      ·{' '}
                    </span>
                    <span className={styles.programTaglineInTitle}>{p.tagline}</span>
                  </h3>
                  <div className={styles.programMetrics}>
                    <div className={styles.programPriceCluster}>
                      <span className={styles.programPriceLabel}>ориентир</span>
                      <span className={styles.programPrice}>{p.price.toLocaleString('ru')} ₽</span>
                      <span className={styles.programPriceScope}>за программу целиком</span>
                    </div>
                    <span className={styles.programDepthBadge} title="Уровень глубины по сроку">
                      {p.term}
                    </span>
                  </div>
                  <p className={styles.programBody}>{p.body}</p>
                  <p className={styles.programDiff}>{p.diff}</p>
                </article>
              ))}
            </div>

            <p className={`${styles.methodsFootnote} ${styles.programsFootnote}`}>
              Сумма и срок не заменяют разговор: детали — на линии; при необходимости передадим координатору программы.
            </p>
          </div>
        </section>

        <section
          className={`${styles.methodsSection} ${styles.compareStrategic}`}
          aria-labelledby="reabilitaciya-compare-heading"
        >
          <div className={`c ${styles.methodsInner}`}>
            <header className={`${styles.methodsHeader} ${styles.compareHeader}`}>
              <p className={styles.methodsKicker}>Логика этапов</p>
              <h2 id="reabilitaciya-compare-heading" className={styles.methodsTitle}>
                Чем реабилитация отличается от стационара
              </h2>
              <p className={`${styles.methodsLead} ${styles.compareLead}`}>
                Стационар и реабилитация часто идут по очереди, но у каждого этапа своя задача — иначе легко ждать от программы не того.
              </p>
            </header>
            <div className={styles.compareStageGrid}>
              <article className={`${styles.compareStageCard} ${styles.compareStageCardStacionar}`}>
                <p className={styles.compareStageMeta}>Острая фаза · безопасность и наблюдение</p>
                <p className={styles.compareStageName}>Стационар</p>
                <h3 className={styles.compareStageHeading}>Когда нужна стабилизация</h3>
                <div className={styles.compareCardProse}>
                  <p className={styles.comparePara}>
                    Круглосуточное наблюдение, медицинская помощь по показаниям, снятие острой симптоматики. Фокус — безопасность и динамика
                    состояния, а не «перестройка личности за неделю».
                  </p>
                  <p className={styles.comparePara}>
                    Это не «слабость» — это признак, что сначала нужен врачебный контур и режим отделения.
                  </p>
                </div>
              </article>
              <article className={`${styles.compareStageCard} ${styles.compareStageCardRehab}`}>
                <p className={styles.compareStageMeta}>После стабилизации · участие и длительная работа</p>
                <p className={styles.compareStageName}>Реабилитация</p>
                <h3 className={styles.compareStageHeading}>Когда нужна устойчивость</h3>
                <div className={styles.compareCardProse}>
                  <p className={styles.comparePara}>
                    Длительная работа в спокойном темпе: поведение, привычки, отношения, смыслы. Задача — не «переждать срок», а научиться жить
                    иначе, с поддержкой и ясной структурой.
                  </p>
                  <p className={styles.comparePara}>
                    Обычно логична после стабилизации — когда человек может участвовать в программе осознанно, а не только переносить острую фазу.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          className={`${styles.methodsSection} ${styles.recoveryIncludes}`}
          aria-labelledby="reabilitaciya-includes-heading"
        >
          <div className={`c ${styles.methodsInner}`}>
            <header className={`${styles.methodsHeader} ${styles.recoveryIncludesHeader}`}>
              <p className={styles.methodsKicker}>Формат программы</p>
              <h2 id="reabilitaciya-includes-heading" className={styles.methodsTitle}>
                Что обычно входит в программу
              </h2>
              <p className={`${styles.methodsLead} ${styles.recoveryIncludesLead}`}>
                Опорный каркас: детали при записи. Оплата — за участие в структуре восстановления, а не за «простой номер».
              </p>
            </header>
            <div className={styles.recoveryIncludesGrid}>
              {PROGRAM_INCLUDES.map((item, i) => (
                <article key={i} className={styles.recoveryIncludeCard}>
                  <h3 className={styles.recoveryIncludeTitle}>{item.title}</h3>
                  <p className={styles.recoveryIncludeDesc}>{item.desc}</p>
                </article>
              ))}
            </div>
            {city.rehabProgram?.trim() && (
              <p className={`${styles.methodsFootnote} ${styles.recoveryIncludesFootnote}`}>
                В групповой части может использоваться формат «{city.rehabProgram}» рядом с индивидуальной поддержкой — по правилам программы.
              </p>
            )}
          </div>
        </section>

        <section
          className={`${styles.proseSection} ${styles.narrativeRhythm}`}
          aria-labelledby="reabilitaciya-rhythm-heading"
        >
          <div className={`c ${styles.narrativeInner}`}>
            <header className={`${styles.methodsHeader} ${styles.narrativeBlockHeader}`}>
              <p className={styles.methodsKicker}>Ритм программы</p>
              <h2 id="reabilitaciya-rhythm-heading" className={styles.methodsTitle}>
                Не больничный острый этап — а спокойная работа
              </h2>
              <p className={styles.narrativeSectionLead}>
                Регулярность, предсказуемость и участие — не гонка и не ожидание «на автомате».
              </p>
            </header>
            <div className={styles.narrativeRhythmBody}>
              <p className={styles.narrativePara}>
                Реабилитация — это не сутки «под капельницей» и не гонка. Здесь важны регулярность, предсказуемость и участие: человек не
                «перетерпевает», а постепенно перестраивает распорядок, отношения к себе и к близким. Задача программы — дать опору и язык для
                этого, без морализаторства и без обещания, что достаточно одного рывка.
              </p>
              <p className={styles.narrativePara}>
                Время — ресурс: оно снижает хаос, даёт шанс увидеть повторяющиеся сценарии и отработать их в безопасной среде, прежде чем
                возвращаться к привычной жизни.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.proseSection} ${styles.narrativeFamily}`} aria-labelledby="reabilitaciya-family-heading">
          <div className={`c ${styles.narrativeInner}`}>
            <header className={`${styles.methodsHeader} ${styles.narrativeBlockHeader}`}>
              <p className={styles.methodsKicker}>Семья и границы</p>
              <h2 id="reabilitaciya-family-heading" className={styles.methodsTitle}>
                Родственникам: без «отдали и забыли»
              </h2>
              <p className={styles.narrativeSectionLead}>
                Ясность и уважение к частной жизни участника — без давления и без роли «спасателя».
              </p>
            </header>
            <div className={styles.narrativeFamilyWell}>
              <p className={styles.narrativePara}>
                Семья часто устала от кризиса и не знает, как помогать без контроля и срывов. На программе близким объясняют этапы, границы и
                ожидания: что реалистично в первые недели, где нужна поддержка специалистов, как не подменять собой работу человека. Это не
                разбор «кто виноват» — это спокойная ясность, как снизить трение дома.
              </p>
              <p className={styles.narrativePara}>
                Контакт с семьёй строится по правилам программы и с уважением к частной жизни участника: формат созвонов и визитов согласуется,
                чтобы не превращать восстановление в новый источник конфликта.
              </p>
            </div>
          </div>
        </section>

        <FAQ city={city} variant="reabilitaciya" />
        <CTASection city={city} variant="reabilitaciya" />
      </main>
      <Footer city={city} activeHref={`/${city.slug}/reabilitaciya/`} />
      <div className="ic-mockup-scroll-pad" aria-hidden="true" />
      <MobileBar city={city} variant="reabilitaciya" />
      <CallbackModal city={city} />
      <CookieConsent />
    </div>
  )
}
