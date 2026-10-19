'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, Send } from 'lucide-react'
import { Button, LinkButton } from '@/components/kit/button'
import { Avatar, Badge, Card } from '@/components/kit/primitives'
import type { MatchResult } from '@/lib/matching'
import type { Student } from '@/lib/types'
import { AvailabilityBadge, MatchBadge, SkillTags } from './badges'
import { InviteModal } from './invite-modal'

export function StudentCard({
  student,
  match,
  isSelf,
  compact,
}: {
  student: Student
  match?: MatchResult
  isSelf?: boolean
  compact?: boolean
}) {
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <Card className="group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-indigo-500/5">
      <div className="flex items-start gap-3">
        <Avatar name={student.name} color={student.color} />
        <div className="min-w-0 flex-1">
          <Link href={`/students/${student.id}`} className="block truncate font-semibold hover:text-primary">
            {student.name}
            {isSelf && <span className="ml-1.5 text-xs font-normal text-muted-foreground">(You)</span>}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{student.preferredRole || 'Role not set'}</p>
        </div>
        {match ? <MatchBadge score={match.score} /> : <AvailabilityBadge value={student.availability} />}
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <GraduationCap className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <p className="line-clamp-2">
          {student.college} · {student.branch} · {student.year}
        </p>
      </div>

      <div className="mt-4">
        <SkillTags skills={student.skills.map((s) => s.name)} max={compact ? 3 : 4} />
      </div>

      {!compact && student.interests.length > 0 && (
        <p className="mt-3 line-clamp-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">Interests:</span> {student.interests.join(', ')}
        </p>
      )}

      {match && <p className="mt-3 line-clamp-2 text-xs text-muted-foreground text-pretty">{match.reason}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {match && <AvailabilityBadge value={student.availability} />}
        <Badge>{student.experience}</Badge>
      </div>

      <div className="mt-auto flex gap-2 pt-5">
        <LinkButton href={`/students/${student.id}`} variant="outline" size="sm" className="flex-1">
          View Profile
        </LinkButton>
        {!isSelf && (
          <Button size="sm" className="flex-1" onClick={() => setInviteOpen(true)}>
            <Send aria-hidden="true" /> Invite to Team
          </Button>
        )}
      </div>

      {!isSelf && <InviteModal student={student} open={inviteOpen} onClose={() => setInviteOpen(false)} />}
    </Card>
  )
}
