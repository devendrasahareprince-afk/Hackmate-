'use client'

import { Plus, Users } from 'lucide-react'
import { TeamCard } from '@/components/app/team-card'
import { LinkButton } from '@/components/kit/button'
import { EmptyState, PageHeader } from '@/components/kit/primitives'
import { useStore } from '@/lib/store'

export function MyTeamsView() {
  const { state, currentUser } = useStore()
  if (!currentUser) return null
  const mine = state.teams.filter((t) => t.members.some((m) => m.studentId === currentUser.id))
  const led = mine.filter((t) => t.leaderId === currentUser.id)
  const joined = mine.filter((t) => t.leaderId !== currentUser.id)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="My Teams"
        description="Teams you lead or have joined."
        actions={
          <LinkButton href="/teams/new">
            <Plus aria-hidden="true" /> Create Team
          </LinkButton>
        }
      />
      {mine.length === 0 ? (
        <EmptyState
          icon={Users}
          title="You are not in any team yet"
          description="Create a team for a competition or request to join an open one."
          action={
            <LinkButton href="/teams" size="sm">
              Explore Teams
            </LinkButton>
          }
        />
      ) : (
        <>
          {led.length > 0 && (
            <section aria-label="Teams I lead">
              <h2 className="mb-4 text-lg font-semibold">Teams I lead ({led.length})</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {led.map((t) => (
                  <TeamCard key={t.id} team={t} />
                ))}
              </div>
            </section>
          )}
          {joined.length > 0 && (
            <section aria-label="Teams I joined">
              <h2 className="mb-4 text-lg font-semibold">Teams I joined ({joined.length})</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {joined.map((t) => (
                  <TeamCard key={t.id} team={t} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
