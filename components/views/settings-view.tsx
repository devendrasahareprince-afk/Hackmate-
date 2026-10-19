'use client'

import { useState } from 'react'
import { Button } from '@/components/kit/button'
import { Toggle } from '@/components/kit/form'
import { Card, PageHeader } from '@/components/kit/primitives'
import { createSeedState } from '@/lib/data/seed'
import { useStore } from '@/lib/store'
import type { Settings } from '@/lib/types'

export function SettingsView() {
  const { state, currentUser, updateSettings, resetDemo } = useStore()
  const [draft, setDraft] = useState<Settings>(state.settings)
  if (!currentUser) return null

  const n = (k: keyof Settings['notifications']) => (v: boolean) => setDraft((d) => ({ ...d, notifications: { ...d.notifications, [k]: v } }))
  const p = (k: keyof Settings['privacy']) => (v: boolean) => setDraft((d) => ({ ...d, privacy: { ...d.privacy, [k]: v } }))
  const dirty = JSON.stringify(draft) !== JSON.stringify(state.settings)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader title="Settings" description="Preferences are saved only in this browser (prototype mode)." />

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {currentUser.email}</p>
      </Card>

      <Card className="divide-y divide-border p-6 py-3">
        <h2 className="py-3 text-lg font-semibold">Notifications</h2>
        <Toggle label="Invitations" description="When a team invites you" checked={draft.notifications.invitations} onChange={n('invitations')} />
        <Toggle label="Join requests" description="When someone asks to join your team" checked={draft.notifications.joinRequests} onChange={n('joinRequests')} />
        <Toggle label="Competitions" description="New competitions that match your skills" checked={draft.notifications.competitions} onChange={n('competitions')} />
        <Toggle label="Weekly digest" description="A weekly summary of activity" checked={draft.notifications.weeklyDigest} onChange={n('weeklyDigest')} />
      </Card>

      <Card className="divide-y divide-border p-6 py-3">
        <h2 className="py-3 text-lg font-semibold">Privacy</h2>
        <Toggle label="Discoverable" description="Appear in teammate search" checked={draft.privacy.discoverable} onChange={p('discoverable')} />
        <Toggle label="Show email" description="Show your email on your profile" checked={draft.privacy.showEmail} onChange={p('showEmail')} />
        <Toggle label="Show college" description="Show your college on your profile" checked={draft.privacy.showCollege} onChange={p('showCollege')} />
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" disabled={!dirty} onClick={() => setDraft(state.settings)}>
          Discard
        </Button>
        <Button disabled={!dirty} onClick={() => updateSettings(draft)}>
          Save preferences
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Demo data</h2>
        <p className="mt-1 text-sm text-muted-foreground">Restore the sample students, teams and invitations. Accounts you created are removed.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm('Reset all demo data? This cannot be undone.')) {
                resetDemo()
                setDraft(createSeedState().settings)
              }
            }}
          >
            Reset demo data
          </Button>
        </div>
      </Card>
    </div>
  )
}
