'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, Trophy, UserMinus, UserPlus, Users } from 'lucide-react'
import { JoinModal } from '@/components/app/join-modal'
import { RequestStatusBadge, SkillTags, TeamStatusBadge } from '@/components/app/badges'
import { Button, LinkButton } from '@/components/kit/button'
import { Avatar, Badge, Card, EmptyState } from '@/components/kit/primitives'
import { getCompetition } from '@/lib/data/seed'
import { formatDate, teamStatus } from '@/lib/helpers'
import { useStore } from '@/lib/store'

export function TeamDetail({ id }: { id: string }) {
  const { currentUser, state, getTeam, getStudent, removeMember, leaveTeam, respondJoinRequest, cancelInvitation } = useStore()
  const [joinOpen, setJoinOpen] = useState(false)
  const team = getTeam(id)

  if (!team || !currentUser) {
    return (
      <EmptyState
        icon={Users}
        title="Team not found"
        description="This team may have been removed."
        action={
          <LinkButton href="/teams" size="sm">
            Explore teams
          </LinkButton>
        }
      />
    )
  }

  const me = currentUser.id
  const isLeader = team.leaderId === me
  const isMember = team.members.some((m) => m.studentId === me)
  const invited = state.invitations.some((i) => i.teamId === team.id && i.toId === me && i.status === 'pending')
  if (team.visibility === 'private' && !isMember && !invited) {
    return <EmptyState icon={Lock} title="This team is private" description="Only members and invited students can view it." />
  }

  const competition = getCompetition(team.competitionId)
  const status = teamStatus(team)
  const myPending = state.joinRequests.some((r) => r.teamId === team.id && r.studentId === me && r.status === 'pending')
  const requests = state.joinRequests.filter((r) => r.teamId === team.id && r.status === 'pending')
  const sentInvites = state.invitations.filter((i) => i.teamId === team.id && i.status === 'pending')

  return (
    <div className="flex flex-col gap-8">
      <Link href="/teams" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> All teams
      </Link>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <TeamStatusBadge team={team} />
              {team.visibility === 'private' && (
                <Badge>
                  <Lock className="size-3" aria-hidden="true" /> Private
                </Badge>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-balance">{team.name}</h1>
            {competition && (
              <Link href={`/competitions/${competition.id}`} className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Trophy className="size-4" aria-hidden="true" /> {competition.name}
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {!isMember &&
              (myPending ? (
                <Button variant="secondary" disabled>
                  Request pending
                </Button>
              ) : (
                <Button disabled={status === 'Full'} onClick={() => setJoinOpen(true)}>
                  <UserPlus aria-hidden="true" /> {status === 'Full' ? 'Team full' : 'Request to Join'}
                </Button>
              ))}
            {isMember && !isLeader && (
              <Button
                variant="danger"
                onClick={() => {
                  if (window.confirm(`Leave ${team.name}?`)) leaveTeam(team.id)
                }}
              >
                Leave Team
              </Button>
            )}
            {isLeader && status !== 'Full' && (
              <LinkButton href="/teammates" variant="secondary">
                Find Teammates
              </LinkButton>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Project idea</h2>
            <p className="mt-1 font-medium">{team.projectIdea}</p>
            <p className="mt-3 text-sm text-muted-foreground text-pretty">{team.description}</p>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Seats filled</dt>
              <dd className="font-medium tabular-nums">
                {team.members.length} / {team.maxSize}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Registration deadline</dt>
              <dd className="font-medium">{formatDate(team.deadline)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="mb-1.5 text-muted-foreground">Required skills</dt>
              <dd>
                <SkillTags skills={team.requiredSkills} max={10} />
              </dd>
            </div>
            {team.openRoles.length > 0 && (
              <div className="col-span-2">
                <dt className="mb-1.5 text-muted-foreground">Looking for</dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5">
                    {team.openRoles.map((r, i) => (
                      <li key={`${r}-${i}`}>
                        <Badge tone="cyan">{r}</Badge>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </Card>

      <section aria-label="Members">
        <h2 className="mb-4 text-lg font-semibold">Members ({team.members.length})</h2>
        <Card className="divide-y divide-border">
          {team.members.map((m) => {
            const s = getStudent(m.studentId)
            if (!s) return null
            return (
              <div key={m.studentId} className="flex items-center gap-3 p-4">
                <Avatar name={s.name} color={s.color} />
                <div className="min-w-0 flex-1">
                  <Link href={`/students/${s.id}`} className="block truncate font-medium hover:text-primary">
                    {s.name}
                    {s.id === me && <span className="ml-1.5 text-xs font-normal text-muted-foreground">(You)</span>}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">{m.role}</p>
                </div>
                {m.studentId === team.leaderId && <Badge tone="purple">Leader</Badge>}
                {isLeader && m.studentId !== team.leaderId && (
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Remove ${s.name}`}
                    onClick={() => {
                      if (window.confirm(`Remove ${s.name} from ${team.name}?`)) removeMember(team.id, s.id)
                    }}
                  >
                    <UserMinus aria-hidden="true" /> Remove
                  </Button>
                )}
              </div>
            )
          })}
        </Card>
      </section>

      {isLeader && (requests.length > 0 || sentInvites.length > 0) && (
        <section aria-label="Pending activity" className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Join requests ({requests.length})</h2>
            {requests.length ? (
              <Card className="divide-y divide-border">
                {requests.map((r) => (
                  <div key={r.id} className="p-4">
                    <p className="text-sm">
                      <span className="font-medium">{getStudent(r.studentId)?.name ?? 'A student'}</span> wants to join as {r.role}
                    </p>
                    {r.message && <p className="mt-1 text-xs text-muted-foreground">“{r.message}”</p>}
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="success" onClick={() => respondJoinRequest(r.id, true)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => respondJoinRequest(r.id, false)}>
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>
            ) : (
              <p className="text-sm text-muted-foreground">No pending requests.</p>
            )}
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Invitations sent ({sentInvites.length})</h2>
            {sentInvites.length ? (
              <Card className="divide-y divide-border">
                {sentInvites.map((i) => (
                  <div key={i.id} className="flex items-center gap-3 p-4">
                    <p className="flex-1 text-sm">
                      <span className="font-medium">{getStudent(i.toId)?.name ?? 'A student'}</span> · {i.role}
                    </p>
                    <RequestStatusBadge status={i.status} />
                    <Button size="sm" variant="ghost" onClick={() => cancelInvitation(i.id)}>
                      Cancel
                    </Button>
                  </div>
                ))}
              </Card>
            ) : (
              <p className="text-sm text-muted-foreground">No pending invitations.</p>
            )}
          </div>
        </section>
      )}

      <JoinModal team={team} open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  )
}
