import type { Metadata } from 'next'
import { CompetitionsView } from '@/components/views/competitions-view'

export const metadata: Metadata = { title: 'Competitions' }

export default function CompetitionsPage() {
  return <CompetitionsView />
}
