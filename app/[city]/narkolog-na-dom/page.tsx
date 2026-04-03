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

export async function generateStaticParams() {
  return getCitySlugs().map(slug => ({ city: slug }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}
  return {
    title: `Нарколог на дом в ${city.namePrep} — выезд за ${city.arrivalTime} мин | InterClinics`,
    description: `Вызов нарколога на дом в ${city.namePrep}. От ${city.priceNarkolog.toLocaleString('ru')}₽. Приедем за ${city.arrivalTime} мин. Анонимно. ☎ ${city.phoneDisplay}`,
    alternates: { canonical: `https://interclinics.ru/${city.slug}/narkolog-na-dom/` },
  }
}

export default function NarkologNaDomPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()
  const service = getServiceBySlug('narkolog-na-dom')!

  return (
    <>
      <Header city={city} />
      <main>
        <section style={{ background: 'var(--deep)', padding: '56px 0 64px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40%', right: '-15%', width: 650, height: 650, background: 'radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 65%)', borderRadius: '50%' }} />
          <div className="ctr" style={{ position: 'relative', zIndex: 2, maxWidth: 800, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(16,185,129,.1)', color: 'var(--em)', padding: '5px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 22, border: '1px solid rgba(16,185,129,.15)' }}>
              от {city.priceNarkolog.toLocaleString('ru')} ₽ · Выезд за {city.arrivalTime} мин
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 18 }}>
              Вызов нарколога на дом<br />
              <em style={{ fontStyle: 'normal', color: 'var(--em)' }}>в&nbsp;{city.namePrep}</em>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.55)', marginBottom: 30, lineHeight: 1.65, maxWidth: 600, margin: '0 auto 30px' }}>
              {service.fullDescription}
            </p>
            <a href={`tel:${city.phone}`} style={{ display: 'inline-block', padding: '16px 40px', background: 'var(--em)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 17 }}>
              Вызвать: {city.phoneDisplay}
            </a>
          </div>
        </section>

        <section style={{ padding: '60px 0' }}>
          <div className="ctr" style={{ maxWidth: 800 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--deep)', marginBottom: 24 }}>Что входит в вызов</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {service.includes.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'var(--bg)', borderRadius: 12, fontSize: 14, color: 'var(--t2)' }}>
                  <span style={{ color: 'var(--em)', fontWeight: 700, fontSize: 16 }}>✓</span>{item}
                </div>
              ))}
            </div>
            {city.districts.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--deep)', marginBottom: 12 }}>Выезжаем по всем районам {city.nameGen}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {city.districts.map((d, i) => (
                    <span key={i} style={{ padding: '6px 14px', background: 'var(--bg)', borderRadius: 100, fontSize: 13, color: 'var(--t2)', border: '1px solid var(--b1)' }}>{d}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <Steps city={city} />
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
