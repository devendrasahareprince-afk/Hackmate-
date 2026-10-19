'use client'

import { useState } from 'react'
import { Inbox } from 'lucide-react'
import { RequestStatusBadge } from '@/components/app/badges'
import { Button } from '@/components/kit/button'
import { Card, EmptyState, PageHeader, Tabs } from '@/components/kit/primitives'
import { formatDate } from '@/lib/helpers'
import { useStore } from '@/lib/store'

type Tab = 'received' | 'requests' | 'sent' | 'mine'

function Item({ children, status, date }: { children: React.ReactNode; status: React.ReactNode; date: string }) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex items-center gap-3">
        <span className="text-xs whitespace-nowrap text-muted-foreground">{formatDate(date)}</span>
        {status}
      </div>
    </div>
  )
}

export function InvitationsView() {
  const { state, currentUser, getStudent, getTeam, respondInvitation, cancelInvitation, respondJoinRequest, cancelJoinRequest } = useStore()
  const [tab, setTab] = useState<Tab>('received')
  if (!currentUser) return null
  const me = currentUser.id
  const ledIds = state.teams.filter((t) => t.leaderId === me).map((t) => t.id)

  const received = state.invitations.filter((i) => i.toId === me)
  const sent = state.invitations.filter((i) => i.fromId === me)
  const requests = state.joinRequests.filter((r) => ledIds.includes(r.teamId))
  const mine = state.joinRequests.filter((r) => r.studentId === me)
  const pending = <T extends { status: string }>(list: T[]) => list.filter((x) => x.status === 'pending').length

  const empty = (
    <EmptyState icon={Inbox} title="Nothing here yet" description="Invitations and requests will appear in this tab." />
  )

  return (
    <div>
      <PageHeader title="Invitations & Requests" description="Respond to invitations, review join requests and track what you have sent." />
      <div className="mb-6 overflow-x-auto">
        <Tabs<Tab>
          label="Invitation views"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'received', label: 'Received', count: pending(received) },
            { value: 'requests', label: 'Join requests', count: pending(requests) },
            { value: 'sent', label: 'Sent', count: pending(sent) },
            { value: 'mine', label: 'My requests', count: pending(mine) },
          ]}
        />
      </div>

      {tab === 'received' &&
        (received.length ? (
          <Card className="divide-y divide-border">
            {received.map((i) => (
              <Item key={i.id} date={i.date} status={<RequestStatusBadge status={i.status} />}>
                <p className="text-sm">
                  <span className="font-medium">{getStudent(i.fromId)?.name ?? 'Someone'}</span> invited you to{' '}
                  <span className="font-medium">{getTeam(i.teamId)?.name ?? 'a team'}</span> as {i.role}
                </p>
                {i.message && <p className="mt-1 text-xs text-muted-foreground">“{i.message}”</p>}
                {i.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="success" onClick={() => respondInvitation(i.id, true)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => respondInvitation(i.id, false)}>
                      Decline
                    </Button>
                  </div>
                )}
              </Item>
            ))}
          </Card>
        ) : (
          empty
        ))}

      {tab === 'requests' &&
        (requests.length ? (
          <Card className="divide-y divide-border">
            {requests.map((r) => (
              <Item key={r.id} date={r.date} status={<RequestStatusBadge status={r.status} />}>
                <p className="text-sm">
                  <span className="font-medium">{getStudent(r.studentId)?.name ?? 'A student'}</span> wants to join{' '}
                  <span className="font-medium">{getTeam(r.teamId)?.name ?? 'your team'}</span> as {r.role}
                </p>
                {r.message && <p className="mt-1 text-xs text-muted-foreground">“{r.message}”</p>}
                {r.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="success" onClick={() => respondJoinRequest(r.id, true)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => respondJoinRequest(r.id, false)}>
                      Decline
                    </Button>
                  </div>
                )}
              </Item>
            ))}
          </Card>
        ) : (
          empty
        ))}

      {tab === 'sent' &&
        (sent.length ? (
          <Card className="divide-y divide-border">
            {sent.map((i) => (
              <Item key={i.id} date={i.date} status={<RequestStatusBadge status={i.status} />}>
                <p className="text-sm">
                  You invited <span className="font-medium">{getStudent(i.toId)?.name ?? 'someone'}</span> to{' '}
                  <span className="font-medium">{getTeam(i.teamId)?.name ?? 'a team'}</span> as {i.role}
                </p>
                {i.status === 'pending' && (
                  <Button size="sm" variant="ghost" className="mt-2" onClick={() => cancelInvitation(i.id)}>
                    Cancel invitation
                  </Button>
                )}
              </Item>
            ))}
          </Card>
        ) : (
          empty
        ))}

      {tab === 'mine' &&
        (mine.length ? (
          <Card className="divide-y divide-border">
            {mine.map((r) => (
              <Item key={r.id} date={r.date} status={<RequestStatusBadge status={r.status} />}>
                <p className="text-sm">
                  You asked to join <span className="font-medium">{getTeam(r.teamId)?.name ?? 'a team'}</span> as {r.role}
                </p>
                {r.status === 'pending' && (
                  <Button size="sm" variant="ghost" className="mt-2" onClick={() => cancelJoinRequest(r.id)}>
                    Cancel request
                  </Button>
                )}
              </Item>
            ))}
          </Card>
        ) : (
          empty
        ))}
    </div>
  )
}
