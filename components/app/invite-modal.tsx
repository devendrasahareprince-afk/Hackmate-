'use client'

import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { Button, LinkButton } from '@/components/kit/button'
import { Field, Select, Textarea } from '@/components/kit/form'
import { Modal } from '@/components/kit/modal'
import { Avatar, EmptyState } from '@/components/kit/primitives'
import { ROLES } from '@/lib/constants'
import { getCompetition } from '@/lib/data/seed'
import { computeMatch, needsForTeam } from '@/lib/matching'
import { useStore } from '@/lib/store'
import type { Student } from '@/lib/types'
import { MatchBadge } from './badges'

export function InviteModal({
  student,
  open,
  onClose,
  defaultTeamId,
}: {
  student: Student
  open: boolean
  onClose: () => void
  defaultTeamId?: string
}) {
  const { state, currentUser, sendInvitation } = useStore()
  const myTeams = currentUser ? state.teams.filter((t) => t.leaderId === currentUser.id) : []
  const eligible = myTeams.filter(
    (t) => !t.members.some((m) => m.studentId === student.id) && t.members.length < t.maxSize,
  )
  const [teamId, setTeamId] = useState(defaultTeamId ?? '')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedTeam = eligible.find((t) => t.id === teamId)
  const roleOptions = selectedTeam?.openRoles.length ? selectedTeam.openRoles : [...ROLES]
  const pendingFor = (id: string) =>
    state.invitations.some((i) => i.teamId === id && i.toId === student.id && i.status === 'pending')

  const close = () => {
    setError('')
    onClose()
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamId) return setError('Select one of your teams')
    const finalRole = role || roleOptions[0]
    if (!finalRole) return setError('Select a role')
    if (sendInvitation(teamId, student.id, finalRole, message.trim() || undefined)) {
      setTeamId('')
      setRole('')
      setMessage('')
      close()
    }
  }

  return (
    <Modal open={open} onClose={close} title={`Invite ${student.name.split(' ')[0]} to your team`}>
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
        <Avatar name={student.name} color={student.color} />
        <div className="min-w-0">
          <p className="truncate font-medium">{student.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {student.preferredRole || 'No preferred role'} · {student.college}
          </p>
        </div>
      </div>

      {eligible.length === 0 ? (
        <EmptyState
          icon={Users}
          title={myTeams.length ? 'No eligible teams' : 'You do not lead any teams yet'}
          description={
            myTeams.length
              ? `${student.name.split(' ')[0]} is already in your teams, or your teams are full.`
              : 'Create a team first, then you can invite students to join it.'
          }
          action={
            <LinkButton href="/teams/new" size="sm" onClick={close}>
              <Plus aria-hidden="true" /> Create Team
            </LinkButton>
          }
        />
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">
              Select team<span className="ml-0.5 text-destructive">*</span>
            </legend>
            <div className="flex flex-col gap-2">
              {eligible.map((t) => {
                const match = computeMatch(student, needsForTeam(t))
                const pending = pendingFor(t.id)
                return (
                  <label
                    key={t.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition-colors has-checked:border-primary has-checked:bg-primary/8 has-disabled:cursor-not-allowed has-disabled:opacity-60"
                  >
                    <input
                      type="radio"
                      name="team"
                      value={t.id}
                      checked={teamId === t.id}
                      disabled={pending}
                      onChange={() => {
                        setTeamId(t.id)
                        setRole('')
                        setError('')
                      }}
                      className="accent-primary"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {getCompetition(t.competitionId)?.name} · {t.members.length}/{t.maxSize} members
                        {pending && ' · Invitation pending'}
                      </p>
                    </div>
                    <MatchBadge score={match.score} />
                  </label>
                )
              })}
            </div>
          </fieldset>

          <Field label="Role" htmlFor="invite-role">
            <Select id="invite-role" value={role || roleOptions[0]} onChange={(e) => setRole(e.target.value)}>
              {roleOptions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </Field>

          <Field label="Message (optional)" htmlFor="invite-msg">
            <Textarea
              id="invite-msg"
              rows={3}
              maxLength={280}
              placeholder="Tell them why they'd be a great fit..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Field>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
