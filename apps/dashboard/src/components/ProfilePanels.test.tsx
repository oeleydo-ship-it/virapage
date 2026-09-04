import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { User } from '@uidesired/types'
import { PasswordCard, ProfileCard } from './ProfilePanels'

vi.mock('../lib/auth', () => ({
  authApi: {
    updateProfile: vi.fn(),
    updatePassword: vi.fn(),
    uploadAvatar: vi.fn(),
    removeAvatar: vi.fn(),
    sessions: vi.fn(async () => []),
    revokeSessions: vi.fn(),
  },
}))

function wrap(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

const account = { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', email_verified: true, has_password: true } as User

const button = (name: RegExp | string) => screen.getByRole('button', { name }) as HTMLButtonElement

describe('ProfileCard', () => {
  it('shows the account values without needing them copied into state first', () => {
    wrap(<ProfileCard me={account} />)
    expect(screen.getByDisplayValue('Ada Lovelace')).toBeTruthy()
    expect(screen.getByDisplayValue('ada@example.com')).toBeTruthy()
  })

  it('keeps Save disabled until something actually changes', () => {
    wrap(<ProfileCard me={account} />)
    expect(button(/save profile/i).disabled).toBe(true)

    fireEvent.change(screen.getByDisplayValue('Ada Lovelace'), { target: { value: 'Ada L' } })
    expect(button(/save profile/i).disabled).toBe(false)
  })

  it('asks for the current password only when the email is being changed', () => {
    wrap(<ProfileCard me={account} />)
    expect(screen.queryByText('Required to move the account to a different email address.')).toBeNull()

    fireEvent.change(screen.getByDisplayValue('ada@example.com'), { target: { value: 'new@example.com' } })
    expect(screen.getByText('Required to move the account to a different email address.')).toBeTruthy()
    // ...and refuses to submit until it is given.
    expect(button(/save profile/i).disabled).toBe(true)
  })

  it('does not ask a Google account to confirm a password it never chose', () => {
    wrap(<ProfileCard me={{ ...account, has_password: false, google_connected: true }} />)
    fireEvent.change(screen.getByDisplayValue('ada@example.com'), { target: { value: 'new@example.com' } })

    expect(screen.queryByText('Required to move the account to a different email address.')).toBeNull()
    expect(button(/save profile/i).disabled).toBe(false)
  })

  it('falls back to initials when there is no picture', () => {
    wrap(<ProfileCard me={account} />)
    expect(screen.getByText('AL')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /remove/i })).toBeNull()
  })

  it('offers to remove a picture once one is set', () => {
    wrap(<ProfileCard me={{ ...account, avatar_url: 'https://example.test/me.png' }} />)
    expect(screen.getByRole('button', { name: /remove/i })).toBeTruthy()
  })
})

describe('PasswordCard', () => {
  it('requires the current password, a long enough new one, and a match', () => {
    wrap(<PasswordCard me={account} />)
    const submit = () => button(/change password/i)
    expect(submit().disabled).toBe(true)

    const inputs = document.querySelectorAll('input[type="password"]')
    expect(inputs).toHaveLength(3)

    fireEvent.change(inputs[0], { target: { value: 'current-one' } })
    fireEvent.change(inputs[1], { target: { value: 'short' } })
    fireEvent.change(inputs[2], { target: { value: 'short' } })
    expect(submit().disabled).toBe(true)

    fireEvent.change(inputs[1], { target: { value: 'a-long-enough-password' } })
    fireEvent.change(inputs[2], { target: { value: 'a-different-password' } })
    expect(screen.getByText('Those two do not match.')).toBeTruthy()
    expect(submit().disabled).toBe(true)

    fireEvent.change(inputs[2], { target: { value: 'a-long-enough-password' } })
    expect(submit().disabled).toBe(false)
  })

  it('offers to set a first password for a Google account, with no current-password field', () => {
    wrap(<PasswordCard me={{ ...account, has_password: false, google_connected: true }} />)

    expect(screen.getByText('Set a password')).toBeTruthy()
    expect(document.querySelectorAll('input[type="password"]')).toHaveLength(2)

    const inputs = document.querySelectorAll('input[type="password"]')
    fireEvent.change(inputs[0], { target: { value: 'my-first-password' } })
    fireEvent.change(inputs[1], { target: { value: 'my-first-password' } })
    expect(button(/set password/i).disabled).toBe(false)
  })

  it('warns that changing the password ends the other sessions', () => {
    wrap(<PasswordCard me={account} />)
    expect(screen.getByText('Changing your password signs out every other device.')).toBeTruthy()
  })
})
