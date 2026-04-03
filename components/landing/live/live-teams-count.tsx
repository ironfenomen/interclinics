'use client'

import { useLiveTeams } from '../providers/landing-ui-context'

export function LiveTeamsCount() {
  const teams = useLiveTeams()
  return <b>{teams}</b>
}
