from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

NAVY   = colors.HexColor('#1B2A4A')
TEAL   = colors.HexColor('#1D7874')
GOLD   = colors.HexColor('#C9A84C')
ORANGE = colors.HexColor('#E8570E')
LIGHT  = colors.HexColor('#F4F6F9')
WHITE  = colors.white
MID    = colors.HexColor('#6B7280')
DARK   = colors.HexColor('#1F2937')
RED_BG = colors.HexColor('#FEE2E2')
RED_FG = colors.HexColor('#991B1B')
AMB_BG = colors.HexColor('#FEF3C7')
AMB_FG = colors.HexColor('#92400E')
GRN_BG = colors.HexColor('#D1FAE5')
GRN_FG = colors.HexColor('#065F46')

W, H = A4

def S(name, **kw):
    return ParagraphStyle(name, **kw)

# ── Shared styles ─────────────────────────────────────────────────────────────
h1    = S('h1',    fontName='Helvetica-Bold', fontSize=17, textColor=NAVY,   leading=22, spaceAfter=5,  spaceBefore=14)
h2    = S('h2',    fontName='Helvetica-Bold', fontSize=12, textColor=NAVY,   leading=17, spaceAfter=4,  spaceBefore=10)
h3    = S('h3',    fontName='Helvetica-Bold', fontSize=10, textColor=TEAL,   leading=14, spaceAfter=3,  spaceBefore=7)
body  = S('body',  fontName='Helvetica',      fontSize=9.5, textColor=DARK,  leading=14, spaceAfter=4)
note  = S('note',  fontName='Helvetica',      fontSize=8.5, textColor=MID,   leading=13, spaceAfter=3)
wht   = S('wht',   fontName='Helvetica',      fontSize=9,   textColor=WHITE, leading=13)
whtb  = S('whtb',  fontName='Helvetica-Bold', fontSize=9,   textColor=WHITE, leading=13)
TH    = S('TH',    fontName='Helvetica-Bold', fontSize=8.5, textColor=WHITE, leading=12)
TD    = S('TD',    fontName='Helvetica',      fontSize=8.5, textColor=DARK,  leading=13)
TDm   = S('TDm',   fontName='Helvetica',      fontSize=8.5, textColor=MID,   leading=13)

CW = W - 60*mm   # content width

def divider(colour=TEAL, space=6):
    return HRFlowable(width='100%', thickness=1, color=colour, spaceAfter=space, spaceBefore=4)

def section_header(label, title, colour=TEAL):
    return [
        Paragraph(label.upper(), S('lbl', fontName='Helvetica-Bold', fontSize=8, textColor=colour, leading=11)),
        Paragraph(title, S('stitle', fontName='Helvetica-Bold', fontSize=18, textColor=NAVY, leading=24)),
        HRFlowable(width='100%', thickness=2, color=colour, spaceAfter=10, spaceBefore=4),
    ]

def banner(left_label, left_value, right_label, right_value, bg=NAVY):
    data = [[
        Paragraph(f'<b>{left_value}</b>', S('bv', fontName='Helvetica-Bold', fontSize=20, textColor=WHITE, leading=24, alignment=TA_CENTER)),
        Paragraph(left_label, S('bl', fontName='Helvetica', fontSize=9, textColor=colors.HexColor('#BFD0E8'), leading=12, alignment=TA_CENTER)),
        Paragraph(f'<b>{right_value}</b>', S('bv2', fontName='Helvetica-Bold', fontSize=20, textColor=WHITE, leading=24, alignment=TA_CENTER)),
        Paragraph(right_label, S('bl2', fontName='Helvetica', fontSize=9, textColor=colors.HexColor('#BFD0E8'), leading=12, alignment=TA_CENTER)),
    ]]
    t = Table(data, colWidths=[CW/4]*4)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LINEBEFORE', (1,0), (1,0), 0.5, colors.HexColor('#3B5173')),
        ('LINEBEFORE', (2,0), (2,0), 0.5, colors.HexColor('#3B5173')),
        ('LINEBEFORE', (3,0), (3,0), 0.5, colors.HexColor('#3B5173')),
    ]))
    return t

def info_box(text, bg=AMB_BG, border=GOLD):
    t = Table([[Paragraph(text, S('ib', fontName='Helvetica', fontSize=9, textColor=DARK, leading=14))]], colWidths=[CW])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('BOX', (0,0), (-1,-1), 1.5, border),
        ('TOPPADDING', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    return t

def two_col_table(rows_left, rows_right, pad=4):
    lc = [Paragraph(r, body) for r in rows_left]
    rc = [Paragraph(r, body) for r in rows_right]
    t = Table([[lc, rc]], colWidths=[CW/2, CW/2])
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), pad),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    return t

