'use client'

import { useState } from 'react'
import { Button } from '@/components/kit/button'
import { Field, Select, Textarea } from '@/components/kit/form'
import { Modal } from '@/components/kit/modal'
import { ROLES } from '@/lib/constants'
import { useStore } from '@/lib/store'
import type { Team } from '@/lib/types'

export function JoinModal({ team, open, onClose }: { team: Team; open: boolean; onClose: () => void }) {
  const { requestJoin, currentUser } = useStore()
  const roles = team.openRoles.length ? team.openRoles : [...ROLES]
  const preferred = currentUser && roles.includes(currentUser.preferredRole) ? currentUser.preferredRole : roles[0]
  const [role, setRole] = useState(preferred)
  const [message, setMessage] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (requestJoin(team.id, role, message.trim() || undefined)) {
      setMessage('')
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Request to join ${team.name}`} description="The team leader will review your request.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Role you want to fill" htmlFor="join-role" required>
          <Select id="join-role" value={role} onChange={(e) => setRole(e.target.value)}>
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </Field>
        <Field label="Message (optional)" htmlFor="join-msg">
          <Textarea
            id="join-msg"
            rows={3}
            maxLength={280}
            placeholder="Share your relevant skills or experience..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Send Request</Button>
        </div>
      </form>
    </Modal>
  )
}
