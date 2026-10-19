import type { Metadata } from 'next'
import { InvitationsView } from '@/components/views/invitations-view'

export const metadata: Metadata = { title: 'Invitations' }

export default function InvitationsPage() {
  return <InvitationsView />
}