def step_row(num, title, desc, colour=TEAL):
    t = Table([[
        Paragraph(str(num), S('sn', fontName='Helvetica-Bold', fontSize=12, textColor=WHITE, leading=16, alignment=TA_CENTER)),
        [Paragraph(title, S('st', fontName='Helvetica-Bold', fontSize=9.5, textColor=NAVY, leading=14)),
         Paragraph(desc,  S('sd', fontName='Helvetica', fontSize=8.5, textColor=MID, leading=13))]
    ]], colWidths=[11*mm, CW - 11*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colour),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (1,0), (1,0), 10),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E7EB')),
    ]))
    return t

def data_table(headers, rows, col_widths, header_bg=NAVY):
    hrow = [Paragraph(h, TH) for h in headers]
    data = [hrow] + [[Paragraph(c, TD) for c in row] for row in rows]
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), header_bg),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [LIGHT, WHITE]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E7EB')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#D1D5DB')),
    ]))
    return t

def label_row(label, value, label_bg=TEAL, label_w=50*mm):
    t = Table([[
        Paragraph(label, S('lr', fontName='Helvetica-Bold', fontSize=9, textColor=WHITE, leading=13)),
        Paragraph(value, S('lv', fontName='Helvetica', fontSize=9, textColor=DARK, leading=13))
    ]], colWidths=[label_w, CW - label_w])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), label_bg),
        ('BACKGROUND', (1,0), (1,0), LIGHT),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#D1D5DB')),
    ]))
    return t

# ── Page template ─────────────────────────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    page = doc.page
    if page == 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, 0, W, H, fill=1, stroke=0)
        canvas.setFillColor(GOLD)
        canvas.rect(0, H - 6*mm, W, 6*mm, fill=1, stroke=0)
        canvas.setFillColor(TEAL)
        canvas.rect(0, 0, W, 16*mm, fill=1, stroke=0)
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(colors.HexColor('#BFD0E8'))
        canvas.drawCentredString(W/2, 6*mm, 'Confidential — Dwelly Group  |  2026')
    else:
        canvas.setFillColor(NAVY)
        canvas.rect(0, H - 10*mm, W, 10*mm, fill=1, stroke=0)
        canvas.setFont('Helvetica-Bold', 9)
        canvas.setFillColor(WHITE)
        canvas.drawString(20*mm, H - 6.5*mm, 'Dwelly')
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(colors.HexColor('#BFD0E8'))
        canvas.drawString(33*mm, H - 6.5*mm, 'Platform Overview')
        canvas.setFont('Helvetica', 8)
        canvas.drawRightString(W - 20*mm, H - 6.5*mm, f'Page {page}')
        canvas.setStrokeColor(colors.HexColor('#E5E7EB'))
        canvas.setLineWidth(0.5)
        canvas.line(20*mm, 14*mm, W - 20*mm, 14*mm)
        canvas.setFont('Helvetica', 7.5)
        canvas.setFillColor(MID)
        canvas.drawCentredString(W/2, 9*mm, 'Confidential — Dwelly Group  |  Internal use only  |  2026')
    canvas.restoreState()

# ── Build ─────────────────────────────────────────────────────────────────────
output_path = '/Users/charlielockwood/Portal build/Dwelly_Platform_Overview.pdf'
doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    leftMargin=30*mm, rightMargin=30*mm,
    topMargin=22*mm, bottomMargin=22*mm,
)

story = []

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 1 — COVER
# ══════════════════════════════════════════════════════════════════════════════
story.append(Spacer(1, 40*mm))
story.append(Paragraph('Dwelly', S('brand', fontName='Helvetica-Bold', fontSize=44, textColor=GOLD, leading=52)))
story.append(Spacer(1, 2*mm))
story.append(Paragraph('Platform Overview', S('ct', fontName='Helvetica-Bold', fontSize=30, textColor=WHITE, leading=38)))
story.append(Spacer(1, 6*mm))
story.append(Paragraph(
    'A full walkthrough of the Dwelly property management system — how it works, what it automates, and what it manages.',
    S('cs', fontName='Helvetica', fontSize=13, textColor=colors.HexColor('#BFD0E8'), leading=19)))
