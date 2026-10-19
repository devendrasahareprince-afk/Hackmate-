import { Suspense } from 'react'
import type { Metadata } from 'next'
import { TeammatesView } from '@/components/views/teammates-view'

export const metadata: Metadata = { title: 'Find Teammates' }

export default function TeammatesPage() {
  return (
    <Suspense>
      <TeammatesView />
    </Suspense>
  )
}
