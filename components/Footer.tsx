'use client'

// components/Footer.tsx — сетка и юрблок как у городского HTML-мокапа (mockup-literal + lib/footer-legal-mockup)
import { City } from '@/data/cities'
import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'
import { MEDICAL_CONTRAINDICATIONS_TEXT } from '@/components/MedicalContraindicationsNote'
import {
  DEFAULT_FOOTER_MEDICAL_EXECUTOR,
  DEFAULT_FOOTER_SITE_OWNER,
  FOOTER_LEGAL_NOTE_MEDICAL,
  FOOTER_LEGAL_NOTE_PSYCH,
} from '@/lib/footer-legal-mockup'

/** Сравнение путей с учётом завершающего слэша (для aria-current на посадочных). */
function pathsMatch(activeHref: string | undefined, href: string): boolean {
  if (!activeHref) return false
  const norm = (s: string) => s.replace(/\/+$/, '') || '/'
  return norm(activeHref.split('#')[0] ?? '') === norm(href.split('#')[0] ?? '')
}

export default function Footer({ city, activeHref }: { city: City; activeHref?: string }) {
  const owner = city.footerSiteOwner ?? DEFAULT_FOOTER_SITE_OWNER
  const med = city.footerMedicalExecutor ?? DEFAULT_FOOTER_MEDICAL_EXECUTOR

  const localLine = city.isOwn
    ? `Юридический адрес исполнителя: ${city.partnerAddress}`
    : `Приём и координация в ${city.namePrep}. Адрес исполнителя услуги уточняется при обращении.`

  const cityHome = `/${city.slug}/`

  const serviceLinks: [string, string][] = [
    ['Главная города', cityHome],
    ['Вывод из запоя', `/${city.slug}/vyvod-iz-zapoya/`],
    ['Нарколог на дом', `/${city.slug}/narkolog-na-dom/`],
    ['Стационар 24/7', `/${city.slug}/stacionar/`],
    ['Кодирование', `/${city.slug}/kodirovanie/`],
    ['Реабилитация', `/${city.slug}/reabilitaciya/`],
    ['Услуги и направления', `${cityHome}#services`],
  ]

  const docLinks: [string, string][] = [
    ['Политика конфиденциальности', '/privacy/'],
    ['Согласие на обработку персональных данных', '/consent/'],
    ['Политика cookie и метрических сервисов', '/cookies/'],
    ['Пользовательское соглашение', '/agreement/'],
  ]

  return (
    <footer className="footer">
      <div className="c">
        <div className="footer-grid">
          <div className="footer-col footer-col--brand">
            <a href={cityHome} className="footer-brand-home">
              <div className="footer-brand">
                {BRAND_DISPLAY_NAME}
                <small>Сеть наркологической помощи в регионах</small>
              </div>
            </a>
            <div className="footer-text" id="footer-requisites">
              <p className="footer-legal-lead">
                Сайт interclinics.ru принадлежит и администрируется <strong>{owner.name}</strong> (ИНН {owner.inn}, ОГРН{' '}
                {owner.ogrn}).
              </p>
              <p className="footer-legal-provider">
                Основной исполнитель медицинских услуг в базовом маршруте — <strong>{med.clinicBrand}</strong> (
                <strong>{med.legalName}</strong>, ИНН {med.inn}, ОГРН {med.ogrn}). Медицинская лицензия {med.license}{' '}
                от {med.licenseDate}.
              </p>
              <p className="footer-legal-note">{FOOTER_LEGAL_NOTE_MEDICAL}</p>
              <p className="footer-legal-note">{FOOTER_LEGAL_NOTE_PSYCH}</p>
              <p>{localLine}</p>
            </div>
          </div>

          <div className="footer-col">
            <h4>Услуги и разделы</h4>
            <ul>
              {serviceLinks.map(([label, href]) => (
                <li key={label}>
                  <a href={href} {...(pathsMatch(activeHref, href) ? { 'aria-current': 'page' as const } : {})}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Документы</h4>
            <ul>
              {docLinks.map(([label, href]) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-medical-strip" role="note" aria-label="Медицинское предупреждение">
          <span className="footer-medical-strip__mark" aria-hidden="true" />
          <p className="footer-medical-strip__text">{MEDICAL_CONTRAINDICATIONS_TEXT}</p>
        </div>

        <div className="footer-bottom">
          <p className="footer-disclaimer">
            Материалы сайта носят информационный характер и не являются публичной офертой. Диагноз и план лечения
            определяет врач при очной консультации. © 2024–2026 {BRAND_DISPLAY_NAME}.
          </p>
        </div>
      </div>
    </footer>
  )
}
