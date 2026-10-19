'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Logo, ThemeToggle } from '@/components/brand'
import { LinkButton } from '@/components/kit/button'
import { useStore } from '@/lib/store'

const links = [
  { href: '/', label: 'Home' },
  { href: '/teammates', label: 'Find Teammates' },
  { href: '/teams', label: 'Explore Teams' },
  { href: '/competitions', label: 'Competitions' },
  { href: '/#how-it-works', label: 'How It Works' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { currentUser, hydrated } = useStore()
  const loggedIn = hydrated && !!currentUser

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            {loggedIn ? (
              <LinkButton href="/dashboard" size="sm">
                Go to Dashboard
              </LinkButton>
            ) : (
              <>
                <LinkButton href="/login" variant="ghost" size="sm">
                  Login
                </LinkButton>
                <LinkButton href="/signup" size="sm">
                  Get Started
                </LinkButton>
              </>
            )}
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-nav" className="border-t border-border bg-background px-4 pb-4 lg:hidden">
          <ul className="flex flex-col py-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            {loggedIn ? (
              <LinkButton href="/dashboard" className="flex-1">
                Go to Dashboard
              </LinkButton>
            ) : (
              <>
                <LinkButton href="/login" variant="outline" className="flex-1">
                  Login
                </LinkButton>
                <LinkButton href="/signup" className="flex-1">
                  Get Started
                </LinkButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
