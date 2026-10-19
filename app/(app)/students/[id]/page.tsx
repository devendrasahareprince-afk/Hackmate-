import type { Metadata } from 'next'
import { StudentProfile } from '@/components/views/student-profile'

export const metadata: Metadata = { title: 'Student Profile' }

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <StudentProfile id={id} />
}