story.append(Spacer(1, 10*mm))
story.append(HRFlowable(width='35%', thickness=1.5, color=GOLD, spaceAfter=10))
story.append(Paragraph('May 2026  ·  Confidential', S('ctag', fontName='Helvetica', fontSize=10, textColor=GOLD, leading=14)))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 2 — SYSTEM OVERVIEW
# ══════════════════════════════════════════════════════════════════════════════
story += section_header('Overview', 'What Is Dwelly?')
story.append(Paragraph(
    'Dwelly is a full-stack property management platform built specifically for the UK residential lettings market. '
    'It manages the entire lifecycle of a tenancy — from onboarding a landlord through to deposit return at the end of '
    'a tenancy — within a single system. Every interaction, communication, job update, and document is logged in one place.',
    body))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Automation-first design', h2))
story.append(Paragraph(
    'Dwelly operates on an automation-first model. The system handles routine communications — contractor notifications, '
    'tenant reminders, certificate renewals, compliance chasers — automatically, without the property manager needing '
    'to take action. Staff work the exceptions; the system handles the process.',
    body))
story.append(Spacer(1, 3*mm))
story.append(info_box(
    'Dwelly uses masked phone numbers and controlled communication flows for all calls and messages. '
    'Every call is transcribed. Every email is parsed and logged. '
    'This means the full history of every job is automatically recorded, with no reliance on staff remembering to document.',
    bg=colors.HexColor('#EFF6FF'), border=colors.HexColor('#3B82F6')))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Access levels', h2))
story.append(data_table(
    ['Access Level', 'Typical Users', 'Key Permissions'],
    [
        ['Manager',     'Property Managers, Lettings Negotiators, Finance Administrators', 'View and manage tasks within their zone of responsibility for their agency'],
        ['Supervisor',  'Team Coordinators', 'All Manager permissions, plus editing of contact data, restoring declined offers, property publication and withdrawal'],
        ['Admin',       'Agency MDs, Central Ops', 'All Supervisor permissions, plus removing landlords, editing Terms of Business'],
        ['Superadmin',  'Core Tech Team', 'Full system control including access rights and platform configuration'],
    ],
    [42*mm, 54*mm, CW - 96*mm]
))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Key system areas', h2))
areas = [
    (TEAL,   'Maintenance',           'End-to-end job management from tenant report to invoice. Automated contractor contact, visit scheduling, and escalation.'),
    (NAVY,   'Compliance',            'Certificate tracking for every property: gas safety, EICR, EPC, RtR, HMO and more. Automated renewals and certificate serving.'),
    (ORANGE, 'Move-Outs',             'Structured checkout flow: inspection, condition assessment, deposit calculation, and formal tenancy closure.'),
    (TEAL,   'Inspections',           'Routine mid-tenancy visits auto-scheduled per agency, integrated with Property Specialist calendars.'),
    (NAVY,   'Right to Rent',         'Automated re-verification for time-limited immigration status. Share code validation and visual likeness checks.'),
    (TEAL,   'Lettings Pipeline',     'Property publication, applicant management, viewings, offers, and move-in coordination.'),
    (NAVY,   'Finance & Ledger',      'Rent collection, commission fees, deposit records, and financial reporting across the full portfolio.'),
    (ORANGE, 'Support',               'Inbound contact tracking for queries that fall outside of active jobs — tenant, landlord, and provider requests.'),
]
for col, title_, desc in areas:
    t = Table([[
        Paragraph(title_, S('at', fontName='Helvetica-Bold', fontSize=9.5, textColor=WHITE, leading=13)),
        Paragraph(desc,   S('ad', fontName='Helvetica', fontSize=9, textColor=DARK, leading=13))
    ]], colWidths=[42*mm, CW - 42*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), col),
        ('BACKGROUND', (1,0), (1,0), LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (0,0), 10),
        ('LEFTPADDING', (1,0), (1,0), 12),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#D1D5DB')),
    ]))
    story.append(t)
    story.append(Spacer(1, 2.5*mm))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 3 — PROPERTIES & NAVIGATION
# ══════════════════════════════════════════════════════════════════════════════
story += section_header('Navigation', 'Properties & System Navigation', TEAL)
story.append(Paragraph(
    'Every element of the platform is accessible from Dwelly Home — the left-hand control panel. '
    'A Global Search at the top of the screen allows any property address, tenant name, landlord, or provider '
    'to be found instantly across the whole agency portfolio.',
    body))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Property lifecycle statuses', h2))
