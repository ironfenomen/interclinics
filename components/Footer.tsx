'use client'

// components/Footer.tsx

import { City } from '@/data/cities'
import { MedicalContraindicationsNote } from '@/components/MedicalContraindicationsNote'

export default function Footer({ city }: { city: City }) {
  return (
    <footer style={{ background: 'linear-gradient(180deg,#030910,#08111D 55%,#0a1520)', color: 'rgba(255,255,255,.62)', padding: '56px 0 36px', fontSize: 13 }}>
      <div className="ctr" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '36px 32px' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-.03em' }}>InterClinics</div>
          <div style={{ lineHeight: 1.8 }}>
            <strong style={{ color: 'rgba(255,255,255,.55)' }}>{city.partnerName}</strong><br />
            ИНН {city.partnerInn} / ОГРН {city.partnerOgrn}<br />
            Лицензия {city.partnerLicense}<br />
            от {city.partnerLicenseDate} г.<br /><br />
            {city.partnerAddress}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.68)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '.1em' }}>Услуги</div>
          <ul style={{ listStyle: 'none' }}>
            {[
              ['Вывод из запоя', `/${city.slug}/vyvod-iz-zapoya/`],
              ['Кодирование', `/${city.slug}/kodirovanie/`],
              ['Лечение алкоголизма', '#'],
              ['Лечение наркомании', '#'],
              ['Стационар 24/7', `/${city.slug}/stacionar/`],
              ['Реабилитация', `/${city.slug}/reabilitaciya/`],
              ['Нарколог на дом', `/${city.slug}/narkolog-na-dom/`],
            ].map(([label, href]) => (
              <li key={label} style={{ marginBottom: 10 }}>
                <a className="ic-footer-link" href={href} style={{ color: 'rgba(255,255,255,.62)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'color .2s, border-color .2s' }}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.68)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '.1em' }}>Информация</div>
          <ul style={{ listStyle: 'none' }}>
            {[['О компании', '#'], ['Врачи', '#'], ['Цены', '#'], ['Лицензии', '#'], ['Политика конфиденциальности', '/privacy/'], ['Политика cookie', '/cookies'], ['Пользовательское соглашение', '/agreement/']].map(([t, h]) => (
              <li key={t} style={{ marginBottom: 10 }}><a className="ic-footer-link" href={h} style={{ color: 'rgba(255,255,255,.62)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'color .2s, border-color .2s' }}>{t}</a></li>
            ))}
          </ul>
        </div>
        <div
          className="ic-footer-legal"
          style={{ gridColumn: '1 / -1', marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.05)' }}
        >
          <div style={{ maxWidth: 660, lineHeight: 1.7, fontSize: 11, color: 'rgba(255,255,255,.2)' }}>
            Сайт носит исключительно информационный характер и не является публичной офертой. Определение диагноза и методов лечения — прерогатива лечащего врача. © 2024–2026 InterClinics.
          </div>
          <MedicalContraindicationsNote className="mx-auto w-full max-w-full shrink-0 max-sm:justify-center max-sm:[&_p]:text-center sm:mx-0 sm:w-auto sm:max-w-[min(100%,380px)]" />
        </div>
      </div>
      <style jsx>{`
        .ic-footer-link:hover {
          color: #fff !important;
          border-bottom-color: rgba(16, 185, 129, 0.45) !important;
        }
        .ic-footer-legal {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: stretch;
        }
        @media (min-width: 769px) {
          .ic-footer-legal {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        @media (max-width: 768px) {
          footer .ctr {
            grid-template-columns: 1fr !important;
          }
          .ic-footer-legal {
            text-align: center;
            align-items: center;
          }
        }
      `}</style>
    </footer>
  )
}
