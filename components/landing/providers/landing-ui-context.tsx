'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type LeadModalView = 'form' | 'success'

type ModalApi = {
  openModal: () => void
  openModalSuccess: () => void
  setModalSuccessView: () => void
  closeModal: () => void
  modalOpen: boolean
  modalView: LeadModalView
}

const ModalContext = createContext<ModalApi | null>(null)
const LiveTeamsContext = createContext(4)
/** Счётчик для строки topbar: стартует с 2, далее синхронизируется с обновлением «свободных бригад». */
const LiveTopbarTeamsContext = createContext(2)

export function useLandingModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useLandingModal: missing provider')
  return ctx
}

export function useLiveTeams() {
  return useContext(LiveTeamsContext)
}

export function useLiveTopbarTeams() {
  return useContext(LiveTopbarTeamsContext)
}

export function LandingUIProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<LeadModalView>('form')
  const [teams, setTeams] = useState(4)
  const [topbarTeams, setTopbarTeams] = useState(2)

  const openModal = useCallback(() => {
    setModalView('form')
    setModalOpen(true)
  }, [])
  const openModalSuccess = useCallback(() => {
    setModalView('success')
    setModalOpen(true)
  }, [])
  const setModalSuccessView = useCallback(() => {
    setModalView('success')
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setModalView('form')
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      const n = Math.floor(Math.random() * 4) + 2
      setTeams(n)
      setTopbarTeams(n)
    }, 42000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <ModalContext.Provider
      value={{
        openModal,
        openModalSuccess,
        setModalSuccessView,
        closeModal,
        modalOpen,
        modalView,
      }}
    >
      <LiveTeamsContext.Provider value={teams}>
        <LiveTopbarTeamsContext.Provider value={topbarTeams}>{children}</LiveTopbarTeamsContext.Provider>
      </LiveTeamsContext.Provider>
    </ModalContext.Provider>
  )
}
