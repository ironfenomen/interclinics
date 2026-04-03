import type { City } from '@/data/cities'
import { Reveal } from '../effects/reveal'
import { CallbackButton } from '../ui/callback-button'

function rub(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n)
}

export function LandingIntentSection({ city }: { city: City }) {
  return (
    <section id="services" className="pb-6 pt-[88px]">
      <div className="mockup-container w-full">
        <Reveal>
          <div className="landing-section-head">
            <span className="landing-section-eyebrow">
              <span className="landing-section-eyebrow-dot" aria-hidden />
              Услуги и продуктовые интенты
            </span>
            <h2>Прототип уже разводит разные сценарии обращения, а не сваливает всё в одну кашу</h2>
            <p>
              Это важно для наркологии: «срочно прокапаться», «вызвать врача», «закодироваться» и «устроить в реабилитацию»
              — это четыре разные психологии и четыре разные посадки.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-3 gap-[18px] max-[1024px]:grid-cols-2 max-md:grid-cols-1">
          <Reveal>
            <div className="card-intent relative overflow-hidden rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] p-6 shadow-landing after:pointer-events-none after:absolute after:-bottom-[58%] after:-right-1/4 after:h-[200px] after:w-[200px] after:rounded-full after:bg-[radial-gradient(circle,rgba(16,185,129,.12),transparent_60%)]">
              <div className="relative z-[1] flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[rgba(220,230,241,0.9)] bg-gradient-to-b from-white to-surface-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(9,20,35,.05)]">
                <svg className="h-6 w-6 stroke-emerald" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round">
                  <path d="M12 2v20" />
                  <path d="M5 12h14" />
                  <path d="m7 7 5-5 5 5" />
                </svg>
              </div>
              <h3 className="relative z-[1] mt-4 text-2xl font-extrabold leading-[1.12] tracking-[-0.03em] text-deep-2">
                Вывод из запоя
              </h3>
              <p className="relative z-[1] mt-2.5 text-sm leading-relaxed text-ink-muted">
                Горячий и самый срочный интент. Здесь важнее всего скорость выезда, понятная цена, анонимность и минимальная
                сложность обращения.
              </p>
              <ul className="relative z-[1] mt-4 grid list-none gap-2">
                {[
                  'Оффер с выездом и временем прибытия',
                  'Цена видна достаточно рано',
                  'Прямой путь к звонку с первого экрана',
                ].map(t => (
                  <li
                    key={t}
                    className="flex gap-2.5 text-sm font-semibold leading-snug text-ink before:mt-0.5 before:h-[18px] before:w-[18px] before:flex-shrink-0 before:rounded-full before:bg-[rgba(16,185,129,.12)] before:shadow-[inset_0_0_0_5px_rgba(16,185,129,.22)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <div className="relative z-[1] mt-[18px] flex flex-wrap items-end justify-between gap-3.5">
                <div className="text-sm font-bold text-ink-muted">
                  от <b className="text-[28px] tracking-tight text-deep-2">{rub(city.priceVyvodFrom)} ₽</b>
                </div>
                <CallbackButton className="btn-secondary-mock shrink-0">Оставить номер</CallbackButton>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="card-intent relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-deep-2 to-[#102A48] p-6 text-white shadow-landingLg after:pointer-events-none after:absolute after:-bottom-[58%] after:-right-1/4 after:h-[200px] after:w-[200px] after:rounded-full after:bg-[radial-gradient(circle,rgba(16,185,129,.12),transparent_60%)]">
              <div className="relative z-[1] flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,.08)]">
                <svg className="h-6 w-6 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round">
                  <path d="M22 12h-4l-3 9-6-18-3 9H2" />
                </svg>
              </div>
              <h3 className="relative z-[1] mt-4 text-2xl font-extrabold leading-[1.12] tracking-[-0.03em] text-white">
                Нарколог на дом
              </h3>
              <p className="relative z-[1] mt-2.5 text-sm leading-relaxed text-[rgba(255,255,255,0.66)]">
                Ключевой коммерческий кластер для поискового трафика. Прототип под него самый сильный: здесь лучшие условия для
                звонка и быстрой заявки.
              </p>
              <ul className="relative z-[1] mt-4 grid list-none gap-2">
                {[
                  'Покрытие районов и объяснение логистики',
                  'Снятие страха перед вызовом домой',
                  'Два CTA рядом: немедленно и «перезвоните мне»',
                ].map(t => (
                  <li
                    key={t}
                    className="flex gap-2.5 text-sm font-semibold leading-snug text-white before:mt-0.5 before:h-[18px] before:w-[18px] before:flex-shrink-0 before:rounded-full before:bg-[rgba(215,180,105,.18)] before:shadow-[inset_0_0_0_5px_rgba(215,180,105,.28)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <div className="relative z-[1] mt-[18px] flex flex-wrap items-end justify-between gap-3.5">
                <div className="text-sm font-bold text-[rgba(255,255,255,0.66)]">
                  от <b className="text-[28px] tracking-tight text-white">{rub(city.priceNarkolog)} ₽</b>
                </div>
                <a className="btn-primary-mock shrink-0" href="#how">
                  Как это работает
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="card-intent relative overflow-hidden rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] p-6 shadow-landing after:pointer-events-none after:absolute after:-bottom-[58%] after:-right-1/4 after:h-[200px] after:w-[200px] after:rounded-full after:bg-[radial-gradient(circle,rgba(16,185,129,.12),transparent_60%)] max-lg:col-span-2 max-md:col-span-1">
              <div className="relative z-[1] flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[rgba(220,230,241,0.9)] bg-gradient-to-b from-white to-surface-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(9,20,35,.05)]">
                <svg className="h-6 w-6 stroke-emerald" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="relative z-[1] mt-4 text-2xl font-extrabold leading-[1.12] tracking-[-0.03em] text-deep-2">
                Кодирование и реабилитация
              </h3>
              <p className="relative z-[1] mt-2.5 text-sm leading-relaxed text-ink-muted">
                Менее срочные, но более тяжёлые по доверию решения. Поэтому они не мешают острому сценарию, а подаются как
                отдельный продуктовый слой.
              </p>
              <ul className="relative z-[1] mt-4 grid list-none gap-2">
                {[
                  'Нужны отдельные посадки и тональность',
                  'Здесь важнее доверие, врачи и методика',
                  'Путь к заявке мягче, чем в urgent-сценариях',
                ].map(t => (
                  <li
                    key={t}
                    className="flex gap-2.5 text-sm font-semibold leading-snug text-ink before:mt-0.5 before:h-[18px] before:w-[18px] before:flex-shrink-0 before:rounded-full before:bg-[rgba(16,185,129,.12)] before:shadow-[inset_0_0_0_5px_rgba(16,185,129,.22)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <div className="relative z-[1] mt-[18px] flex flex-wrap items-end justify-between gap-3.5">
                <div className="text-sm font-bold text-ink-muted">
                  от <b className="text-[28px] tracking-tight text-deep-2">{rub(city.priceCoding)} ₽</b>
                </div>
                <a className="btn-secondary-mock shrink-0" href="#doctors">
                  Смотреть блок доверия
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
