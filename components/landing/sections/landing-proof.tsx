import type { City } from '@/data/cities'
import { Reveal } from '../effects/reveal'

export function LandingProofSection({ city }: { city: City }) {
  return (
    <section id="coverage" className="py-[94px] max-md:pb-[76px]">
      <div className="mockup-container grid w-full grid-cols-[1.05fr_0.95fr] gap-[18px] max-[1180px]:grid-cols-1">
        <Reveal>
          <div className="rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] p-7 shadow-landing">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-[rgba(215,180,105,.14)] px-3 py-[7px] text-xs font-extrabold text-[#8A6A25]">
                  Блок доверия и правдоподобия
                </span>
                <h3 className="mt-3 text-[32px] font-extrabold leading-tight tracking-tight text-deep-2 max-md:text-[30px]">
                  Доверие строится не абстрактно, а через понятные маркеры реальности
                </h3>
                <p className="mt-2.5 max-w-[560px] text-[15px] leading-[1.75] text-ink-muted">
                  Даже на уровне прототипа важно показать, какие именно блоки будут утяжелять доверие в боевой версии: кто
                  оказывает услуги, почему можно вызвать домой, как устроена география, чем защищена анонимность и где
                  находится клиника/офис.
                </p>
              </div>
            </div>

            <div className="mt-[22px] grid grid-cols-2 gap-3 max-md:grid-cols-1">
              {[
                ['Юрблок и исполнитель', 'Прототип уже предусматривает место под владельца сайта, исполнителя услуг, номер лицензии, адрес и правовой дисклеймер.'],
                ['Адрес и карта', 'Для Директа и пользовательского доверия адрес должен быть не спрятан, а понятен и близок к коммерческим блокам.'],
                ['Сценарий безопасности', 'Нужно объяснить, как проходит визит, что видят соседи, как выглядит машина и кто именно приезжает.'],
                ['Маршрут по воронке', 'Острая помощь → последующее лечение → кодирование → реабилитация. Это усиливает LTV и делает бренд шире одной услуги.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[20px] border border-line bg-gradient-to-b from-white to-[#F8FBFF] p-[18px]">
                  <strong className="block text-lg font-extrabold tracking-tight text-deep-2">{title}</strong>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative flex min-h-full flex-col justify-between overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_84%_18%,rgba(215,180,105,.16),transparent_20%),linear-gradient(180deg,#0B1D35,#102A48)] text-white shadow-landing before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] before:bg-[length:24px_24px] before:opacity-50">
            <div className="relative z-[1] p-7">
              <span className="inline-flex rounded-full bg-[rgba(255,255,255,0.1)] px-3 py-[7px] text-xs font-extrabold text-white">
                География выезда и адресная логика
              </span>
              <h3 className="mt-3 text-[30px] font-extrabold leading-tight tracking-tight max-md:text-[30px]">
                {city.name} и зоны выезда показаны как часть доверия, а не как сухая справка
              </h3>
              <p className="mt-3 text-[15px] leading-[1.78] text-[rgba(255,255,255,0.72)]">
                Этот блок важен и для конверсии, и для рекламы: пользователь быстрее понимает, что помощь реально может
                приехать, а не «существует где-то в интернете».
              </p>

              <div className="mt-[18px] flex flex-wrap gap-2.5">
                {city.districts.map(d => (
                  <span
                    key={d}
                    className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] px-3.5 py-2.5 text-[13px] font-bold text-white"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <div className="relative mt-[26px] h-[280px] overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.12)] bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.03)] before:pointer-events-none before:absolute before:inset-[18px] before:rounded-[20px] before:border before:border-dashed before:border-[rgba(255,255,255,0.18)] after:pointer-events-none after:absolute after:inset-[40px_54px_34px_34px] after:rounded-[20px] after:border after:border-dashed after:border-[rgba(255,255,255,0.18)]">
                <div className="absolute left-9 top-[34px] z-[2] flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-deep-2 shadow-[0_12px_24px_rgba(0,0,0,.14)]">
                  <span className="h-2 w-2 rounded-full bg-emerald" />
                  Клиника / офис
                </div>
                <div className="absolute right-[46px] top-[106px] z-[2] flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-deep-2 shadow-[0_12px_24px_rgba(0,0,0,.14)]">
                  <span className="h-2 w-2 rounded-full bg-emerald" />
                  Выездная зона 30 мин
                </div>
                <div className="absolute bottom-[42px] left-1/2 z-[2] flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-deep-2 shadow-[0_12px_24px_rgba(0,0,0,.14)]">
                  <span className="h-2 w-2 rounded-full bg-emerald" />
                  Расширенная зона 45–60 мин
                </div>
              </div>

              <div className="mt-[18px] rounded-[18px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] p-4 text-[13px] leading-relaxed text-[rgba(255,255,255,0.7)]">
                Здесь в боевой версии должны быть реальные адрес, координаты, карта, зоны покрытия и привязка к конкретному
                городу / партнёру. На уровне прототипа место под это уже заложено в нужной точке страницы.
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
