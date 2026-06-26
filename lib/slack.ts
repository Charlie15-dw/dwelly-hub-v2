// Minimal Slack Web API helper for sending direct-message reminders.
// Requires a Slack bot token (SLACK_BOT_TOKEN, "xoxb-…") with the scopes:
//   users:read.email   — look up a Slack user by their email address
//   chat:write         — post messages
//   im:write           — open a DM channel with a user
//
// Users are matched to Slack by the same email address they use to log in
// to the portal, so no extra mapping table is needed.

const SLACK_API = 'https://slack.com/api'

function token(): string | null {
  return process.env.SLACK_BOT_TOKEN ?? null
}

async function slackCall<T = Record<string, unknown>>(
  method: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string } & T> {
  const res = await fetch(`${SLACK_API}/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(body),
  })
  return res.json()
}

/** Look up a Slack user ID by their email address. Returns null if not found. */
export async function findSlackUserIdByEmail(email: string): Promise<string | null> {
  const res = await fetch(
    `${SLACK_API}/users.lookupByEmail?email=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${token()}` } },
  )
  const data = (await res.json()) as { ok: boolean; user?: { id: string } }
  return data.ok && data.user ? data.user.id : null
}

export type SlackSendResult =
  | { ok: true }
  | { ok: false; reason: 'no_token' | 'user_not_found' | 'send_failed'; detail?: string }

/**
 * Send a direct message to a portal user, matched to Slack by their login
 * email. Opens (or reuses) the DM channel, then posts the message.
 */
export async function sendSlackDirectMessage(
  email: string,
  message: string,
): Promise<SlackSendResult> {
  if (!token()) return { ok: false, reason: 'no_token' }

  const userId = await findSlackUserIdByEmail(email)
  if (!userId) return { ok: false, reason: 'user_not_found' }

  const dm = await slackCall<{ channel?: { id: string } }>('conversations.open', {
    users: userId,
  })
  if (!dm.ok || !dm.channel) {
    return { ok: false, reason: 'send_failed', detail: dm.error }
  }

  const posted = await slackCall('chat.postMessage', {
    channel: dm.channel.id,
    text: message,
  })
  if (!posted.ok) return { ok: false, reason: 'send_failed', detail: posted.error }

  return { ok: true }
}
