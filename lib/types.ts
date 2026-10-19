export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type Availability = 'Available' | 'Limited' | 'Unavailable'
export type AcademicYear = 'First Year' | 'Second Year' | 'Third Year' | 'Final Year'

export interface SkillEntry {
  name: string
  level: SkillLevel
}

export interface Project {
  title: string
  description: string
  tech: string[]
}

export interface HackathonEntry {
  name: string
  result: string
  year: string
}

export interface Student {
  id: string
  name: string
  email: string
  college: string
  branch: string
  year: AcademicYear
  bio: string
  skills: SkillEntry[]
  softSkills: string[]
  interests: string[]
  experience: SkillLevel
  availability: Availability
  preferredRole: string
  projects: Project[]
  hackathons: HackathonEntry[]
  color: number
}

export interface TeamMember {
  studentId: string
  role: string
}

export interface Team {
  id: string
  name: string
  competitionId: string
  projectIdea: string
  description: string
  leaderId: string
  members: TeamMember[]
  maxSize: number
  requiredSkills: string[]
  openRoles: string[]
  deadline: string
  visibility: 'public' | 'private'
  createdAt: string
}

export type CompetitionCategory =
  | 'Hackathons'
  | 'Ideathons'
  | 'Coding Competitions'
  | 'AI/ML Challenges'
  | 'Project Competitions'

export interface Competition {
  id: string
  name: string
  organizer: string
  category: CompetitionCategory
  date: string
  registrationDeadline: string
  minTeam: number
  maxTeam: number
  requiredSkills: string[]
  description: string
  mode: 'Online' | 'Offline' | 'Hybrid'
  location: string
  themes: string[]
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'

export interface Invitation {
  id: string
  teamId: string
  fromId: string
  toId: string
  role: string
  message?: string
  date: string
  status: RequestStatus
}

export interface JoinRequest {
  id: string
  teamId: string
  studentId: string
  role: string
  message?: string
  date: string
  status: RequestStatus
}

export interface Activity {
  id: string
  text: string
  date: string
  kind: 'team' | 'invite' | 'request' | 'profile' | 'system'
}

export interface Account {
  email: string
  password: string
  studentId: string
}

export interface Settings {
  notifications: {
    invitations: boolean
    joinRequests: boolean
    competitions: boolean
    weeklyDigest: boolean
  }
  privacy: {
    discoverable: boolean
    showEmail: boolean
    showCollege: boolean
  }
}

export interface AppState {
  version: number
  students: Student[]
  teams: Team[]
  invitations: Invitation[]
  joinRequests: JoinRequest[]
  activities: Activity[]
  accounts: Account[]
  currentUserId: string | null
  settings: Settings
}
