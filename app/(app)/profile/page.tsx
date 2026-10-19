import type { Metadata } from 'next'
import { ProfileForm } from '@/components/views/profile-form'

export const metadata: Metadata = { title: 'My Profile' }

export default function ProfilePage() {
  return <ProfileForm />
}
