import type { ReactNode } from 'react'

/** Мокап уже включает modal / cookie / exit-intent / mobile-bar — отдельный chrome не дублируем. */
export function LandingChrome({ children }: { children: ReactNode }) {
  return children
}
