import { Reveal } from '../effects/reveal'
import { CallbackButton } from '../ui/callback-button'

const cards = [
  {
    step: '01',
    title: 'Разделили сценарии ещё в hero',
    body: 'Раньше page-level сегментация начиналась позже. Теперь пользователь уже на первом экране понимает: ему нужен срочный вызов, домашний выезд, кодирование или реабилитация.',
    bullets: [
      'Разные эмоциональные контексты',
      'Разные CTA внутри одной формы',
      'Меньше ощущения «один экран про всё»',
    ],
    cta: { href: '#services' as const, label: 'Смотреть структуру услуг', primary: false },
  },
  {
    step: '02',
    title: 'Уплотнили путь к действию',
    body: 'Не хватает не форм, а умного ритма между ними. Добавлены новые точки маршрутизации: hero, mid-CTA, comparison, финальный дожим и exit-intent.',
    bullets: [
      'Нет длинных «немых» отрезков',
      'Каждые 1–2 экрана есть шаг вперёд',
      'CTA работают по разной температуре спроса',
    ],
    cta: { href: '#pricing' as const, label: 'Перейти к ценам', primary: false },
  },
  {
    step: '03',
    title: 'Дали тяжёлый benchmark',
    body: 'У сильного прототипа должно быть не только «мы хорошие», но и понятное отличие от типичного сайта клиники или агрегатора. Ниже это показано прямо и жёстко.',
    bullets: [
      'Почему premium performance лучше шаблона',
      'Почему лид не должен уходить в агрегаторную воронку',
      'Почему доверие строится конструкцией, а не лозунгом',
    ],
    cta: { href: '#benchmark' as const, label: 'Смотреть сравнение', primary: false },
  },
  {
    step: '04',
    title: 'Собрали доверие в систему',
    body: 'Не один блок доверия, а связка: география, процесс, цены, сравнительная логика, врачи, кейсы, отзывы, FAQ и мягкий дожим в конце.',
    bullets: [
      'Доверие разложено по всей странице',
      'Каждый следующий экран усиливает предыдущий',
      'Страница ощущается цельной платформой',
    ],
    cta: { modal: true as const, label: 'Запросить консультацию', primary: true },
  },
] as const

function Icon01() {
  return (
    <svg className="h-6 w-6 stroke-emerald" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-3.2-6.9" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}
function Icon02() {
  return (
    <svg className="h-6 w-6 stroke-emerald" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round">
      <path d="M12 20V10" />
      <path d="m18 14-6 6-6-6" />
      <path d="M12 4v2" />
    </svg>
  )
}
function Icon03() {
  return (
    <svg className="h-6 w-6 stroke-emerald" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round">
      <path d="M3 7h18" />
      <path d="M7 3v8" />
      <path d="M17 3v8" />
      <rect x="3" y="7" width="18" height="14" rx="2" />
    </svg>
  )
}
function Icon04() {
  return (
    <svg className="h-6 w-6 stroke-emerald" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round">
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
const icons = [Icon01, Icon02, Icon03, Icon04]

export function LandingArchitectureSection() {
  return (
    <section id="architecture" className="bg-gradient-to-b from-[#FBFDFF] to-[#F6FAFD] py-4 pb-[94px]">
      <div className="mockup-container w-full">
        <Reveal>
          <div className="rounded-[30px] border border-[rgba(220,230,241,0.95)] bg-gradient-to-b from-[rgba(255,255,255,0.92)] to-[rgba(247,251,255,0.98)] p-[26px] shadow-landingMd">
            <div className="mb-[22px] flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-[720px]">
                <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(215,180,105,.14)] px-3.5 py-[7px] text-xs font-extrabold tracking-wider text-[#8A6A25]">
                  Жёстко дожатая архитектура
                </span>
                <h3 className="mt-4 text-[34px] font-extrabold leading-tight tracking-tight text-deep-2">
                  Чего не хватало до «почти 100»: управление интентом, маршрут до действия и более тяжёлый каркас выбора
                </h3>
              </div>
              <p className="max-w-[420px] text-[15px] leading-[1.78] text-ink-muted">
                В прошлой версии страница была уже сильной, но часть силы жила «ниже по скроллу». Здесь недостающие решения
                вынесены выше: сценарий обращения, разветвление по задачам и отдельные точки захвата уже не спрятаны.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
              {cards.map((c, i) => {
                const Ico = icons[i]
                return (
                  <div
                    key={c.step}
                    className="relative rounded-[24px] border border-line bg-white p-[22px] shadow-landing"
                  >
                    <span className="absolute right-[18px] top-[18px] text-xs font-extrabold uppercase tracking-[0.16em] text-ink-muted-2">
                      {c.step}
                    </span>
                    <div className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[rgba(220,230,241,0.9)] bg-gradient-to-b from-white to-surface-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(9,20,35,.05)]">
                      <Ico />
                    </div>
                    <h4 className="text-[19px] font-extrabold tracking-tight text-deep-2">{c.title}</h4>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{c.body}</p>
                    <ul className="mt-4 grid gap-2">
                      {c.bullets.map(b => (
                        <li
                          key={b}
                          className="relative pl-[18px] text-[13px] font-semibold leading-snug text-ink before:absolute before:left-0 before:top-[0.58em] before:h-[7px] before:w-[7px] before:rounded-full before:bg-emerald"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-[18px]">
                      {'href' in c.cta ? (
                        <a className="btn-secondary-mock w-full text-center" href={c.cta.href}>
                          {c.cta.label}
                        </a>
                      ) : (
                        <CallbackButton className="btn-primary-mock w-full">{c.cta.label}</CallbackButton>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
