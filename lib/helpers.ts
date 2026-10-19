import type { Student, Team } from './types'

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function formatDate(iso: string) {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function relativeTime(iso: string) {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(iso)
}

export function teamStatus(team: Team): 'Recruiting' | 'Full' | 'Closed' {
  if (team.members.length >= team.maxSize) return 'Full'
  if (team.openRoles.length === 0) return 'Closed'
  return 'Recruiting'
}

export function profileCompletion(s: Student) {
  const checks = [
    !!s.name,
    !!s.college,
    !!s.branch,
    s.bio.trim().length >= 20,
    s.skills.length >= 3,
    s.softSkills.length >= 1,
    s.interests.length >= 1,
    s.projects.length >= 1,
    s.hackathons.length >= 1,
    !!s.preferredRole,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-cyan-500 to-indigo-500',
  'from-violet-500 to-fuchsia-500',
  'from-sky-500 to-cyan-400',
  'from-emerald-500 to-cyan-500',
  'from-amber-500 to-rose-500',
  'from-rose-500 to-violet-500',
  'from-blue-600 to-indigo-400',
]
