import type { AcademicYear, Availability, CompetitionCategory, SkillLevel } from './types'

export const SKILLS = [
  'Frontend Development',
  'Backend Development',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'AI/ML',
  'Data Science',
  'UI/UX',
  'Cybersecurity',
  'Cloud Computing',
  'Presentation',
  'Research',
  'HTML',
  'CSS',
  'JavaScript',
  'MongoDB',
  'SQL',
  'Figma',
  'Flutter',
] as const

export const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI/ML Developer',
  'UI/UX Designer',
  'Data Analyst',
  'Mobile Developer',
  'Security Specialist',
  'Cloud/DevOps Engineer',
  'Competitive Programmer',
  'Presenter / Pitch Lead',
  'Researcher',
] as const

export const ROLE_SKILLS: Record<string, string[]> = {
  'Frontend Developer': ['Frontend Development', 'React', 'JavaScript', 'HTML', 'CSS'],
  'Backend Developer': ['Backend Development', 'Node.js', 'Java', 'Python', 'MongoDB', 'SQL'],
  'Full Stack Developer': ['React', 'Node.js', 'Frontend Development', 'Backend Development', 'MongoDB'],
  'AI/ML Developer': ['AI/ML', 'Python', 'Data Science'],
  'UI/UX Designer': ['UI/UX', 'Figma', 'CSS'],
  'Data Analyst': ['Data Science', 'Python', 'SQL'],
  'Mobile Developer': ['Flutter', 'Java', 'JavaScript'],
  'Security Specialist': ['Cybersecurity', 'Python', 'C++'],
  'Cloud/DevOps Engineer': ['Cloud Computing', 'Node.js', 'Python'],
  'Competitive Programmer': ['C++', 'Java', 'Python'],
  'Presenter / Pitch Lead': ['Presentation', 'Research'],
  Researcher: ['Research', 'Data Science', 'Presentation'],
  'Team Leader': [],
}

export const BRANCHES = [
  'Information Technology',
  'Computer Engineering',
  'Computer Science',
  'AI & Data Science',
  'Electronics & Telecommunication',
  'Electrical Engineering',
  'Mechanical Engineering',
]

export const YEARS: AcademicYear[] = ['First Year', 'Second Year', 'Third Year', 'Final Year']
export const LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced']
export const AVAILABILITY: Availability[] = ['Available', 'Limited', 'Unavailable']

export const CATEGORIES: CompetitionCategory[] = [
  'Hackathons',
  'Ideathons',
  'Coding Competitions',
  'AI/ML Challenges',
  'Project Competitions',
]

export const INTERESTS = [
  'Web Development',
  'Artificial Intelligence',
  'Hackathons',
  'Open Source',
  'FinTech',
  'HealthTech',
  'EdTech',
  'Sustainability',
  'Competitive Programming',
  'Blockchain',
  'IoT',
  'Product Design',
  'Startups',
  'Cybersecurity',
  'Data Visualization',
  'Mobile Apps',
]

export const SOFT_SKILLS = [
  'Leadership',
  'Communication',
  'Problem Solving',
  'Teamwork',
  'Time Management',
  'Public Speaking',
  'Critical Thinking',
  'Adaptability',
]
