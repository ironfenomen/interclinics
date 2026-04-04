// app/[city]/kodirovanie/page.tsx
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

export async function generateStaticParams() {
  return getCitySlugs().map(slug => ({ city: slug }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}
  const pageUrl = `https://interclinics.ru/${city.slug}/kodirovanie/`
  const title = `Кодирование от алкоголизма в ${city.namePrep} — от ${city.priceCoding.toLocaleString('ru')}₽ | ${BRAND_DISPLAY_NAME}`
  const description = `Кодирование от алкоголизма в ${city.namePrep}. Эспераль, Торпедо, Вивитрол, Довженко. От ${city.priceCoding.toLocaleString('ru')}₽. ☎ ${city.phoneDisplay}`
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

export default function KodirovaniePage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()

  const methods: {
    name: string
    price: string
    term: string
    desc: string
  }[] = [
    {
      name: 'Эспераль (имплантация)',
      price: 'от 20 500 ₽',
      term: '1–3 года',
      desc: 'Препарат на основе дисульфирама: блокирует фермент переработки этанола. Имплантат вводится под кожу.',
    },
    {
      name: 'Дисульфирам (имплантация)',
      price: 'от 20 500 ₽',
      term: '1–3 года',
      desc: 'Имплантация дисульфирама: тот же принцип блокирования переработки спирта; подкожное введение по протоколу.',
    },
    {
      name: 'Дисульфирам (инъекция)',
      price: 'от 9 900 ₽',
      term: '6–12 мес',
      desc: 'Внутривенное введение. Сочетание с алкоголем на фоне терапии может давать выраженные нежелательные реакции — врач заранее объясняет режим и риски.',
    },
    {
      name: 'Налтрексон',
      price: 'от 31 500 ₽',
      term: '1 мес (курс)',
      desc: 'Блокирует опиатные рецепторы, снижает «усиление награды» от алкоголя; курс подбирается под наблюдением. При отдельных показаниях используется и в наркологических схемах — по решению врача.',
    },
    {
      name: 'По Довженко',
      price: 'от 15 000 ₽',
      term: 'индивидуально',
      desc: 'Психотерапевтический метод: работа с установками в изменённом состоянии внимания. Срок и число сеансов зависят от клинической ситуации.',
    },
    {
      name: 'Двойной блок',
      price: 'от 14 500 ₽',
      term: 'от 1 года',
      desc: 'Сочетание внутримышечного и внутривенного введения компонентов по назначению врача; обсуждается при отдельных показаниях. Срок уточняется при планировании.',
    },
  ]

  return (
    <div className={styles.pageRoot}>
      <Header city={city} />
      <main>
        <section className={styles.hero} aria-labelledby="kodirovanie-hero-heading">
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroMesh} aria-hidden />
          <div className={`c ${styles.heroInner}`}>
            <p className={styles.eyebrow}>Медицинское кодирование · врач‑нарколог · {city.namePrep}</p>

            <ul className={styles.heroBadges} aria-label="Ключевые условия">
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                От {city.priceCoding.toLocaleString('ru')} ₽ — ориентир по методам
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                5 форматов кодирования
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                После детоксикации и периода трезвости
              </li>
              <li className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} aria-hidden />
                Метод подбирает врач индивидуально
              </li>
            </ul>

            <h1 id="kodirovanie-hero-heading" className={styles.title}>
              <span className={styles.titleKicker}>Кодирование от алкоголизма</span>
              <span className={styles.titleMain}>
                В {city.namePrep} — после детоксикации, периода трезвости и осмотра врача
              </span>
            </h1>

            <p className={styles.lead}>
              Кодирование проводится только после перенесённой детоксикации и устойчивого периода трезвости: ориентир — не менее 3–5 дней, если врач по
              показаниям и противопоказаниям не определит иначе. Нарколог оценивает состояние и подбирает формат — медикаментозное, психотерапевтическое или
              комбинированное кодирование. Следующий шаг — консультация и согласование плана: спокойно, без давления и без обещаний «универсального» результата.
            </p>

            <div className={styles.heroCtaBlock}>
              <OpenCallbackButton className={styles.heroCta}>Обсудить кодирование с врачом</OpenCallbackButton>
              <p className={styles.heroCtaHint}>
                Или позвоните на линию:{' '}
                <a className={styles.heroTelLink} href={`tel:${city.phone}`}>
                  {city.phoneDisplay}
                </a>
              </p>
            </div>

            <p className={styles.heroMicroTrust}>
              Лицензированная помощь · консультация до процедуры · без гарантий излечения · круглосуточная линия
            </p>
          </div>
        </section>

        <section className={styles.methodsSection} aria-labelledby="kodirovanie-methods-heading">
          <div className={`c ${styles.methodsInner}`}>
            <header className={styles.methodsHeader}>
              <p className={styles.methodsKicker}>Форматы кодирования</p>
              <h2 id="kodirovanie-methods-heading" className={styles.methodsTitle}>
                Методы и ориентиры по стоимости
              </h2>
              <p className={styles.methodsLead}>
                Ниже — варианты, с которыми работает врач. Итоговый формат выбирается после консультации, оценки периода трезвости, противопоказаний и задачи
                лечения — не «с сайта по одному клику».
              </p>
            </header>
            <div className={styles.methodsGrid}>
              {methods.map((m, i) => (
                <article key={i} className={styles.methodCard}>
                  <div className={styles.methodCardHead}>
                    <h3 className={styles.methodName}>{m.name}</h3>
                    <div className={styles.methodMeta}>
                      <span className={styles.methodPrice}>{m.price}</span>
                      <span className={styles.methodTerm} title="Срок действия / курса по протоколу">
                        {m.term}
                      </span>
                    </div>
                  </div>
                  <p className={styles.methodDesc}>{m.desc}</p>
                </article>
              ))}
            </div>
            <p className={styles.methodsFootnote}>
              Ориентиры по цене и сроку не заменяют очный осмотр: кодирование проводится после периода трезвости по показаниям; итоговый вариант и момент процедуры
              согласуются с врачом.
            </p>
          </div>
        </section>

        <FAQ city={city} variant="kodirovanie" />
        <CTASection city={city} variant="kodirovanie" />
      </main>
      <Footer city={city} activeHref={`/${city.slug}/kodirovanie/`} />
      <div className="ic-mockup-scroll-pad" aria-hidden="true" />
      <MobileBar city={city} variant="kodirovanie" />
      <CallbackModal city={city} />
      <CookieConsent />
      <FloatingWhatsApp city={city} />
    </div>
  )
}
