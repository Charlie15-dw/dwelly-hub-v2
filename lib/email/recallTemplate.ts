export interface RecallEmailData {
  name: string
  assessmentTitle: string
  intervalDays: number
  quizLink: string
}

export function buildRecallEmail(data: RecallEmailData): { subject: string; html: string } {
  const { name, assessmentTitle, intervalDays, quizLink } = data
  const firstName = name.split(' ')[0]

  const intervalLabel =
    intervalDays === 3  ? '3-day'  :
    intervalDays === 7  ? '7-day'  :
    intervalDays === 30 ? '30-day' : `${intervalDays}-day`

  const subject = `Your ${intervalLabel} recall check is ready — ${assessmentTitle}`

  const intervalMessage =
    intervalDays === 3
      ? "It's been 3 days since you passed — the perfect time for a quick recall check before the knowledge starts to fade."
      : intervalDays === 7
        ? "A week has passed since you completed this assessment. Research shows this is an ideal time to revisit the material."
        : "It's been 30 days — your final spaced repetition check for this topic. Completing it cements the knowledge for the long term."

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
              <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Spaced Repetition — Recall Check</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">

              <!-- Interval badge -->
              <div style="display:inline-block;background:#fef3c7;border:1px solid #fde68a;border-radius:99px;padding:4px 14px;margin-bottom:20px;">
                <span style="font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;">${intervalLabel} check</span>
              </div>

              <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0a1628;">Time for your recall check, ${firstName}</h1>
              <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">${intervalMessage}</p>

              <!-- Module card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Assessment</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#0a1628;">${assessmentTitle}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
                The recall check is <strong>3 questions</strong> and takes under 2 minutes.
                It won't affect your assessment score — it's purely to help the knowledge stick.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#f97316;border-radius:8px;">
                    <a href="${quizLink}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:-0.1px;">Start recall check →</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
                Spaced repetition is proven to improve long-term retention.
                By completing all three recall checks (3, 7, and 30 days), you help ensure compliance knowledge
                stays sharp beyond initial training.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-radius:0 0 12px 12px;padding:20px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                © ${new Date().getFullYear()} Dwelly · Automated recall check from the Dwelly Training Portal.<br/>
                You are receiving this because you recently passed an assessment in the Dwelly Professional Development Programme.
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
