import {
  ArrowRight,
  Compass,
  Mail,
  Network,
  Rocket,
  Search,
  SlidersHorizontal,
  Trophy,
  UserCircle2,
  Users,
  UsersRound,
  Zap,
} from 'lucide-react'
import { LinkButton } from '@/components/kit/button'
import { Avatar } from '@/components/kit/primitives'

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold tracking-widest text-brand-cyan uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl text-balance">{title}</h2>
      <p className="mt-4 text-muted-foreground text-pretty">{description}</p>
    </div>
  )
}

const stats = [
  { value: '500+', label: 'Students' },
  { value: '120+', label: 'Teams' },
  { value: '50+', label: 'Competitions' },
  { value: '30+', label: 'Skills' },
]

export function Stats() {
  return (
    <section aria-labelledby="stats-heading" className="mx-auto max-w-7xl px-4 sm:px-6">
      <h2 id="stats-heading" className="sr-only">
        Platform statistics
      </h2>
      <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card/40 px-6 py-8 text-center">
            <p className="font-display text-3xl font-semibold text-gradient sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Demo statistics for prototype illustration only.</p>
    </section>
  )
}

const steps = [
  {
    icon: UserCircle2,
    title: 'Create Your Profile',
    text: 'Add your skills, interests, projects and preferred role so teams know what you bring.',
  },
  {
    icon: Search,
    title: 'Discover Teammates',
    text: 'Search and filter students by skill, branch, year and availability with smart match scores.',
  },
  {
    icon: UsersRound,
    title: 'Build Your Team',
    text: 'Create a team, list open roles, send invitations and review join requests in one place.',
  },
  {
    icon: Rocket,
    title: 'Participate and Innovate',
    text: 'Pick a competition, collaborate with your new team and ship something you are proud of.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="How it works"
        title="From solo idea to winning team in four steps"
        description="HackMate replaces scattered WhatsApp groups with a focused space built for team formation."
      />
      <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <s.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

const features = [
  { icon: Zap, title: 'Skill-Based Matching', text: 'Transparent match scores compare skills, roles, interests and availability.' },
  { icon: SlidersHorizontal, title: 'Smart Teammate Search', text: 'Filter by skill, college, branch, year, experience and role instantly.' },
  { icon: Users, title: 'Team Creation', text: 'Spin up a team with open roles, required skills and a project pitch.' },
  { icon: Trophy, title: 'Competition Discovery', text: 'Browse hackathons, ideathons and challenges and form teams around them.' },
  { icon: Network, title: 'Student Networking', text: 'Explore profiles with projects, past hackathons and skill proficiency.' },
  { icon: Mail, title: 'Team Invitations', text: 'Send invites, accept requests and track every status in one inbox.' },
]

export function Features() {
  return (
    <section className="relative border-y border-border bg-surface/60 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to assemble the right team"
          description="Designed for students who want complementary skills, not just familiar faces."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-indigo-500/25">
                <f.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  {
    name: 'Sanya Kulkarni',
    meta: 'Demo profile · Third Year, IT',
    quote:
      'I had the idea but no backend developer. Within a day I found two teammates whose skills filled every gap on our team.',
    color: 2,
  },
  {
    name: 'Nikhil Deshpande',
    meta: 'Demo profile · Second Year, Computer Engg.',
    quote: 'The match score explained why someone was a good fit. It made reaching out to strangers way less awkward.',
    color: 1,
  },
  {
    name: 'Aisha Khan',
    meta: 'Demo profile · Final Year, AI & DS',
    quote: 'Managing join requests and invites in one place saved our team hours of back-and-forth messages.',
    color: 4,
  },
]

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Testimonials"
        title="Loved by student builders"
        description="Illustrative quotes from fictional demo student profiles."
      />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <blockquote className="flex-1 text-sm leading-relaxed text-pretty">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Avatar name={t.name} color={t.color} size="sm" />
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.meta}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function CallToAction() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center text-white sm:px-12">
        <div className="pointer-events-none absolute -top-20 -right-10 size-72 rounded-full bg-cyan-300/30 blur-3xl" />
        <Compass className="mx-auto size-10 opacity-90" aria-hidden="true" />
        <h2 className="relative mt-4 text-3xl font-semibold sm:text-4xl text-balance">Your next team is one search away.</h2>
        <p className="relative mx-auto mt-3 max-w-xl text-white/80 text-pretty">
          Jump in with the demo student account and try the full flow — search, invite, create and join.
        </p>
        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton
            href="/login"
            size="lg"
            variant="secondary"
            className="border-white bg-white text-indigo-700 hover:bg-white/90"
          >
            Try the Demo
            <ArrowRight aria-hidden="true" />
          </LinkButton>
          <LinkButton
            href="/signup"
            size="lg"
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10"
          >
            Create an Account
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
