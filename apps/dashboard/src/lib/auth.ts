import type { AuthPayload, User, Workspace } from '@uidesired/types'
import { clearSession, http, setSession } from './api'

export const authApi = {
  register: (body: { name: string; email: string; password: string; password_confirmation: string }) =>
    http.post<AuthPayload>('/auth/register', body),
  login: (body: { email: string; password: string }) => http.post<AuthPayload>('/auth/login', body),
  logout: () => http.post('/auth/logout'),
  user: () => http.get<User>('/auth/user'),
  resendVerification: () => http.post('/auth/email/resend'),
  forgotPassword: (email: string) => http.post('/auth/forgot-password', { email }),
  resetPassword: (body: { token: string; email: string; password: string; password_confirmation: string }) =>
    http.post('/auth/reset-password', body),
  googleStatus: () => http.get<{ enabled: boolean }>('/auth/google'),
  googleRedirect: () => http.get<{ url: string }>('/auth/google/redirect'),

  updateProfile: (body: { name?: string; email?: string; current_password?: string }) =>
    http.patch<User>('/auth/profile', body),
  updatePassword: (body: { current_password?: string; password: string; password_confirmation: string }) =>
    http.put<{ sessions_signed_out: number }>('/auth/password', body),
  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return http.upload<{ avatar_url: string }>('/auth/avatar', form)
  },
  removeAvatar: () => http.delete<{ avatar_url: null }>('/auth/avatar'),
  sessions: () => http.get<AccountSession[]>('/auth/sessions'),
  revokeSessions: () => http.delete<{ sessions_signed_out: number }>('/auth/sessions'),
}

export interface AccountSession {
  id: number
  name: string
  kind: string
  last_used_at: string | null
  created_at: string | null
  current: boolean
}

export function persistAuth(payload: AuthPayload) {
  const user = unwrapMaybe<User>(payload.user)
  const workspaces = unwrapMaybe<Workspace[]>(payload.workspaces)
  const list = Array.isArray(workspaces) ? workspaces : []
  const first = list[0]
  const workspaceId = user?.current_workspace_id ?? first?.id
  setSession(payload.token, workspaceId)
}

function unwrapMaybe<T>(value: unknown): T {
  if (value && typeof value === 'object' && 'data' in (value as object)) {
    return (value as { data: T }).data
  }
  return value as T
}

export async function logoutAndClear() {
  try {
    await authApi.logout()
  } catch {
    /* ignore */
  }
  clearSession()
}

export type { User, Workspace }
