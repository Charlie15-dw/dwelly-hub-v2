#!/usr/bin/env python3
"""Generate the CRM 2.0 Compliance SOPs PDF (docs/CRM-2.0-Compliance-SOPs.pdf).

A simple, do-this / do-that operating procedure for the agent-led compliance
flow. Content is drawn straight from the live Hub learning space
(lib/crm2-content.ts): the main path, the human checkpoints, and the
stage-by-stage actions. Brand: Dwelly navy/orange.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, ListFlowable, ListItem, NextPageTemplate,
)

# ── Brand palette ───────────────────────────────────────────────────────────
NAVY   = colors.HexColor("#0B1F3A")
NAVY50 = colors.HexColor("#EEF2F8")
ORANGE = colors.HexColor("#F26A21")
INK    = colors.HexColor("#1C2A3A")
GREY   = colors.HexColor("#5A6b7b")
LINE   = colors.HexColor("#D9E1EC")
GREEN  = colors.HexColor("#1F7A46")
AMBER  = colors.HexColor("#B9770B")
AMBERBG= colors.HexColor("#FDF3E3")
GREENBG= colors.HexColor("#E9F5EE")
INFOBG = colors.HexColor("#EEF3FB")

OUT = "docs/CRM-2.0-Compliance-SOPs.pdf"

# ── Styles ──────────────────────────────────────────────────────────────────
ss = getSampleStyleSheet()

def style(name, **kw):
    return ParagraphStyle(name, parent=ss["Normal"], **kw)

H1     = style("H1", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=NAVY, spaceBefore=6, spaceAfter=6)
H2     = style("H2", fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=NAVY, spaceBefore=13, spaceAfter=4)
KICK   = style("Kick", fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=ORANGE, spaceAfter=2)
BODY   = style("Body", fontName="Helvetica", fontSize=10, leading=14.5, textColor=INK, spaceAfter=5)
LEAD   = style("Lead", fontName="Helvetica", fontSize=11, leading=16, textColor=GREY, spaceAfter=8)
BULLET = style("Bullet", fontName="Helvetica", fontSize=10, leading=14, textColor=INK)
STEP   = style("Step", fontName="Helvetica", fontSize=10, leading=14, textColor=INK)
CO     = style("Callout", fontName="Helvetica", fontSize=9.5, leading=13.5, textColor=INK)
COLBL  = style("CalloutLbl", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=colors.white)
CELLH  = style("CellH", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=colors.white)
CELL   = style("Cell", fontName="Helvetica", fontSize=9, leading=12.5, textColor=INK)
CELLB  = style("CellB", fontName="Helvetica-Bold", fontSize=9, leading=12.5, textColor=NAVY)
COVERT = style("CoverT", fontName="Helvetica-Bold", fontSize=30, leading=34, textColor=colors.white, alignment=TA_LEFT)
COVERS = style("CoverS", fontName="Helvetica", fontSize=13, leading=19, textColor=colors.HexColor("#C7D3E4"))
COVKICK= style("CoverKick", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=ORANGE)


def bullets(items, st=BULLET):
    return ListFlowable(
        [ListItem(Paragraph(t, st), leftIndent=6, value="•") for t in items],
        bulletType="bullet", bulletColor=ORANGE, bulletFontSize=8,
        leftIndent=12, spaceBefore=2, spaceAfter=8,
    )


def steps(items, st=STEP):
    return ListFlowable(
        [ListItem(Paragraph(t, st), leftIndent=4) for t in items],
        bulletType="1", bulletFormat="%s.", bulletColor=ORANGE,
        bulletFontName="Helvetica-Bold", bulletFontSize=10,
        leftIndent=16, spaceBefore=2, spaceAfter=8,
    )


def chip_table(rows, header, col_widths):
    data = [[Paragraph(h, CELLH) for h in header]]
    for r in rows:
        data.append([Paragraph(str(c), CELLB if i == 0 else CELL) for i, c in enumerate(r)])
    t = Table(data, colWidths=col_widths, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, NAVY50]),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


_CO = {
    "tip":     (GREEN, GREENBG, "DO THIS"),
    "warning": (AMBER, AMBERBG, "WATCH OUT"),
    "info":    (NAVY,  INFOBG,  "NOTE"),
}

def callout(text, variant="info"):
    bar, bg, label = _CO[variant]
    inner = Table(
        [[Paragraph(label, COLBL)], [Paragraph(text, CO)]],
        colWidths=[A4[0] - 40 * mm - 10],
    )
    inner.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), bar),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (0, 0), 2),
        ("BOTTOMPADDING", (0, 0), (0, 0), 2),
        ("TOPPADDING", (0, 1), (0, 1), 6),
        ("BOTTOMPADDING", (0, 1), (0, 1), 7),
    ]))
    outer = Table([[inner]], colWidths=[A4[0] - 40 * mm])
    outer.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 2.4, bar),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return outer


# ── Page furniture ──────────────────────────────────────────────────────────
def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setFillColor(ORANGE)
    canvas.rect(0, A4[1] - 6 * mm, A4[0], 6 * mm, fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#2A3B55"))
    canvas.setLineWidth(0.5)
    canvas.line(20 * mm, 26 * mm, A4[0] - 20 * mm, 26 * mm)
    canvas.setFillColor(colors.HexColor("#8C9AB0"))
    canvas.setFont("Helvetica", 8.5)
    canvas.drawString(20 * mm, 20 * mm, "Dwelly · Training Portal")
    canvas.drawRightString(A4[0] - 20 * mm, 20 * mm, "The Hub  ›  CRM 2.0  ›  Compliance")
    canvas.restoreState()


def content_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, A4[1] - 14 * mm, A4[0], 14 * mm, fill=1, stroke=0)
    canvas.setFillColor(ORANGE)
    canvas.rect(0, A4[1] - 14 * mm, A4[0], 1.4 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(20 * mm, A4[1] - 9.2 * mm, "CRM 2.0 Compliance — Standard Operating Procedures")
    canvas.setFillColor(colors.HexColor("#AEBACD"))
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(A4[0] - 20 * mm, A4[1] - 9.2 * mm, "Dwelly Training Portal")
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(20 * mm, 15 * mm, A4[0] - 20 * mm, 15 * mm)
    canvas.setFillColor(GREY)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(20 * mm, 10.5 * mm, "The Hub  ›  CRM 2.0  ›  Compliance")
    canvas.drawRightString(A4[0] - 20 * mm, 10.5 * mm, "Page %d" % doc.page)
    canvas.restoreState()


# ── Document ────────────────────────────────────────────────────────────────
doc = BaseDocTemplate(
    OUT, pagesize=A4,
    leftMargin=20 * mm, rightMargin=20 * mm, topMargin=20 * mm, bottomMargin=20 * mm,
    title="CRM 2.0 Compliance — SOPs", author="Dwelly",
)
frame_cover = Frame(20 * mm, 30 * mm, A4[0] - 40 * mm, A4[1] - 70 * mm, id="cover")
frame_body = Frame(20 * mm, 18 * mm, A4[0] - 40 * mm, A4[1] - 38 * mm, id="body")
doc.addPageTemplates([
    PageTemplate(id="Cover", frames=[frame_cover], onPage=cover_bg),
    PageTemplate(id="Body", frames=[frame_body], onPage=content_bg),
])

S = []

# ── COVER ───────────────────────────────────────────────────────────────────
S.append(NextPageTemplate("Body"))
S.append(Spacer(1, 58 * mm))
S.append(Paragraph("WHAT TO DO, STAGE BY STAGE", COVKICK))
S.append(Spacer(1, 6))
S.append(Paragraph("CRM 2.0 Compliance", COVERT))
S.append(Paragraph("Standard Operating Procedures", style(
    "cst2", fontName="Helvetica-Bold", fontSize=16, leading=20,
    textColor=colors.HexColor("#C7D3E4"))))
S.append(Spacer(1, 12))
S.append(Paragraph(
    "The agent runs the routine; you make the human calls. This is the simple "
    "reference for what you do at each stage of a compliance job — from landlord "
    "approval to close.", COVERS))
S.append(PageBreak())

# ── HOW THE MODEL WORKS ──────────────────────────────────────────────────────
S.append(Paragraph("The model in one minute", H1))
S.append(Paragraph(
    "Every request is a single compliance-certificate job — a Gas Safety "
    "Certificate (CP12), an EICR, an EPC, and so on. An AI <b>agent</b> runs the "
    "routine end to end: chasing, booking and reminding. <b>You</b>, the operator, "
    "step in for the decisions that need a human. Two review checkpoints are always "
    "yours: <b>Certificate review</b> and <b>Invoice review</b>.", LEAD))

S.append(Paragraph("Ground rules — every job", H2))
S.append(bullets([
    "<b>Read the whole job before acting.</b> The agent often suggests an action "
    "from the most recent message only; the wider history may point elsewhere.",
    "<b>Only action flagged jobs.</b> An orange flag means it has escalated and "
    "needs a human. Leave everything else with the agent.",
    "<b>Don't take over just to call early.</b> If there's no new urgent info, let "
    "the agent work — it will escalate when it needs you.",
    "<b>Call first, then email.</b> Calling is your primary way to progress a job. "
    "Always follow up with an email — including every time you leave a voicemail — "
    "so the recipient can find the right thread to reply to.",
    "<b>If you're not 100% sure, ask.</b> And surface bugs and edge cases early "
    "rather than pushing a job forward the wrong way.",
]))
S.append(callout(
    "Never share direct phone numbers between tenant, landlord and provider — we "
    "only pass on masked numbers.", "warning"))

# ── THE MAIN PATH ────────────────────────────────────────────────────────────
S.append(Paragraph("The main path", H1))
S.append(Paragraph(
    "Most jobs travel these stages, driven by the agent. The two <b>bold</b> stages "
    "are your checkpoints — the job stops and waits for you.", BODY))
S.append(chip_table([
    ["1  Landlord approval", "Agent asks the landlord to authorise the work."],
    ["2  Provider selection", "Agent finds a contractor."],
    ["3  Scheduling", "Agent brokers a date between the parties."],
    ["4  Visit", "Agent confirms and reminds the day before."],
    ["5  Result awaiting", "Agent chases the certificate."],
    ["6  Certificate review ★", "YOUR CHECKPOINT — check the document and its dates."],
    ["7  Invoice review ★", "YOUR CHECKPOINT — the invoice is reviewed by hand before close."],
    ["8  Completed", "Job done."],
], ["Stage", "What happens"], [48 * mm, 122 * mm]))
S.append(Spacer(1, 2))
S.append(callout(
    "Side flows branch off the main path: <b>Remedial works</b> (extra works found "
    "at Certificate review), <b>Landlord DIY</b> (landlord arranges it themselves), "
    "and a <b>Boiler service</b> that can ride along with a CP12.", "info"))

# ── SOP: LANDLORD APPROVAL ───────────────────────────────────────────────────
S.append(PageBreak())
S.append(Paragraph("SOP · Landlord approval", H1))
S.append(Paragraph(
    "Every job starts here. You authorise the works once the landlord says yes. "
    "The buttons vary slightly by certificate type.", LEAD))
S.append(steps([
    "If the landlord approves <b>by phone</b>, click the approval button directly "
    "(e.g. <b>Approve, Use Default SP</b>) — <b>not</b> Add Direct Info.",
    "If the landlord <b>names a specific provider</b>, click <b>Approve, Use "
    "Another Provider</b> (see the provider SOP below).",
    "If the landlord wants to <b>arrange it themselves</b>, click <b>Landlord "
    "DIY</b> — the agent then waits for their certificate.",
    "On a <b>CP12</b>, check whether the landlord wants a boiler service via "
    "<b>Approve, Add Boiler Service</b>. If their answer is unclear, ask again before "
    "proceeding.",
]))
S.append(callout(
    "Landlords often ask the price before authorising. Check the Service price "
    "cheat sheet (in this space), reply via <b>Send Communication</b>, then click "
    "the approval button.", "tip"))
S.append(callout(
    "<b>Provide Instructions</b>, <b>Reassign Job</b> and <b>Cancel Job</b> are "
    "admin-only. You'll still see the buttons, but consult an admin first.", "warning"))

S.append(Paragraph("If the landlord asks for a specific provider", H2))
S.append(steps([
    "Click <b>Approve, Use Another Provider</b>.",
    "If they're not on the preferred list, check the provider panel at "
    "panel.dwelly.team/dw-admin/html/pm-providers.",
    "They may be on an agency-specific onboarded list — if so, reach out to Dylan.",
    "If they're on no list, ask the relevant PMs for feedback, then send the "
    "provider to Veronica to be onboarded properly (following the onboarding SOP).",
]))

# ── SOP: SCHEDULING ──────────────────────────────────────────────────────────
S.append(Paragraph("SOP · Scheduling", H1))
S.append(Paragraph(
    "The agent contacts the tenant and provider to find a matching slot, nudging "
    "whichever side is silent and escalating on a deadlock. When it lands with you:", BODY))
S.append(bullets([
    "<b>Chase by phone first</b>, then send a confirming email.",
    "<b>Add Direct Info</b> — use it to pass on information you received from one "
    "party to the other. Write it <b>as if you are the party you got it from</b> "
    "(e.g. \u201C11th August 2026 at 2pm\u201D, not an internal note). Pick the right "
    "source (e.g. From Provider); attachments are supported.",
    "<b>Set Visit Date</b> — use it to record an appointment <b>both sides have "
    "already agreed</b>.",
]))
S.append(callout(
    "Rule of thumb: <b>Add Direct Info</b> = passing on information you received. "
    "<b>Set Visit Date</b> = recording an appointment both sides have agreed.", "tip"))
S.append(bullets([
    "Vague times the AI won't accept (\u201Cmorning\u201D): set the visit date "
    "manually — treat morning as 8am\u201312pm.",
    "Tenant reschedules out-of-band (emails us directly): it arrives as an "
    "escalation — just <b>Set Visit Date</b> to the agreed new slot.",
    "Two tenants: it's better to call the second tenant than the first tenant's "
    "second number (secondary numbers were copied across without notes).",
]))

# ── SOP: RESCHEDULING ────────────────────────────────────────────────────────
S.append(Paragraph("SOP · Rescheduling", H1))
S.append(Paragraph(
    "From <b>Visit</b> or <b>Result awaiting</b> you can reschedule without a "
    "manual take-over. Pick the action by whether a new time is already agreed.", BODY))
S.append(chip_table([
    ["Reset Visit Date", "Both sides have ALREADY agreed the new time. Updates the "
     "booking and notifies both automatically."],
    ["Reschedule", "No new time agreed yet. Choose tenant or provider and "
     "write the opening message so context carries over."],
], ["Action", "When to use it"], [42 * mm, 128 * mm]))
S.append(callout(
    "Dates you type into your message are recognised and used through the flow — a "
    "natural line like \u201Cnext Monday works\u201D is enough to move things along.", "tip"))

# ── SOP: CERTIFICATE REVIEW ──────────────────────────────────────────────────
S.append(PageBreak())
S.append(Paragraph("SOP · Certificate review  ★ your checkpoint", H1))
S.append(Paragraph("Check on every certificate", H2))
S.append(steps([
    "<b>Address</b> — check it on the certificate and the paperwork generally "
    "(invoices, quotes). Landlords sometimes send a document for another property.",
    "<b>Numbers</b> — subtotal, VAT and total.",
    "<b>Dates</b> — issue and expiry present and accurate, in the right fields on "
    "both the certificate and the CRM.",
    "<b>Provider name</b> — for a Dwelly provider, copy it from the Contacts tab; "
    "for a landlord-DIY cert, use the name on the certificate.",
]))
S.append(callout(
    "If the AI <b>flags the address</b>, there's nothing to correct — it's just a "
    "hint to look (often triggered by a handwritten cert).", "info"))

S.append(Paragraph("Landlord sends a cert for the wrong property", H2))
S.append(steps([
    "Upload the cert to the property it actually belongs to (CRM 1 \u2192 File "
    "Manager) — it's a valid document, don't waste it.",
    "Request the correct cert for this job's property from the landlord.",
]))

S.append(Paragraph("Reading the two cert types", H2))
S.append(bullets([
    "<b>CP12 (gas)</b> — not labelled satisfactory / unsatisfactory; each appliance "
    "is categorised individually. Check the <b>Safe to use</b> column. All YES "
    "means no safety failure forcing a required remedial — but read the engineer's "
    "notes and judge each noted item (required vs optional) on its own merits.",
    "<b>EICR (electrical)</b> — carries an overall Satisfactory / Unsatisfactory. "
    "Codes <b>C1, C2 and FI mean work is required</b>; <b>C3</b> is advisory only. "
    "An EICR with only C3s (or none) is satisfactory.",
]))
S.append(callout(
    "<b>FI (further investigation) is a fail code</b>, just like C1 and C2. If an "
    "EICR lists any FI items it is unsatisfactory — send it down the required-"
    "remedial path, whatever the summary box says.", "warning"))
S.append(callout(
    "<b>Invalid</b> — use when you spot an issue with a cert (wrong date, address). "
    "<b>Upload another</b> — use when a new cert arrived that the agent didn't "
    "recognise automatically.", "info"))

# ── SOP: REMEDIAL WORKS ──────────────────────────────────────────────────────
S.append(Paragraph("SOP · Remedial works — required vs optional", H1))
S.append(Paragraph(
    "At Certificate review you decide whether remedial works are <b>required for "
    "compliance</b> or simply <b>recommended</b>. That choice sets the job's path.", BODY))
S.append(bullets([
    "<b>Required:</b> click <b>Need required remedial</b> and continue the remedial "
    "flow as usual.",
    "<b>Optional / recommended</b> (a satisfactory cert with C3 items): review the "
    "cert as usual, then click <b>Optional remedial</b>.",
]))
S.append(callout(
    "Expected, not a bug: confirming C3s on a satisfactory cert automatically "
    "creates a maintenance job in CRM 1.0 — the optional-remedial workflow lives "
    "in 1.0. Accept C3-only certs as satisfactory.", "info"))
S.append(Paragraph("The remedial branch (once you press Need remedial)", H2))
S.append(chip_table([
    ["Quotation awaiting", "Agent asks the provider for a quote."],
    ["Quotation review ★", "YOUR CHECKPOINT — check the amount and the work description."],
    ["Landlord quote approval", "Landlord agrees to pay. Usually nothing to do."],
    ["Then", "Approved \u2192 back to Scheduling for the repeat visit. Rejected \u2192 "
     "Remedial terminated (the satisfactory cert still stands)."],
], ["Stage", "What happens"], [46 * mm, 124 * mm]))
S.append(callout(
    "If the landlord rejects the quote, call to confirm whether they'll get their "
    "own quote or want other agency contractors. Their own contractor must be "
    "vetted first; if they decline entirely, assert full landlord DIY.", "tip"))

# ── SOP: INVOICE REVIEW ──────────────────────────────────────────────────────
S.append(Paragraph("SOP · Invoice review  ★ your checkpoint", H1))
S.append(bullets([
    "Every job with an invoice stops here — it must be reviewed by hand before the "
    "job can close.",
    "Check the <b>subtotal, VAT and total add up</b>, and the <b>reference</b> is "
    "right.",
    "Collect the certificate <b>and</b> the invoice for every appointment.",
]))

# ── SOP: EPC ─────────────────────────────────────────────────────────────────
S.append(Paragraph("SOP · EPC — not mandatory mid-tenancy", H1))
S.append(Paragraph(
    "Unlike an EICR or gas cert, an EPC does not have to be renewed during a live "
    "tenancy. It must be valid before you market the property, sign a new agreement "
    "with different tenants, formally change the tenancy agreement, or serve notice "
    "— so renewing is best practice.", BODY))
S.append(callout(
    "Exception — <b>selective licensing</b>: some properties must hold a valid EPC "
    "at all times. If a property is under selective licensing, treat the EPC as "
    "required and keep it in date.", "warning"))
S.append(callout(
    "Wording when the landlord hasn't responded: \u201CAs we have not heard from you "
    "regarding the renewal of the EPC, we will not be going ahead with renewing "
    "this, as it is not a legal requirement to have one during a tenancy. Please be "
    "aware you must have a valid EPC before you market the property, sign a new "
    "agreement with different tenants, or change the formal tenancy agreement; if "
    "you serve notice you would also need a valid EPC — so it would be best "
    "practice to renew it. If you'd like this renewed in future, please come back "
    "and confirm we can arrange it.\u201D", "tip"))

# ── SOP: ESCALATIONS & TIMING ────────────────────────────────────────────────
S.append(PageBreak())
S.append(Paragraph("SOP · Escalations & timing", H1))
S.append(Paragraph(
    "The date at the bottom of a job is the <b>next agent action</b> — not "
    "necessarily the next escalation (it may be an auto reminder). The full list of "
    "planned actions sits on the right of the job. If the next action is an "
    "escalation you can action it early; if it's a reminder, leave it.", BODY))
S.append(Paragraph("How long the agent chases before it escalates", H2))
S.append(chip_table([
    ["Landlord approval", "+1 & +3 days", "+4 days: auto-advance to provider selection"],
    ["Provider selection", "Instant", "Escalates only if no contractor is found"],
    ["Scheduling", "Nudges the silent side", "Escalates on a deadlock"],
    ["Visit", "One reminder day before", "Auto-advances once the date passes"],
    ["Result awaiting", "+1 & +2 days", "+3 days: escalates to you"],
    ["Invoice / Quotation awaiting", "+1 day", "+3 days: escalates to you"],
    ["Landlord quote approval", "+3 days", "+7 days: escalates (money decision)"],
    ["Landlord DIY", "+10 days", "+14 days: escalates (landlord is doing it)"],
], ["Stage", "Reminders", "Then"], [46 * mm, 40 * mm, 84 * mm]))
S.append(callout(
    "\u201CWait for response\u201D caps at <b>3 days</b>. If a provider is away "
    "longer (e.g. annual leave), set the 3 days and extend again when the job "
    "returns to your queue.", "info"))

S.append(Paragraph("Common escalation triggers — what to do", H2))
S.append(chip_table([
    ["Vague / low-confidence reply", "Call the party and clarify before choosing the next step."],
    ["Unrecognised intent", "Read the whole job log, call to clarify, then choose the stage."],
    ["Job answered + unrelated question", "Action the job, then pass the extra question to the relevant PM."],
    ["Party silent, reminders exhausted", "Follow up by phone, then a confirming email."],
    ["Sensitive ask (tenant data / named contractor)", "Don't share or commit without checking. If unsure, ask."],
    ["Landlord hints DIY / changes mind", "Route to Landlord DIY; if unclear, call to confirm first."],
    ["No contractor / landlord named one", "Source a contractor, or record the one the landlord named."],
    ["Contractor declined / won't attend", "Reschedule or Change SP."],
    ["Document unreadable / wrong type", "Check the file, request a correct copy (a \u201Cdocument problem\u201D escalation)."],
    ["External-system error", "Retry if transient; escalate to support if it persists."],
], ["Trigger", "What to do"], [66 * mm, 104 * mm]))

# ── SOP: ACROSS SYSTEMS & HABITS ─────────────────────────────────────────────
S.append(Paragraph("SOP · Working across 2.0 and 1.0, and good habits", H1))
S.append(Paragraph("Switching a job from CRM 2.0 to CRM 1.0", H2))
S.append(steps([
    "Ask the ops team to pause auto-transfer for the agency.",
    "Cancel the request in CRM 2.0.",
    "Create the request in CRM 1.0, leaving full context on why it was moved.",
    "Ask the ops team to switch auto-transfer back on for the agency.",
]))
S.append(Paragraph("Vacant (unattended) properties", H2))
S.append(Paragraph(
    "Fully supported and flagged <b>Unattended</b>. With no tenant, the agent goes "
    "straight to the provider, explains keys are collected from the agency, and "
    "books from provider availability. The day before the visit you get an "
    "escalation to verify the keys are available for collection.", BODY))
S.append(Paragraph("Good habits", H2))
S.append(bullets([
    "Before requesting a document from a provider, check the last few emails on the "
    "job — often it's already there.",
    "If a document arrives out-of-band (e.g. Slack), don't take over to upload it — "
    "use <b>Add Direct Info</b>, source <b>From Provider</b>, and attach the file.",
    "Collect the certificate AND the invoice for every appointment.",
    "Use the <b>Job Notes</b> tab for operational context (why we're waiting, "
    "special agreements) — not communication history.",
    "Don't rely on the AI summary alone — always read the job chronology first.",
]))
S.append(callout(
    "Resources: the full <b>SOP guide</b> (password-protected — ask an admin), the "
    "<b>Service price cheat sheet</b>, and the <b>SOP widget (beta)</b> that serves "
    "stage-relevant SOPs inside the job page. Use the automated solution before "
    "manually sending emails.", "info"))

doc.build(S)
print("Wrote", OUT)
