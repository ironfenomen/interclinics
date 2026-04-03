// components/Footer.tsx
'use client'

import { City } from '@/data/cities'
import { MedicalContraindicationsNote } from '@/components/MedicalContraindicationsNote'

export default function Footer({ city }: { city: City }) {
  return (
    <footer style={{ background: '#060D18', color: 'rgba(255,255,255,.35)', padding: '44px 0 28px', fontSize: 13 }}>
      <div className="ctr" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 36 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10 }}>InterClinics</div>
          <div style={{ lineHeight: 1.8 }}>
            <strong style={{ color: 'rgba(255,255,255,.55)' }}>{city.partnerName}</strong><br />
            ИНН {city.partnerInn} / ОГРН {city.partnerOgrn}<br />
            Лицензия {city.partnerLicense}<br />
            от {city.partnerLicenseDate} г.<br /><br />
            {city.partnerAddress}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.6)', marginBottom: 14, textTransform: 'uppercase' as const, letterSpacing: '.08em' }}>Услуги</div>
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
              <li key={label} style={{ marginBottom: 8 }}>
                <a href={href} style={{ color: 'rgba(255,255,255,.35)', transition: 'color .2s' }}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.6)', marginBottom: 14, textTransform: 'uppercase' as const, letterSpacing: '.08em' }}>Информация</div>
          <ul style={{ listStyle: 'none' }}>
            {[['О компании', '#'], ['Врачи', '#'], ['Цены', '#'], ['Лицензии', '#'], ['Политика конфиденциальности', '/privacy/'], ['Политика cookie', '/cookies'], ['Пользовательское соглашение', '/agreement/']].map(([t, h]) => (
              <li key={t} style={{ marginBottom: 8 }}><a href={h} style={{ color: 'rgba(255,255,255,.35)', transition: 'color .2s' }}>{t}</a></li>
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
