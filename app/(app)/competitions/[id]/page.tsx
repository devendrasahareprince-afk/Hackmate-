import type { Metadata } from 'next'
import { CompetitionDetail } from '@/components/views/competition-detail'

export const metadata: Metadata = { title: 'Competition' }

export default async function CompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CompetitionDetail id={id} />
}
