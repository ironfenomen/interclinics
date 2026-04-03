import { Reveal } from '../effects/reveal'

function Star() {
  return (
    <svg className="h-4 w-4 fill-gold" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
    </svg>
  )
}

export function LandingReviewsSection() {
  return (
    <section className="pb-[94px] max-md:pb-[76px]">
      <div className="mockup-container w-full">
        <Reveal>
          <div className="landing-section-head">
            <span className="landing-section-eyebrow">
              <span className="landing-section-eyebrow-dot" aria-hidden />
              Отзывы и сценарии боли
            </span>
            <h2>Лучше работают не абстрактные «спасибо», а узнаваемые жизненные ситуации</h2>
            <p>
              Поэтому отзывы здесь собраны так, чтобы они передавали контекст обращения: срочность, ночь, отказ ехать в
              стационар, сомнения семьи, решение на дому.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-[1.05fr_0.95fr_0.95fr] gap-[18px] max-[1180px]:grid-cols-2 max-md:grid-cols-1">
          <Reveal>
            <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-deep-2 to-deep-3 p-6 text-white shadow-landingLg max-[1180px]:col-span-2 max-md:col-span-1">
              <div className="flex items-center gap-3.5">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-br from-emerald to-emerald-2 text-base font-extrabold text-white">
                  АР
                </div>
                <div>
                  <div className="text-base font-extrabold tracking-tight">Артур Р.</div>
                  <div className="mt-1 text-xs font-bold text-[rgba(255,255,255,0.45)]">
                    Аудио-формат · сценарий «нужна была помощь ночью»
                  </div>
                </div>
              </div>
              <p className="mt-3.5 text-[15px] leading-[1.82] text-[rgba(255,255,255,0.74)]">
                «Сильнее всего сработало не то, что красиво написано, а то, что сразу было понятно: куда звонить, сколько
                ждать, сколько стоит и что никто не узнает. Для острой ниши это важнее любого дизайна — но здесь и
                визуально всё выглядит дорого.»
              </p>
              <div className="mt-[18px] flex items-center gap-3 rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.07)] px-4 py-3">
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-emerald shadow-[0_10px_22px_rgba(16,185,129,.22)]">
                  <svg className="ml-0.5 h-[15px] w-[15px] fill-white" viewBox="0 0 24 24" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="landing-audio-wave relative h-3 flex-1 overflow-hidden rounded-full bg-gradient-to-r from-[rgba(255,255,255,0.12)] to-[rgba(255,255,255,0.08)]">
                </div>
                <div className="text-xs font-extrabold text-[rgba(255,255,255,0.5)]">0:42</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Ночной выезд', 'Без стационара', 'Быстрое решение'].map(t => (
                  <span
                    key={t}
                    className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.08)] px-2.5 py-1.5 text-xs font-extrabold text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] p-6 shadow-landing">
              <div className="flex items-center gap-3.5">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-br from-deep-2 to-deep-3 text-base font-extrabold text-white">
                  ОН
                </div>
                <div>
                  <div className="text-base font-extrabold tracking-tight text-deep-2">Ольга Н.</div>
                  <div className="mt-1 text-xs font-bold text-ink-muted-2">Сценарий «муж не хотел ехать никуда»</div>
                </div>
              </div>
              <div className="mt-3.5 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="mt-3.5 text-[15px] leading-[1.82] text-ink-muted">
                Больше всего успокаивает, когда сайт не грузит бесполезной болтовнёй. Здесь понятно: вызов, врач, цена,
                районы, почему это анонимно. Это именно тот тип подачи, который должен работать на тёплом и горячем
                трафике.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Семейный сценарий', 'Решение на дому', 'Снижение тревоги'].map(t => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-surface-bg px-2.5 py-1.5 text-xs font-extrabold text-ink-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] p-6 shadow-landing">
              <div className="flex items-center gap-3.5">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-br from-gold to-[#C89A43] text-base font-extrabold text-white">
                  СВ
                </div>
                <div>
                  <div className="text-base font-extrabold tracking-tight text-deep-2">Сергей В.</div>
                  <div className="mt-1 text-xs font-bold text-ink-muted-2">Сценарий «искал не дешево, а надёжно»</div>
                </div>
              </div>
              <div className="mt-3.5 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="mt-3.5 text-[15px] leading-[1.82] text-ink-muted">
                В этом прототипе нет ощущения «очередного шаблона». Он выглядит как дорогой бренд, но при этом не теряет
                жёсткую лидогенерационную логику. Это редкое сочетание.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Премиальная подача', 'Директовая пригодность', 'Сильный каркас'].map(t => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-surface-bg px-2.5 py-1.5 text-xs font-extrabold text-ink-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
