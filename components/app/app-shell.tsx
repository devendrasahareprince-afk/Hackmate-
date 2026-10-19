'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Compass,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Search,
  Settings,
  Trophy,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { Logo, ThemeToggle } from '@/components/brand'
import { Avatar, Spinner } from '@/components/kit/primitives'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/teammates', label: 'Find Teammates', icon: Search },
  { href: '/teams', label: 'Explore Teams', icon: Compass },
  { href: '/my-teams', label: 'My Teams', icon: Users },
  { href: '/competitions', label: 'Competitions', icon: Trophy },
  { href: '/invitations', label: 'Invitations', icon: Mail },
  { href: '/profile', label: 'My Profile', icon: UserRound },
  { href: '/settings', label: 'Settings', icon: Settings },
]

function isActive(pathname: string, href: string) {
  if (href === '/teams') return pathname === '/teams' || (pathname.startsWith('/teams/') && pathname !== '/teams/new')
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLinks({ onNavigate, pendingCount }: { onNavigate?: () => void; pendingCount: number }) {
  const pathname = usePathname()
  return (
    <nav aria-label="App" className="flex flex-col gap-1">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary/12 text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon
              className={cn('size-4.5', active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')}
              aria-hidden="true"
            />
            {label}
            {href === '/invitations' && pendingCount > 0 && (
              <span className="ml-auto rounded-full bg-brand-gradient px-2 text-xs font-semibold text-white">
                {pendingCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { hydrated, currentUser, state, logout } = useStore()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const loggingOut = useRef(false)

  useEffect(() => {
    if (hydrated && !currentUser && !loggingOut.current) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
  }, [hydrated, currentUser, pathname, router])

  if (!hydrated || !currentUser) return <Spinner label="Loading your workspace" />

  const ledIds = new Set(state.teams.filter((t) => t.leaderId === currentUser.id).map((t) => t.id))
  const pendingCount =
    state.invitations.filter((i) => i.toId === currentUser.id && i.status === 'pending').length +
    state.joinRequests.filter((r) => ledIds.has(r.teamId) && r.status === 'pending').length

  const handleLogout = () => {
    loggingOut.current = true
    logout()
    router.push('/')
  }

  const userBlock = (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
      <Avatar name={currentUser.name} color={currentUser.color} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{currentUser.name}</p>
        <p className="truncate text-xs text-muted-foreground">{currentUser.branch}</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        aria-label="Log out"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  )

  return (
    <div className="min-h-dvh lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-surface p-4 lg:flex">
        <div className="px-2 py-2">
          <Logo href="/dashboard" />
        </div>
        <div className="mt-6 flex-1 overflow-y-auto">
          <NavLinks pendingCount={pendingCount} />
        </div>
        {userBlock}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="relative flex h-full w-72 max-w-[85%] flex-col border-r border-border bg-surface p-4 animate-in slide-in-from-left">
            <div className="flex items-center justify-between px-2 py-2">
              <Logo href="/dashboard" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <NavLinks pendingCount={pendingCount} onNavigate={() => setOpen(false)} />
            </div>
            {userBlock}
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <Logo href="/dashboard" className="lg:hidden" />
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/invitations"
            className="relative inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Invitations${pendingCount ? `, ${pendingCount} pending` : ''}`}
          >
            <Mail className="size-4" aria-hidden="true" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-brand-cyan text-[10px] leading-4 font-bold text-slate-950">
                {pendingCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <Link href="/profile" aria-label="My profile" className="hidden sm:block">
            <Avatar name={currentUser.name} color={currentUser.color} size="sm" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
    </div>
  )
}
