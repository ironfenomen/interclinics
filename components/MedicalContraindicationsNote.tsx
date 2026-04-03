/**
 * Юридически корректное медицинское предупреждение (противопоказания).
 * Спокойный premium-стиль: без красного alert и без «крика» типографики.
 */
export const MEDICAL_CONTRAINDICATIONS_TEXT =
  'Имеются противопоказания. Необходима консультация специалиста.'

type Props = {
  /** Дополнительные классы для корневого блока */
  className?: string
}

export function MedicalContraindicationsNote({ className = '' }: Props) {
  return (
    <div
      role="note"
      aria-label="Медицинское предупреждение"
      className={`flex max-w-full items-start gap-3 rounded-2xl border border-emerald-500/20 bg-white/[0.04] px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:items-center ${className}`.trim()}
    >
      <span
        className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_0_3px_rgba(245,158,11,0.12)] sm:mt-0"
        aria-hidden
      />
      <p className="m-0 max-w-[42em] text-[13px] font-medium leading-snug text-[rgba(255,255,255,0.84)]">
        {MEDICAL_CONTRAINDICATIONS_TEXT}
      </p>
    </div>
  )
}
