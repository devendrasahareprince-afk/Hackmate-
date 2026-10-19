import { Trophy } from 'lucide-react'
import { Avatar } from '@/components/kit/primitives'
import { cn } from '@/lib/utils'

const people = [
  { name: 'Rahul Sharma', role: 'Backend', skill: 'Node.js', match: 92, color: 0, pos: 'left-0 top-4' },
  { name: 'Priya Patil', role: 'UI/UX', skill: 'Figma', match: 88, color: 2, pos: 'right-0 top-0' },
  { name: 'Aditya Kulkarni', role: 'AI/ML', skill: 'Python', match: 85, color: 1, pos: 'left-2 bottom-6' },
  { name: 'Ananya Iyer', role: 'Pitch', skill: 'Presentation', match: 79, color: 5, pos: 'right-2 bottom-2' },
]

const tags = [
  { label: 'React', pos: 'left-[30%] top-0', delay: '0s' },
  { label: 'Python', pos: 'right-[28%] top-[24%]', delay: '1.2s' },
  { label: 'AI/ML', pos: 'left-[-4%] top-[44%]', delay: '0.6s' },
  { label: 'UI/UX', pos: 'right-[-2%] top-[48%]', delay: '1.8s' },
  { label: 'Node.js', pos: 'left-[26%] bottom-[2%]', delay: '0.9s' },
  { label: 'Java', pos: 'right-[30%] bottom-[24%]', delay: '2.4s' },
]

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hm-line" x1="0" x2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {[
          [22, 16],
          [80, 12],
          [20, 82],
          [80, 86],
        ].map(([x, y]) => (
          <line
            key={`${x}-${y}`}
            x1="50"
            y1="50"
            x2={x}
            y2={y}
            stroke="url(#hm-line)"
            strokeWidth="0.35"
            strokeDasharray="1.4 1.2"
          />
        ))}
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="0.3" />
      </svg>

      <div className="absolute top-1/2 left-1/2 w-56 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-primary/40 bg-card/90 p-4 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <Trophy className="size-4" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold">Code Warriors</p>
            <p className="text-[11px] text-muted-foreground">CodeSprint Hackathon</p>
          </div>
        </div>
        <div className="mt-3 flex -space-x-2">
          {people.map((p) => (
            <Avatar key={p.name} name={p.name} color={p.color} size="sm" />
          ))}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/3 rounded-full bg-brand-gradient" />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">4 / 6 members · 2 roles open</p>
      </div>

      {people.map((p) => (
        <div
          key={p.name}
          className={cn(
            'glass absolute flex w-44 items-center gap-2.5 rounded-xl p-2.5 shadow-xl sm:w-48',
            p.pos,
          )}
        >
          <Avatar name={p.name} color={p.color} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{p.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {p.role} · {p.skill}
            </p>
          </div>
          <span className="rounded-md bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">{p.match}%</span>
        </div>
      ))}

      {tags.map((t) => (
        <span
          key={t.label}
          style={{ animationDelay: t.delay }}
          className={cn(
            'animate-float absolute hidden rounded-full border border-primary/30 bg-background/80 px-3 py-1 text-xs font-medium text-foreground shadow-lg backdrop-blur sm:inline-flex',
            t.pos,
          )}
        >
          {t.label}
        </span>
      ))}
    </div>
  )
}
