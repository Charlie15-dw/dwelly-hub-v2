export interface InviteData {
  inviteeName?: string | null
  inviteLink: string
  invitedBy?: string | null
}

export function buildInviteEmail(data: InviteData): { subject: string; html: string } {
  const { inviteeName, inviteLink, invitedBy } = data
  const firstName = (inviteeName ?? '').split(' ')[0] || 'there'
  const inviter = invitedBy ? ` by ${invitedBy}` : ''

  const subject = "You've been invited to the Dwelly Training Portal"

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
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
              <h1 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#0a1628;">Welcome to Dwelly Training</h1>
              <div style="font-size:15px;line-height:1.7;color:#475569;">
                <p>Hi ${firstName},</p>
                <p>You've been invited${inviter} to join the Dwelly Training Portal — your home for the Dwelly Professional Development Programme.</p>
                <p>Click the button below to set your password and access your training:</p>
              </div>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                <tr>
                  <td style="background:#f97316;border-radius:8px;">
                    <a href="${inviteLink}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:-0.1px;">Accept invite & set password →</a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
                If the button above doesn't work, copy and paste this link into your browser:<br/>
                <span style="word-break:break-all;color:#64748b;">${inviteLink}</span>
              </p>

              <p style="margin:20px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
                If you weren't expecting this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-radius:0 0 12px 12px;padding:20px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                © ${new Date().getFullYear()} Dwelly · Training Portal
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

  return { subject, html }
}
