import { Reveal } from '../effects/reveal'

const cases = [
  {
    k: 'Кейс 01',
    t: 'Ночной срочный запрос',
    p: 'Пользователь заходит с мобильного, не хочет читать длинно, видит звонок, короткую форму и быстрый proof прямо в hero.',
    m1: 'Главный триггер: скорость',
    m2: 'Главный CTA: звонок',
  },
  {
    k: 'Кейс 02',
    t: 'Сомневающийся родственник',
    p: 'Не готов звонить сразу, но идёт по пути «как это работает → цена → доверие → отзывы → FAQ» и уже потом оставляет номер.',
    m1: 'Главный триггер: безопасность',
    m2: 'Главный CTA: обратный звонок',
  },
  {
    k: 'Кейс 03',
    t: 'Долгий цикл реабилитации',
    p: 'Нужен не ударный оффер, а спокойный экспертный маршрут. Поэтому страница теперь лучше держит и длинное решение, не только urgent-сценарий.',
    m1: 'Главный триггер: доверие',
    m2: 'Главный CTA: консультация',
  },
] as const

const readiness = [
  ['Hero', 'Сильнее сегментирован и уже не выглядит универсальной шапкой про всё сразу.'],
  ['Flow', 'После hero появился тяжёлый архитектурный слой, который объясняет логику и усиливает маршрут.'],
  ['Differentiation', 'Есть прямое сравнение с типовым рынком, а значит страница ощущается как осознанный продукт.'],
  ['Cases', 'Добавлены сценарные кейсы, которые переводят абстракцию в узнаваемое пользовательское поведение.'],
  ['System', 'Все ключевые блоки теперь работают как единая лидген-платформа, а не как удачно собранный лендинг.'],
] as const

export function LandingOutcomesSection() {
  return (
    <section id="outcomes" className="pb-[94px] max-md:pb-[76px]">
      <div className="mockup-container w-full">
        <div className="grid grid-cols-[1.15fr_0.85fr] gap-[18px] max-lg:grid-cols-1">
          <Reveal>
            <div className="rounded-[28px] border border-line bg-white p-[26px] shadow-landing">
              <span className="inline-flex rounded-full bg-[rgba(16,185,129,.12)] px-3 py-[7px] text-xs font-extrabold text-emerald-2">
                Чего ещё не хватало до максимума
              </span>
              <h3 className="mt-3 text-[30px] font-extrabold leading-tight tracking-tight text-deep-2">
                Кейсы и сценарные результаты: страница должна не просто обещать, а показывать, как она ведёт человека из
                хаоса в решение
              </h3>
              <p className="mt-3 text-[15px] leading-[1.78] text-ink-muted">
                Ниже не «клинические обещания», а прототипные кейсы поведения пользователя. Они усиливают ощущение
                маршрута: кто пришёл, с какой проблемой, какой экран сработал и почему именно эта архитектура помогает
                довести до контакта.
              </p>

              <div className="mt-[22px] grid grid-cols-3 gap-3.5 max-md:grid-cols-1">
                {cases.map(c => (
                  <div key={c.k} className="rounded-[22px] border border-line bg-gradient-to-b from-[#F8FBFE] to-white p-[18px]">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-2">{c.k}</div>
                    <h4 className="mt-2.5 text-lg font-extrabold leading-tight tracking-tight text-deep-2">{c.t}</h4>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{c.p}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <div className="rounded-[14px] border border-line bg-white px-3 py-2.5 text-xs font-extrabold text-deep-2">
                        {c.m1}
                      </div>
                      <div className="rounded-[14px] border border-line bg-white px-3 py-2.5 text-xs font-extrabold text-deep-2">
                        {c.m2}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-[28px] border border-line bg-white p-[26px] shadow-landing">
              <span className="inline-flex rounded-full bg-[rgba(215,180,105,.14)] px-3 py-[7px] text-xs font-extrabold text-[#8A6A25]">
                Readiness checklist
              </span>
              <h3 className="mt-3 text-[30px] font-extrabold leading-tight tracking-tight text-deep-2">
                Почему после доработки я уже могу считать это почти эталонным прототипом
              </h3>
              <p className="mt-3 text-[15px] leading-[1.78] text-ink-muted">
                Страница стала сильнее не на уровне «красивее», а на уровне структуры принятия решения. Она лучше
                управляет вниманием, контекстом, температурой спроса и переходами между секциями.
              </p>
              <ul className="mt-[18px] grid list-none gap-3">
                {readiness.map(([b, s]) => (
                  <li key={b} className="rounded-[18px] border border-line bg-gradient-to-b from-[#F8FBFE] to-white px-4 py-3.5">
                    <b className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wide text-emerald-2">{b}</b>
                    <span className="text-sm font-semibold leading-relaxed text-ink-muted">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
