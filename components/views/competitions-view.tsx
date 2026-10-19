'use client'

import { useState } from 'react'
import { SearchX } from 'lucide-react'
import { CompetitionCard } from '@/components/app/competition-card'
import { Input } from '@/components/kit/form'
import { EmptyState, PageHeader, SampleNote, Tabs } from '@/components/kit/primitives'
import { CATEGORIES } from '@/lib/constants'
import { competitions } from '@/lib/data/seed'

export function CompetitionsView() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('all')
  const term = q.trim().toLowerCase()
  const list = competitions
    .filter((c) => cat === 'all' || c.category === cat)
    .filter(
      (c) =>
        !term ||
        [c.name, c.organizer, c.description, ...c.requiredSkills, ...c.themes].some((v) => v.toLowerCase().includes(term)),
    )
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div>
      <PageHeader
        title="Competitions"
        description="Pick an event, then build a team or find teammates for it."
        actions={<SampleNote>Sample events for demonstration only</SampleNote>}
      />
      <div className="mb-6 flex flex-col gap-3">
        <Input
          type="search"
          placeholder="Search competitions, themes or skills"
          aria-label="Search competitions"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md"
        />
        <div className="overflow-x-auto">
          <Tabs
            label="Category"
            value={cat}
            onChange={setCat}
            tabs={[
              { value: 'all', label: 'All', count: competitions.length },
              ...CATEGORIES.map((c) => ({ value: c as string, label: c, count: competitions.filter((x) => x.category === c).length })),
            ]}
          />
        </div>
      </div>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CompetitionCard key={c.id} competition={c} />
          ))}
        </div>
      ) : (
        <EmptyState icon={SearchX} title="No competitions found" description="Try another category or search term." />
      )}
    </div>
  )
}
