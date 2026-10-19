'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trophy, UserPlus } from 'lucide-react'
import { Button, LinkButton } from '@/components/kit/button'
import { Avatar, Badge, Card } from '@/components/kit/primitives'
import { getCompetition } from '@/lib/data/seed'
import { teamStatus } from '@/lib/helpers'
import { useStore } from '@/lib/store'
import type { Team } from '@/lib/types'
import { SkillTags, TeamStatusBadge } from './badges'
import { JoinModal } from './join-modal'

export function TeamCard({ team }: { team: Team }) {
  const { currentUser, state, getStudent } = useStore()
  const [joinOpen, setJoinOpen] = useState(false)
  const competition = getCompetition(team.competitionId)
  const isMember = !!currentUser && team.members.some((m) => m.studentId === currentUser.id)
  const pending =
    !!currentUser &&
    state.joinRequests.some((r) => r.teamId === team.id && r.studentId === currentUser.id && r.status === 'pending')
  const status = teamStatus(team)
  const fill = Math.round((team.members.length / team.maxSize) * 100)

  return (
    <Card className="flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-indigo-500/5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/teams/${team.id}`} className="block truncate text-lg font-semibold hover:text-primary">
            {team.name}
          </Link>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <Trophy className="size-3.5 shrink-0 text-brand-cyan" aria-hidden="true" />
            {competition?.name ?? 'Independent project'}
          </p>
        </div>
        <TeamStatusBadge team={team} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground text-pretty">{team.description}</p>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Members</span>
          <span className="font-medium tabular-nums">
            {team.members.length}/{team.maxSize}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${fill}%` }} />
        </div>
        <div className="mt-3 flex -space-x-2">
          {team.members.slice(0, 5).map((m) => {
            const s = getStudent(m.studentId)
            return s ? <Avatar key={m.studentId} name={s.name} color={s.color} size="sm" /> : null
          })}
        </div>
      </div>

      {team.openRoles.length > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Looking for</p>
          <ul className="flex flex-wrap gap-1.5">
            {team.openRoles.map((r, i) => (
              <li key={`${r}-${i}`}>
                <Badge tone="cyan">{r}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Required skills</p>
        <SkillTags skills={team.requiredSkills} max={4} />
      </div>

      <div className="mt-auto flex gap-2 pt-5">
        <LinkButton href={`/teams/${team.id}`} variant="outline" size="sm" className="flex-1">
          View Team
        </LinkButton>
        {isMember ? (
          <Button size="sm" variant="secondary" className="flex-1" disabled>
            You are a member
          </Button>
        ) : pending ? (
          <Button size="sm" variant="secondary" className="flex-1" disabled>
            Request pending
          </Button>
        ) : (
          <Button size="sm" className="flex-1" disabled={status === 'Full'} onClick={() => setJoinOpen(true)}>
            <UserPlus aria-hidden="true" /> {status === 'Full' ? 'Team full' : 'Request to Join'}
          </Button>
        )}
      </div>
      <JoinModal team={team} open={joinOpen} onClose={() => setJoinOpen(false)} />
    </Card>
  )
}
