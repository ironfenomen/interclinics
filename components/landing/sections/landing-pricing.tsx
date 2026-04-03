import type { City } from '@/data/cities'
import { Reveal } from '../effects/reveal'
import { CallbackButton } from '../ui/callback-button'

function rub(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n)
}

export function LandingPricingSection({ city }: { city: City }) {
  const packs = [
    {
      label: 'Базовый вход',
      title: 'Стандартная капельница',
      desc: 'Для коротких эпизодов, умеренных симптомов и пользователей, которые ищут понятный первый шаг без перегруза деталями.',
      price: city.priceBase,
      lines: [
        'Быстрый и понятный оффер без избыточных обещаний',
        'Подходит под горячие запросы «прокапаться», «снять запой»',
        'Нормальная точка входа для price-sensitive трафика',
      ],
      cta: { type: 'modal' as const },
    },
    {
      label: 'Главный конверсионный пакет',
      title: 'Усиленная помощь на дому',
      desc: 'Это тот блок, который чаще всего конвертит лучше остальных: достаточно серьёзно выглядит, но остаётся психологически доступным по цене.',
      price: city.priceEnhanced,
      featured: true,
      lines: [
        'Лучшее сочетание «ценность / доверие / решение проблемы»',
        'Подходит под urgent и semi-urgent сценарии',
        'Выглядит как разумный выбор, а не как «эконом»',
      ],
      cta: { type: 'modal' as const, primary: true },
    },
    {
      label: 'Тяжёлый сценарий',
      title: 'Расширенный клинический выезд',
      desc: 'Для пользователей, которым важны серьёзность, глубина помощи и ощущение, что проблему действительно берут под контроль.',
      price: city.priceMax,
      lines: [
        'Работает как «премиальный якорь» для всей сетки цен',
        'Поднимает ценность среднего пакета',
        'Подходит для более тяжёлых и тревожных кейсов',
      ],
      cta: { type: 'link' as const, href: '#coverage', label: 'Посмотреть географию' },
    },
  ]

  return (
    <section id="pricing" className="bg-gradient-to-b from-[#F7FAFD] to-white py-[90px] max-md:pb-[76px]">
      <div className="mockup-container w-full">
        <Reveal>
          <div className="landing-section-head">
            <span className="landing-section-eyebrow">
              <span className="landing-section-eyebrow-dot" aria-hidden />
              Цены и пакеты
            </span>
            <h2>Прайс показан вовремя: не слишком рано и не слишком поздно</h2>
            <p>
              После объяснения процесса цена уже не пугает, а становится инструментом выбора. Это особенно важно для
              поискового трафика по запросам «цена», «сколько стоит», «недорого».
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-3 gap-[18px] max-[1024px]:grid-cols-2 max-md:grid-cols-1">
          {packs.map(p => (
            <Reveal key={p.title}>
              <div
                className={`relative overflow-hidden rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] p-[26px] shadow-landing before:absolute before:left-0 before:right-0 before:top-0 before:h-[5px] before:bg-gradient-to-r before:from-gold before:to-emerald ${
                  p.featured
                    ? '-translate-y-2.5 bg-gradient-to-b from-white to-[#F7FCFB] shadow-[0_28px_80px_rgba(16,185,129,.13),0_18px_48px_rgba(10,25,45,.12)]'
                    : ''
                }`}
              >
                <div className="inline-flex rounded-full bg-[rgba(215,180,105,.14)] px-3 py-[7px] text-xs font-extrabold text-[#8A6A25]">
                  {p.label}
                </div>
                <h3 className="mt-3.5 text-[22px] font-extrabold tracking-tight text-deep-2">{p.title}</h3>
                <div className="mt-2.5 text-sm leading-relaxed text-ink-muted">{p.desc}</div>
                <div className="mt-[18px] text-[44px] font-extrabold tracking-tight text-deep-2">
                  {rub(p.price)} ₽ <small className="text-[15px] font-bold text-ink-muted">/ выезд</small>
                </div>
                <ul className="mt-[18px] grid list-none gap-2.5">
                  {p.lines.map(line => (
                    <li
                      key={line}
                      className="flex gap-2.5 text-sm font-semibold leading-snug text-ink before:mt-0.5 before:h-5 before:w-5 before:flex-shrink-0 before:rounded-full before:bg-[rgba(16,185,129,.12)] before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%2310B981%27%20stroke-width%3D%272.4%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27M5%2013l4%204L19%207%27%2F%3E%3C%2Fsvg%3E')] before:bg-[length:13px] before:bg-center before:bg-no-repeat"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="mt-[22px] flex gap-2.5">
                  {p.cta.type === 'modal' ? (
                    <CallbackButton
                      className={
                        'primary' in p.cta && p.cta.primary
                          ? 'btn-primary-mock w-full'
                          : 'btn-secondary-mock w-full'
                      }
                    >
                      {'primary' in p.cta && p.cta.primary ? 'Выбрать этот пакет' : 'Оставить номер'}
                    </CallbackButton>
                  ) : (
                    <a className="btn-secondary-mock w-full text-center" href={p.cta.href}>
                      {p.cta.label}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-[22px] grid grid-cols-[1.05fr_auto] items-center gap-5 rounded-[28px] bg-gradient-to-br from-deep-2 to-deep-3 p-6 text-white shadow-landingLg max-lg:grid-cols-1">
            <div>
              <h3 className="text-[28px] font-extrabold leading-tight tracking-tight">
                Пользователь уже увидел цену — это идеальный момент для второго дожима
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[rgba(255,255,255,0.68)]">
                Поэтому прямо после прайса добавлен промежуточный блок действия: он забирает тех, кто принял решение на цифрах,
                не заставляя листать ещё несколько экранов.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2.5 max-lg:justify-start">
              <a
                className="rounded-[18px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] px-[18px] py-3.5 text-xl font-extrabold tracking-tight text-white"
                href={`tel:${city.phone}`}
              >
                {city.phoneDisplay}
              </a>
              <CallbackButton className="btn-primary-mock">Получить звонок</CallbackButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
