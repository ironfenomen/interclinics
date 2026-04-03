// app/[city]/kodirovanie/page.tsx
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

export async function generateStaticParams() {
  return getCitySlugs().map(slug => ({ city: slug }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}
  return {
    title: `Кодирование от алкоголизма в ${city.namePrep} — от ${city.priceCoding.toLocaleString('ru')}₽ | InterClinics`,
    description: `Кодирование от алкоголизма в ${city.namePrep}. Эспераль, Торпедо, Вивитрол, Довженко. От ${city.priceCoding.toLocaleString('ru')}₽. ☎ ${city.phoneDisplay}`,
    alternates: { canonical: `https://interclinics.ru/${city.slug}/kodirovanie/` },
  }
}

export default function KodirovaniePage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()
  const service = getServiceBySlug('kodirovanie')!

  const methods = [
    { name: 'Эспераль (имплантация)', price: 'от 12 600 ₽', dur: 'на 1–3 года', desc: 'Французский препарат. Блокирует фермент переработки спирта. Имплантируется подкожно.' },
    { name: 'Торпедо (инъекция)', price: 'от 6 200 ₽', dur: 'на 6–12 мес', desc: 'Внутривенная инъекция. Несовместимость с алкоголем при приёме вызывает резкое ухудшение.' },
    { name: 'Вивитрол', price: 'от 31 500 ₽', dur: 'на 1 мес (курс)', desc: 'Блокирует опиатные рецепторы. Устраняет эйфорию от алкоголя, делая приём бессмысленным.' },
    { name: 'По Довженко', price: 'от 8 000 ₽', dur: 'индивидуально', desc: 'Психотерапевтический метод. Внушение отвращения к алкоголю в состоянии лёгкого транса.' },
    { name: 'Двойной блок', price: 'от 14 000 ₽', dur: 'на 1–2 года', desc: 'Комбинация медикаментозного и психотерапевтического методов. Максимальная эффективность.' },
  ]

  return (
    <>
      <Header city={city} />
      <main>
        <section style={{ background: 'var(--deep)', padding: '56px 0 64px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40%', right: '-15%', width: 650, height: 650, background: 'radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 65%)', borderRadius: '50%' }} />
          <div className="ctr" style={{ position: 'relative', zIndex: 2, maxWidth: 800, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(16,185,129,.1)', color: 'var(--em)', padding: '5px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 22, border: '1px solid rgba(16,185,129,.15)' }}>
              от {city.priceCoding.toLocaleString('ru')} ₽ · 5 методов кодирования
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 18 }}>
              Кодирование от алкоголизма<br />
              <em style={{ fontStyle: 'normal', color: 'var(--em)' }}>в&nbsp;{city.namePrep}</em>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.55)', marginBottom: 30, lineHeight: 1.65, maxWidth: 600, margin: '0 auto 30px' }}>
              {service.fullDescription}
            </p>
            <a href={`tel:${city.phone}`} style={{ display: 'inline-block', padding: '16px 40px', background: 'var(--em)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 17 }}>
              Записаться: {city.phoneDisplay}
            </a>
          </div>
        </section>

        {/* Методы кодирования */}
        <section style={{ padding: '60px 0' }}>
          <div className="ctr" style={{ maxWidth: 900 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--deep)', marginBottom: 24 }}>Методы кодирования</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {methods.map((m, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, padding: '20px 24px', background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--b2)', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--deep)', marginBottom: 4 }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>{m.desc}</div>
                    <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 6 }}>Срок: {m.dur}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--deep)', whiteSpace: 'nowrap' }}>{m.price}</div>
                  </div>
                </div>
              ))}
            </div>
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
