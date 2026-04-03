import { Reveal } from '../effects/reveal'

export function LandingTrustStrip() {
  return (
    <div className="relative z-[3] -mt-[22px] max-md:mt-0 max-md:pt-3.5">
      <div className="mockup-container w-full">
        <Reveal>
          <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] gap-[14px] max-lg:grid-cols-2 max-md:grid-cols-1">
            <div className="rounded-[24px] border border-[rgba(220,230,241,0.92)] bg-gradient-to-b from-white to-[#f8fbff] p-[20px] shadow-landingMd">
              <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-2">Почему именно этот прототип</div>
              <h3 className="mt-2 text-2xl font-extrabold leading-[1.16] tracking-[-0.04em] text-deep-2">
                Не «инфо-портянка», а структура, которая продаёт помощь в стрессе
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                Путь пользователя выстроен не «как красиво», а «как покупают в стрессе»: сначала острый запрос и действие,
                затем процесс, затем цена, затем тяжёлое доверие, затем дожим и FAQ.
              </p>
            </div>
            <div className="rounded-[24px] border border-[rgba(220,230,241,0.92)] bg-[rgba(255,255,255,0.95)] p-[20px] shadow-landingMd">
              <strong className="block text-3xl leading-none text-deep">95%</strong>
              <span className="mt-2 block text-[13px] font-bold text-ink-muted">
      архитектуры уже пригодно для Директа и мультигородского разворота
              </span>
            </div>
            <div className="rounded-[24px] border border-[rgba(220,230,241,0.92)] bg-[rgba(255,255,255,0.95)] p-[20px] shadow-landingMd">
              <strong className="block text-3xl leading-none text-deep">3 слоя</strong>
              <span className="mt-2 block text-[13px] font-bold text-ink-muted">
                CTA: звонок, мгновенная форма и промежуточный захват после цен
              </span>
            </div>
            <div className="rounded-[24px] border border-[rgba(220,230,241,0.92)] bg-[rgba(255,255,255,0.95)] p-[20px] shadow-landingMd">
              <strong className="block text-3xl leading-none text-deep">0 лишнего</strong>
              <span className="mt-2 block text-[13px] font-bold text-ink-muted">
                каждый блок либо продаёт, либо снимает тревогу, либо усиливает доверие
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
