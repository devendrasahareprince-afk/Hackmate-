import { ArrowRight, Sparkles, UserPlus } from 'lucide-react'
import { LinkButton } from '@/components/kit/button'
import { HeroVisual } from './hero-visual'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-[120px] dark:bg-indigo-500/20" />
      <div className="pointer-events-none absolute top-40 -right-40 h-80 w-80 rounded-full bg-cyan-400/15 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-2 lg:pt-24 lg:pb-28">
        <div className="flex flex-col items-start">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-brand-cyan" aria-hidden="true" />
            Great Ideas Need Great Teams.
          </span>
          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl text-balance">
            Find Your Perfect <span className="text-gradient">Hackathon Team.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg text-pretty">
            Connect with talented students, discover complementary skills, and build winning teams for hackathons,
            ideathons, and competitions.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <LinkButton href="/teammates" size="lg">
              Find Teammates
              <ArrowRight aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/teams/new" size="lg" variant="secondary">
              <UserPlus aria-hidden="true" />
              Create Your Team
            </LinkButton>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            No sign-up needed to explore — use <span className="font-medium text-foreground">Continue as Demo Student</span>{' '}
            on the login page.
          </p>
        </div>
        <HeroVisual />
      </div>
    </section>
  )
}
