'use client'

import type { City } from '@/data/cities'
import styles from './page.module.css'

function openCallbackModal() {
  const modal = document.getElementById('callbackModal')
  if (modal) modal.classList.add('open')
  document.body.style.overflow = 'hidden'
}

export default function VyvodHeroActions({ city }: { city: City }) {
  return (
    <div className={styles.ctaRow}>
      <a href={`tel:${city.phone}`} className="btn btn-primary">
        Позвонить: {city.phoneDisplay}
      </a>
      <button type="button" className="btn btn-dark" onClick={openCallbackModal}>
        Обратный звонок
      </button>
    </div>
  )
}