story.append(data_table(
    ['Status', 'What it means'],
    [
        ['Prospect',    'Potential property — Terms of Business not yet signed.'],
        ['New',         'Added to the system but not yet published on portals.'],
        ['Published',   'Live on Dwelly and syndicated to Rightmove, Zoopla, and OnTheMarket.'],
        ['Let Agreed',  'Tenant selected and holding deposit paid.'],
        ['Tenanted',    'Tenant has moved in and the tenancy is active.'],
        ['Withdrawn',   'No longer managed — sold, lost, or removed from portfolio.'],
        ['Offboarding', 'Leaving Dwelly — pending actions still to complete (keys, deposits, etc.).'],
    ],
    [32*mm, CW - 32*mm]
))
story.append(Spacer(1, 5*mm))

story.append(Paragraph('Property information screen', h2))
story.append(Paragraph(
    'Clicking into any property opens a full information screen with the following tabs:',
    body))
story.append(data_table(
    ['Tab', 'Contents'],
    [
        ['Property',      'Bedrooms, bathrooms, floor, rental price, deposit, pet/child preferences, parking, EPC rating.'],
        ['Maintenance',   'All maintenance and compliance jobs. Sub-tabs: Primary, Task List, Ownership Shares, Property Metres.'],
        ['Ledger',        'Full financial records for the property, landlord, and tenant, with paginated transaction history.'],
        ['Publications',  'How the listing appears on portals. Managed by the contents team.'],
        ['File Manager',  'All documents: AST, Right to Rent checks, compliance certificates, referencing reports, inventories.'],
        ['Deals',         'All enquiries received for the property (not offers).'],
        ['Offers',        'All offers made, with landlord preference notes visible.'],
        ['Notes',         'Internal notes for property, landlord, and tenancy — not visible externally.'],
        ['Fees',          'Agency commission, deposit details, inspection frequency, and all charges linked to the property.'],
    ],
    [28*mm, CW - 28*mm]
))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('My Jobs — the personal task queue', h2))
story.append(Paragraph(
    'Every user has a My Jobs tab showing all tasks currently assigned to them, ordered from most urgent to least urgent. '
    'When a job is actioned and returned to Auto Mode, Dwelly removes it from the queue and re-adds it only when human '
    'intervention is needed. Jobs are never silently dropped — every escalation returns to the assigned PM.',
    body))
story.append(Spacer(1, 3*mm))
story.append(info_box(
    'Once any job type has been closed, it cannot be reopened under any circumstances. No further edits can be made after closure. '
    'This protects the audit trail and prevents retrospective changes to completed records.',
    bg=RED_BG, border=colors.HexColor('#EF4444')))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 4 — MAINTENANCE
# ══════════════════════════════════════════════════════════════════════════════
story += section_header('Maintenance', 'Maintenance Job Management', ORANGE)
story.append(Paragraph(
    'Maintenance is the highest-volume workflow in the system. Dwelly manages every stage of a maintenance job — '
    'from the initial report to final invoice — with automation handling the majority of communications.',
    body))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('How jobs are created', h2))
story.append(two_col_table(
    ['<b>Automatic (Tenant Portal)</b>\nTenants report issues through the Dwelly Tenant Portal. The system auto-creates the job and assigns it to the responsible PM.'],
    ['<b>Manual (PM created)</b>\nProperty Management tab → + Add Request → Maintenance Request → enter address, description, and any files → Create Job.'],
))
story.append(Spacer(1, 5*mm))

story.append(Paragraph('The maintenance job flow', h2))
steps_m = [
    (1, 'Job Created & Assigned',    'Job enters the PM\'s queue. All communication from this point must happen inside the Job Chat.'),
    (2, 'Landlord Consent',          'System sends an approval request. Job enters Auto Mode while awaiting response. If landlord wishes to use their own contractor, tenant contact details are shared and the job moves to On Hold.'),
    (3, 'Provider Instructed',       'PM selects the service category and contractor. Auto Mode sends visit notifications to tenant and contractor, then automated reminders at 24, 48, and 96 hours if no response.'),
    (4, 'Visit Date Confirmed',      'Date extracted from masked call transcription, provider email, or manual PM entry. Confirmation sent to tenant and contractor. Tenant receives a reminder SMS 24 hours before the visit.'),
    (5, 'Result & Invoice Upload',   'PM selects outcome: Job Completed, Quote Approved (returns to scheduling), or Additional Quote Required. Invoice and proof of works uploaded. Payment allocation selected (agency pays for LL, LL pays directly, or tenant pays).'),
]
for num, title_, desc in steps_m:
    story.append(step_row(num, title_, desc, ORANGE))
    story.append(Spacer(1, 2.5*mm))

story.append(Spacer(1, 4*mm))
story.append(Paragraph('Auto Mode vs On Hold', h2))
story.append(Paragraph(
    'Every job has a mode state. Getting this right reduces manual admin significantly.',
    body))
