// app/[city]/reabilitaciya/page.tsx — психосоциальная реабилитация (отдельная service landing)
import { Metadata } from 'next'
import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'
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
import styles from './page.module.css'

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

  const routeCenter =
    city.nearestStacionarSlug && !city.hasRehab ? getCityBySlug(city.nearestStacionarSlug) : undefined

  const programs: {
    title: string
    tagline: string
    price: number
    term: string
    body: string
    diff: string
  }[] = [
    {
      title: '28 дней',
      tagline: 'Старт восстановления',
      price: city.priceRehab28,
      term: 'вход в программу',
      body: 'Первый цикл: стабилизировать режим, познакомиться с группой и правилами, начать работу с запросом «зачем я здесь».',
      diff: 'Подходит как первый шаг после стационара или если нужен короткий, структурированный ввод без обещания «полной перестройки за месяц».',
    },
    {
      title: '90 дней',
      tagline: 'Углубление и устойчивость',
      price: city.priceRehab90,
      term: 'средняя глубина',
      body: 'Больше времени на привыкание к трезвости, повторяющиеся ситуации и отношения — меньше иллюзии «я уже справился».',
      diff: 'Имеет смысл, когда важна не скорость, а закрепление: навыки, доверие к процессу, ясность следующего этапа.',
    },
    {
      title: '6 месяцев',
      tagline: 'Длительное сопровождение',
      price: city.priceRehab6Mo,
      term: 'долгий горизонт',
      body: 'Формат для тех, кому нужен спокойный темп и сопровождение при серьёзной перестройке жизни, а не рывок.',
      diff: 'Срок не «гарантирует результат» — он даёт пространство для устойчивости, а итог по-прежнему зависит от участия человека и контекста.',
    },
  ]

  return (
    <div className={styles.pageRoot}>
      <Header city={city} />
      <main>
        <section className={styles.hero} aria-labelledby="reabilitaciya-hero-heading">
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroMesh} aria-hidden />
          <div className={`c ${styles.heroInner}`}>
            <p className={styles.eyebrow}>Программа восстановления · следующий этап · {city.namePrep}</p>

            <ul className={styles.heroBadges} aria-label="Ключевые условия">
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                Ориентир от {city.priceRehabDay.toLocaleString('ru')} ₽ / сутки
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                После острой фазы или стационара
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                Срок и глубина — по задаче, не «чудо за 28 дней»
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                Семья в курсе этапов — без давления
              </li>
            </ul>

            <h1 id="reabilitaciya-hero-heading" className={styles.title}>
              <span className={styles.titleKicker}>Реабилитация и сопровождение</span>
              <span className={styles.titleMain}>
                В {city.namePrep} — устойчивый путь после стабилизации, не срочный «выход в ноль»
              </span>
            </h1>

            <p className={styles.lead}>
              Здесь не лечат острую фазу и не обещают полное излечение «навсегда» за один заезд. Это программа психосоциального восстановления:
              структура, сопровождение, работа с поведением и отношениями — чтобы выстроить трезвость как длительную опору, а не как одноразовый
              подвиг. Формат и срок подбирают после разговора; на линии можно спокойно сориентироваться без обязательств до записи.
            </p>

            <div className={styles.heroCtaBlock}>
              <OpenCallbackButton className={styles.heroCta}>Согласовать консультацию по программе</OpenCallbackButton>
              <p className={styles.heroCtaHint}>
                Или позвоните:{' '}
                <a className={styles.heroTelLink} href={`tel:${city.phone}`}>
                  {city.phoneDisplay}
                </a>
              </p>
            </div>

            <p className={styles.heroMicroTrust}>
              Без обещаний «быстрого результата» · спокойный ритм · конфиденциальность · линия 24/7
            </p>
          </div>
        </section>

        <section className={styles.methodsSection} aria-labelledby="reabilitaciya-programs-heading">
          <div className={`c ${styles.methodsInner}`}>
            <header className={styles.methodsHeader}>
              <p className={styles.methodsKicker}>Глубина программы</p>
              <h2 id="reabilitaciya-programs-heading" className={styles.methodsTitle}>
                Три ориентира по сроку — не «тарифы», а длина пути
              </h2>
              <p className={styles.methodsLead}>
                Цифры ниже — про то, сколько времени обычно закладывают на разные уровни работы. Итоговый пакет и сумма согласуются после
                консультации: мы не подменяем разговор таблицей с экрана.
              </p>
            </header>

            {city.hasRehab && city.rehabAddress && (
              <p
                className={styles.methodsLead}
                style={{ textAlign: 'center', marginBottom: 24, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}
              >
                {city.rehabAddress}
              </p>
            )}

            {!city.hasRehab && routeCenter && (
              <p
                className={styles.methodsLead}
                style={{ textAlign: 'center', marginBottom: 24, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}
              >
                Программы для жителей {city.nameGen} проходят в центре сети в {routeCenter.namePrep}
                {typeof city.nearestStacionarDistance === 'number'
                  ? ` (ориентир ~${city.nearestStacionarDistance} км).`
                  : '.'}{' '}
                Сроки и логистику согласуем при обращении.
              </p>
            )}

            {!city.hasRehab && !routeCenter && (
              <p
                className={styles.methodsLead}
                style={{ textAlign: 'center', marginBottom: 24, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}
              >
                Формат и место прохождения программы уточняются на линии — подберём вариант под вашу ситуацию.
              </p>
            )}

            <div className={styles.methodsGrid}>
              {programs.map((p, i) => (
                <article key={i} className={styles.methodCard}>
                  <div className={styles.methodCardHead}>
                    <h3 className={styles.methodName}>
                      {p.title} — {p.tagline}
                    </h3>
                    <div className={styles.methodMeta}>
                      <span className={styles.methodPrice}>{p.price.toLocaleString('ru')} ₽</span>
                      <span className={styles.methodTerm} title="Уровень глубины по сроку">
                        {p.term}
                      </span>
                    </div>
                  </div>
                  <p className={styles.methodDesc}>{p.body}</p>
                  <p className={styles.programDiff}>{p.diff}</p>
                  <p className={styles.methodDesc} style={{ marginTop: 10, fontSize: 12.5, color: '#64748b' }}>
                    за программу целиком
                  </p>
                </article>
              ))}
            </div>

            <p className={styles.methodsFootnote}>
              Стоимость и срок не заменяют согласование: уточняйте детали на линии; при необходимости направим к координатору программы.
            </p>
          </div>
        </section>

        <section className={styles.methodsSection} aria-labelledby="reabilitaciya-compare-heading">
          <div className={`c ${styles.methodsInner}`}>
            <header className={styles.methodsHeader}>
              <p className={styles.methodsKicker}>Этапы маршрута</p>
              <h2 id="reabilitaciya-compare-heading" className={styles.methodsTitle}>
                Чем реабилитация отличается от стационара
              </h2>
              <p className={styles.methodsLead}>
                Оба этапа могут быть важны, но у них разная задача. Путать их — значит ждать от программы не того, что она даёт.
              </p>
            </header>
            <div className={styles.compareGrid}>
              <div className={styles.compareCard}>
                <p className={styles.compareCardTitle}>Стационар</p>
                <h3>Когда нужна стабилизация</h3>
                <p>
                  Круглосуточное наблюдение, медицинская помощь по показаниям, снятие острой симптоматики. Фокус — безопасность и динамика
                  состояния, а не «перестройка личности за неделю».
                </p>
                <p>Это не «слабость» — это признак, что сначала нужен врачебный контур и режим отделения.</p>
              </div>
              <div className={styles.compareCard}>
                <p className={styles.compareCardTitle}>Реабилитация</p>
                <h3>Когда нужна устойчивость</h3>
                <p>
                  Длительная работа в спокойном темпе: поведение, привычки, отношения, смыслы. Задача — не «переждать срок», а научиться жить
                  иначе, с поддержкой и ясной структурой.
                </p>
                <p>Обычно логична после стабилизации — когда человек может участвовать в программе осознанно, а не только переносить острую фазу.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.methodsSection} style={{ paddingTop: 48 }} aria-labelledby="reabilitaciya-includes-heading">
          <div className={`c ${styles.methodsInner}`}>
            <header className={styles.methodsHeader}>
              <p className={styles.methodsKicker}>Содержание</p>
              <h2 id="reabilitaciya-includes-heading" className={styles.methodsTitle}>
                Что обычно входит в программу
              </h2>
              <p className={styles.methodsLead}>
                Набор может отличаться в деталях — ниже типовой каркас, чтобы было понятно, за что вы платите не «простой номер», а участие в
                восстановлении.
              </p>
            </header>
            <div className={styles.methodsGrid}>
              {PROGRAM_INCLUDES.map((item, i) => (
                <article key={i} className={styles.methodCard}>
                  <span className={styles.includeItemTitle}>{item.title}</span>
                  <p className={styles.includeItemDesc}>{item.desc}</p>
                </article>
              ))}
            </div>
            {city.rehabProgram?.trim() && (
              <p className={styles.methodsFootnote}>
                В групповой части может использоваться формат «{city.rehabProgram}» наряду с индивидуальной поддержкой — по правилам программы.
              </p>
            )}
          </div>
        </section>

        <section className={styles.proseSection} aria-labelledby="reabilitaciya-rhythm-heading">
          <div className={`c ${styles.proseInner}`}>
            <header className={styles.methodsHeader}>
              <p className={styles.methodsKicker}>Среда и ритм</p>
              <h2 id="reabilitaciya-rhythm-heading" className={styles.methodsTitle}>
                Не больничный острый этап — а спокойная работа
              </h2>
            </header>
            <p className={styles.proseBody}>
              Реабилитация — это не сутки «под капельницей» и не гонка. Здесь важны регулярность, предсказуемость и участие: человек не
              «перетерпевает», а постепенно перестраивает распорядок, отношения к себе и к близким. Задача программы — дать опору и язык для
              этого, без морализаторства и без обещания, что достаточно одного рывка.
            </p>
            <p className={styles.proseBody}>
              Время — ресурс: оно снижает хаос, даёт шанс увидеть повторяющиеся сценарии и отработать их в безопасной среде, прежде чем
              возвращаться к привычной жизни.
            </p>
          </div>
        </section>

        <section className={styles.proseSection} style={{ background: '#f8fafc' }} aria-labelledby="reabilitaciya-family-heading">
          <div className={`c ${styles.proseInner}`}>
            <header className={styles.methodsHeader}>
              <p className={styles.methodsKicker}>Близкие</p>
              <h2 id="reabilitaciya-family-heading" className={styles.methodsTitle}>
                Родственникам: без «отдали и забыли»
              </h2>
            </header>
            <p className={styles.proseBody}>
              Семья часто устала от кризиса и не знает, как помогать без контроля и срывов. На программе близким объясняют этапы, границы и
              ожидания: что реалистично в первые недели, где нужна поддержка специалистов, как не подменять собой работу человека. Это не
              разбор «кто виноват» — это спокойная ясность, как снизить трение дома.
            </p>
            <p className={styles.proseBody}>
              Контакт с семьёй строится по правилам программы и с уважением к частной жизни участника: формат созвонов и визитов согласуется,
              чтобы не превращать восстановление в новый источник конфликта.
            </p>
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
      <FloatingWhatsApp city={city} />
    </div>
  )
}
