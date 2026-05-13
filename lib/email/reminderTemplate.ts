export type ReminderType = 'not_started' | 'in_progress' | 'nearly_there'

export interface ReminderData {
  name: string
  email: string
  type: ReminderType
  assessmentsPassed: number
  totalAssessments: number
  daysSinceActivity: number | null
}

export function buildReminderEmail(data: ReminderData): { subject: string; html: string } {
  const { name, type, assessmentsPassed, totalAssessments } = data
  const firstName = name.split(' ')[0]
  const portalUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portal.dwelly.group'

  const subjects: Record<ReminderType, string> = {
    not_started:  'Your Dwelly training is waiting for you',
    in_progress:  'Keep going — your Dwelly assessments are in progress',
    nearly_there: "You're nearly there — finish your Dwelly training",
  }

  const headlines: Record<ReminderType, string> = {
    not_started:  "Your training is ready to go",
    in_progress:  "Pick up where you left off",
    nearly_there: "You're so close — finish strong",
  }

  const messages: Record<ReminderType, string> = {
    not_started: `
      <p>Hi ${firstName},</p>
      <p>Just a quick nudge — your Dwelly training programme is set up and ready for you, but we haven't seen you in the portal yet.</p>
      <p>The assessments are designed to be straightforward and you can work through them at your own pace. Getting started only takes a few minutes.</p>
    `,
    in_progress: `
      <p>Hi ${firstName},</p>
      <p>You've made a great start — you've passed <strong>${assessmentsPassed} out of ${totalAssessments}</strong> assessments so far. Well done.</p>
      <p>You haven't been active for a little while, so we wanted to send a friendly reminder to keep the momentum going. The remaining assessments cover topics that will make a real difference in your day-to-day role.</p>
    `,
    nearly_there: `
      <p>Hi ${firstName},</p>
      <p>You're almost there! You've passed <strong>${assessmentsPassed} out of ${totalAssessments}</strong> assessments — you're in the home straight.</p>
      <p>A quick session in the portal is all it takes to complete your training and earn your competency passport.</p>
    `,
  }

  const progressPct = totalAssessments > 0 ? Math.round((assessmentsPassed / totalAssessments) * 100) : 0
  const progressBarFill = Math.max(4, progressPct)

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subjects[type]}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0a1628;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Dwelly Training Portal</p>
              <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Professional Development Programme</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">
              <h1 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#0a1628;">${headlines[type]}</h1>
              <div style="font-size:15px;line-height:1.7;color:#475569;">
                ${messages[type]}
              </div>

              ${assessmentsPassed > 0 ? `
              <!-- Progress bar -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Your progress</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#e2e8f0;border-radius:99px;height:10px;overflow:hidden;">
                          <table width="${progressBarFill}%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background:#f97316;height:10px;border-radius:99px;"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:6px 0 0;font-size:13px;color:#64748b;">${assessmentsPassed} of ${totalAssessments} assessments passed (${progressPct}%)</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                <tr>
                  <td style="background:#f97316;border-radius:8px;">
                    <a href="${portalUrl}/assessments" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:-0.1px;">Go to my training →</a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
                If you have any questions or are having trouble accessing the portal, please reach out to your manager or contact the training team.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-radius:0 0 12px 12px;padding:20px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                © ${new Date().getFullYear()} Dwelly · This is an automated reminder from the training portal.<br/>
                You are receiving this because you are enrolled in the Dwelly Professional Development Programme.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  return { subject: subjects[type], html }
}
