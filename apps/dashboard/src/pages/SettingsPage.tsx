import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getWorkspaceId, setSession, getToken } from '../lib/api'
import { authApi } from '../lib/auth'
import { ProfileCard, PasswordCard, SessionsCard } from '../components/ProfilePanels'
import { billingApi, workspacesApi } from '../lib/endpoints'
import { Badge, Button, Card, Input, Label, PageHeader, TabPanel, Tabs } from '../ui/primitives'

export function SettingsPage() {
  const qc = useQueryClient()
  const workspaceId = Number(getWorkspaceId())
  // Null means untouched, so the field follows the workspace until it is
  // edited. Seeding a copy in state needs an effect and shows an empty box
  // for the moment between mount and the workspace list arriving.
  const [nameDraft, setNameDraft] = useState<string | null>(null)
  const [newWorkspace, setNewWorkspace] = useState('')
  const [tab, setTab] = useState('workspace')
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const me = useQuery({ queryKey: ['me'], queryFn: authApi.user })
  const workspaces = useQuery({ queryKey: ['workspaces'], queryFn: workspacesApi.list })
  const subscription = useQuery({ queryKey: ['subscription'], queryFn: billingApi.subscription })

  const current = (workspaces.data || []).find((workspace) => workspace.id === workspaceId)

  const name = nameDraft ?? current?.name ?? ''

  const rename = useMutation({
    mutationFn: () => workspacesApi.rename(workspaceId, name),
    onSuccess: () => {
      setError(null)
      setNameDraft(null)
      setNotice('Workspace name updated.')
      qc.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const create = useMutation({
    mutationFn: () => workspacesApi.create(newWorkspace),
    onSuccess: async (workspace) => {
      await workspacesApi.switch(workspace.id)
      setSession(getToken()!, workspace.id)
      window.location.assign('/')
    },
    onError: (err: Error) => setError(err.message),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Workspace identity, your account, and plan details." />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: 'workspace', label: 'Workspace' },
          { id: 'profile', label: 'Profile' },
          { id: 'security', label: 'Security' },
          { id: 'plan', label: 'Plan' },
        ]}
      />

      {error ? <div className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">{error}</div> : null}
      {notice ? (
        <div className="rounded-lg border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">{notice}</div>
      ) : null}

      <TabPanel id="workspace" active={tab === 'workspace'}>
        <Card className="max-w-xl space-y-3">
          <h2 className="font-medium text-white">Workspace</h2>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setNameDraft(e.target.value)} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={current?.slug ?? ''} disabled />
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            Your role: <Badge tone="info">{current?.role ?? '—'}</Badge>
          </div>
          <Button disabled={!name || name === current?.name || rename.isPending} onClick={() => rename.mutate()}>
            Save changes
          </Button>
        </Card>

        <Card className="max-w-xl space-y-3">
          <h2 className="font-medium text-white">Create a workspace</h2>
          <p className="text-sm text-zinc-500">Separate clients or projects with their own sites, team, and plan.</p>
          <Input placeholder="Acme Agency" value={newWorkspace} onChange={(e) => setNewWorkspace(e.target.value)} />
          <Button variant="outline" disabled={!newWorkspace || create.isPending} onClick={() => create.mutate()}>
            Create and switch
          </Button>
        </Card>
      </TabPanel>

      <TabPanel id="profile" active={tab === 'profile'}>
        <ProfileCard me={me.data} />
      </TabPanel>

      <TabPanel id="security" active={tab === 'security'}>
        <PasswordCard me={me.data} />
        <SessionsCard />
      </TabPanel>

      <TabPanel id="plan" active={tab === 'plan'}>
        <Card className="max-w-xl space-y-2">
          <h2 className="font-medium text-white">Plan</h2>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Current plan</span>
            <span className="text-zinc-200">{subscription.data?.plan?.name ?? '—'}</span>
          </div>
        </Card>
      </TabPanel>
    </div>
  )
}
