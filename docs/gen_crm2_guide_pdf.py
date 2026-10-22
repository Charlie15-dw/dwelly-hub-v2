#!/usr/bin/env python3
"""Generate the CRM 2.0 Compliance user guide PDF (docs/CRM-2.0-Compliance-Guide.pdf).

Content mirrors the live Hub section (lib/crm2-content.ts): 3 pillars, 12 guides,
5 reference sheets, practice drills and the capstone. Brand: Dwelly navy/orange.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, ListFlowable, ListItem, NextPageTemplate,
)

# ── Brand palette ───────────────────────────────────────────────────────────
NAVY   = colors.HexColor("#0B1F3A")
NAVY50 = colors.HexColor("#EEF2F8")
ORANGE = colors.HexColor("#F26A21")
INK    = colors.HexColor("#1C2A3A")
GREY   = colors.HexColor("#5A6b7b")
LINE   = colors.HexColor("#D9E1EC")
GREEN  = colors.HexColor("#1F7A46")

OUT = "docs/CRM-2.0-Compliance-Guide.pdf"

# ── Styles ──────────────────────────────────────────────────────────────────
ss = getSampleStyleSheet()

def style(name, **kw):
    return ParagraphStyle(name, parent=ss["Normal"], **kw)

H1     = style("H1", fontName="Helvetica-Bold", fontSize=19, leading=23, textColor=NAVY, spaceBefore=6, spaceAfter=8)
H2     = style("H2", fontName="Helvetica-Bold", fontSize=13.5, leading=17, textColor=NAVY, spaceBefore=14, spaceAfter=5)
BODY   = style("Body", fontName="Helvetica", fontSize=10, leading=15, textColor=INK, spaceAfter=6)
LEAD   = style("Lead", fontName="Helvetica", fontSize=11, leading=16, textColor=GREY, spaceAfter=8)
SMALL  = style("Small", fontName="Helvetica", fontSize=8.5, leading=12, textColor=GREY)
BULLET = style("Bullet", fontName="Helvetica", fontSize=10, leading=14.5, textColor=INK)
PILLLBL= style("Pill", fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=colors.white)
CELLH  = style("CellH", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=colors.white)
CELL   = style("Cell", fontName="Helvetica", fontSize=9, leading=12.5, textColor=INK)
CELLB  = style("CellB", fontName="Helvetica-Bold", fontSize=9, leading=12.5, textColor=NAVY)
COVERT = style("CoverT", fontName="Helvetica-Bold", fontSize=30, leading=34, textColor=colors.white, alignment=TA_LEFT)
COVERS = style("CoverS", fontName="Helvetica", fontSize=13, leading=19, textColor=colors.HexColor("#C7D3E4"))
COVKICK= style("CoverKick", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=ORANGE)


def bullets(items, style=BULLET):
    return ListFlowable(
        [ListItem(Paragraph(t, style), leftIndent=6, value="•") for t in items],
        bulletType="bullet", bulletColor=ORANGE, bulletFontSize=8,
        leftIndent=12, spaceBefore=2, spaceAfter=8,
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
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


# ── Page furniture ──────────────────────────────────────────────────────────
def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    # orange accent bar
    canvas.setFillColor(ORANGE)
    canvas.rect(0, A4[1] - 6 * mm, A4[0], 6 * mm, fill=1, stroke=0)
    # subtle footer rule
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
    # header band
    canvas.setFillColor(NAVY)
    canvas.rect(0, A4[1] - 14 * mm, A4[0], 14 * mm, fill=1, stroke=0)
    canvas.setFillColor(ORANGE)
    canvas.rect(0, A4[1] - 14 * mm, A4[0], 1.4 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(20 * mm, A4[1] - 9.2 * mm, "CRM 2.0 Compliance — User Guide")
    canvas.setFillColor(colors.HexColor("#AEBACD"))
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(A4[0] - 20 * mm, A4[1] - 9.2 * mm, "Dwelly Training Portal")
    # footer
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
    title="CRM 2.0 Compliance — User Guide", author="Dwelly",
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
S.append(Spacer(1, 60 * mm))
S.append(Paragraph("THE NEXT GENERATION", COVKICK))
S.append(Spacer(1, 6))
S.append(Paragraph("CRM 2.0 Compliance", COVERT))
S.append(Spacer(1, 10))
S.append(Paragraph(
    "Everything in the learning space, and how to use it — the guides, the "
    "reference sheets, the practice drills and the assessments that sign you off.",
    COVERS))
S.append(Spacer(1, 22))
S.append(Paragraph(
    "<font color='#FFFFFF'><b>12 guides</b></font>  ·  "
    "<font color='#C7D3E4'>5 reference sheets  ·  practice + capstone</font>",
    style("cst", fontName="Helvetica", fontSize=11.5, leading=15, textColor=colors.white)))
S.append(PageBreak())

# ── WHAT THIS IS ────────────────────────────────────────────────────────────
S.append(Paragraph("What CRM 2.0 Compliance is", H1))
S.append(Paragraph(
    "CRM 2.0 is Dwelly's agent-led compliance flow: the system chases certificates, "
    "books works and moves jobs forward on its own, and hands over to you at the "
    "decisions that need a human. This learning space in the Hub gets you confident "
    "with that model before you own it for your team.", LEAD))
S.append(Paragraph(
    "You'll each be the main point of contact for your team on CRM 2.0, so the goal "
    "is simple: read the guides, keep the reference sheets to hand, practise on "
    "realistic jobs, then pass the checks.", BODY))

S.append(Paragraph("How the space is organised", H2))
S.append(Paragraph(
    "The content is grouped into three pillars — a 1·2·3 journey from finding your "
    "feet to operating like a pro:", BODY))
pillar_rows = [
    ["1  Get orientated", "How CRM 2.0 works and how to find your way around it."],
    ["2  Master the features", "The buttons, actions and workflows that get jobs done."],
    ["3  Work smarter", "Timing, edge cases and the habits of a great operator."],
]
S.append(chip_table(pillar_rows, ["Pillar", "What it covers"],
                    [55 * mm, 115 * mm]))
S.append(Spacer(1, 4))

S.append(Paragraph("How to use it — the recommended path", H2))
S.append(bullets([
    "<b>Read the 12 guides in order.</b> Each is a 3–6 minute read; the landing page "
    "tracks what you've completed and shows a progress ring per pillar.",
    "<b>Keep the reference sheets open</b> while you work a real job — the glossary, "
    "cheatsheet, price list, FAQ and what's-new. They don't count towards progress.",
    "<b>Practise with the scenario drills</b> — realistic jobs, decision by decision, "
    "with instant feedback. Nothing is scored, so make your mistakes here.",
    "<b>Pass the knowledge checks.</b> Each guide has one, plus the capstone at the "
    "end. 80% to pass. Clear them all and your certificate unlocks.",
]))

# ── THE 12 GUIDES ───────────────────────────────────────────────────────────
S.append(PageBreak())
S.append(Paragraph("The 12 guides", H1))
S.append(Paragraph(
    "Your core reading, in order. Roughly 55 minutes end to end — but designed to be "
    "taken one guide at a time.", LEAD))

def guide_block(pillar_no, pillar_label, rows):
    flow = []
    flow.append(Paragraph(f"Pillar {pillar_no} · {pillar_label}", H2))
    data = [[Paragraph("#", CELLH), Paragraph("Guide", CELLH),
             Paragraph("What you'll learn", CELLH), Paragraph("Min", CELLH)]]
    for n, title, summ, mins in rows:
        data.append([
            Paragraph(f"{n:02d}", CELLB), Paragraph(title, CELLB),
            Paragraph(summ, CELL), Paragraph(str(mins), CELL),
        ])
    t = Table(data, colWidths=[9 * mm, 47 * mm, 100 * mm, 14 * mm], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, NAVY50]),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (3, 0), (3, -1), "CENTER"),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    flow.append(t)
    flow.append(Spacer(1, 4))
    return KeepTogether(flow)

S.append(guide_block(1, "Get orientated", [
    (1, "How CRM 2.0 works: the agent &amp; you",
     "The agent-first model — what runs automatically, and the decisions that are always yours.", 5),
    (2, "Finding your way around",
     "The requests queue, the job screen, and how to read a job at a glance.", 5),
    (3, "When the system hands over to you",
     "The designed human checkpoints, and how long the agent chases before it escalates.", 5),
]))
S.append(guide_block(2, "Master the features", [
    (4, "Buttons &amp; actions",
     "Send Communication, Add Direct Info, Set Visit Date, Provide Instructions and Take Over — what each is for.", 6),
    (5, "Rescheduling",
     "Reschedule without a manual take-over — and let the system read the dates in your message.", 3),
    (6, "Remedial works — required vs optional",
     "Deciding at Certificate review whether remedials are required for compliance or just recommended.", 5),
    (7, "Certificate review",
     "What to check on every certificate, AI address flags, wrong-property certs, and reading a CP12.", 5),
    (8, "EPC — not mandatory mid-tenancy",
     "Why an EPC differs from an EICR or gas cert, and the wording when a landlord goes quiet.", 3),
    (9, "Worked example: a gas safety job, start to finish",
     "Follow one CP12 through the whole flow — including a remedial branch — to see how the pieces fit.", 5),
]))
S.append(guide_block(3, "Work smarter", [
    (10, "Escalations &amp; timing in practice",
     "Reading the next-action date, third-party blocks, and the 3-day wait cap.", 4),
    (11, "Escalations reference: every trigger &amp; the edge cases",
     "The exceptions the agent raises outside the happy path — what each means, and the document &amp; email cases.", 5),
    (12, "Working across 2.0 and 1.0, and other essentials",
     "Switching a job to CRM 1.0, vacant-property jobs, and the habits that keep jobs clean.", 4),
]))

# ── REFERENCE SHEETS ────────────────────────────────────────────────────────
S.append(PageBreak())
S.append(Paragraph("Reference sheets — keep to hand", H1))
S.append(Paragraph(
    "These live alongside the guides but don't count towards your progress. Open them "
    "while you're working a real job.", LEAD))
S.append(chip_table([
    ["Glossary: the language of 2.0",
     "Every stage name and control in one place, so the whole team speaks the same language."],
    ["Quick-reference cheatsheet",
     "The \u201Cwhen X, do Y\u201D calls you'll make most often, on one screen. Printable one-pager."],
    ["Service price cheat sheet",
     "What each compliance service costs, by agency and provider — answer a landlord's \u201Chow much?\u201D straight away."],
    ["FAQ &amp; common gotchas",
     "Straight answers to the questions that come up most — certificates, scheduling, cancellations, invoices, help."],
    ["What's new in 2.0 (vs 1.0)",
     "The headline changes from the old CRM, so you know what to expect and what's different."],
], ["Sheet", "What it's for"], [55 * mm, 115 * mm]))

# ── PROVE IT ────────────────────────────────────────────────────────────────
S.append(Paragraph("Prove it — practice &amp; assessments", H1))
S.append(Paragraph("Practice drills", H2))
S.append(Paragraph(
    "Work realistic jobs decision-by-decision with instant feedback on every call. "
    "Nothing is recorded — it's pure practice, so this is the place to test your "
    "judgement before the real checks.", BODY))
S.append(Paragraph("Knowledge checks", H2))
S.append(bullets([
    "<b>One check per guide</b> — a short assessment tied to each lesson.",
    "<b>80% to pass</b>, the same bar across the whole space.",
    "<b>One attempt, then it locks.</b> Your score is recorded either way; if you need "
    "another go, your manager can grant a retake.",
    "<b>Every question shows the reasoning afterwards</b>, so a check doubles as revision.",
]))
S.append(Paragraph("The capstone", H2))
S.append(Paragraph(
    "The final sign-off: 20 scenario questions drawn at random from across every "
    "lesson, so you never know which topics will come up. 80% to pass, reshuffled "
    "each time, retake as often as you like. Pass it and — with all 12 guides read — "
    "your CRM 2.0 Compliance certificate unlocks.", BODY))

S.append(Spacer(1, 8))
note = Table([[Paragraph(
    "<b>Where to find it:</b> open the Hub, then <b>CRM 2.0 › Compliance</b> in the "
    "sidebar. Compliance Overview is the landing page above; Compliance Assessments "
    "lists every knowledge check and your status on each.", BODY)]],
    colWidths=[170 * mm])
note.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), NAVY50),
    ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#C7D3E4")),
    ("LEFTPADDING", (0, 0), (-1, -1), 12),
    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ("TOPPADDING", (0, 0), (-1, -1), 9),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
]))
S.append(note)
S.append(Spacer(1, 8))
S.append(Paragraph(
    "Questions, or want to walk through anything? Ask in the manager channel and "
    "we'll happily set up a call.", SMALL))

doc.build(S)
print("Wrote", OUT)
