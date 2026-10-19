'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, GraduationCap, Send, UserRound } from 'lucide-react'
import { AvailabilityBadge, LevelBadge, MatchBadge } from '@/components/app/badges'
import { InviteModal } from '@/components/app/invite-modal'
import { Button, LinkButton } from '@/components/kit/button'
import { Avatar, Badge, Card, EmptyState } from '@/components/kit/primitives'
import { useStore } from '@/lib/store'
import { useMatchMap } from '@/lib/use-matches'

export function StudentProfile({ id }: { id: string }) {
  const { getStudent, currentUser, state } = useStore()
  const matches = useMatchMap()
  const [inviteOpen, setInviteOpen] = useState(false)
  const s = getStudent(id)

  if (!s) {
    return (
      <EmptyState
        icon={UserRound}
        title="Student not found"
        description="This profile does not exist."
        action={
          <LinkButton href="/teammates" size="sm">
            Find teammates
          </LinkButton>
        }
      />
    )
  }

  const isSelf = currentUser?.id === s.id
  const match = matches.get(s.id)
  const teams = state.teams.filter((t) => t.members.some((m) => m.studentId === s.id) && (t.visibility === 'public' || isSelf))

  return (
    <div className="flex flex-col gap-6">
      <Link href="/teammates" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to teammates
      </Link>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar name={s.name} color={s.color} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold">{s.name}</h1>
              {match && <MatchBadge score={match.score} />}
              <AvailabilityBadge value={s.availability} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{s.preferredRole || 'Preferred role not set'}</p>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <GraduationCap className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {s.college} · {s.branch} · {s.year}
            </p>
            {isSelf && <p className="mt-1 text-sm text-muted-foreground">{s.email}</p>}
            {match && <p className="mt-3 text-sm text-muted-foreground text-pretty">{match.reason}</p>}
          </div>
          <div className="flex gap-2">
            {isSelf ? (
              <LinkButton href="/profile" variant="secondary">
                Edit Profile
              </LinkButton>
            ) : (
              <Button onClick={() => setInviteOpen(true)}>
                <Send aria-hidden="true" /> Invite to Team
              </Button>
            )}
          </div>
        </div>
        {s.bio && <p className="mt-6 max-w-3xl text-sm text-pretty">{s.bio}</p>}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-3 text-lg font-semibold">Skills</h2>
          {s.skills.length ? (
            <ul className="flex flex-col gap-2">
              {s.skills.map((k) => (
                <li key={k.name} className="flex items-center justify-between text-sm">
                  {k.name}
                  <LevelBadge level={k.level} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No skills added yet.</p>
          )}
          {s.softSkills.length > 0 && (
            <>
              <h3 className="mt-5 mb-2 text-sm font-medium text-muted-foreground">Soft skills</h3>
              <ul className="flex flex-wrap gap-1.5">
                {s.softSkills.map((k) => (
                  <li key={k}>
                    <Badge tone="purple">{k}</Badge>
                  </li>
                ))}
              </ul>
            </>
          )}
          {s.interests.length > 0 && (
            <>
              <h3 className="mt-5 mb-2 text-sm font-medium text-muted-foreground">Interests</h3>
              <ul className="flex flex-wrap gap-1.5">
                {s.interests.map((k) => (
                  <li key={k}>
                    <Badge tone="cyan">{k}</Badge>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h2 className="mb-3 text-lg font-semibold">Projects</h2>
            {s.projects.length ? (
              <ul className="flex flex-col gap-4">
                {s.projects.map((p) => (
                  <li key={p.title}>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.tech.join(' · ')}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No projects added yet.</p>
            )}
          </Card>
          <Card className="p-6">
            <h2 className="mb-3 text-lg font-semibold">Hackathons</h2>
            {s.hackathons.length ? (
              <ul className="flex flex-col gap-2 text-sm">
                {s.hackathons.map((h) => (
                  <li key={`${h.name}-${h.year}`} className="flex items-center justify-between gap-3">
                    <span>{h.name}</span>
                    <span className="text-muted-foreground">
                      {h.result} · {h.year}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hackathons added yet.</p>
            )}
          </Card>
          {teams.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-3 text-lg font-semibold">Teams</h2>
              <ul className="flex flex-col gap-2 text-sm">
                {teams.map((t) => (
                  <li key={t.id}>
                    <Link href={`/teams/${t.id}`} className="text-primary hover:underline">
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      {!isSelf && <InviteModal student={s} open={inviteOpen} onClose={() => setInviteOpen(false)} />}
    </div>
  )
}
