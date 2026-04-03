// components/Header.tsx
'use client'
import { useState, useEffect } from 'react'
import { City } from '@/data/cities'
import styles from './Header.module.css'

export default function Header({ city }: { city: City }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* TOP BAR */}
      <div className={styles.topbar}>
        <div className="ctr" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className={styles.live}>
              <span className={styles.dot} />
              Онлайн — {city.teamsAvailable} бригады свободны
            </div>
            <span>Ежедневно, круглосуточно</span>
          </div>
          <span className={styles.lic}>Лицензия {city.partnerLicense}</span>
        </div>
      </div>

      {/* HEADER */}
      <header className={`${styles.hdr} ${scrolled ? styles.stuck : ''}`}>
        <div className="ctr" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <a href={`/${city.slug}/`} className={styles.logo}>
            <div className={styles.mark}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className={styles.brand}>
              InterClinics
              <small>Сеть наркологических клиник</small>
            </div>
          </a>

          <div className={styles.city}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {city.name}
          </div>

          <div className={styles.tel}>
            <a href={`tel:${city.phone}`} className={styles.telNum}>{city.phoneDisplay}</a>
            <span className={styles.telSub}>Бесплатно по РФ, 24/7</span>
          </div>

          <button className={styles.cta} onClick={() => {
            const modal = document.getElementById('callbackModal')
            if (modal) modal.classList.add('open')
            document.body.style.overflow = 'hidden'
          }}>
            Обратный звонок
          </button>
        </div>
      </header>
    </>
  )
}
