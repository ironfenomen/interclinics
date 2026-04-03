import type { City } from '@/data/cities'

/** Дефолтный владелец / администратор сайта (сеть InterClinics). */
export const DEFAULT_FOOTER_SITE_OWNER = {
  name: 'ООО «Амадеус»',
  inn: '2634111890',
  ogrn: '1232600005571',
} as const

/** Дефолтный основной медицинский исполнитель базового маршрута. */
export const DEFAULT_FOOTER_MEDICAL_EXECUTOR = {
  clinicBrand: 'клиника «Амадея»',
  legalName: 'ООО «Амадея»',
  inn: '2635248939',
  ogrn: '1212600004165',
  license: 'Л041-01197-26/00327766',
  licenseDate: '10.08.2021',
} as const

const NOTE_MEDICAL =
  'В зависимости от города, маршрута помощи и выбранного формата услуг медицинская помощь может оказываться иными медицинскими организациями или индивидуальными предпринимателями, имеющими право на соответствующую деятельность.'

const NOTE_PSYCH =
  'Психологические консультации также могут оказываться иными исполнителями, включая ИП, в рамках выбранного формата сопровождения.'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Юридический блок футера городского HTML-мокапа.
 * Собирается из city.footer* при наличии, иначе — дефолты сети.
 */
export function buildMockupFooterLegalHtml(city: City): string {
  const owner = city.footerSiteOwner ?? DEFAULT_FOOTER_SITE_OWNER
  const med = city.footerMedicalExecutor ?? DEFAULT_FOOTER_MEDICAL_EXECUTOR

  return `<p class="footer-legal-lead">Сайт interclinics.ru принадлежит и администрируется <strong>${esc(owner.name)}</strong> (ИНН ${esc(owner.inn)}, ОГРН ${esc(owner.ogrn)}).</p>
<p class="footer-legal-provider">Основной исполнитель медицинских услуг в базовом маршруте — <strong>${esc(med.clinicBrand)}</strong> (<strong>${esc(med.legalName)}</strong>, ИНН ${esc(med.inn)}, ОГРН ${esc(med.ogrn)}). Медицинская лицензия ${esc(med.license)} от ${esc(med.licenseDate)}.</p>
<p class="footer-legal-note">${NOTE_MEDICAL}</p>
<p class="footer-legal-note">${NOTE_PSYCH}</p>`
}
