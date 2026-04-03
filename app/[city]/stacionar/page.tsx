import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug, getCitySlugs } from '@/data/cities'
import { getServiceBySlug } from '@/data/services'
import Header from '@/components/Header'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import MobileBar from '@/components/MobileBar'
import CallbackModal from '@/components/CallbackModal'
import CookieConsent from '@/components/CookieConsent'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import OpenCallbackButton from '@/components/OpenCallbackButton'

export async function generateStaticParams() {
  return getCitySlugs().map(slug => ({ city: slug }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}
  return {
    title: `Наркологический стационар в ${city.namePrep} — от ${city.priceStacionarDay}₽/сутки | InterClinics`,
    description: `Стационар 24/7 в ${city.namePrep}: детоксикация, наблюдение врача, палаты. От ${city.priceStacionarDay.toLocaleString('ru')} ₽/сутки. ☎ ${city.phoneDisplay}`,
    alternates: { canonical: `https://interclinics.ru/${city.slug}/stacionar/` },
  }
}

export default function StacionarPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()
  const service = getServiceBySlug('stacionar')!
  const nearest =
    city.hasStacionar || !city.nearestStacionarSlug ? null : getCityBySlug(city.nearestStacionarSlug)

  const programs = [
    { name: 'Детокс 3–5 дней', price: city.priceStacionarDetox, desc: 'Стабилизация, выведение токсинов, подготовка к терапии' },
    { name: 'Стандарт 7–14 дней', price: city.priceStacionarStandard, desc: 'Медикаментозная терапия, психотерапия, режим' },
    { name: 'Полный курс 14–21 день', price: city.priceStacionarFull, desc: 'Расширенная программа наблюдения и сопровождения' },
  ]

  return (
    <>
      <Header city={city} />
      <main>
        <section
          style={{
            background: 'var(--deep)',
            padding: '56px 0 64px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              right: '-15%',
              width: 650,
              height: 650,
              background: 'radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 65%)',
              borderRadius: '50%',
            }}
          />
          <div className="ctr" style={{ position: 'relative', zIndex: 2, maxWidth: 800, textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(16,185,129,.1)',
                color: 'var(--em)',
                padding: '5px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 22,
                border: '1px solid rgba(16,185,129,.15)',
              }}
            >
              от {city.priceStacionarDay.toLocaleString('ru')} ₽ / сутки
            </div>

            <h1
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.15,
                marginBottom: 18,
                letterSpacing: '-.03em',
              }}
            >
              Наркологический стационар 24/7
              <br />
              <em style={{ fontStyle: 'normal', color: 'var(--em)' }}>в&nbsp;{city.namePrep}</em>
            </h1>

            <p
              style={{
                fontSize: 17,
                color: 'rgba(255,255,255,.55)',
                marginBottom: 30,
                lineHeight: 1.65,
                maxWidth: 640,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {service.fullDescription}
            </p>

            {!city.hasStacionar && nearest && (
              <p
                style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,.65)',
                  marginBottom: 24,
                  lineHeight: 1.65,
                }}
              >
                В {city.namePrep} приём ведётся по направлению в стационар в {nearest.namePrep}
                {typeof city.nearestStacionarDistance === 'number' && ` (${city.nearestStacionarDistance} км)`}.
              </p>
            )}

            {city.hasStacionar && city.stacionarAddress && (
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', marginBottom: 20 }}>{city.stacionarAddress}</p>
            )}

            <OpenCallbackButton
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                background: 'var(--em)',
                color: '#fff',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 17,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Записаться на госпитализацию
            </OpenCallbackButton>
          </div>
        </section>

        <section style={{ padding: '60px 0' }}>
          <div className="ctr" style={{ maxWidth: 900 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--deep)', marginBottom: 24, textAlign: 'center' }}>
              Программы стационара
            </h2>
            <div className="ic-grid-autofit-md" style={{ gap: 16 }}>
              {programs.map(p => (
                <div
                  key={p.name}
                  style={{
                    padding: '22px 20px',
                    background: 'var(--bg)',
                    borderRadius: 16,
                    border: '1px solid var(--b2)',
                  }}
                >
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--deep)', marginBottom: 8 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 16, lineHeight: 1.55 }}>{p.desc}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--em)' }}>
                    {p.price.toLocaleString('ru')} ₽
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>за программу</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '0 0 60px' }}>
          <div className="ctr" style={{ maxWidth: 800 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--deep)', marginBottom: 20 }}>Условия размещения</h2>
            <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--t2)', lineHeight: 1.75, fontSize: 15 }}>
              <li>Одно- и двухместные палаты, постельное бельё, санузел в отделении или в палате — по корпусу.</li>
              <li>Питание 3 раза в день, диетические варианты по назначению врача.</li>
              <li>Режим дня: наблюдение, процедуры, психотерапия, отдых — по индивидуальному плану.</li>
            </ul>
          </div>
        </section>

        <section style={{ padding: '0 0 60px', background: 'var(--bg)' }}>
          <div className="ctr" style={{ maxWidth: 800, paddingTop: 60, paddingBottom: 60 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--deep)', marginBottom: 20 }}>Этапы лечения в стационаре</h2>
            <ol style={{ margin: 0, paddingLeft: 22, color: 'var(--t2)', lineHeight: 1.85, fontSize: 15 }}>
              <li>Оформление и поступление — осмотр, согласование программы.</li>
              <li>Детоксикация — снятие интоксикации, медикаментозная поддержка.</li>
              <li>Терапия и реабилитационная подготовка — психотерапия, консультации.</li>
              <li>Выписка — рекомендации, план дальнейшего восстановления.</li>
            </ol>
          </div>
        </section>

        <section style={{ padding: '0 0 60px' }}>
          <div className="ctr" style={{ maxWidth: 800 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--deep)', marginBottom: 20 }}>Для родственников</h2>
            <p style={{ fontSize: 15, color: 'var(--t2)', lineHeight: 1.75, marginBottom: 16 }}>
              Посещение по правилам стационара и по согласованию с лечащим врачом. Мы подскажем, как безопасно поговорить с близким о помощи и мотивации к госпитализации — без давления и конфликта.
            </p>
          </div>
        </section>

        <section style={{ padding: '0 0 60px', background: 'var(--deep)', textAlign: 'center' }}>
          <div className="ctr" style={{ paddingTop: 56, paddingBottom: 56 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 20 }}>Запись на госпитализацию</h2>
            <p style={{ color: 'rgba(255,255,255,.55)', marginBottom: 24, fontSize: 15 }}>
              Позвоните или оставьте заявку — подберём программу и ответим на вопросы.
            </p>
            <a
              href={`tel:${city.phone}`}
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                background: 'var(--em)',
                color: '#fff',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 17,
                textDecoration: 'none',
              }}
            >
              {city.phoneDisplay}
            </a>
          </div>
        </section>

        <FAQ city={city} />
        <CTASection city={city} />
      </main>

      <Footer city={city} />
      <MobileBar city={city} />
      <CallbackModal city={city} />
      <CookieConsent />
      <FloatingWhatsApp city={city} />
    </>
  )
}
