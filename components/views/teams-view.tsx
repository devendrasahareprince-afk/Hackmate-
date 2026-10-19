'use client'

import { useState } from 'react'
import { Plus, SearchX } from 'lucide-react'
import { TeamCard } from '@/components/app/team-card'
import { LinkButton } from '@/components/kit/button'
import { Input, Select } from '@/components/kit/form'
import { EmptyState, PageHeader } from '@/components/kit/primitives'
import { competitions } from '@/lib/data/seed'
import { teamStatus } from '@/lib/helpers'
import { useStore } from '@/lib/store'

export function TeamsView() {
  const { state, currentUser } = useStore()
  const [q, setQ] = useState('')
  const [comp, setComp] = useState('')
  const [recruitingOnly, setRecruitingOnly] = useState(false)

  const term = q.trim().toLowerCase()
  const list = state.teams
    .filter((t) => t.visibility === 'public' || t.members.some((m) => m.studentId === currentUser?.id))
    .filter((t) => !comp || t.competitionId === comp)
    .filter((t) => !recruitingOnly || teamStatus(t) === 'Recruiting')
    .filter(
      (t) =>
        !term ||
        [t.name, t.description, t.projectIdea, ...t.requiredSkills, ...t.openRoles].some((v) =>
          v.toLowerCase().includes(term),
        ),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div>
      <PageHeader
        title="Explore Teams"
        description="Browse public teams and ask to join the ones that fit your skills."
        actions={
          <LinkButton href="/teams/new">
            <Plus aria-hidden="true" /> Create Team
          </LinkButton>
        }
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          className="lg:col-span-2"
          type="search"
          placeholder="Search teams, skills or roles"
          aria-label="Search teams"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select aria-label="Filter by competition" value={comp} onChange={(e) => setComp(e.target.value)}>
          <option value="">All competitions</option>
          {competitions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <label className="flex h-10 items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-primary"
            checked={recruitingOnly}
            onChange={(e) => setRecruitingOnly(e.target.checked)}
          />
          Only teams recruiting
        </label>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        {list.length} team{list.length === 1 ? '' : 's'} found
      </p>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      ) : (
        <EmptyState icon={SearchX} title="No teams match" description="Try a different filter, or create your own team." />
      )}
    </div>
  )
}
