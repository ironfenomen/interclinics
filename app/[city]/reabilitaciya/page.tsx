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
    title: `Реабилитационный центр в ${city.namePrep} — от ${city.priceRehabDay}₽/сутки | InterClinics`,
    description: `Программы восстановления и адаптации в ${city.namePrep}. От ${city.priceRehabDay.toLocaleString('ru')} ₽/сутки. Консультация. ☎ ${city.phoneDisplay}`,
    alternates: { canonical: `https://interclinics.ru/${city.slug}/reabilitaciya/` },
  }
}

export default function ReabilitaciyaPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()
  const service = getServiceBySlug('reabilitaciya')!

  const programs = [
    { title: '28 дней', price: city.priceRehab28, text: 'Базовая программа адаптации и восстановления' },
    { title: '90 дней', price: city.priceRehab90, text: 'Углублённая работа над устойчивой трезвостью' },
  ]

  return (
    <>
      <Header city={city} />
      <main>
        <section
          style={{
            background: 'linear-gradient(180deg, #F8FAFC 0%, #fff 100%)',
            padding: '56px 0 64px',
            borderBottom: '1px solid var(--b1)',
          }}
        >
          <div className="ctr" style={{ maxWidth: 800, textAlign: 'center' }}>
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
              от {city.priceRehabDay.toLocaleString('ru')} ₽ / сутки
            </div>
            <h1
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: 'var(--deep)',
                lineHeight: 1.15,
                marginBottom: 18,
                letterSpacing: '-.03em',
              }}
            >
              Реабилитация и восстановление
              <br />
              <em style={{ fontStyle: 'normal', color: 'var(--em)' }}>в&nbsp;{city.namePrep}</em>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--t2)', marginBottom: 28, lineHeight: 1.65 }}>
              {service.fullDescription}
            </p>
            {city.hasRehab && city.rehabAddress && (
              <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 20 }}>{city.rehabAddress}</p>
            )}
            {!city.hasRehab && (
              <p style={{ fontSize: 15, color: 'var(--t2)', marginBottom: 28, lineHeight: 1.65 }}>
                Программы проходят в центре в Ставрополе; для жителей {city.nameGen} подбираем сроки и формат сопровождения.
              </p>
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
              Получить консультацию
            </OpenCallbackButton>
          </div>
        </section>

        <section style={{ padding: '60px 0' }}>
          <div className="ctr" style={{ maxWidth: 900 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--deep)', marginBottom: 28, textAlign: 'center' }}>
              Программы по срокам
            </h2>
            <div className="ic-grid-autofit-lg">
              {programs.map(p => (
                <div
                  key={p.title}
                  style={{
                    padding: '26px 22px',
                    background: 'var(--bg)',
                    borderRadius: 16,
                    border: '1px solid var(--b2)',
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--deep)', marginBottom: 8 }}>{p.title}</div>
                  <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, marginBottom: 16 }}>{p.text}</p>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--em)' }}>
                    {p.price.toLocaleString('ru')} ₽
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>за программу</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '0 0 60px', background: 'var(--bg)' }}>
          <div className="ctr" style={{ maxWidth: 800, paddingTop: 56, paddingBottom: 56 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--deep)', marginBottom: 20 }}>Что включено</h2>
            <div className="ic-grid-autofit-sm" style={{ gap: 12 }}>
              {service.includes.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '14px 18px',
                    background: '#fff',
                    borderRadius: 12,
                    fontSize: 14,
                    color: 'var(--t2)',
                    border: '1px solid var(--b2)',
                  }}
                >
                  <span style={{ color: 'var(--em)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
            {city.rehabProgram && (
              <p style={{ marginTop: 24, fontSize: 15, color: 'var(--t2)', lineHeight: 1.7 }}>
                Дополнительно в программе: {city.rehabProgram}.
              </p>
            )}
          </div>
        </section>

        <section style={{ padding: '0 0 60px', textAlign: 'center' }}>
          <div className="ctr">
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--deep)', marginBottom: 16 }}>
              Консультация по программе
            </h2>
            <p style={{ color: 'var(--t2)', marginBottom: 22, fontSize: 15 }}>
              Расскажем о формате, сроках и адаптации — без навязанных решений.
            </p>
            <OpenCallbackButton
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 17,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Получить консультацию
            </OpenCallbackButton>
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