story.append(data_table(
    ['Mode', 'What it does', 'When to use it'],
    [
        ['Auto',    'Dwelly handles all communications: notifications, reminders, chasers, confirmations.',   'Default for all jobs. Engage whenever you have completed your part and are waiting for another party.'],
        ['Pause',   'Automation paused. Task returns to queue after the hold period expires.',                'Awaiting landlord/tenant response (48-hour hold recommended). Long-lead work. Landlord using own contractor.'],
        ['Manual',  'No automated messages will be sent at all.',                                             'Only when no automated communications should go out. Cannot return to Auto afterwards.'],
        ['MP_TIME_FORCE', 'All automation paused — PM must take direct control.',                            'Applied automatically when a certificate is near or past expiry, or the property is vacant.'],
    ],
    [28*mm, 62*mm, CW - 90*mm]
))
story.append(Spacer(1, 3*mm))
story.append(info_box(
    'Do not use consecutive On Holds. When a hold expires, call the relevant party before applying another. '
    'If a quote has been approved, use Assign Progress to return to Auto Mode immediately — do not leave the job on Pause.',
    bg=AMB_BG, border=GOLD))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 5 — COMPLIANCE
# ══════════════════════════════════════════════════════════════════════════════
story += section_header('Compliance', 'Compliance Certificate Management', NAVY)
story.append(Paragraph(
    'Dwelly tracks all mandatory property compliance certificates across every managed property. '
    'Renewals are triggered automatically 30 days before expiry, and certificates are served to '
    'landlords and tenants by the system once uploaded.',
    body))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Certificates tracked per property', h2))
story.append(data_table(
    ['Certificate', 'Renewal Frequency', 'System behaviour'],
    [
        ['Gas Safety (CP12)',           'Annual',         'Job auto-created 30 days before expiry. Certificate served automatically to landlord and tenant once uploaded.'],
        ['EICR (Electrical)',           'Every 5 years',  'C1/C2 failures require remedial works within 28 days. System tracks remedial completion before marking compliant.'],
        ['EPC (Energy Performance)',    'Every 10 years', 'Minimum Band E required under MEES. If landlord declines renewal, marked as Not Needed and TC closes the job.'],
        ['Legionella Risk Assessment',  'Periodic',       'Landlord responsibility. Logged in File Manager. Manual job flow — no automated system emails.'],
        ['PAT Testing',                 'Annual',         'Required where landlord provides electrical appliances. Failed appliances must be removed or re-tested.'],
        ['HMO Licence',                 'Every 5 years',  'Fully manual task flow. No automatic communications. All coordination via Job Chat.'],
        ['Right to Rent',               'Per immigration status expiry', 'Job auto-created 2 months before expiry. Automated email to tenant requesting share code.'],
        ['Smoke & CO Alarms',           'Each tenancy',   'Confirmed at check-in. Noted in inventory report.'],
        ['Fire Risk Assessment',        'Periodic / on change', 'Low risk may use written confirmation. Medium/high risk requires updated FRA and new certificate.'],
    ],
    [44*mm, 32*mm, CW - 76*mm]
))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Compliance job flow', h2))
steps_c = [
    (1, 'Auto-creation',        'System generates the job 30 days before expiry and places it in the PM\'s queue.'),
    (2, 'Landlord consent',     'PM contacts landlord to approve renewal. If no response within 2 weeks of expiry, proceed without approval.'),
    (3, 'Provider assigned',    'Preferred provider selected. Auto Mode sends instructions, notifies landlord and tenant, and sends 24/48-hour chasers if no response.'),
    (4, 'Visit date confirmed', 'Extracted via call transcription, email, or manual entry. Confirmations sent to all parties. Tenant reminder 24 hours before.'),
    (5, 'Certificate uploaded', 'Both certificate and invoice uploaded. System auto-serves certificate to landlord and tenant. Job closes.'),
]
for num, title_, desc in steps_c:
    story.append(step_row(num, title_, desc, NAVY))
    story.append(Spacer(1, 2.5*mm))

story.append(Spacer(1, 4*mm))
story.append(Paragraph('Handling remedial works', h2))
story.append(Paragraph(
    'If a certificate is returned as unsatisfactory, the property is treated as non-compliant until valid remedial '
    'evidence is received. The unsatisfactory certificate is uploaded to File Manager (not the job) to prevent it '
    'being served to all parties. A new maintenance job is raised for the remedial works. Once complete, the '
    'compliant certificate is uploaded to the original compliance job.',
    body))
