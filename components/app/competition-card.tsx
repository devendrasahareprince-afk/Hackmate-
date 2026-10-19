import Link from 'next/link'
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react'
import { LinkButton } from '@/components/kit/button'
import { Badge, Card, type BadgeTone } from '@/components/kit/primitives'
import { formatDate } from '@/lib/helpers'
import type { Competition, CompetitionCategory } from '@/lib/types'
import { SkillTags } from './badges'

export const categoryTone: Record<CompetitionCategory, BadgeTone> = {
  Hackathons: 'primary',
  Ideathons: 'purple',
  'Coding Competitions': 'cyan',
  'AI/ML Challenges': 'success',
  'Project Competitions': 'warning',
}

export function CompetitionCard({ competition: c }: { competition: Competition }) {
  return (
    <Card className="flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-indigo-500/5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={categoryTone[c.category]}>{c.category}</Badge>
        <Badge>{c.mode}</Badge>
        <Badge tone="warning" className="ml-auto">
          Sample
        </Badge>
      </div>
      <Link href={`/competitions/${c.id}`} className="mt-3 text-lg font-semibold hover:text-primary text-balance">
        {c.name}
      </Link>
      <p className="text-xs text-muted-foreground">by {c.organizer}</p>
      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground text-pretty">{c.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-3.5 text-primary" aria-hidden="true" />
          <dt className="sr-only">Event date</dt>
          <dd>{formatDate(c.date)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-3.5 text-warning" aria-hidden="true" />
          <dt className="sr-only">Registration deadline</dt>
          <dd>Reg. by {formatDate(c.registrationDeadline)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Users className="size-3.5 text-brand-cyan" aria-hidden="true" />
          <dt className="sr-only">Team size</dt>
          <dd>
            {c.minTeam}–{c.maxTeam} members
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5 text-brand-purple" aria-hidden="true" />
          <dt className="sr-only">Location</dt>
          <dd className="truncate">{c.location}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <SkillTags skills={c.requiredSkills} max={4} />
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
        <LinkButton href={`/competitions/${c.id}`} variant="outline" size="sm">
          Details
        </LinkButton>
        <LinkButton href={`/teammates?skill=${encodeURIComponent(c.requiredSkills[0] ?? '')}`} variant="secondary" size="sm">
          Teammates
        </LinkButton>
        <LinkButton href={`/teams/new?competition=${c.id}`} size="sm">
          Create Team
        </LinkButton>
      </div>
    </Card>
  )
}
