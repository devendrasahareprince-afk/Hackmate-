'use client'

import Link from 'next/link'
import {
  Activity as ActivityIcon,
  ArrowRight,
  Compass,
  Mail,
  Plus,
  Search,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { StudentCard } from '@/components/app/student-card'
import { TeamCard } from '@/components/app/team-card'
import { categoryTone } from '@/components/app/competition-card'
import { Button, LinkButton } from '@/components/kit/button'
import { Avatar, Badge, Card, EmptyState } from '@/components/kit/primitives'
import { competitions } from '@/lib/data/seed'
import type { Team } from '@/lib/types'
import { formatDate, profileCompletion, relativeTime, teamStatus } from '@/lib/helpers'
import { useStore } from '@/lib/store'
import { useMatchMap } from '@/lib/use-matches'

function StatCard({
  href,
  label,
  value,
  hint,
  icon: Icon,
  accent,
  children,
}: {
  href: string
  label: string
  value: string | number
  hint: string
  icon: LucideIcon
  accent: string
  children?: React.ReactNode
}) {
  return (
    <Link href={href} className="group block focus-visible:outline-none">
      <Card className="relative h-full overflow-hidden p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <span className={`inline-flex size-9 items-center justify-center rounded-xl ${accent}`}>
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p>
        {children}
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary">
          {hint} <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </p>
      </Card>
    </Link>
  )
}

function SectionHeader({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Link href={href} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        {linkLabel} <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  )
}


function daysUntil(iso: string) {
  const d = new Date(`${iso}T00:00:00`).getTime()
  return Math.ceil((d - Date.now()) / 86_400_000)
}

function ActionCenter() {
  const { state, currentUser, getStudent, getTeam, respondInvitation, respondJoinRequest } = useStore()
  if (!currentUser) return null
  const me = currentUser.id
  const invites = state.invitations.filter((i) => i.toId === me && i.status === 'pending')
  const ledIds = state.teams.filter((t) => t.leaderId === me).map((t) => t.id)
  const requests = state.joinRequests.filter((r) => ledIds.includes(r.teamId) && r.status === 'pending')
  const total = invites.length + requests.length

  return (
    <section aria-label="Needs your response">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Needs your response</h2>
        {total > 0 && <Badge tone="warning">{total} waiting</Badge>}
      </div>
      {total === 0 ? (
        <EmptyState icon={Mail} title="You’re all caught up" description="New invitations and join requests will show up here." />
      ) : (
        <Card className="divide-y divide-border">
          {invites.map((i) => {
            const from = getStudent(i.fromId)
            const team = getTeam(i.teamId)
            return (
              <div key={i.id} className="p-4">
                <p className="text-sm">
                  <span className="font-medium">{from?.name ?? 'Someone'}</span> invited you to join{' '}
                  <span className="font-medium">{team?.name ?? 'a team'}</span> as {i.role}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="success" onClick={() => respondInvitation(i.id, true)}>Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => respondInvitation(i.id, false)}>Decline</Button>
                </div>
              </div>
            )
          })}
          {requests.map((r) => {
            const who = getStudent(r.studentId)
            const team = getTeam(r.teamId)
            return (
              <div key={r.id} className="p-4">
                <p className="text-sm">
                  <span className="font-medium">{who?.name ?? 'A student'}</span> wants to join{' '}
                  <span className="font-medium">{team?.name}</span> as {r.role}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="success" onClick={() => respondJoinRequest(r.id, true)}>Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => respondJoinRequest(r.id, false)}>Decline</Button>
                </div>
              </div>
            )
          })}
        </Card>
      )}
    </section>
  )
}

