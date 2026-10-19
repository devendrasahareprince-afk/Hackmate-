import { CheckCircle2 } from 'lucide-react'
import { Logo, ThemeToggle } from '@/components/brand'

const points = [
  'Discover students by skill, branch and availability',
  'Transparent rule-based match scores',
  'Create teams, invite members and manage requests',
]

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-border bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-indigo-500/25 blur-[100px]" />
        <div className="pointer-events-none absolute -top-20 right-0 size-72 rounded-full bg-cyan-400/15 blur-[90px]" />
        <Logo className="relative" />
        <div className="relative">
          <h2 className="text-4xl leading-tight font-semibold text-balance">
            Great ideas need <span className="text-gradient">great teams.</span>
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-cyan" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-muted-foreground">
          Prototype mode: accounts are simulated and stored only in your browser. This is not production-secure
          authentication.
        </p>
      </aside>
      <main className="flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  )
}
