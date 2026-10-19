import { ROLE_SKILLS } from './constants'
import type { Student, Team } from './types'

export interface MatchResult {
  score: number
  reason: string
  matchedSkills: string[]
}

interface MatchNeeds {
  requiredSkills: string[]
  roles: string[]
  interests?: string[]
}

const levelWeight = { Beginner: 0.6, Intermediate: 0.85, Advanced: 1 } as const

export function computeMatch(student: Student, needs: MatchNeeds): MatchResult {
  const roleSkills = needs.roles.flatMap((r) => ROLE_SKILLS[r] ?? [])
  const wanted = Array.from(new Set([...needs.requiredSkills, ...roleSkills]))
  const studentSkills = new Map(student.skills.map((s) => [s.name, s.level]))

  const matched = wanted.filter((s) => studentSkills.has(s))
  const directMatched = needs.requiredSkills.filter((s) => studentSkills.has(s))

  const directRatio = needs.requiredSkills.length ? directMatched.length / needs.requiredSkills.length : 0
  const weightedQuality = matched.length
    ? matched.reduce((sum, s) => sum + levelWeight[studentSkills.get(s)!], 0) / matched.length
    : 0
  const breadth = Math.min(matched.length / 3, 1)
  const skillScore = (directRatio * 0.55 + breadth * 0.45) * weightedQuality * 50

  const roleHit = needs.roles.includes(student.preferredRole)
  const roleOverlap = needs.roles.some((r) => (ROLE_SKILLS[r] ?? []).some((s) => studentSkills.has(s)))
  const roleScore = roleHit ? 25 : roleOverlap ? 14 : 0

  const interestHits = (needs.interests ?? []).filter((i) => student.interests.includes(i)).length
  const interestScore = Math.min(interestHits * 4, 10)

  const availabilityScore = student.availability === 'Available' ? 15 : student.availability === 'Limited' ? 7 : 0

  const score = Math.max(5, Math.min(99, Math.round(skillScore + roleScore + interestScore + availabilityScore)))

  const parts: string[] = []
  if (matched.length) parts.push(`has ${listify(matched.slice(0, 3))} experience`)
  if (roleHit) parts.push(`prefers the ${student.preferredRole} role`)
  if (interestHits) parts.push('shares your interests')
  if (student.availability === 'Available') parts.push('is currently available')

  const first = student.name.split(' ')[0]
  const strength = score >= 75 ? 'Strong match' : score >= 50 ? 'Good match' : 'Partial match'
  const reason = parts.length
    ? `${strength} because ${first} ${listify(parts)}.`
    : `${strength}: ${first} brings complementary skills to the team.`

  return { score, reason, matchedSkills: matched }
}

export function needsForTeam(team: Team): MatchNeeds {
  return { requiredSkills: team.requiredSkills, roles: team.openRoles }
}

export function needsForUser(user: Student, ledTeams: Team[]): MatchNeeds {
  if (ledTeams.length) {
    return {
      requiredSkills: Array.from(new Set(ledTeams.flatMap((t) => t.requiredSkills))),
      roles: Array.from(new Set(ledTeams.flatMap((t) => t.openRoles))),
      interests: user.interests,
    }
  }
  const own = new Set(user.skills.map((s) => s.name))
  const complementary = ['Backend Development', 'Node.js', 'AI/ML', 'UI/UX', 'Data Science', 'Cloud Computing'].filter(
    (s) => !own.has(s),
  )
  return {
    requiredSkills: complementary,
    roles: ['Backend Developer', 'AI/ML Developer', 'UI/UX Designer'],
    interests: user.interests,
  }
}

function listify(items: string[]) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}
