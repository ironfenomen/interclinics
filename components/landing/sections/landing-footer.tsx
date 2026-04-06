import type { City } from '@/data/cities'
import { MedicalContraindicationsNote } from '@/components/MedicalContraindicationsNote'
import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'
import { DEFAULT_FOOTER_SITE_OWNER } from '@/lib/footer-legal-mockup'

export function LandingFooter({ city }: { city: City }) {
  const addrLine = city.partnerAddress?.trim() ?? ''

  return (
    <footer className="bg-gradient-to-b from-[#040A12] to-[#08111D] px-5 py-11 pb-[22px] text-[rgba(255,255,255,0.58)]">
      <div className="mockup-container w-full">
        <div className="grid grid-cols-[1.3fr_0.9fr_0.9fr] gap-[26px] max-md:grid-cols-1">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-white">
              {BRAND_DISPLAY_NAME}
              <small className="mt-1.5 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.34)]">
                Сеть наркологических клиник / лидогенерационная платформа
              </small>
            </div>
            <div className="mt-3.5 text-[13px] leading-[1.85]">
              <strong className="text-[rgba(255,255,255,0.85)]">{DEFAULT_FOOTER_SITE_OWNER.name}</strong>
              <br />
              ИНН {DEFAULT_FOOTER_SITE_OWNER.inn}, ОГРН {DEFAULT_FOOTER_SITE_OWNER.ogrn}
              <br />
              <br />
              Медицинские услуги оказывает:
              <br />
              <strong className="text-[rgba(255,255,255,0.85)]">{city.partnerName}</strong>
              <br />
              Лицензия № {city.partnerLicense}
              <br />
              {addrLine ? <>Адрес: {addrLine}</> : null}
            </div>
          </div>

          <div>
            <h4 className="mb-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[rgba(255,255,255,0.75)]">
              Навигация
            </h4>
            <ul className="grid list-none gap-2.5">
              {[
                ['Услуги', '#services'],
                ['Цены', '#pricing'],
                ['География', '#coverage'],
                ['Врачи', '#doctors'],
                ['FAQ', '#faq'],
              ].map(([l, h]) => (
                <li key={l}>
                  <a className="text-[13px] font-bold text-[rgba(255,255,255,0.58)]" href={h}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[rgba(255,255,255,0.75)]">
              Документы
            </h4>
            <ul className="grid list-none gap-2.5">
              <li>
                <a className="text-[13px] font-bold text-[rgba(255,255,255,0.58)]" href="/privacy">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a className="text-[13px] font-bold text-[rgba(255,255,255,0.58)]" href="/consent">
                  Согласие на обработку персональных данных
                </a>
              </li>
              <li>
                <a className="text-[13px] font-bold text-[rgba(255,255,255,0.58)]" href="/cookies">
                  Политика cookie и метрических сервисов
                </a>
              </li>
              <li>
                <a className="text-[13px] font-bold text-[rgba(255,255,255,0.58)]" href="#">
                  Пользовательское соглашение
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-[rgba(255,255,255,0.07)] pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-[18px]">
          <div className="max-w-[760px] text-xs leading-[1.8] text-[rgba(255,255,255,0.44)]">
            Сайт носит информационный характер и не является публичной офертой. Определение диагноза и методов лечения относится
            к компетенции врача. Структура страницы собрана как премиальный конверсионный прототип под Яндекс Директ и
            мультигородскую архитектуру.
          </div>
          <MedicalContraindicationsNote className="shrink-0 sm:max-w-[min(100%,380px)]" />
        </div>
      </div>
    </footer>
  )
}