story.append(Spacer(1, 3*mm))
story.append(data_table(
    ['Certificate', 'Remedial requirement'],
    [
        ['EICR',                    'C1/C2 items: remedial works within 28 days. Written confirmation or Minor Works Certificate required.'],
        ['Gas Safety (CP12)',        'If marked unsafe (ID or AR): Gas Safe engineer repairs and new certificate always required.'],
        ['Fire alarm / emergency lighting', 'Failed: remedial works completed and system re-tested. New pass certificate required.'],
        ['PAT',                     'Failed appliances must be removed, repaired, and re-tested before re-use.'],
        ['EPC',                     'If below legal minimum: improvement works and new EPC assessment required before re-letting.'],
    ],
    [44*mm, CW - 44*mm]
))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 6 — MOVE-OUTS
# ══════════════════════════════════════════════════════════════════════════════
story += section_header('Move-Outs', 'End of Tenancy & Deposit Return', TEAL)
story.append(Paragraph(
    'The move-out workflow manages everything from notice receipt through to formal tenancy closure, '
    'deposit return, and property readiness for re-let. It directly affects void periods and must be actioned promptly.',
    body))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('How move-out jobs are created', h2))
story.append(two_col_table(
    ['<b>Tenant Portal (automatic)</b>\nTenant submits notice. Dwelly creates the job, assigns it to the PM, and records the proposed move-out date.'],
    ['<b>Manual (PM created)</b>\nUsed when tenant contacts by phone or email, or when a landlord requests the property back. Property Management → + Add Request → Move-Out Request.'],
))
story.append(Spacer(1, 5*mm))

story.append(Paragraph('Move-out flow', h2))
steps_mo = [
    (1,  'Notice received',            'Check correct notice period has been given. Verify any special tenancy conditions. Update move-out date — Lettings Negotiators rely on this to progress re-let.'),
    (2,  'Check-out inspection scheduled', 'Booked using the integrated Property Specialist calendar (internal) or agreed directly with a third party. System sends tenant confirmation and 24-hour SMS reminder.'),
    (3,  'Inspection report uploaded', 'Inspector sends the report. PM uploads it to the job. Check-in inventory is visible alongside for comparison.'),
    (4,  'Meter readings entered',     'Water, gas, and electricity readings entered from the check-out report. If meters are missing, added via Properties → Maintenance → Property Metres.'),
    (5,  'Property condition assessed','Green (clean, deposit returned in full), Yellow (cleaning required — costs assigned), or Red (damage found — repair costs calculated).'),
    (6,  'Maintenance jobs raised',    'All open maintenance jobs reviewed. Each is allocated as landlord responsibility or tenant damage. Payment allocation entered per job.'),
    (7,  'Deposit calculation',        'Dwelly automatically calculates the deposit return based on condition assessment and maintenance allocations. Landlord receives cost breakdown; tenant receives deduction summary with 14-day dispute window.'),
    (8,  'Tenancy formally closed',    'Three actions required: Tenancy Ended (stops invoice generation), Mediation Finished (deposit fully resolved), Property Ready (ready for re-let). Keys confirmed returned. Final close button permanently closes the job.'),
]
for num, title_, desc in steps_mo:
    story.append(step_row(num, title_, desc, TEAL))
    story.append(Spacer(1, 2*mm))

story.append(Spacer(1, 3*mm))
story.append(data_table(
    ['Responsibility', 'Who pays', 'Example'],
    [
        ['Normal wear and tear', 'Landlord', 'Boiler breakdown with no evidence of tenant misuse.'],
        ['Tenant damage',        'Tenant',   'Wall damage or broken fixtures found at checkout.'],
        ['Move-out cleaning',    'Tenant',   'Property not left clean per the tenancy agreement.'],
    ],
    [46*mm, 28*mm, CW - 74*mm]
))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 7 — INSPECTIONS & RIGHT TO RENT
# ══════════════════════════════════════════════════════════════════════════════
story += section_header('Inspections & Right to Rent', 'Mid-Tenancy Processes', TEAL)

story.append(Paragraph('Inspections', h1))
story.append(Paragraph(
    'Inspection jobs are never created manually. The system automatically generates them based on the date of the '
    'last inspection and the inspection frequency set by each agency.',
    body))
story.append(Spacer(1, 3*mm))

