'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/kit/button'
import { ChipSelect, Field, Input, Select, Textarea } from '@/components/kit/form'
import { Card, PageHeader } from '@/components/kit/primitives'
import { ROLES, SKILLS } from '@/lib/constants'
import { competitions, getCompetition } from '@/lib/data/seed'
import { useStore } from '@/lib/store'

export function NewTeamForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { createTeam } = useStore()
  const pre = getCompetition(params.get('competition') ?? '')

  const [form, setForm] = useState({
    name: '',
    competitionId: pre?.id ?? '',
    projectIdea: '',
    description: '',
    maxSize: pre?.maxTeam ?? 4,
    requiredSkills: pre ? pre.requiredSkills.filter((s) => (SKILLS as readonly string[]).includes(s)) : ([] as string[]),
    openRoles: [] as string[],
    deadline: pre?.registrationDeadline ?? '',
    visibility: 'public' as 'public' | 'private',
    leaderRole: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const comp = getCompetition(form.competitionId)
  const maxAllowed = comp?.maxTeam ?? 10

  const patch = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }))

  const onCompetition = (id: string) => {
    const c = getCompetition(id)
    patch({
      competitionId: id,
      maxSize: c ? Math.min(Math.max(form.maxSize, 2), c.maxTeam) : form.maxSize,
      deadline: c?.registrationDeadline ?? form.deadline,
    })
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (form.name.trim().length < 3) errs.name = 'Team name must be at least 3 characters'
    if (!form.competitionId) errs.competitionId = 'Choose a competition'
    if (form.projectIdea.trim().length < 5) errs.projectIdea = 'Describe your project idea in a few words'
    if (form.description.trim().length < 20) errs.description = 'Add at least 20 characters of description'
    if (!Number.isInteger(form.maxSize) || form.maxSize < 2 || form.maxSize > maxAllowed)
      errs.maxSize = `Team size must be between 2 and ${maxAllowed}`
    else if (form.openRoles.length > form.maxSize - 1)
      errs.openRoles = `With a team of ${form.maxSize} you can open at most ${form.maxSize - 1} roles`
    if (form.requiredSkills.length < 1) errs.requiredSkills = 'Pick at least one skill'
    if (!form.deadline) errs.deadline = 'Choose a deadline'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const id = createTeam(form)
    if (id) router.push(`/teams/${id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Create a Team" description="You will be the team leader. You can invite students once the team is created." />
      <Card className="p-6">
        <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
          <Field label="Team name" htmlFor="t-name" error={errors.name} required>
            <Input id="t-name" value={form.name} onChange={(e) => patch({ name: e.target.value })} aria-invalid={!!errors.name} />
          </Field>
          <Field label="Competition" htmlFor="t-comp" error={errors.competitionId} required>
            <Select id="t-comp" value={form.competitionId} onChange={(e) => onCompetition(e.target.value)} aria-invalid={!!errors.competitionId}>
              <option value="">Select a competition</option>
              {competitions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Project idea" htmlFor="t-idea" error={errors.projectIdea} required className="sm:col-span-2">
            <Input id="t-idea" value={form.projectIdea} onChange={(e) => patch({ projectIdea: e.target.value })} aria-invalid={!!errors.projectIdea} />
          </Field>
          <Field label="Description" htmlFor="t-desc" error={errors.description} required className="sm:col-span-2">
            <Textarea id="t-desc" rows={4} value={form.description} onChange={(e) => patch({ description: e.target.value })} aria-invalid={!!errors.description} />
          </Field>
          <Field label="Team size" htmlFor="t-size" error={errors.maxSize} hint={comp ? `${comp.name} allows up to ${comp.maxTeam}` : undefined} required>
            <Input
              id="t-size"
              type="number"
              min={2}
              max={maxAllowed}
              value={form.maxSize}
              onChange={(e) => patch({ maxSize: Number(e.target.value) })}
              aria-invalid={!!errors.maxSize}
            />
          </Field>
          <Field label="Registration deadline" htmlFor="t-deadline" error={errors.deadline} required>
            <Input id="t-deadline" type="date" value={form.deadline} onChange={(e) => patch({ deadline: e.target.value })} aria-invalid={!!errors.deadline} />
          </Field>
          <Field label="Your role" htmlFor="t-lrole" hint="Optional. Shown next to “Team Leader”." >
            <Select id="t-lrole" value={form.leaderRole} onChange={(e) => patch({ leaderRole: e.target.value })}>
              <option value="">No specific role</option>
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <Field label="Visibility" htmlFor="t-vis">
            <Select id="t-vis" value={form.visibility} onChange={(e) => patch({ visibility: e.target.value as 'public' | 'private' })}>
              <option value="public">Public – anyone can find and request to join</option>
              <option value="private">Private – invite only</option>
            </Select>
          </Field>
          <Field label="Required skills" error={errors.requiredSkills} required className="sm:col-span-2">
            <ChipSelect label="Required skills" options={SKILLS} value={form.requiredSkills} onChange={(v) => patch({ requiredSkills: v })} invalid={!!errors.requiredSkills} />
          </Field>
          <Field label="Roles you are looking for" error={errors.openRoles} className="sm:col-span-2">
            <ChipSelect label="Open roles" options={ROLES} value={form.openRoles} onChange={(v) => patch({ openRoles: v })} invalid={!!errors.openRoles} />
          </Field>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Create Team</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
