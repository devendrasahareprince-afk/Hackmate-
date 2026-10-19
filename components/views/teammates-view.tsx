'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchX } from 'lucide-react'
import { StudentCard } from '@/components/app/student-card'
import { Input, Select } from '@/components/kit/form'
import { EmptyState, PageHeader } from '@/components/kit/primitives'
import { AVAILABILITY, ROLES, SKILLS } from '@/lib/constants'
import { useStore } from '@/lib/store'
import { useMatchMap } from '@/lib/use-matches'

export function TeammatesView() {
  const params = useSearchParams()
  const { state, currentUser } = useStore()
  const matches = useMatchMap()
  const initialSkill = params.get('skill') ?? ''
  const [q, setQ] = useState('')
  const [skill, setSkill] = useState((SKILLS as readonly string[]).includes(initialSkill) ? initialSkill : '')
  const [avail, setAvail] = useState('')
  const [role, setRole] = useState('')
  const [sort, setSort] = useState<'match' | 'name'>(params.get('sort') === 'name' ? 'name' : 'match')

  const term = q.trim().toLowerCase()
  const list = state.students
    .filter((s) => s.id !== currentUser?.id)
    .filter((s) => !skill || s.skills.some((k) => k.name === skill))
    .filter((s) => !avail || s.availability === avail)
    .filter((s) => !role || s.preferredRole === role)
    .filter(
      (s) =>
        !term ||
        [s.name, s.college, s.branch, ...s.skills.map((k) => k.name), ...s.interests].some((v) =>
          v.toLowerCase().includes(term),
        ),
    )
    .sort((a, b) =>
      sort === 'match'
        ? (matches.get(b.id)?.score ?? 0) - (matches.get(a.id)?.score ?? 0)
        : a.name.localeCompare(b.name),
    )

  return (
    <div>
      <PageHeader
        title="Find Teammates"
        description="Search students by skill, role and availability. Match scores are a simple rule-based estimate."
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          className="lg:col-span-2"
          type="search"
          placeholder="Search name, college, skill or interest"
          aria-label="Search students"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select aria-label="Filter by skill" value={skill} onChange={(e) => setSkill(e.target.value)}>
          <option value="">All skills</option>
          {SKILLS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
        <Select aria-label="Filter by role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </Select>
        <Select aria-label="Filter by availability" value={avail} onChange={(e) => setAvail(e.target.value)}>
          <option value="">Any availability</option>
          {AVAILABILITY.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </Select>
      </div>
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {list.length} student{list.length === 1 ? '' : 's'} found
        </p>
        <label className="flex items-center gap-2">
          Sort by
          <Select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as 'match' | 'name')} className="h-9 w-36">
            <option value="match">Best match</option>
            <option value="name">Name</option>
          </Select>
        </label>
      </div>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <StudentCard key={s.id} student={s} match={matches.get(s.id)} />
          ))}
        </div>
      ) : (
        <EmptyState icon={SearchX} title="No students match" description="Try removing a filter or searching for something else." />
      )}
    </div>
  )
}