story.append(Paragraph('Agency inspection schedules', h2))
story.append(data_table(
    ['Agency', 'First inspection', 'Repeat frequency'],
    [
        ['Lime',              'After 3 months', 'Every 6 months'],
        ['GR',                'After 1 month',  'Every 4 months'],
        ['Pennington',        'After 3 months', 'Every 6 months'],
        ['Brookdale',         'After 3 months', 'Every 6 months'],
        ['Parks',             'Every 6 months', 'Every 6 months'],
        ['HC Lettings',       'After 4 months', 'Every 6 months'],
        ['Number 1 Lettings', 'After 4 months', 'Every 6 months'],
    ],
    [44*mm, 36*mm, CW - 80*mm]
))
story.append(Spacer(1, 3*mm))
story.append(Paragraph(
    'Dwelly creates the inspection job 14 days before it is due. The system integrates with the Property Specialist\'s '
    'Google Calendar — the PM selects an available slot directly in the system. Once booked, the tenant receives a '
    'confirmation and an SMS reminder 24 hours before the visit.',
    body))
story.append(Spacer(1, 3*mm))
story.append(Paragraph(
    'After the visit, the PM uploads the report, records the date and expiry, and selects the property condition. '
    'If issues are identified, a separate maintenance job is created. The landlord is automatically notified '
    'of the outcome with the report attached.',
    body))

story.append(Spacer(1, 6*mm))
story.append(divider(NAVY))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Right to Rent — during-tenancy re-verification', h1))
story.append(Paragraph(
    'Where a tenant\'s immigration status is time-limited, Right to Rent must be re-verified during the tenancy. '
    'Dwelly automates this process from start to finish.',
    body))
story.append(Spacer(1, 3*mm))

steps_rtr = [
    (1, 'Job auto-created',         'System creates the job 2 months before the tenant\'s RtR expiry date and sends an automatic email requesting their share code and date of birth.'),
    (2, 'Automated chasing',        'If no response in 96 hours, a second reminder is sent automatically. After 7 days with no reply, the job switches to Manual mode and returns to the PM\'s queue.'),
    (3, 'Share code entered',        'PM enters the share code and date of birth into the job. System submits the verification request. Valid code = job auto-completes. Invalid code = returns to PM queue for follow-up.'),
    (4, 'Visual likeness check',    'PM conducts a video call to confirm the tenant\'s likeness matches the document and that all personal details are correct. If details do not match, the job is escalated to the Team Coordinator immediately.'),
]
for num, title_, desc in steps_rtr:
    story.append(step_row(num, title_, desc, NAVY))
    story.append(Spacer(1, 2.5*mm))

story.append(Spacer(1, 3*mm))
story.append(info_box(
    'Closing and cancelling Right to Rent tasks is restricted to Supervisor-level users only. '
    'If a task needs to be closed, this must be actioned by a Team Coordinator or Product Support.',
    bg=colors.HexColor('#EFF6FF'), border=colors.HexColor('#3B82F6')))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 8 — COMMUNICATION & AUDIT
# ══════════════════════════════════════════════════════════════════════════════
story += section_header('Communication & Audit', 'How Dwelly Logs Everything', TEAL)
story.append(Paragraph(
    'Every action taken in the system — every call, email, SMS, stage change, mode change, and internal note — '
    'is automatically captured in the Job Chat. This creates a complete, immutable audit trail for every job.',
    body))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('The Job Chat', h2))
story.append(data_table(
    ['Communication type', 'What happens'],
    [
        ['Outbound call',      'Placed through Dwelly\'s masked number system. Call is transcribed automatically and the transcript added to the Job Chat.'],
        ['Inbound call',       'Received on the masked number. Transcribed and logged against the relevant job.'],
        ['Email (outbound)',   'Sent directly from the job. Reply comes back into the job chat. Full thread visible in one place.'],
        ['SMS',                'Sent from the job to tenant, contractor, or landlord. Delivery and any replies logged automatically.'],
        ['Internal note',      'Left on the task, property, landlord, or tenancy. Pinned notes visible across all jobs for that property.'],
        ['System log',         'Every auto-action (reminder sent, mode change, stage change) recorded with timestamp.'],
    ],
    [40*mm, CW - 40*mm]
))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Masked numbers & controlled communication', h2))
story.append(Paragraph(
    'Dwelly uses masked phone numbers for all calls and messages between staff, tenants, contractors, and landlords. '
    'Direct contact details are never shared externally. This protects compliance, traceability, and automation — '
    'if a tenant calls a contractor directly using a number shared outside the system, Dwelly loses the ability '
    'to log the outcome or trigger automations based on the response.',
    body))
story.append(Spacer(1, 3*mm))
story.append(info_box(
    'All communication for any job must be sent and replied to inside Dwelly. Using external tools such as Outlook means '
    'the system cannot capture the information, resulting in incomplete job histories and broken automations.',
    bg=RED_BG, border=colors.HexColor('#EF4444')))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Notes — property, landlord, tenancy', h2))
