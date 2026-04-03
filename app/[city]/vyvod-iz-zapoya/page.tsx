// app/[city]/vyvod-iz-zapoya/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug, getCitySlugs } from '@/data/cities'
import { getServiceBySlug } from '@/data/services'
import Header from '@/components/Header'
import PricingTable from '@/components/PricingTable'
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
    title: `Вывод из запоя в ${city.namePrep} на дому — от ${city.priceVyvodFrom.toLocaleString('ru')}₽ | InterClinics`,
    description: `Вывод из запоя на дому в ${city.namePrep}. Капельница от ${city.priceVyvodFrom.toLocaleString('ru')}₽. Выезд ${city.arrivalTime} мин. Анонимно, круглосуточно. ☎ ${city.phoneDisplay}`,
    alternates: { canonical: `https://interclinics.ru/${city.slug}/vyvod-iz-zapoya/` },
  }
}

export default function VyvodIzZapoyaPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()
  const service = getServiceBySlug('vyvod-iz-zapoya')!

  return (
    <>
      <Header city={city} />
      <main>
        {/* HERO для услуги */}
        <section style={{
          background: 'var(--deep)', padding: '56px 0 64px',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-40%', right: '-15%',
            width: 650, height: 650,
            background: 'radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 65%)',
            borderRadius: '50%'
          }} />
          <div className="ctr" style={{ position: 'relative', zIndex: 2, maxWidth: 800, textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(16,185,129,.1)', color: 'var(--em)',
              padding: '5px 16px', borderRadius: 100, fontSize: 13,
              fontWeight: 600, marginBottom: 22,
              border: '1px solid rgba(16,185,129,.15)'
            }}>
              от {city.priceVyvodFrom.toLocaleString('ru')} ₽ · Выезд за {city.arrivalTime} мин
            </div>

            <h1 style={{
              fontSize: 42, fontWeight: 800, color: '#fff',
              lineHeight: 1.15, marginBottom: 18, letterSpacing: '-.03em'
            }}>
              Вывод из запоя на дому<br />
              <em style={{ fontStyle: 'normal', color: 'var(--em)' }}>
                в&nbsp;{city.namePrep}
              </em>
            </h1>

            <p style={{
              fontSize: 17, color: 'rgba(255,255,255,.55)',
              marginBottom: 30, lineHeight: 1.65, maxWidth: 600,
              marginLeft: 'auto', marginRight: 'auto'
            }}>
              {service.fullDescription}
            </p>

            <a href={`tel:${city.phone}`} style={{
              display: 'inline-block', padding: '16px 40px',
              background: 'var(--em)', color: '#fff', borderRadius: 12,
              fontWeight: 700, fontSize: 17, transition: 'all .25s'
            }}>
              Позвонить: {city.phoneDisplay}
            </a>
          </div>
        </section>

        {/* Что входит */}
        <section style={{ padding: '60px 0' }}>
          <div className="ctr" style={{ maxWidth: 800 }}>
            <h2 style={{
              fontSize: 28, fontWeight: 800, color: 'var(--deep)', marginBottom: 24
            }}>
              Что входит в процедуру
            </h2>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12
            }}>
              {service.includes.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 18px', background: 'var(--bg)',
                  borderRadius: 12, fontSize: 14, color: 'var(--t2)'
                }}>
                  <span style={{ color: 'var(--em)', fontWeight: 700, fontSize: 16 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            {/* Локальный текст для SEO */}
            {city.localText && (
              <p style={{
                marginTop: 24, fontSize: 15, color: 'var(--t2)',
                lineHeight: 1.7, padding: '16px 20px', background: 'var(--bg)',
                borderRadius: 12, borderLeft: '3px solid var(--em)'
              }}>
                {city.localText}
              </p>
            )}

            {/* Районы обслуживания */}
            {city.districts.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{
                  fontSize: 18, fontWeight: 700, color: 'var(--deep)', marginBottom: 12
                }}>
                  Районы обслуживания в {city.namePrep}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {city.districts.map((d, i) => (
                    <span key={i} style={{
                      padding: '6px 14px', background: 'var(--bg)',
                      borderRadius: 100, fontSize: 13, color: 'var(--t2)',
                      border: '1px solid var(--b1)'
                    }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <PricingTable city={city} />
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
