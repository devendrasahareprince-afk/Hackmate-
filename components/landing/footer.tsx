'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/brand'
import { Modal } from '@/components/kit/modal'

const info: Record<string, { title: string; body: string }> = {
  about: {
    title: 'About HackMate',
    body: 'HackMate is a student-focused team formation platform that helps college students find teammates with the right skills for hackathons, ideathons and coding competitions. This is a working prototype built for demonstration.',
  },
  contact: {
    title: 'Contact',
    body: 'This is a prototype, so there is no live support inbox yet. For a real deployment, a contact form or email such as hello@hackmate.example would live here.',
  },
  privacy: {
    title: 'Privacy',
    body: 'In this prototype, all data — including accounts you create — is stored only in your browser via localStorage. Nothing is sent to a server. Clearing your browser data removes it.',
  },
  terms: {
    title: 'Terms',
    body: 'HackMate is provided as a demonstration prototype. Student profiles, teams, competitions and statistics are fictional sample data and should not be treated as real events or people.',
  },
}

export function Footer() {
  const [open, setOpen] = useState<keyof typeof info | null>(null)
  const active = open ? info[open] : null

  const item = (key: keyof typeof info, label: string) => (
    <li>
      <button type="button" onClick={() => setOpen(key)} className="text-sm text-muted-foreground hover:text-foreground">
        {label}
      </button>
    </li>
  )

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">Great Ideas Need Great Teams.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {item('about', 'About HackMate')}
              {item('contact', 'Contact')}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/competitions" className="text-sm text-muted-foreground hover:text-foreground">
                  Competitions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {item('privacy', 'Privacy')}
              {item('terms', 'Terms')}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © 2026 HackMate · Prototype with fictional demo data
      </div>
      <Modal open={!!active} onClose={() => setOpen(null)} title={active?.title ?? ''}>
        <p className="text-sm leading-relaxed text-muted-foreground">{active?.body}</p>
      </Modal>
    </footer>
  )
}
