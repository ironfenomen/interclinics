'use client'

// components/Hero.tsx
import { City, isStavropolCity } from '@/data/cities'
import { CALLBACK_MODAL_TITLE } from '@/lib/callback-modal-copy'
import LeadForm from './LeadForm'

export default function Hero({ city }: { city: City }) {
  const quickLinks: { label: string; href: string }[] = [
    { label: 'Вывод из запоя', href: `/${city.slug}/vyvod-iz-zapoya/` },
    { label: 'Нарколог на дом', href: `/${city.slug}/narkolog-na-dom/` },
    { label: 'Стационар 24/7', href: `/${city.slug}/stacionar/` },
    { label: 'Кодирование', href: `/${city.slug}/kodirovanie/` },
    { label: 'Реабилитация', href: `/${city.slug}/reabilitaciya/` },
  ]

  return (
    <section style={{ background: 'var(--deep)', position: 'relative', overflow: 'hidden', padding: '52px 0 60px' }}>
      <div style={{ position:'absolute', top:'-40%', right:'-15%', width:650, height:650, background:'radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 65%)', borderRadius:'50%' }} />

      <div className="ctr" style={{ position:'relative', zIndex:2, display:'grid', gridTemplateColumns:'1fr 400px', gap:48, alignItems:'start' }}>
        <div style={{ animation: 'fadeUp .7s ease forwards' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:18 }}>
            {[
              { t: 'Стационар 24/7', em: 'station' as const },
              {
                t: isStavropolCity(city)
                  ? `Выезд врача — до ${city.arrivalTime} мин`
                  : 'Выезд нарколога на дом',
                em: false,
              },
              { t: 'Конфиденциально', em: false },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'6px 14px', borderRadius:100, fontSize:12, fontWeight:700,
                  letterSpacing:'-.01em',
                  ...(c.em === 'station'
                    ? { background:'rgba(16,185,129,.11)', color:'#fff', border:'1px solid rgba(16,185,129,.26)' }
                    : { background:'rgba(255,255,255,.06)', color:'rgba(255,255,255,.88)', border:'1px solid rgba(255,255,255,.1)' }),
                }}
              >
                {c.t}
              </div>
            ))}
          </div>

          <h1 style={{ fontSize:40, fontWeight:800, color:'#fff', lineHeight:1.06, marginBottom:14, letterSpacing:'-.03em' }}>
            <span style={{ color:'var(--em)' }}>Экстренная наркологическая помощь</span>
            <span style={{ display:'block', marginTop:6, fontSize:'clamp(26px, 0.92em, 36px)', lineHeight:1.08 }}>
              <em style={{ fontStyle:'normal', color:'var(--em)' }}>в&nbsp;{city.namePrep}</em>
            </span>
          </h1>

          <p style={{ fontSize:16, color:'rgba(255,255,255,.58)', marginBottom:18, lineHeight:1.62, maxWidth:540 }}>
            {isStavropolCity(city) ? (
              <>
                Круглосуточная линия: выезд нарколога на дом (ориентир — {city.arrivalTime} мин), при необходимости — очный приём. При показаниях — круглосуточный
                стационар с наблюдением. Кодирование и реабилитация — следующие этапы маршрута по решению врача.
              </>
            ) : (
              <>
                Круглосуточная линия: выезд нарколога на дом и согласование формата на линии; при необходимости — очный приём. При показаниях — круглосуточный
                стационар с наблюдением. Кодирование и реабилитация — следующие этапы маршрута по решению врача.
              </>
            )}
          </p>

          <div style={{ display:'flex', flexWrap:'wrap', gap:'7px 8px', marginBottom:18 }}>
            {quickLinks.map(link => (
              <a
                key={link.label + link.href}
                href={link.href}
                style={{
                  display:'inline-flex', alignItems:'center', padding:'6px 12px', borderRadius:10,
                  fontSize:12.5, fontWeight:600, color:'rgba(255,255,255,.85)',
                  background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)',
                  textDecoration:'none', transition:'background .2s, border-color .2s',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div
            style={{
              display:'flex', flexDirection:'column', alignItems:'stretch', gap:0, marginTop:4, marginBottom:0,
              maxWidth:520, padding:'16px 18px 15px', borderRadius:16,
              background:'linear-gradient(165deg,rgba(255,255,255,.055),rgba(255,255,255,.032))',
              border:'1px solid rgba(255,255,255,.12)',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,.08), 0 14px 40px rgba(6,17,32,.14)',
            }}
          >
            <a
              href={`tel:${city.phone}`}
              style={{
                display:'flex', alignItems:'center', justifyContent:'center',
                padding:'14px 24px', borderRadius:14, background:'var(--em)', color:'#fff',
                fontWeight:700, fontSize:15, textDecoration:'none',
                boxShadow:'0 12px 30px rgba(16,185,129,.22)',
              }}
            >
              Позвонить сейчас
            </a>
            <div
              role="group"
              aria-label="Стационар"
              style={{
                display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between',
                gap:'12px 18px', marginTop:12, paddingTop:14,
                borderTop:'1px solid rgba(255,255,255,.1)',
              }}
            >
              <a
                href={`/${city.slug}/stacionar/`}
                style={{
                  display:'inline-flex', flex:'1 1 auto', justifyContent:'center', minWidth:'min(200px,100%)',
                  padding:'12px 20px', borderRadius:14,
                  border:'1px solid rgba(255,255,255,.2)', color:'#fff',
                  fontWeight:700, fontSize:14, letterSpacing:'-.015em', textDecoration:'none',
                  background:'linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.055))',
                  boxShadow:'inset 0 1px 0 rgba(255,255,255,.1), 0 8px 22px rgba(6,17,32,.12)',
                }}
              >
                Стационар 24/7
              </a>
              <span style={{ display:'inline-flex', alignItems:'baseline', gap:4, fontSize:12, fontWeight:600, fontVariantNumeric:'tabular-nums', color:'rgba(255,255,255,.55)', letterSpacing:'0.006em', whiteSpace:'nowrap' }}>
                <span>от {city.priceStacionarDay.toLocaleString('ru')} ₽</span>
                <span style={{ fontSize:11, fontWeight:500, color:'rgba(255,255,255,.4)', letterSpacing:'0.02em' }}>/ сутки</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const m = document.getElementById('callbackModal')
                if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden' }
              }}
              style={{
                marginTop:13, paddingTop:13, paddingBottom:12, paddingLeft:20, paddingRight:20, borderRadius:12,
                border:'1px solid rgba(255,255,255,.22)',
                borderTop:'1px solid rgba(255,255,255,.09)',
                background:'transparent', color:'rgba(255,255,255,.82)', fontWeight:600, fontSize:13.5, letterSpacing:'-0.01em', cursor:'pointer',
                textAlign:'center',
              }}
            >
              {CALLBACK_MODAL_TITLE}
            </button>
          </div>

          <p
            style={{
              margin:'14px 0 0', padding:'11px 15px', borderRadius:14, maxWidth:520,
              background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.085)',
              fontSize:12, fontWeight:500, color:'rgba(255,255,255,.52)', lineHeight:1.45, letterSpacing:'0.018em', textWrap:'balance',
            }}
          >
            {isStavropolCity(city)
              ? `Лицензия · Конфиденциально · Выезд до ${city.arrivalTime} мин`
              : 'Лицензия · Конфиденциально · Координация 24/7'}
          </p>
        </div>

        <div style={{ animation: 'fadeUp .7s ease .12s forwards', opacity: 0 }}>
          <LeadForm city={city} variant="hero" />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          section > div.ctr { grid-template-columns: 1fr !important; gap: 32px !important; }
          h1 { font-size: 32px !important; }
        }
        @media (max-width: 768px) {
          section { padding: 36px 0 44px !important; }
          h1 { font-size: 26px !important; }
        }
      `}</style>
    </section>
  )
}
