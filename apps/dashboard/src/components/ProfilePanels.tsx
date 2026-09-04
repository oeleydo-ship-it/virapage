import type { User } from '@uidesired/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { authApi, type AccountSession } from '../lib/auth'
import { timeAgo } from '../lib/timeAgo'
import { Badge, Button, Card, Input, Label } from '../ui/primitives'

/** Laravel puts the first validation failure in `message`, which is the useful one. */
function messageOf(error: unknown): string {
  return error instanceof Error && error.message ? error.message : 'Something went wrong.'
}

function initialsOf(name?: string | null): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

/**
 * Name, email and picture.
 *
 * Changing the email address un-verifies the account, so the form says as much
 * before it is submitted rather than surprising someone with a lost badge.
 */
export function ProfileCard({ me }: { me?: User }) {
  const qc = useQueryClient()
  const fileInput = useRef<HTMLInputElement>(null)
  // Null means untouched, so the field simply shows whatever the account says.
  // Holding a copy in state instead would need an effect to seed it, and would
  // show a stale value for the moment between mount and the account loading.
  const [nameDraft, setNameDraft] = useState<string | null>(null)
  const [emailDraft, setEmailDraft] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const name = nameDraft ?? me?.name ?? ''
  const email = emailDraft ?? me?.email ?? ''
  const emailChanged = Boolean(me) && email.trim() !== me?.email
  const nameChanged = Boolean(me) && name.trim() !== me?.name
  const needsPassword = emailChanged && me?.has_password !== false

  const refresh = () => qc.invalidateQueries({ queryKey: ['me'] })

  const save = useMutation({
    mutationFn: () =>
      authApi.updateProfile({
        ...(nameChanged ? { name: name.trim() } : {}),
        ...(emailChanged ? { email: email.trim() } : {}),
        ...(needsPassword ? { current_password: currentPassword } : {}),
      }),
    onSuccess: () => {
      setError('')
      setNameDraft(null)
      setEmailDraft(null)
      setCurrentPassword('')
      setNotice(emailChanged ? 'Saved. Check your new address for a verification link.' : 'Profile updated.')
      void refresh()
    },
    onError: (err) => {
      setNotice('')
      setError(messageOf(err))
    },
  })

  const upload = useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),
    onSuccess: () => {
      setError('')
      setNotice('Picture updated.')
      void refresh()
    },
    onError: (err) => {
      setNotice('')
      setError(messageOf(err))
    },
  })

  const removePicture = useMutation({
    mutationFn: () => authApi.removeAvatar(),
    onSuccess: () => {
      setError('')
      setNotice('Picture removed.')
      void refresh()
    },
    onError: (err) => setError(messageOf(err)),
  })

  const busy = save.isPending || upload.isPending || removePicture.isPending

  return (
    <Card className="max-w-xl space-y-4">
      <div>
        <h2 className="font-medium text-white">Profile</h2>
        <p className="text-sm text-zinc-500">How you appear across the app.</p>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}

      <div className="flex items-center gap-4">
        {me?.avatar_url ? (
          <img src={me.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-lg font-medium text-zinc-300">
            {initialsOf(me?.name)}
          </span>
        )}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button variant="outline" disabled={busy} onClick={() => fileInput.current?.click()}>
              {upload.isPending ? 'Uploading…' : 'Change picture'}
            </Button>
            {me?.avatar_url ? (
              <Button variant="ghost" disabled={busy} onClick={() => removePicture.mutate()}>
                Remove
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-zinc-500">PNG, JPEG, WebP or GIF, up to 2 MB.</p>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            // Reset first, so picking the same file twice still fires a change.
            e.target.value = ''
            if (file) upload.mutate(file)
          }}
        />
      </div>

      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setNameDraft(e.target.value)} />
      </div>

      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={(e) => setEmailDraft(e.target.value)} />
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          {me?.email_verified ? <Badge tone="success">verified</Badge> : <Badge tone="warning">pending</Badge>}
          {emailChanged ? (
            <span className="text-amber-400">Changing this signs you out of nothing, but you will need to verify the new address.</span>
          ) : null}
        </div>
      </div>

      {needsPassword ? (
        <div>
          <Label>Current password</Label>
          <Input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <p className="mt-1.5 text-xs text-zinc-500">Required to move the account to a different email address.</p>
        </div>
      ) : null}

      <Button
        disabled={busy || (!nameChanged && !emailChanged) || (needsPassword && !currentPassword)}
        onClick={() => save.mutate()}
      >
        {save.isPending ? 'Saving…' : 'Save profile'}
      </Button>
    </Card>
  )
}