function MyTeamsPanel({ teams }: { teams: Team[] }) {
  return (
    <section aria-label="My teams">
      <SectionHeader title="My teams" href="/my-teams" linkLabel="Manage" />
      {teams.length === 0 ? (
        <EmptyState icon={Users} title="You haven’t joined a team yet" description="Create one for an upcoming competition, or ask to join an open team." action={<LinkButton href="/teams/new" size="sm">Create Team</LinkButton>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {teams.map((t) => {
            const comp = competitions.find((c) => c.id === t.competitionId)
            const pct = Math.round((t.members.length / t.maxSize) * 100)
            return (
              <Card key={t.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{t.name}</h3>
                    <p className="truncate text-xs text-muted-foreground">{comp?.name ?? 'Competition'}</p>
                  </div>
                  <Badge tone={teamStatus(t) === 'Recruiting' ? 'cyan' : 'success'}>{teamStatus(t)}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t.members.length} of {t.maxSize} seats filled</span>
                  <span className="tabular-nums">{pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${t.name} seats filled`}>
                  <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pct}%` }} />
                </div>
                {t.openRoles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {t.openRoles.map((r) => <Badge key={r} tone="warning">Needs {r}</Badge>)}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function DashboardView() {
  const { state, currentUser } = useStore()
  const matches = useMatchMap()
  if (!currentUser) return null

  const me = currentUser.id
  const myTeams = state.teams.filter((t) => t.members.some((m) => m.studentId === me))
  const pendingInvites = state.invitations.filter((i) => i.toId === me && i.status === 'pending')
  const completion = profileCompletion(currentUser)

  const recommended = state.students
    .filter((s) => s.id !== me && matches.has(s.id))
    .sort((a, b) => matches.get(b.id)!.score - matches.get(a.id)!.score)
    .slice(0, 3)

  const recruiting = state.teams
    .filter((t) => t.visibility === 'public' && !t.members.some((m) => m.studentId === me) && teamStatus(t) === 'Recruiting')
    .slice(0, 2)

  const upcoming = [...competitions].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)
  const activities = state.activities.slice(0, 6)

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-indigo-500/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-60 rounded-full bg-cyan-400/10 blur-[80px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{currentUser.college}</p>
            <h1 className="mt-1 text-3xl font-semibold sm:text-4xl text-balance">
              Welcome back, <span className="text-gradient">{currentUser.name.split(' ')[0]}!</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground text-pretty">
              {pendingInvites.length
                ? `You have ${pendingInvites.length} pending invitation${pendingInvites.length > 1 ? 's' : ''}. Review them to join a team.`
                : 'Discover teammates with complementary skills and start building something great.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/teammates">
              <Search aria-hidden="true" /> Find Teammates
            </LinkButton>
            <LinkButton href="/teams/new" variant="secondary">
              <Plus aria-hidden="true" /> Create Team
            </LinkButton>
            <LinkButton href="/competitions" variant="outline">
              <Trophy aria-hidden="true" /> Explore Competitions
            </LinkButton>
          </div>
        </div>
      </section>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard href="/my-teams" label="My Teams" value={myTeams.length} hint="Manage teams" icon={Users} accent="bg-primary/12 text-primary" />
        <StatCard href="/invitations" label="Pending Invitations" value={pendingInvites.length} hint="Review invitations" icon={Mail} accent="bg-brand-cyan/12 text-brand-cyan" />
        <StatCard href="/competitions" label="Available Competitions" value={competitions.length} hint="Browse events" icon={Trophy} accent="bg-brand-purple/12 text-brand-purple" />
        <StatCard href="/profile" label="Profile Completion" value={`${completion}%`} hint={completion < 100 ? 'Complete profile' : 'View profile'} icon={UserRound} accent="bg-success/12 text-success">
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion">
            <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${completion}%` }} />
          </div>
        </StatCard>
      </section>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MyTeamsPanel teams={myTeams} />
        </div>
        <ActionCenter />
      </div>

      <section>
        <SectionHeader title="Recommended Teammates" href="/teammates?sort=match" linkLabel="See all" />
        <p className="-mt-2 mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-brand-cyan" aria-hidden="true" />
          Prototype rule-based match score based on skills, roles, interests and availability — not an AI-verified assessment.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recommended.map((s) => (
            <StudentCard key={s.id} student={s} match={matches.get(s.id)} compact />
          ))}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <SectionHeader title="Teams Looking for Members" href="/teams" linkLabel="Explore teams" />
          {recruiting.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recruiting.map((t) => (
                <TeamCard key={t.id} team={t} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Compass} title="No open teams right now" description="Check back later or create your own team." action={<LinkButton href="/teams/new" size="sm">Create Team</LinkButton>} />
          )}
        </section>

        <section>
          <SectionHeader title="Upcoming Competitions" href="/competitions" linkLabel="View all" />
          <Card className="divide-y divide-border">
            {upcoming.map((c) => (
              <Link key={c.id} href={`/competitions/${c.id}`} className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50">
                <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-[10px] font-semibold uppercase">
                    {new Date(`${c.date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' })}
                  </span>
                  <span className="font-display text-lg leading-none font-semibold">{new Date(`${c.date}T00:00:00`).getDate()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Reg. by {formatDate(c.registrationDeadline)}
                    {daysUntil(c.registrationDeadline) >= 0 && daysUntil(c.registrationDeadline) <= 14 && (
                      <span className="ml-1 font-medium text-warning">({daysUntil(c.registrationDeadline)} days left)</span>
                    )}
                  </p>
                </div>
                <Badge tone={categoryTone[c.category]} className="hidden sm:inline-flex">
                  {c.category.replace(' Competitions', '').replace(' Challenges', '')}
                </Badge>
              </Link>
            ))}
          </Card>
          <p className="mt-2 text-xs text-muted-foreground">Sample events for demonstration only.</p>
        </section>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        {activities.length ? (
          <Card>
            <ol className="divide-y divide-border">
              {activities.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <ActivityIcon className="size-4" aria-hidden="true" />
                  </span>
                  <p className="flex-1 text-sm">{a.text}</p>
                  <time dateTime={a.date} className="text-xs whitespace-nowrap text-muted-foreground">
                    {relativeTime(a.date)}
                  </time>
                </li>
              ))}
            </ol>
          </Card>
        ) : (
          <EmptyState icon={ActivityIcon} title="No activity yet" description="Your team, invitation and profile actions will appear here." />
        )}
      </section>
    </div>
  )
}
