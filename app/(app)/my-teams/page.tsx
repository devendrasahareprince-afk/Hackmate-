import type { Metadata } from 'next'
import { MyTeamsView } from '@/components/views/my-teams-view'

export const metadata: Metadata = { title: 'My Teams' }

export default function MyTeamsPage() {
  return <MyTeamsView />
}
