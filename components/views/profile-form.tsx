'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/kit/button'
import { ChipSelect, Field, Input, Select, Textarea } from '@/components/kit/form'
import { Avatar, Card, PageHeader } from '@/components/kit/primitives'
import { AVAILABILITY, BRANCHES, INTERESTS, LEVELS, ROLES, SKILLS, SOFT_SKILLS, YEARS } from '@/lib/constants'
import { profileCompletion } from '@/lib/helpers'
import { useStore } from '@/lib/store'
import type { AcademicYear, Availability, HackathonEntry, Project, SkillEntry, SkillLevel, Student } from '@/lib/types'

function ProfileEditor({ student }: { student: Student }) {
  const { updateProfile } = useStore()
  const [f, setF] = useState<Student>(student)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = <K extends keyof Student>(k: K, v: Student[K]) => setF((p) => ({ ...p, [k]: v }))
  const completion = profileCompletion(f)

  const setSkillNames = (names: string[]) =>
    set(
      'skills',
      names.map((n) => f.skills.find((s) => s.name === n) ?? { name: n, level: 'Beginner' as SkillLevel }),
    )
  const setLevel = (name: string, level: SkillLevel) =>
    set(
      'skills',
      f.skills.map((s): SkillEntry => (s.name === name ? { ...s, level } : s)),
    )
  const setProject = (i: number, p: Partial<Project>) =>
    set('projects', f.projects.map((x, j) => (j === i ? { ...x, ...p } : x)))
  const setHack = (i: number, p: Partial<HackathonEntry>) =>
    set('hackathons', f.hackathons.map((x, j) => (j === i ? { ...x, ...p } : x)))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (f.name.trim().length < 2) errs.name = 'Enter your full name'
    if (f.college.trim().length < 3) errs.college = 'Enter your college name'
    setErrors(errs)
    if (Object.keys(errs).length) return
    updateProfile({
      name: f.name.trim(),
      college: f.college.trim(),
      branch: f.branch,
      year: f.year,
      bio: f.bio.trim(),
      skills: f.skills,
      softSkills: f.softSkills,
      interests: f.interests,
      experience: f.experience,
      availability: f.availability,
      preferredRole: f.preferredRole,
      projects: f.projects.filter((p) => p.title.trim()),
      hackathons: f.hackathons.filter((h) => h.name.trim()),
    })
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader title="My Profile" description="A complete profile helps teams find and trust you." />
      <Card className="flex items-center gap-4 p-5">
        <Avatar name={f.name || 'You'} color={f.color} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{f.name || 'Your name'}</p>
          <p className="truncate text-sm text-muted-foreground">{f.email}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion">
            <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${completion}%` }} />
          </div>
        </div>
        <span className="text-sm font-semibold tabular-nums">{completion}%</span>
      </Card>

      <Card className="grid gap-5 p-6 sm:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2">Basics</h2>
        <Field label="Full name" htmlFor="p-name" error={errors.name} required>
          <Input id="p-name" value={f.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} />
        </Field>
        <Field label="College" htmlFor="p-college" error={errors.college} required>
          <Input id="p-college" value={f.college} onChange={(e) => set('college', e.target.value)} aria-invalid={!!errors.college} />
        </Field>
        <Field label="Branch" htmlFor="p-branch">
          <Select id="p-branch" value={f.branch} onChange={(e) => set('branch', e.target.value)}>
            {!BRANCHES.includes(f.branch) && <option>{f.branch}</option>}
            {BRANCHES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
        </Field>
        <Field label="Academic year" htmlFor="p-year">
          <Select id="p-year" value={f.year} onChange={(e) => set('year', e.target.value as AcademicYear)}>
            {YEARS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </Select>
        </Field>
        <Field label="Preferred role" htmlFor="p-role">
          <Select id="p-role" value={f.preferredRole} onChange={(e) => set('preferredRole', e.target.value)}>
            <option value="">Not set</option>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </Field>
        <Field label="Overall experience" htmlFor="p-exp">
          <Select id="p-exp" value={f.experience} onChange={(e) => set('experience', e.target.value as SkillLevel)}>
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </Select>
        </Field>
        <Field label="Availability" htmlFor="p-avail">
          <Select id="p-avail" value={f.availability} onChange={(e) => set('availability', e.target.value as Availability)}>
            {AVAILABILITY.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </Select>
        </Field>
        <Field label="Bio" htmlFor="p-bio" hint={`${f.bio.trim().length}/20 characters minimum for a complete profile`} className="sm:col-span-2">
          <Textarea id="p-bio" rows={4} maxLength={400} value={f.bio} onChange={(e) => set('bio', e.target.value)} />
        </Field>
      </Card>

      <Card className="flex flex-col gap-5 p-6">
        <h2 className="text-lg font-semibold">Skills &amp; interests</h2>
        <Field label="Technical skills" hint="Pick at least 3 for a complete profile">
          <ChipSelect label="Technical skills" options={SKILLS} value={f.skills.map((s) => s.name)} onChange={setSkillNames} />
        </Field>
        {f.skills.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {f.skills.map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-3 rounded-xl border border-border p-2 pl-3 text-sm">
                {s.name}
                <Select aria-label={`${s.name} level`} value={s.level} onChange={(e) => setLevel(s.name, e.target.value as SkillLevel)} className="h-8 w-36 text-xs">
                  {LEVELS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </Select>
              </li>
            ))}
          </ul>
        )}
        <Field label="Soft skills">
          <ChipSelect label="Soft skills" options={SOFT_SKILLS} value={f.softSkills} onChange={(v) => set('softSkills', v)} />
        </Field>
        <Field label="Interests">
          <ChipSelect label="Interests" options={INTERESTS} value={f.interests} onChange={(v) => set('interests', v)} />
        </Field>
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projects</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => set('projects', [...f.projects, { title: '', description: '', tech: [] }])}>
            <Plus aria-hidden="true" /> Add project
          </Button>
        </div>
        {f.projects.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
        {f.projects.map((p, i) => (
          <div key={i} className="grid gap-3 rounded-xl border border-border p-4">
            <Input aria-label="Project title" placeholder="Project title" value={p.title} onChange={(e) => setProject(i, { title: e.target.value })} />
            <Textarea aria-label="Project description" rows={2} placeholder="What does it do?" value={p.description} onChange={(e) => setProject(i, { description: e.target.value })} />
            <Input
              aria-label="Tech used"
              placeholder="Tech used, comma separated"
              value={p.tech.join(', ')}
              onChange={(e) => setProject(i, { tech: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            />
            <Button type="button" size="sm" variant="ghost" className="self-end" onClick={() => set('projects', f.projects.filter((_, j) => j !== i))}>
              <Trash2 aria-hidden="true" /> Remove
            </Button>
          </div>
        ))}
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Hackathon experience</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => set('hackathons', [...f.hackathons, { name: '', result: '', year: String(new Date().getFullYear()) }])}>
            <Plus aria-hidden="true" /> Add hackathon
          </Button>
        </div>
        {f.hackathons.length === 0 && <p className="text-sm text-muted-foreground">No hackathons yet.</p>}
        {f.hackathons.map((h, i) => (
          <div key={i} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[2fr_1.5fr_1fr_auto]">
            <Input aria-label="Hackathon name" placeholder="Name" value={h.name} onChange={(e) => setHack(i, { name: e.target.value })} />
            <Input aria-label="Result" placeholder="Result (e.g. Finalist)" value={h.result} onChange={(e) => setHack(i, { result: e.target.value })} />
            <Input aria-label="Year" placeholder="Year" value={h.year} onChange={(e) => setHack(i, { year: e.target.value })} />
            <Button type="button" size="icon" variant="ghost" aria-label="Remove hackathon" onClick={() => set('hackathons', f.hackathons.filter((_, j) => j !== i))}>
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        ))}
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => setF(student)}>
          Reset changes
        </Button>
        <Button type="submit">Save profile</Button>
      </div>
    </form>
  )
}

export function ProfileForm() {
  const { currentUser } = useStore()
  if (!currentUser) return null
  return <ProfileEditor student={currentUser} />
}
