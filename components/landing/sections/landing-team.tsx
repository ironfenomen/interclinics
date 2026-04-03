import { Reveal } from '../effects/reveal'

const team = [
  {
    av: 'АИ',
    exp: '14 лет практики',
    name: 'Аслан И.',
    role: 'Психиатр-нарколог / экстренная помощь',
    meta: 'Высшая категория',
    rating: '★ 4.9 / доверительный профиль',
    lines: [
      'Подходит для блока про острые состояния, выезд и диагностику на месте.',
      'Сильнее работает рядом с urgent-услугами и ценами, чем в хвосте страницы.',
    ],
  },
  {
    av: 'ЕП',
    exp: '10 лет практики',
    name: 'Елена П.',
    role: 'Врач-нарколог / кодирование',
    meta: 'Первая категория',
    rating: '★ 4.8 / мягкий сценарий доверия',
    lines: [
      'Работает как мост между острой помощью и более осознанным лечением.',
      'Важно для пользователей, которые не готовы к грубому «срочному» тону.',
    ],
  },
  {
    av: 'ВС',
    exp: '22 года практики',
    name: 'Виктор С.',
    role: 'Психотерапевт / мотивация к лечению',
    meta: 'Высшая категория',
    rating: '★ 4.9 / сложные кейсы',
    lines: [
      'Усиливает блок реабилитации и длинного цикла, а не только urgent-сегмент.',
      'Нужен, чтобы бренд не выглядел только как «капельница и всё».',
    ],
  },
  {
    av: 'ИК',
    exp: '11 лет практики',
    name: 'Ирина К.',
    role: 'Терапевт / сопровождение после вызова',
    meta: 'Клинический маршрут',
    rating: '★ 4.7 / поддерживающий профиль',
    lines: [
      'Расширяет восприятие платформы: здесь не только «вызвали и уехали».',
      'Полезна для доверия семей и долгого удержания пациента в системе.',
    ],
  },
] as const

export function LandingTeamSection() {
  return (
    <section id="doctors" className="pb-[94px] max-md:pb-[76px]">
      <div className="mockup-container w-full">
        <Reveal>
          <div className="landing-section-head">
            <span className="landing-section-eyebrow">
              <span className="landing-section-eyebrow-dot" aria-hidden />
              Врачи и клинический блок
            </span>
            <h2>Доверие не должно быть безликим — поэтому у прототипа сильный врачебный слой</h2>
            <p>
              Даже если сейчас это концептуальные карточки, архитектурно блок уже сделан так, чтобы потом без боли подставить
              реальные фото, категории, стаж, регалии и специализации.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-4 gap-[18px] max-[1024px]:grid-cols-2 max-md:grid-cols-1">
          {team.map(m => (
            <Reveal key={m.name}>
              <div className="overflow-hidden rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] shadow-landing">
                <div className="flex min-h-[220px] flex-col justify-between bg-[radial-gradient(circle_at_50%_18%,rgba(215,180,105,.22),transparent_28%),linear-gradient(135deg,#081325,#0B1D35_62%,#143252)] px-[22px] pb-[18px] pt-[22px] text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,.12)] text-[28px] font-extrabold">
                      {m.av}
                    </div>
                    <div className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,.08)] px-3 py-2 text-xs font-extrabold">
                      {m.exp}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[22px] font-extrabold tracking-tight">{m.name}</h3>
                    <p className="mt-1.5 text-sm text-[rgba(255,255,255,0.72)]">{m.role}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5">
                    <span className="text-xs font-extrabold text-ink-muted">{m.meta}</span>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(215,180,105,.14)] px-2.5 py-1.5 text-xs font-extrabold text-[#8A6A25]">
                      {m.rating}
                    </div>
                  </div>
                  <ul className="grid gap-2.5">
                    {m.lines.map(l => (
                      <li key={l} className="text-[13px] font-bold leading-snug text-ink-muted">
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
