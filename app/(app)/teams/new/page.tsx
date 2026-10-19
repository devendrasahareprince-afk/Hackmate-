import { Suspense } from 'react'
import type { Metadata } from 'next'
import { NewTeamForm } from '@/components/views/new-team-form'

export const metadata: Metadata = { title: 'Create Team' }

export default function NewTeamPage() {
  return (
    <Suspense>
      <NewTeamForm />
    </Suspense>
  )
}