/**
 * Change or set the account password.
 *
 * Accounts created through Google have a generated password nobody has seen,
 * so this offers to *set* one instead of asking them to confirm it.
 */
export function PasswordCard({ me }: { me?: User }) {
  const qc = useQueryClient()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const hasPassword = me?.has_password !== false
  const mismatch = confirm.length > 0 && next !== confirm

  const change = useMutation({
    mutationFn: () =>
      authApi.updatePassword({
        ...(hasPassword ? { current_password: current } : {}),
        password: next,
        password_confirmation: confirm,
      }),
    onSuccess: (result) => {
      setError('')
      setCurrent('')
      setNext('')
      setConfirm('')
      const others = result?.sessions_signed_out ?? 0
      setNotice(
        others > 0
          ? `Password updated. ${others} other ${others === 1 ? 'session was' : 'sessions were'} signed out.`
          : 'Password updated.',
      )
      void qc.invalidateQueries({ queryKey: ['me'] })
      void qc.invalidateQueries({ queryKey: ['account-sessions'] })
    },
    onError: (err) => {
      setNotice('')
      setError(messageOf(err))
    },
  })

  return (
    <Card className="max-w-xl space-y-4">
      <div>
        <h2 className="font-medium text-white">{hasPassword ? 'Password' : 'Set a password'}</h2>
        <p className="text-sm text-zinc-500">
          {hasPassword
            ? 'Changing your password signs out every other device.'
            : 'You signed up with Google. Set a password to also sign in with your email address.'}
        </p>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}

      {hasPassword ? (
        <div>
          <Label>Current password</Label>
          <Input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
      ) : null}

      <div>
        <Label>New password</Label>
        <Input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
        <p className="mt-1.5 text-xs text-zinc-500">At least 8 characters.</p>
      </div>

      <div>
        <Label>Confirm new password</Label>
        <Input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {mismatch ? <p className="mt-1.5 text-xs text-red-400">Those two do not match.</p> : null}
      </div>

      <Button
        disabled={change.isPending || (hasPassword && !current) || next.length < 8 || next !== confirm}
        onClick={() => change.mutate()}
      >
        {change.isPending ? 'Saving…' : hasPassword ? 'Change password' : 'Set password'}
      </Button>
    </Card>
  )
}

/** Everywhere this account is signed in, and a way to end the other sessions. */
export function SessionsCard() {
  const qc = useQueryClient()
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const sessions = useQuery({ queryKey: ['account-sessions'], queryFn: authApi.sessions })

  const revoke = useMutation({
    mutationFn: () => authApi.revokeSessions(),
    onSuccess: (result) => {
      setError('')
      const count = result?.sessions_signed_out ?? 0
      setNotice(count > 0 ? `Signed out ${count} other ${count === 1 ? 'session' : 'sessions'}.` : 'No other sessions were active.')
      void qc.invalidateQueries({ queryKey: ['account-sessions'] })
    },
    onError: (err) => {
      setNotice('')
      setError(messageOf(err))
    },
  })

  const rows: AccountSession[] = sessions.data ?? []
  const others = rows.filter((row) => !row.current).length

  return (
    <Card className="max-w-xl space-y-4">
      <div>
        <h2 className="font-medium text-white">Signed-in devices</h2>
        <p className="text-sm text-zinc-500">
          {others > 0
            ? `Signed in on ${rows.length} ${rows.length === 1 ? 'device' : 'devices'}. End any session you do not recognise.`
            : 'This is the only device signed in.'}
        </p>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}

      {sessions.isLoading ? <p className="text-sm text-zinc-500">Loading…</p> : null}

      <ul className="max-h-80 divide-y divide-zinc-800 overflow-y-auto pr-1">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 py-2.5">
            <div>
              <p className="text-sm text-zinc-200">{row.kind}</p>
              <p className="text-xs text-zinc-500">
                {row.last_used_at ? `Last used ${timeAgo(row.last_used_at)}` : 'Not used yet'}
                {row.created_at ? ` · started ${timeAgo(row.created_at)}` : ''}
              </p>
            </div>
            {row.current ? <Badge tone="success">this device</Badge> : null}
          </li>
        ))}
      </ul>

      <Button variant="outline" disabled={revoke.isPending || others === 0} onClick={() => revoke.mutate()}>
        {revoke.isPending ? 'Signing out…' : 'Sign out other devices'}
      </Button>
    </Card>
  )
}
