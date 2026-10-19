'use client'

import { useMemo } from 'react'
import { computeMatch, needsForUser, type MatchResult } from './matching'
import { useStore } from './store'

export function useMatchMap(): Map<string, MatchResult> {
  const { state, currentUser } = useStore()
  return useMemo(() => {
    const map = new Map<string, MatchResult>()
    if (!currentUser) return map
    const led = state.teams.filter((t) => t.leaderId === currentUser.id)
    const needs = needsForUser(currentUser, led)
    for (const s of state.students) {
      if (s.id !== currentUser.id) map.set(s.id, computeMatch(s, needs))
    }
    return map
  }, [state.students, state.teams, currentUser])
}
