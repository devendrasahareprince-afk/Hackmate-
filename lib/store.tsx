'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { createSeedState, STATE_VERSION } from './data/seed'
import { DEMO_STUDENT_ID } from './data/students'
import { uid, slugify, teamStatus } from './helpers'
import type { Activity, AppState, Settings, Student, Team } from './types'

const STORAGE_KEY = 'hackmate:state'

export interface SignupInput {
  name: string
  email: string
  password: string
  college: string
  branch: string
  year: Student['year']
}

export interface TeamInput {
  name: string
  competitionId: string
  projectIdea: string
  description: string
  maxSize: number
  requiredSkills: string[]
  openRoles: string[]
  deadline: string
  visibility: 'public' | 'private'
  leaderRole: string
}

interface StoreValue {
  hydrated: boolean
  state: AppState
  currentUser: Student | null
  getStudent: (id: string) => Student | undefined
  getTeam: (id: string) => Team | undefined
  loginDemo: () => void
  login: (email: string, password: string) => boolean
  signup: (input: SignupInput) => boolean
  logout: () => void
  updateProfile: (patch: Partial<Student>) => void
  createTeam: (input: TeamInput) => string | null
  updateTeam: (id: string, patch: Partial<Team>) => void
  removeMember: (teamId: string, studentId: string) => void
  leaveTeam: (teamId: string) => void
  sendInvitation: (teamId: string, toId: string, role: string, message?: string) => boolean
  respondInvitation: (id: string, accept: boolean) => void
  cancelInvitation: (id: string) => void
  requestJoin: (teamId: string, role: string, message?: string) => boolean
  respondJoinRequest: (id: string, accept: boolean) => void
  cancelJoinRequest: (id: string) => void
  updateSettings: (settings: Settings) => void
  resetDemo: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed.version === STATE_VERSION) return parsed
    }
  } catch {
    // Corrupt storage falls through to a fresh seed.
  }
  return createSeedState()
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(createSeedState)
  const [hydrated, setHydrated] = useState(false)
  const ref = useRef(state)

  useEffect(() => {
    const loaded = loadState()
    ref.current = loaded
    setState(loaded)
    setHydrated(true)
  }, [])

  const commit = useCallback((updater: (s: AppState) => AppState) => {
    const next = updater(ref.current)
    ref.current = next
    setState(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      toast.error('Could not save changes to local storage.')
    }
  }, [])

  const activity = (text: string, kind: Activity['kind']): Activity => ({
    id: uid('a'),
    text,
    kind,
    date: new Date().toISOString(),
  })

  const value = useMemo<StoreValue>(() => {
    const s = state
    const me = s.currentUserId ? (s.students.find((x) => x.id === s.currentUserId) ?? null) : null
    const nameOf = (id: string, st: AppState = ref.current) => st.students.find((x) => x.id === id)?.name ?? 'Someone'
    const teamOf = (id: string, st: AppState = ref.current) => st.teams.find((x) => x.id === id)

    const addMember = (team: Team, studentId: string, role: string): Team => ({
      ...team,
      members: [...team.members, { studentId, role }],
      openRoles: (() => {
        const idx = team.openRoles.indexOf(role)
        if (idx === -1) return team.openRoles
        const copy = [...team.openRoles]
        copy.splice(idx, 1)
        return copy
      })(),
    })

    return {
      hydrated,
      state: s,
      currentUser: me,
      getStudent: (id) => s.students.find((x) => x.id === id),
      getTeam: (id) => s.teams.find((x) => x.id === id),

      loginDemo: () => {
        commit((st) => ({ ...st, currentUserId: DEMO_STUDENT_ID }))
        toast.success('Welcome back, Aryan!', { description: 'You are exploring HackMate in demo mode.' })
      },

      login: (email, password) => {
        const acc = ref.current.accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase())
        if (!acc || acc.password !== password) {
          toast.error('Invalid email or password')
          return false
        }
        commit((st) => ({ ...st, currentUserId: acc.studentId }))
        toast.success(`Welcome back, ${nameOf(acc.studentId).split(' ')[0]}!`)
        return true
      },

      signup: (input) => {
        const email = input.email.trim().toLowerCase()
        if (ref.current.accounts.some((a) => a.email.toLowerCase() === email)) {
          toast.error('An account with this email already exists')
          return false
        }
        let id = slugify(input.name) || uid('student')
        if (ref.current.students.some((x) => x.id === id)) id = `${id}-${uid('u').slice(2, 6)}`
        const student: Student = {
          id,
          name: input.name.trim(),
          email,
          college: input.college.trim(),
          branch: input.branch,
          year: input.year,
          bio: '',
          skills: [],
          softSkills: [],
          interests: [],
          experience: 'Beginner',
          availability: 'Available',
          preferredRole: '',
          projects: [],
          hackathons: [],
          color: ref.current.students.length % 8,
        }
        commit((st) => ({
          ...st,
          students: [...st.students, student],
          accounts: [...st.accounts, { email, password: input.password, studentId: id }],
          currentUserId: id,
          activities: [activity('You joined HackMate', 'system'), ...st.activities],
        }))
        toast.success('Account created', { description: 'Complete your profile so teams can find you.' })
        return true
      },

      logout: () => {
        commit((st) => ({ ...st, currentUserId: null }))
        toast.success('You have been logged out')
      },

      updateProfile: (patch) => {
        const uidNow = ref.current.currentUserId
        if (!uidNow) return
        commit((st) => ({
          ...st,
          students: st.students.map((x) => (x.id === uidNow ? { ...x, ...patch } : x)),
          activities: [activity('You updated your profile', 'profile'), ...st.activities],
        }))
        toast.success('Profile updated')
      },

      createTeam: (input) => {
        const uidNow = ref.current.currentUserId
        if (!uidNow) return null
        let id = slugify(input.name) || uid('team')
        if (ref.current.teams.some((x) => x.id === id)) id = `${id}-${uid('t').slice(2, 6)}`
        const team: Team = {
          id,
          name: input.name.trim(),
          competitionId: input.competitionId,
          projectIdea: input.projectIdea.trim(),
          description: input.description.trim(),
          leaderId: uidNow,
          members: [{ studentId: uidNow, role: input.leaderRole ? `Team Leader · ${input.leaderRole}` : 'Team Leader' }],
          maxSize: input.maxSize,
          requiredSkills: input.requiredSkills,
          openRoles: input.openRoles,
          deadline: input.deadline,
          visibility: input.visibility,
          createdAt: new Date().toISOString(),
        }
        commit((st) => ({
          ...st,
          teams: [team, ...st.teams],
          activities: [activity(`You created the team ${team.name}`, 'team'), ...st.activities],
        }))
        toast.success(`${team.name} created`, { description: 'You are the team leader. Start inviting teammates!' })
        return id
      },

      updateTeam: (id, patch) => {
        const team = teamOf(id)
        if (!team) return
        if (patch.maxSize !== undefined && patch.maxSize < team.members.length) {
          toast.error(`Team size cannot be smaller than current members (${team.members.length})`)
          return
        }
        commit((st) => ({ ...st, teams: st.teams.map((x) => (x.id === id ? { ...x, ...patch } : x)) }))
        toast.success('Team details saved')
      },

      removeMember: (teamId, studentId) => {
        const team = teamOf(teamId)
        if (!team || studentId === team.leaderId) return
        commit((st) => ({
          ...st,
          teams: st.teams.map((x) =>
            x.id === teamId ? { ...x, members: x.members.filter((m) => m.studentId !== studentId) } : x,
          ),
          activities: [activity(`${nameOf(studentId)} was removed from ${team.name}`, 'team'), ...st.activities],
        }))
        toast.success(`${nameOf(studentId)} removed from ${team.name}`)
      },

      leaveTeam: (teamId) => {
        const uidNow = ref.current.currentUserId
        const team = teamOf(teamId)
        if (!uidNow || !team || team.leaderId === uidNow) return
        commit((st) => ({
          ...st,
          teams: st.teams.map((x) =>
            x.id === teamId ? { ...x, members: x.members.filter((m) => m.studentId !== uidNow) } : x,
          ),
          activities: [activity(`You left ${team.name}`, 'team'), ...st.activities],
        }))
        toast.success(`You left ${team.name}`)
      },

      sendInvitation: (teamId, toId, role, message) => {
        const st0 = ref.current
        const uidNow = st0.currentUserId
        const team = teamOf(teamId)
        if (!uidNow || !team) return false
        if (team.members.some((m) => m.studentId === toId)) {
          toast.error(`${nameOf(toId)} is already in ${team.name}`)
          return false
        }
        if (team.members.length >= team.maxSize) {
          toast.error(`${team.name} is already full`)
          return false
        }
        if (st0.invitations.some((i) => i.teamId === teamId && i.toId === toId && i.status === 'pending')) {
          toast.error(`You already have a pending invitation to ${nameOf(toId)} for this team`)
          return false
        }
        commit((st) => ({
          ...st,
          invitations: [
            {
              id: uid('inv'),
              teamId,
              fromId: uidNow,
              toId,
              role,
              message,
              date: new Date().toISOString().slice(0, 10),
              status: 'pending',
            },
            ...st.invitations,
          ],
          activities: [activity(`You invited ${nameOf(toId)} to ${team.name}`, 'invite'), ...st.activities],
        }))
        toast.success(`Invitation sent to ${nameOf(toId)}`, { description: `${role} · ${team.name}` })
        return true
      },

      respondInvitation: (id, accept) => {
        const st0 = ref.current
        const inv = st0.invitations.find((i) => i.id === id)
        if (!inv || inv.status !== 'pending') return
        const team = teamOf(inv.teamId)
        if (!team) return
        if (accept) {
          if (team.members.length >= team.maxSize) {
            toast.error(`${team.name} is already full`)
            return
          }
          if (team.members.some((m) => m.studentId === inv.toId)) {
            commit((st) => ({
              ...st,
              invitations: st.invitations.map((i) => (i.id === id ? { ...i, status: 'accepted' } : i)),
            }))
            toast.info(`You are already a member of ${team.name}`)
            return
          }
        }
        commit((st) => ({
          ...st,
          invitations: st.invitations.map((i) => (i.id === id ? { ...i, status: accept ? 'accepted' : 'rejected' } : i)),
          teams: accept ? st.teams.map((x) => (x.id === team.id ? addMember(x, inv.toId, inv.role) : x)) : st.teams,
          activities: [
            activity(accept ? `You joined ${team.name} as ${inv.role}` : `You declined the invitation to ${team.name}`, 'invite'),
            ...st.activities,
          ],
        }))
        if (accept) toast.success(`You joined ${team.name}!`, { description: `Role: ${inv.role}` })
        else toast.success('Invitation declined')
      },

      cancelInvitation: (id) => {
        commit((st) => ({
          ...st,
          invitations: st.invitations.map((i) => (i.id === id && i.status === 'pending' ? { ...i, status: 'cancelled' } : i)),
        }))
        toast.success('Invitation cancelled')
      },

      requestJoin: (teamId, role, message) => {
        const st0 = ref.current
        const uidNow = st0.currentUserId
        const team = teamOf(teamId)
        if (!uidNow || !team) return false
        if (team.members.some((m) => m.studentId === uidNow)) {
          toast.error(`You are already a member of ${team.name}`)
          return false
        }
        if (teamStatus(team) === 'Full') {
          toast.error(`${team.name} is already full`)
          return false
        }
        if (st0.joinRequests.some((r) => r.teamId === teamId && r.studentId === uidNow && r.status === 'pending')) {
          toast.error('You already have a pending request for this team')
          return false
        }
        commit((st) => ({
          ...st,
          joinRequests: [
            {
              id: uid('jr'),
              teamId,
              studentId: uidNow,
              role,
              message,
              date: new Date().toISOString().slice(0, 10),
              status: 'pending',
            },
            ...st.joinRequests,
          ],
          activities: [activity(`You requested to join ${team.name}`, 'request'), ...st.activities],
        }))
        toast.success('Join request sent', { description: `${team.name} will review your request.` })
        return true
      },

      respondJoinRequest: (id, accept) => {
        const st0 = ref.current
        const req = st0.joinRequests.find((r) => r.id === id)
        if (!req || req.status !== 'pending') return
        const team = teamOf(req.teamId)
        if (!team) return
        if (accept && team.members.length >= team.maxSize) {
          toast.error(`${team.name} is full. Increase the team size or remove a member first.`)
          return
        }
        const already = team.members.some((m) => m.studentId === req.studentId)
        commit((st) => ({
          ...st,
          joinRequests: st.joinRequests.map((r) => (r.id === id ? { ...r, status: accept ? 'accepted' : 'rejected' } : r)),
          teams:
            accept && !already
              ? st.teams.map((x) => (x.id === team.id ? addMember(x, req.studentId, req.role) : x))
              : st.teams,
          activities: [
            activity(
              accept
                ? `${nameOf(req.studentId)} joined ${team.name} as ${req.role}`
                : `You declined ${nameOf(req.studentId)}'s request to join ${team.name}`,
              'request',
            ),
            ...st.activities,
          ],
        }))
        toast.success(accept ? `${nameOf(req.studentId)} added to ${team.name}` : 'Request rejected')
      },

      cancelJoinRequest: (id) => {
        commit((st) => ({
          ...st,
          joinRequests: st.joinRequests.map((r) => (r.id === id && r.status === 'pending' ? { ...r, status: 'cancelled' } : r)),
        }))
        toast.success('Join request cancelled')
      },

      updateSettings: (settings) => {
        commit((st) => ({ ...st, settings }))
        toast.success('Preferences saved')
      },

      resetDemo: () => {
        const fresh = createSeedState()
        commit((st) => ({ ...fresh, currentUserId: st.currentUserId === DEMO_STUDENT_ID ? DEMO_STUDENT_ID : null }))
        toast.success('Demo data has been reset')
      },
    }
  }, [state, hydrated, commit])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