story.append(Paragraph(
    'Notes can be attached to a specific job, or to the wider property, landlord, or tenancy record. '
    'Pinned property notes are visible across all active jobs for that property — used for standing landlord '
    'preferences, key access arrangements, or recurring instructions that every PM needs to see.',
    body))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Support jobs', h2))
story.append(Paragraph(
    'When a tenant, landlord, or provider contacts the agency about something outside an active job — '
    'such as a query after a job has closed, or a general question — Dwelly automatically creates a Support job. '
    'Support jobs are always in Manual Mode: no automations fire, and the PM handles the request from start to finish. '
    'Support jobs cannot be created manually by staff; they are always triggered by an inbound contact.',
    body))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 9 — FINANCE & LETTINGS
# ══════════════════════════════════════════════════════════════════════════════
story += section_header('Finance & Lettings', 'Financial Management & Lettings Pipeline', NAVY)

story.append(Paragraph('Financial management', h1))
story.append(Paragraph(
    'The Finance tab provides full financial reporting and transaction records at both property and agency level. '
    'Each property has a Ledger showing all charges, payments, and transactions — with pagination for high-volume histories.',
    body))
story.append(Spacer(1, 3*mm))
story.append(data_table(
    ['Financial area', 'What the system manages'],
    [
        ['Rent collection',          'Invoice generation tied to tenancy start date. Stopping invoice generation requires Tenancy Ended to be clicked — this does not happen automatically.'],
        ['Deposit management',       'Deposit amount, scheme used (TDS, DPS, mydeposits), registration, and return. Dwelly calculates the return based on checkout assessment and maintenance allocations.'],
        ['Agency commission',        'Commission fees linked to each property in the Fees tab. Visible at property and agency level.'],
        ['Invoice allocation',       'Each maintenance or compliance job has a payment allocation: agency pays for landlord (deducted from rent), landlord pays directly, or tenant pays.'],
        ['Property Metres',          'Meter readings for water, gas, and electricity tracked per property. Used at move-out for final readings and utility notifications.'],
    ],
    [44*mm, CW - 44*mm]
))
story.append(Spacer(1, 5*mm))
story.append(divider(TEAL))
story.append(Spacer(1, 4*mm))

story.append(Paragraph('Lettings pipeline', h1))
story.append(Paragraph(
    'The lettings side of the system manages properties from initial publication through to a completed tenancy. '
    'Applicant management, viewings, offers, and move-in coordination all sit within the same platform.',
    body))
story.append(Spacer(1, 3*mm))
story.append(data_table(
    ['Stage', 'System function'],
    [
        ['Publication',         'Property published on Dwelly and syndicated to Rightmove, Zoopla, and OnTheMarket. Managed via the Publications tab on each property.'],
        ['Enquiries & Deals',   'All enquiries tracked in the Deals tab. Viewings scheduled and managed within the system.'],
        ['Offers',              'All offers visible in the Offers tab with landlord preference notes. Declined offers can be restored by Supervisors.'],
        ['Let Agreed',          'Holding deposit paid. Tenancy moves to Let Agreed status. Referencing and Right to Rent initiated.'],
        ['Move-in',             'Check-in inventory conducted. Tenancy status moves to Tenanted. Keys and access confirmed.'],
        ['Re-let visibility',   'Once Property Ready is clicked at end of tenancy, Lettings Negotiators can see the property is available. Move-out date kept current in the system to manage pipeline.'],
    ],
    [34*mm, CW - 34*mm]
))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 10 — CLOSING
# ══════════════════════════════════════════════════════════════════════════════
story.append(Spacer(1, 32*mm))
story.append(HRFlowable(width='100%', thickness=2, color=TEAL, spaceAfter=14))
story.append(Paragraph('Dwelly Platform Overview',
    S('cl1', fontName='Helvetica-Bold', fontSize=20, textColor=NAVY, leading=26, alignment=TA_CENTER)))
story.append(Spacer(1, 4*mm))
story.append(Paragraph(
    'This document provides a high-level overview of the Dwelly property management system\nfor demonstration purposes.',
    S('cl2', fontName='Helvetica', fontSize=11, textColor=MID, leading=18, alignment=TA_CENTER)))
story.append(Spacer(1, 10*mm))
story.append(HRFlowable(width='25%', thickness=1, color=GOLD, spaceAfter=10))
story.append(Paragraph('dwelly.group  ·  charlie@dwelly.group',
    S('cl3', fontName='Helvetica', fontSize=10, textColor=MID, leading=14, alignment=TA_CENTER)))

# ── Generate ──────────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print(f"PDF written to: {output_path}")
