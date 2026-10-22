#!/usr/bin/env python3
"""Build the PM training / meeting deck for w/c 29th Sept + the two Slack asks.

Audience: PMs, presented live. Dwelly navy/orange look.
Output: ~/Desktop/PM Training - CRM 2.0 - wc 29 Sept.pptx
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor

# ── Palette ─────────────────────────────────────────────────────────────────
NAVY      = RGBColor(0x16, 0x23, 0x3F)
NAVY_SOFT = RGBColor(0x2A, 0x3B, 0x5E)
ORANGE    = RGBColor(0xF2, 0x6A, 0x21)
ORANGE_LT = RGBColor(0xFB, 0xE9, 0xDD)
WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
INK       = RGBColor(0x1F, 0x2A, 0x44)
GREY      = RGBColor(0x5B, 0x66, 0x7A)
LINE      = RGBColor(0xE2, 0xE6, 0xEE)
GOOD_BG   = RGBColor(0xE8, 0xF5, 0xEC)
GOOD_INK  = RGBColor(0x1E, 0x6B, 0x38)
BAD_BG    = RGBColor(0xFB, 0xE9, 0xE9)
BAD_INK   = RGBColor(0xA3, 0x2A, 0x2A)

# 16:9
prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
SW, SH = prs.slide_width, prs.slide_height
BLANK = prs.slide_layouts[6]

FONT = "Calibri"


def _set(run, size, color, bold=False, italic=False, font=FONT):
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.italic = italic
    run.font.name = font


def rect(slide, x, y, w, h, fill, line=None, line_w=None, shape=MSO_SHAPE.RECTANGLE):
    sp = slide.shapes.add_shape(shape, x, y, w, h)
    sp.fill.solid()
    sp.fill.fore_color.rgb = fill
    if line is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = line
        sp.line.width = line_w or Pt(1)
    sp.shadow.inherit = False
    return sp


def textbox(slide, x, y, w, h, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = Inches(0.05)
    tf.margin_top = tf.margin_bottom = Inches(0.02)
    return tb, tf


def para(tf, text, size, color, bold=False, italic=False, first=False,
         align=PP_ALIGN.LEFT, space_after=6, bullet=None, level=0, line_spacing=1.06):
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    p.alignment = align
    p.space_after = Pt(space_after)
    p.level = level
    p.line_spacing = line_spacing
    if bullet:
        r0 = p.add_run(); r0.text = bullet + "  "
        _set(r0, size, ORANGE, bold=True)
        r = p.add_run(); r.text = text
        _set(r, size, color, bold=bold, italic=italic)
    else:
        r = p.add_run(); r.text = text
        _set(r, size, color, bold=bold, italic=italic)
    return p


def kicker(slide, text, x=Inches(0.9), y=Inches(0.55), color=ORANGE):
    tb, tf = textbox(slide, x, y, Inches(11), Inches(0.4))
    para(tf, text.upper(), 13, color, bold=True, first=True, space_after=0)
    return tb


def heading(slide, text, x=Inches(0.9), y=Inches(0.95), w=Inches(11.5), size=30):
    tb, tf = textbox(slide, x, y, w, Inches(1.0))
    para(tf, text, size, NAVY, bold=True, first=True, space_after=0, line_spacing=1.0)
    # orange underline accent
    rect(slide, x + Emu(1), y + Inches(0.92), Inches(0.9), Inches(0.06), ORANGE)
    return tb


def footer(slide, page):
    tb, tf = textbox(slide, Inches(0.9), Inches(7.02), Inches(11.5), Inches(0.35))
    p = tf.paragraphs[0]; p.space_after = 0
    r = p.add_run(); r.text = "Dwelly · PM Training · CRM 2.0"
    _set(r, 9, GREY)
    tb2, tf2 = textbox(slide, Inches(11.9), Inches(7.02), Inches(0.6), Inches(0.35))
    p2 = tf2.paragraphs[0]; p2.alignment = PP_ALIGN.RIGHT; p2.space_after = 0
    r2 = p2.add_run(); r2.text = str(page)
    _set(r2, 9, GREY, bold=True)


def base(title=None, kick=None, page=None):
    s = prs.slides.add_slide(BLANK)
    rect(s, 0, 0, SW, SH, WHITE)
    if kick:
        kicker(s, kick)
    if title:
        heading(s, title)
    if page is not None:
        footer(s, page)
    return s


def card(slide, x, y, w, h, fill=WHITE, border=LINE):
    return rect(slide, x, y, w, h, fill, line=border, line_w=Pt(1),
                shape=MSO_SHAPE.ROUNDED_RECTANGLE)


# ─────────────────────────────────────────────────────────────────────────────
# 1 · TITLE
# ─────────────────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
rect(s, 0, 0, SW, SH, NAVY)
# accent orbs
rect(s, Inches(9.7), Inches(-1.4), Inches(5), Inches(5), NAVY_SOFT, shape=MSO_SHAPE.OVAL)
rect(s, Inches(-1.2), Inches(4.6), Inches(4), Inches(4), NAVY_SOFT, shape=MSO_SHAPE.OVAL)
tb, tf = textbox(s, Inches(0.9), Inches(2.15), Inches(11.5), Inches(0.5))
para(tf, "PM TRAINING · WEEK COMMENCING 29 SEPT", 14, ORANGE, bold=True, first=True)
tb, tf = textbox(s, Inches(0.9), Inches(2.65), Inches(11.5), Inches(2.2))
para(tf, "CRM 2.0 — getting the stages right", 46, WHITE, bold=True, first=True, line_spacing=1.0, space_after=10)
para(tf, "KPIs & stage logic · Maintenance: triage + landlord approval · scheduling discipline · quoting photos · cancelling jobs properly", 17, RGBColor(0xC7, 0xD0, 0xE0), space_after=0, line_spacing=1.15)
footer(s, 1)

# ─────────────────────────────────────────────────────────────────────────────
# 2 · AGENDA
# ─────────────────────────────────────────────────────────────────────────────
s = base("What we'll cover today", kick="Agenda", page=2)
items = [
    ("1", "The weekly basics", "KPIs we track, and why the stages have to reflect reality"),
    ("2", "Compliance — a quick recap", "What changed on the compliance side this week"),
    ("3", "Maintenance: tenant triage", "Headers, descriptions, tags, and move-out reports"),
    ("4", "Maintenance: landlord approval", "When to call — and when not to"),
    ("5", "Both tracks: visit dates & scheduling", "100% visit dates, direct info, rescheduling"),
    ("6", "Two focus points", "Photos at online quoting · cancelling jobs properly"),
]
y = Inches(1.9)
for n, t, d in items:
    card(s, Inches(0.9), y, Inches(11.5), Inches(0.72))
    rect(s, Inches(0.9), y, Inches(0.72), Inches(0.72), NAVY, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    tb, tf = textbox(s, Inches(0.9), y, Inches(0.72), Inches(0.72), anchor=MSO_ANCHOR.MIDDLE)
    para(tf, n, 20, WHITE, bold=True, first=True, align=PP_ALIGN.CENTER, space_after=0)
    tb, tf = textbox(s, Inches(1.8), y + Inches(0.06), Inches(10.4), Inches(0.62), anchor=MSO_ANCHOR.MIDDLE)
    para(tf, t, 15, NAVY, bold=True, first=True, space_after=1, line_spacing=1.0)
    para(tf, d, 11.5, GREY, space_after=0, line_spacing=1.0)
    y += Inches(0.82)

# ─────────────────────────────────────────────────────────────────────────────
# 3 · SECTION DIVIDER — the weekly basics
# ─────────────────────────────────────────────────────────────────────────────
def divider(num, title, sub):
    s = prs.slides.add_slide(BLANK)
    rect(s, 0, 0, SW, SH, NAVY)
    rect(s, 0, Inches(3.3), SW, Inches(0.06), ORANGE)
    tb, tf = textbox(s, Inches(0.9), Inches(2.4), Inches(11.5), Inches(0.6))
    para(tf, f"PART {num}", 15, ORANGE, bold=True, first=True)
    tb, tf = textbox(s, Inches(0.9), Inches(3.5), Inches(11.5), Inches(1.6))
    para(tf, title, 40, WHITE, bold=True, first=True, line_spacing=1.0, space_after=8)
    para(tf, sub, 16, RGBColor(0xC7, 0xD0, 0xE0), space_after=0)
    return s


divider("1", "The weekly basics", "The same starting point every week — before we get into this week's themes.")

# 4 · KPIs
s = base("The KPIs we track", kick="Part 1 · Weekly basics", page=4)
tb, tf = textbox(s, Inches(0.9), Inches(1.9), Inches(11.5), Inches(0.5))
para(tf, "Three numbers tell us whether jobs are being run cleanly. They should hold for every job.", 14, GREY, first=True, space_after=0)
kpis = [
    ("Calls", "No silent waits", "If we're waiting on someone, we've called — not just sat on the job. Silence isn't a plan."),
    ("Visit date", "100% of jobs*", "Every job has a visit date in the system. *The only exception is Landlord DIY."),
    ("SLA", "Under 4 hours", "First response and action inside 4 hours — tenants and landlords feel the speed."),
]
x = Inches(0.9); cw = Inches(3.7); gap = Inches(0.2)
for t, big, d in kpis:
    card(s, x, Inches(2.6), cw, Inches(3.2))
    rect(s, x, Inches(2.6), cw, Inches(0.14), ORANGE, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    tb, tf = textbox(s, x + Inches(0.3), Inches(2.95), cw - Inches(0.6), Inches(0.5))
    para(tf, t.upper(), 13, ORANGE, bold=True, first=True, space_after=0)
    tb, tf = textbox(s, x + Inches(0.3), Inches(3.4), cw - Inches(0.6), Inches(1.0))
    para(tf, big, 30, NAVY, bold=True, first=True, space_after=0, line_spacing=0.95)
    tb, tf = textbox(s, x + Inches(0.3), Inches(4.5), cw - Inches(0.6), Inches(1.2))
    para(tf, d, 13, GREY, first=True, space_after=0, line_spacing=1.12)
    x += cw + gap

# 5 · Stages must reflect reality
s = base("The stage must reflect reality", kick="Part 1 · Weekly basics", page=5)
tb, tf = textbox(s, Inches(0.9), Inches(1.9), Inches(11.5), Inches(0.9))
para(tf, "The stage tells everyone who owes the next move — and every chaser, reminder and escalation fires off it. If the stage is wrong, the whole automation works on a false picture.", 15, INK, first=True, space_after=0, line_spacing=1.2)
tb, tf = textbox(s, Inches(0.9), Inches(3.0), Inches(11.5), Inches(0.4))
para(tf, "Watch for these mismatches:", 14, NAVY, bold=True, first=True, space_after=0)
bad = [
    ("Result awaiting, asking for an invoice — but the visit never happened",
     "We're chasing paperwork for work that hasn't been done. Move the job back to reality first."),
    ("Waiting for a quote — while the job sits in Scheduling",
     "Scheduling is for booking a date. A job being priced belongs in quoting, not here."),
]
y = Inches(3.5)
for t, d in bad:
    card(s, Inches(0.9), y, Inches(11.5), Inches(1.25), fill=BAD_BG, border=BAD_BG)
    tb, tf = textbox(s, Inches(1.2), y + Inches(0.16), Inches(11.0), Inches(1.0))
    para(tf, "✕  " + t, 15, BAD_INK, bold=True, first=True, space_after=4, line_spacing=1.05)
    para(tf, d, 13, INK, space_after=0, line_spacing=1.1)
    y += Inches(1.42)

# ─────────────────────────────────────────────────────────────────────────────
# 6 · DIVIDER — Compliance recap
# ─────────────────────────────────────────────────────────────────────────────
divider("2", "Compliance — a quick recap", "Full detail lives on the Miro board. Here's what changed this week.")

# 7 · Compliance changes
s = base("What changed on compliance", kick="Part 2 · Compliance", page=7)
changes = [
    ("\u201COptional\u201D is now \u201CRecommended\u201D", "The optional-remedial button and status are renamed. A C3-only EICR is satisfactory, but the C3s still run the recommended-remedial flow — only a fully clean cert needs none."),
    ("Add Direct Info", "Use it to pass on something actionable — a proposed date, availability or a document. A note with no dates just bounces back as a fresh escalation."),
    ("Chasing tenant & provider", "The full escalation ladders are written out — including that we're not allowed to force-book, and provider change at the second escalation."),
    ("Rescheduling", "The agent can reschedule any visit for you. No need to call SPs / tenants / landlords unless it's genuinely urgent."),
    ("EPC when the landlord goes quiet", "The renewal auto-advances and the system assigns a provider, following the preferences the PM filled out."),
]
y = Inches(1.85)
for t, d in changes:
    card(s, Inches(0.9), y, Inches(11.5), Inches(0.92))
    rect(s, Inches(0.9), y, Inches(0.12), Inches(0.92), ORANGE, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    tb, tf = textbox(s, Inches(1.25), y + Inches(0.1), Inches(11.0), Inches(0.75), anchor=MSO_ANCHOR.MIDDLE)
    para(tf, t, 14.5, NAVY, bold=True, first=True, space_after=2, line_spacing=1.0)
    para(tf, d, 12, GREY, space_after=0, line_spacing=1.06)
    y += Inches(1.0)

# ─────────────────────────────────────────────────────────────────────────────
# 8 · DIVIDER — Maintenance
# ─────────────────────────────────────────────────────────────────────────────
divider("3", "Maintenance: tenant triage", "This week's main themes — getting the report right, and handling move-outs.")

# 9 · Why triage matters
s = base("Triage is the cheapest place to get it right", kick="Part 3 · Maintenance · Triage", page=9)
tb, tf = textbox(s, Inches(0.9), Inches(1.85), Inches(11.5), Inches(1.0))
para(tf, "The provider prices the job remotely — they quote from exactly what you attach at triage. The landlord approves from it too. If the job doesn't read properly, someone has to stop and ask, and the job stops moving while they do.", 15, INK, first=True, space_after=0, line_spacing=1.2)
# three checks
checks = [
    ("Headers", "Say what is wrong and where — not just the category.", "\u201CPlumbing Request — Leak Under Kitchen Sink\u201D, not \u201CPlumbing request\u201D."),
    ("Description", "Add what the header doesn't: symptom, access, what's been tried, what you want back.", "Strip the tenant-portal Q&A dump down to the facts that matter."),
    ("Tags", "Move-out, check-out and emergency are tags — never header text.", "The routing follows the tag, so an emergency tag must be a real emergency."),
]
x = Inches(0.9); cw = Inches(3.7); gap = Inches(0.2)
for t, d, ex in checks:
    card(s, x, Inches(3.05), cw, Inches(3.3))
    tb, tf = textbox(s, x + Inches(0.28), Inches(3.28), cw - Inches(0.56), Inches(0.5))
    para(tf, t.upper(), 14, ORANGE, bold=True, first=True, space_after=0)
    tb, tf = textbox(s, x + Inches(0.28), Inches(3.75), cw - Inches(0.56), Inches(1.6))
    para(tf, d, 13.5, NAVY, bold=True, first=True, space_after=6, line_spacing=1.12)
    para(tf, ex, 12, GREY, italic=True, space_after=0, line_spacing=1.1)
    x += cw + gap

# 10 · What good looks like (header table)
s = base("What good looks like", kick="Part 3 · Maintenance · Triage", page=10)
tb, tf = textbox(s, Inches(0.9), Inches(1.85), Inches(11.5), Inches(0.4))
para(tf, "Same jobs, rewritten so a contractor who has never seen the property knows exactly what's needed.", 14, GREY, first=True, space_after=0)
# two-column compare
colx = [Inches(0.9), Inches(6.75)]
heads = [("INSTEAD OF", BAD_INK, BAD_BG), ("WRITE", GOOD_INK, GOOD_BG)]
for i, (h, ink, bg) in enumerate(heads):
    rect(s, colx[i], Inches(2.5), Inches(5.7), Inches(0.5), bg, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    tb, tf = textbox(s, colx[i] + Inches(0.2), Inches(2.5), Inches(5.3), Inches(0.5), anchor=MSO_ANCHOR.MIDDLE)
    para(tf, h, 13, ink, bold=True, first=True, space_after=0)
rows = [
    ("Plumbing request", "Plumbing Request — Leak Under Kitchen Sink"),
    ("MOVE-OUT ID:39591", "Deep Clean of Bathroom — Limescale in Toilet (quote) · tag: move-out"),
    ("Direct LL Request - blocked man hole", "Blocked Manhole — Sewage Overflowing at Rear of Property"),
    ("New cooker / New Cooker", "Washer-dryer door lock damaged — no longer locks, unsafe to run"),
]
y = Inches(3.15)
for bad_t, good_t in rows:
    card(s, colx[0], y, Inches(5.7), Inches(0.82), fill=WHITE, border=LINE)
    tb, tf = textbox(s, colx[0] + Inches(0.2), y, Inches(5.3), Inches(0.82), anchor=MSO_ANCHOR.MIDDLE)
    para(tf, bad_t, 12.5, GREY, first=True, space_after=0, line_spacing=1.05)
    card(s, colx[1], y, Inches(5.7), Inches(0.82), fill=WHITE, border=LINE)
    rect(s, colx[1], y, Inches(0.1), Inches(0.82), GOOD_INK, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    tb, tf = textbox(s, colx[1] + Inches(0.28), y, Inches(5.2), Inches(0.82), anchor=MSO_ANCHOR.MIDDLE)
    para(tf, good_t, 12.5, NAVY, bold=True, first=True, space_after=0, line_spacing=1.05)
    y += Inches(0.92)

# 11 · Move-out reports
s = base("Move-out jobs: attach the report", kick="Part 3 · Maintenance · Triage", page=11)
tb, tf = textbox(s, Inches(0.9), Inches(1.95), Inches(11.5), Inches(1.4))
para(tf, "If it's a move-out job, attach the move-out report to the files at triage — so the provider has it when they come to quote.", 17, INK, first=True, space_after=10, line_spacing=1.2)
card(s, Inches(0.9), Inches(3.4), Inches(11.5), Inches(1.3), fill=BAD_BG, border=BAD_BG)
tb, tf = textbox(s, Inches(1.2), Inches(3.6), Inches(11.0), Inches(1.0))
para(tf, "The problem we keep seeing", 13, BAD_INK, bold=True, first=True, space_after=4)
para(tf, "Jobs reach online quoting with no report. The provider can't quote, so they come back to ask — the job sits for days and we handle it twice. Job lifetime goes up, efficiency goes down.", 14, INK, space_after=0, line_spacing=1.15)
card(s, Inches(0.9), Inches(4.95), Inches(11.5), Inches(1.3), fill=GOOD_BG, border=GOOD_BG)
tb, tf = textbox(s, Inches(1.2), Inches(5.15), Inches(11.0), Inches(1.0))
para(tf, "The fix", 13, GOOD_INK, bold=True, first=True, space_after=4)
para(tf, "Attach the move-out report to the job files during triage. One minute now saves the whole back-and-forth later, and the provider can price straight away.", 14, INK, space_after=0, line_spacing=1.15)

# 12 · DIVIDER — Landlord approval
divider("4", "Maintenance: landlord approval", "The most important habit this week — don't call before the system asks.")

# 13 · Don't call early
s = base("Don't call before the system asks", kick="Part 4 · Maintenance · LL approval", page=13)
tb, tf = textbox(s, Inches(0.9), Inches(1.9), Inches(11.5), Inches(1.1))
para(tf, "The agent runs landlord approval: it sends the request, chases at +1 working day, and escalates to you at +2. Calling the landlord before that escalation cuts across the automation — even for emergencies.", 15, INK, first=True, space_after=0, line_spacing=1.2)
# do / don't
card(s, Inches(0.9), Inches(3.15), Inches(5.6), Inches(3.1), fill=BAD_BG, border=BAD_BG)
tb, tf = textbox(s, Inches(1.15), Inches(3.35), Inches(5.1), Inches(2.8))
para(tf, "DON'T", 15, BAD_INK, bold=True, first=True, space_after=8)
for t in ["Call the landlord on LL approval before the escalation reaches you",
          "Call \u201Cbecause it's an emergency\u201D — the stage still runs first",
          "Use tenant triage as a reason to call — triage is for triaging, not calling"]:
    para(tf, t, 13.5, INK, bullet="•", space_after=8, line_spacing=1.12)
card(s, Inches(6.75), Inches(3.15), Inches(5.6), Inches(3.1), fill=GOOD_BG, border=GOOD_BG)
tb, tf = textbox(s, Inches(7.0), Inches(3.35), Inches(5.1), Inches(2.8))
para(tf, "DO", 15, GOOD_INK, bold=True, first=True, space_after=8)
for t in ["Let the agent send and chase the approval request",
          "Wait for the +2 escalation to land as your task",
          "Then call within the job — and follow the SOP if there's still no answer (retry, hold a day, escalate to your manager)"]:
    para(tf, t, 13.5, INK, bullet="•", space_after=8, line_spacing=1.12)

# ─────────────────────────────────────────────────────────────────────────────
# 14 · DIVIDER — Both tracks
# ─────────────────────────────────────────────────────────────────────────────
divider("5", "Both tracks: visit dates & scheduling", "Applies to compliance and maintenance alike.")

# 15 · Visit date discipline
s = base("The visit date must always be in the system", kick="Part 5 · Both tracks", page=15)
tb, tf = textbox(s, Inches(0.9), Inches(1.9), Inches(11.5), Inches(1.3))
para(tf, "The real world has to be reflected in the system, 100% of the time and always up to date. Every chaser and reminder is built off the visit date — if it's missing or stale, the automation chases the wrong people at the wrong time.", 16, INK, first=True, space_after=0, line_spacing=1.25)
pts = [
    ("Set it", "As soon as both sides agree a slot, record it with Set Visit Date."),
    ("Keep it current", "If the date moves, update it in the system straight away — don't reschedule \u201Cby hand\u201D."),
    ("Align everyone", "Tenant, provider and the system all show the same date. No surprises on the day."),
]
x = Inches(0.9); cw = Inches(3.7); gap = Inches(0.2)
for t, d in pts:
    card(s, x, Inches(3.6), cw, Inches(2.5))
    tb, tf = textbox(s, x + Inches(0.28), Inches(3.85), cw - Inches(0.56), Inches(0.5))
    para(tf, t, 16, ORANGE, bold=True, first=True, space_after=0)
    tb, tf = textbox(s, x + Inches(0.28), Inches(4.45), cw - Inches(0.56), Inches(1.5))
    para(tf, d, 13.5, INK, first=True, space_after=0, line_spacing=1.15)
    x += cw + gap

# 16 · Scheduling rules
s = base("Scheduling: two rules to remember", kick="Part 5 · Both tracks", page=16)
r1y = Inches(1.95)
card(s, Inches(0.9), r1y, Inches(11.5), Inches(1.75))
rect(s, Inches(0.9), r1y, Inches(0.12), Inches(1.75), ORANGE, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
tb, tf = textbox(s, Inches(1.25), r1y + Inches(0.2), Inches(11.0), Inches(1.4))
para(tf, "1 · Someone calls the office", 16, NAVY, bold=True, first=True, space_after=5)
para(tf, "If a tenant or provider calls the office with information — availability, a change — put it into the job with Add Direct Info, on that party's behalf. Don't leave it in your head or in a note.", 14, INK, space_after=0, line_spacing=1.18)
r2y = Inches(3.9)
card(s, Inches(0.9), r2y, Inches(11.5), Inches(2.55))
rect(s, Inches(0.9), r2y, Inches(0.12), Inches(2.55), ORANGE, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
tb, tf = textbox(s, Inches(1.25), r2y + Inches(0.2), Inches(11.0), Inches(2.2))
para(tf, "2 · We have the tenant's slots, and the provider escalates", 16, NAVY, bold=True, first=True, space_after=6)
para(tf, "Call the SP as per the SOP", 14, INK, bullet="→", space_after=5, line_spacing=1.1)
para(tf, "Agree a date using the tenant's existing slots", 14, INK, bullet="→", space_after=5, line_spacing=1.1)
para(tf, "Set Visit Date to lock it in", 14, INK, bullet="→", space_after=0, line_spacing=1.1)

# 17 · Rescheduling
s = base("Rescheduling — keep it in the system", kick="Part 5 · Both tracks", page=17)
tb, tf = textbox(s, Inches(0.9), Inches(1.95), Inches(11.5), Inches(1.2))
para(tf, "The agent can reschedule any visit for you — you rarely need to call around. What matters is that the change lands in the system so the date, and every chaser off it, stays correct.", 16, INK, first=True, space_after=0, line_spacing=1.22)
card(s, Inches(0.9), Inches(3.35), Inches(11.5), Inches(1.5), fill=ORANGE_LT, border=ORANGE_LT)
tb, tf = textbox(s, Inches(1.2), Inches(3.55), Inches(11.0), Inches(1.2))
para(tf, "Set New Visit Date  vs  Reschedule", 15, NAVY, bold=True, first=True, space_after=5)
para(tf, "New time already agreed by both sides → Set New Visit Date. No new time yet → Reschedule, and write the opening message so context carries over.", 14, INK, space_after=0, line_spacing=1.18)
card(s, Inches(0.9), Inches(5.05), Inches(11.5), Inches(1.2), fill=BAD_BG, border=BAD_BG)
tb, tf = textbox(s, Inches(1.2), Inches(5.25), Inches(11.0), Inches(0.9))
para(tf, "The bad-example pattern to avoid", 13, BAD_INK, bold=True, first=True, space_after=4)
para(tf, "Agreeing a new time on a call or email and letting the job carry on without recording it. That's the single most common deviation — it shows up as \u201Crescheduled by hand\u201D and the chasers go wrong.", 13.5, INK, space_after=0, line_spacing=1.15)

# ─────────────────────────────────────────────────────────────────────────────
# 18 · DIVIDER — Two focus points
# ─────────────────────────────────────────────────────────────────────────────
divider("6", "Two focus points", "Photos at online quoting · cancelling jobs the right way.")

# 19 · Photos at online quoting
s = base("Online quoting needs photos & a report", kick="Part 6 · Focus point", page=19)
tb, tf = textbox(s, Inches(0.9), Inches(1.9), Inches(11.5), Inches(1.1))
para(tf, "Providers price the job remotely — they don't visit first. They quote from exactly what's on the job: the photos and the written report. No photos means no quote.", 16, INK, first=True, space_after=0, line_spacing=1.22)
# flow: no photos -> delay
card(s, Inches(0.9), Inches(3.2), Inches(5.6), Inches(3.0), fill=BAD_BG, border=BAD_BG)
tb, tf = textbox(s, Inches(1.15), Inches(3.4), Inches(5.1), Inches(2.7))
para(tf, "Without photos", 15, BAD_INK, bold=True, first=True, space_after=8)
for t in ["Provider can't put a number on it",
          "They email back to ask for photos",
          "Job sits in online quoting for days",
          "Tenant waits longer; we touch the job twice"]:
    para(tf, t, 14, INK, bullet="✕", space_after=9, line_spacing=1.1)
card(s, Inches(6.75), Inches(3.2), Inches(5.6), Inches(3.0), fill=GOOD_BG, border=GOOD_BG)
tb, tf = textbox(s, Inches(7.0), Inches(3.4), Inches(5.1), Inches(2.7))
para(tf, "With photos & report up front", 15, GOOD_INK, bold=True, first=True, space_after=8)
for t in ["Provider quotes straight away",
          "Job moves on the first pass",
          "Shorter lifetime, higher efficiency",
          "Tenant hears back sooner"]:
    para(tf, t, 14, INK, bullet="✓", space_after=9, line_spacing=1.1)

# 20 · Cancelling jobs properly
s = base("Cancelling jobs properly", kick="Part 6 · Focus point", page=20)
tb, tf = textbox(s, Inches(0.9), Inches(1.85), Inches(11.5), Inches(0.9))
para(tf, "Most relevant for GSCs where there's no gas at the property. Cancelling in the system alone isn't enough — and PMs can't cancel directly. Follow the order below.", 15, INK, first=True, space_after=0, line_spacing=1.2)
steps = [
    ("1", "Fill out the form", "Complete the cancellation form in the pm-questions chat with the job link and the reason (e.g. no gas at the property)."),
    ("2", "Then ping Elya", "Only once the form is done, ping Elya — not before. The form first means there's a record and nothing gets missed."),
    ("3", "Tell the provider if a visit is booked", "If an SP is already booked, tell them to stand down before cancelling — cancelling in the system doesn't reach them, or they'll still attend."),
    ("4", "Set compliance preference to \u201Cnot needed\u201D", "So the job doesn't just regenerate the next day. Cancelling alone won't stop it coming back."),
]
y = Inches(2.85)
for n, t, d in steps:
    card(s, Inches(0.9), y, Inches(11.5), Inches(0.92))
    rect(s, Inches(0.9), y, Inches(0.92), Inches(0.92), NAVY, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    tb, tf = textbox(s, Inches(0.9), y, Inches(0.92), Inches(0.92), anchor=MSO_ANCHOR.MIDDLE)
    para(tf, n, 22, WHITE, bold=True, first=True, align=PP_ALIGN.CENTER, space_after=0)
    tb, tf = textbox(s, Inches(2.0), y + Inches(0.1), Inches(10.2), Inches(0.75), anchor=MSO_ANCHOR.MIDDLE)
    para(tf, t, 14.5, NAVY, bold=True, first=True, space_after=2, line_spacing=1.0)
    para(tf, d, 12, GREY, space_after=0, line_spacing=1.05)
    y += Inches(1.0)

# ─────────────────────────────────────────────────────────────────────────────
# 21 · Wrap up
# ─────────────────────────────────────────────────────────────────────────────
s = base("The takeaways", kick="Wrap up", page=21)
takes = [
    "Keep KPIs honest: call (no silent waits), 100% visit dates, SLA under 4 hours.",
    "The stage must match reality — every chaser fires off it.",
    "Triage well: clear header, real description, tags not header text, and attach move-out reports.",
    "Don't call the landlord before the system escalates — even in an emergency.",
    "Record visit dates and reschedules in the system, always.",
    "Photos & report at quoting; cancel via the pm-questions form, then ping Elya.",
]
y = Inches(1.95)
for t in takes:
    card(s, Inches(0.9), y, Inches(11.5), Inches(0.72))
    rect(s, Inches(1.15), y + Inches(0.24), Inches(0.24), Inches(0.24), ORANGE, shape=MSO_SHAPE.OVAL)
    tb, tf = textbox(s, Inches(1.6), y, Inches(10.6), Inches(0.72), anchor=MSO_ANCHOR.MIDDLE)
    para(tf, t, 14, INK, first=True, space_after=0, line_spacing=1.05)
    y += Inches(0.82)

# 22 · Reminder / close
s = prs.slides.add_slide(BLANK)
rect(s, 0, 0, SW, SH, NAVY)
rect(s, Inches(9.7), Inches(4.2), Inches(5), Inches(5), NAVY_SOFT, shape=MSO_SHAPE.OVAL)
tb, tf = textbox(s, Inches(0.9), Inches(2.5), Inches(11.5), Inches(0.5))
para(tf, "BEFORE YOU GO", 14, ORANGE, bold=True, first=True)
tb, tf = textbox(s, Inches(0.9), Inches(3.05), Inches(11.5), Inches(2.2))
para(tf, "Maintenance assessments", 40, WHITE, bold=True, first=True, space_after=10, line_spacing=1.0)
para(tf, "There are 7 short knowledge checks on the Maintenance track (80% to pass, retake anytime). If your team is using Maintenance, please get these done — no deadline yet, but it lets us see how everyone's getting on.", 17, RGBColor(0xC7, 0xD0, 0xE0), space_after=0, line_spacing=1.25)
footer(s, 22)

out = os.path.expanduser("~/Desktop/PM Training - CRM 2.0 - wc 29 Sept.pptx")
prs.save(out)
print("Saved:", out)
print("Slides:", len(prs.slides._sldIdLst))
