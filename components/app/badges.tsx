import { Badge, type BadgeTone } from '@/components/kit/primitives'
import { teamStatus } from '@/lib/helpers'
import type { Availability, RequestStatus, SkillLevel, Team } from '@/lib/types'
import { cn } from '@/lib/utils'

const availabilityTone: Record<Availability, BadgeTone> = {
  Available: 'success',
  Limited: 'warning',
  Unavailable: 'default',
}

export function AvailabilityBadge({ value }: { value: Availability }) {
  return (
    <Badge tone={availabilityTone[value]}>
      <span
        className={cn(
          'size-1.5 rounded-full',
          value === 'Available' ? 'bg-success' : value === 'Limited' ? 'bg-warning' : 'bg-muted-foreground',
        )}
        aria-hidden="true"
      />
      {value}
    </Badge>
  )
}

export function TeamStatusBadge({ team }: { team: Team }) {
  const s = teamStatus(team)
  return <Badge tone={s === 'Recruiting' ? 'success' : s === 'Full' ? 'warning' : 'default'}>{s}</Badge>
}

const reqTone: Record<RequestStatus, BadgeTone> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'danger',
  cancelled: 'default',
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge tone={reqTone[status]} className="capitalize">
      {status}
    </Badge>
  )
}

export function LevelBadge({ level }: { level: SkillLevel }) {
  return <Badge tone={level === 'Advanced' ? 'purple' : level === 'Intermediate' ? 'primary' : 'default'}>{level}</Badge>
}

export function MatchBadge({ score, className }: { score: number; className?: string }) {
  const tone = score >= 75 ? 'text-success border-success/30 bg-success/10' : score >= 50 ? 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10' : 'text-warning border-warning/30 bg-warning/10'
  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums', tone, className)}
    >
      {score}% Match
    </span>
  )
}

export function SkillTags({ skills, max = 4 }: { skills: string[]; max?: number }) {
  const shown = skills.slice(0, max)
  const rest = skills.length - shown.length
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Skills">
      {shown.map((s) => (
        <li key={s}>
          <Badge tone="primary">{s}</Badge>
        </li>
      ))}
      {rest > 0 && (
        <li>
          <Badge>+{rest}</Badge>
        </li>
      )}
    </ul>
  )
}
