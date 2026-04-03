// data/doctors.ts

export interface Doctor {
  initials: string
  name: string
  role: string
  experience: number   // лет
  category: string     // «Высшая категория»
  rating: number       // 4.9
}

export const doctors: Doctor[] = [
  {
    initials: 'АИ',
    name: 'Аслан И.',
    role: 'Психиатр-нарколог',
    experience: 14,
    category: 'Высшая категория',
    rating: 4.9,
  },
  {
    initials: 'ЕП',
    name: 'Елена П.',
    role: 'Врач-нарколог',
    experience: 9,
    category: 'Первая категория',
    rating: 4.8,
  },
  {
    initials: 'ВС',
    name: 'Виктор С.',
    role: 'Психотерапевт',
    experience: 22,
    category: 'Высшая категория',
    rating: 4.9,
  },
  {
    initials: 'ИК',
    name: 'Ирина К.',
    role: 'Терапевт',
    experience: 11,
    category: 'Первая категория',
    rating: 4.7,
  },
]
