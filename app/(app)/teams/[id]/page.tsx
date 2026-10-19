import type { Metadata } from 'next'
import { TeamDetail } from '@/components/views/team-detail'

export const metadata: Metadata = { title: 'Team' }

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TeamDetail id={id} />
}
