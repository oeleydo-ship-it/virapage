import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreditCard } from 'lucide-react'
import { useState } from 'react'
import { paymentsApi } from '../lib/endpoints'
import { Badge, Button, Card, Input, Label, Select } from '../ui/primitives'

const CURRENCIES = ['USD', 'GBP', 'EUR', 'AUD', 'CAD', 'AED', 'INR']

/**
 * The workspace's own Stripe account.
 *
 * Payments go straight to the workspace's Stripe account, never through ours,
 * so this lives in Settings rather than on the Products page - it is account
 * configuration, not something edited per catalogue.
 */
export function PaymentSettings() {
  const qc = useQueryClient()
  const settings = useQuery({ queryKey: ['payments'], queryFn: paymentsApi.get })
  const [secret, setSecret] = useState('')
  const [webhook, setWebhook] = useState('')
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  const save = useMutation({
    mutationFn: paymentsApi.update,
    onSuccess: () => {
      // Cleared so a key is never left sitting in the DOM after it is stored.
      setSecret('')
      setWebhook('')
      setMessage({ text: 'Saved.', ok: true })
      void qc.invalidateQueries({ queryKey: ['payments'] })
    },
    onError: (error: Error) => setMessage({ text: error.message, ok: false }),
  })

  const verify = useMutation({
    mutationFn: paymentsApi.verify,
    onSuccess: (result) => {
      setMessage({ text: result.message, ok: result.ok })
      void qc.invalidateQueries({ queryKey: ['payments'] })
    },
    onError: (error: Error) => setMessage({ text: error.message, ok: false }),
  })

  const disconnect = useMutation({
    mutationFn: paymentsApi.disconnect,
    onSuccess: () => {
      setMessage({ text: 'Disconnected.', ok: true })
      void qc.invalidateQueries({ queryKey: ['payments'] })
    },
  })

  const data = settings.data
  if (!data) return null

  return (
    <Card className="max-w-2xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-zinc-400" />
          <h2 className="text-sm font-semibold">Your Stripe account</h2>
        </div>
        <div className="flex items-center gap-2">
          {data.connected ? (
            <Badge tone={data.verified_at ? 'success' : 'neutral'}>
              {data.verified_at ? `Verified · ${data.mode}` : `Key stored · ${data.mode}`}
            </Badge>
          ) : (
            <Badge tone="neutral">Not connected</Badge>
          )}
        </div>
      </div>

      <p className="mb-4 text-xs text-zinc-500">
        Payments go straight to your own Stripe account. We never hold the money, and your keys are stored encrypted
        and never shown again.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Secret key</Label>
          <Input
            type="password"
            autoComplete="off"
            placeholder={data.connected ? `Stored · ends ${data.secret_hint}` : 'sk_live_… or sk_test_…'}
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
          />
          <p className="mt-1 text-[11px] text-zinc-500">Leave blank to keep the key you already saved.</p>
        </div>
        <div>
          <Label>Webhook signing secret</Label>
          <Input
            type="password"
            autoComplete="off"
            placeholder={data.webhook_set ? 'Stored' : 'whsec_…'}
            value={webhook}
            onChange={(event) => setWebhook(event.target.value)}
          />
          <p className="mt-1 text-[11px] text-zinc-500">From the webhook you add in Stripe, below.</p>
        </div>
      </div>

      <div className="mt-3">
        <Label>Send Stripe webhooks here</Label>
        {/* Read-only: this is the address to paste into Stripe, and it exists
            before any key has been entered. */}
        <Input readOnly value={data.webhook_url} onFocus={(event) => event.currentTarget.select()} />
        <p className="mt-1 text-[11px] text-zinc-500">
          In Stripe: Developers → Webhooks → Add endpoint, and send <code>checkout.session.completed</code>. Orders
          stay unpaid until this is set up.
        </p>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <Label>Default currency</Label>
          <Select
            value={data.currency}
            onChange={(event) => save.mutate({ currency: event.target.value })}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.enabled}
              onChange={(event) => save.mutate({ enabled: event.target.checked })}
            />
            Accept payments
          </label>
        </div>
      </div>

      {data.last_error ? <p className="mt-3 text-xs text-red-600">{data.last_error}</p> : null}
      {data.secret_unreadable ? (
        <p className="mt-3 text-xs text-amber-600">
          The stored key can no longer be read — this happens when APP_KEY changes. Enter it again.
        </p>
      ) : null}
      {message ? (
        <p className={`mt-3 text-xs ${message.ok ? 'text-emerald-600' : 'text-red-600'}`}>{message.text}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={() =>
            save.mutate({
              ...(secret ? { secret_key: secret } : {}),
              ...(webhook ? { webhook_secret: webhook } : {}),
            })
          }
          disabled={save.isPending || (!secret && !webhook)}
        >
          {save.isPending ? 'Saving…' : 'Save keys'}
        </Button>
        <Button variant="outline" onClick={() => verify.mutate()} disabled={verify.isPending || !data.connected}>
          {verify.isPending ? 'Checking…' : 'Test connection'}
        </Button>
        {data.connected ? (
          <Button variant="ghost" onClick={() => disconnect.mutate()} disabled={disconnect.isPending}>
            Disconnect
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
