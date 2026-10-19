'use client'

import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock, MapPin, Trophy, Users } from 'lucide-react'
import { TeamCard } from '@/components/app/team-card'
import { SkillTags } from '@/components/app/badges'
import { categoryTone } from '@/components/app/competition-card'
import { LinkButton } from '@/components/kit/button'
import { Badge, Card, EmptyState } from '@/components/kit/primitives'
import { getCompetition } from '@/lib/data/seed'
import { formatDate } from '@/lib/helpers'
import { useStore } from '@/lib/store'

export function CompetitionDetail({ id }: { id: string }) {
  const { state } = useStore()
  const c = getCompetition(id)
  if (!c) {
    return (
      <EmptyState
        icon={Trophy}
        title="Competition not found"
        description="It may have been removed."
        action={
          <LinkButton href="/competitions" size="sm">
            All competitions
          </LinkButton>
        }
      />
    )
  }
  const teams = state.teams.filter((t) => t.competitionId === c.id && t.visibility === 'public')
  const daysLeft = Math.ceil((new Date(`${c.registrationDeadline}T00:00:00`).getTime() - Date.now()) / 86_400_000)

  return (
    <div className="flex flex-col gap-8">
      <Link href="/competitions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> All competitions
      </Link>
      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={categoryTone[c.category]}>{c.category}</Badge>
          <Badge>{c.mode}</Badge>
          <Badge tone="warning">Sample event</Badge>
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-balance">{c.name}</h1>
        <p className="text-sm text-muted-foreground">Organised by {c.organizer}</p>
        <p className="mt-4 max-w-3xl text-muted-foreground text-pretty">{c.description}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="size-4 text-primary" aria-hidden="true" />
            <div>
              <dt className="text-xs text-muted-foreground">Event date</dt>
              <dd>{formatDate(c.date)}</dd>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 text-warning" aria-hidden="true" />
            <div>
              <dt className="text-xs text-muted-foreground">Register by</dt>
              <dd>
                {formatDate(c.registrationDeadline)}
                {daysLeft >= 0 && daysLeft <= 30 && <span className="ml-1 text-warning">({daysLeft}d left)</span>}
                {daysLeft < 0 && <span className="ml-1 text-muted-foreground">(closed)</span>}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="size-4 text-brand-cyan" aria-hidden="true" />
            <div>
              <dt className="text-xs text-muted-foreground">Team size</dt>
              <dd>
                {c.minTeam}–{c.maxTeam} members
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 text-brand-purple" aria-hidden="true" />
            <div>
              <dt className="text-xs text-muted-foreground">Location</dt>
              <dd>{c.location}</dd>
            </div>
          </div>
        </dl>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Skills that help</p>
            <SkillTags skills={c.requiredSkills} max={8} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Themes</p>
            <ul className="flex flex-wrap gap-1.5">
              {c.themes.map((t) => (
                <li key={t}>
                  <Badge>{t}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <LinkButton href={`/teams/new?competition=${c.id}`}>Create Team</LinkButton>
          <LinkButton href={`/teammates?skill=${encodeURIComponent(c.requiredSkills[0] ?? '')}`} variant="secondary">
            Find Teammates
          </LinkButton>
        </div>
      </Card>

      <section aria-label="Teams for this competition">
        <h2 className="mb-4 text-lg font-semibold">Teams for this competition ({teams.length})</h2>
        {teams.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((t) => (
              <TeamCard key={t.id} team={t} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Users} title="No teams yet" description="Be the first to create a team for this event." />
        )}
      </section>
    </div>
  )
}
