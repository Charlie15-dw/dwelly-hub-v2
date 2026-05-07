import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// ── Colours ───────────────────────────────────────────────────────────────────
const NAVY  = '#1B2A4A'
const TEAL  = '#1D7874'
const GOLD  = '#C9A84C'
const LIGHT = '#F5F5F7'
const MID   = '#6E6E73'
const RED   = '#DC2626'
const AMBER = '#D97706'
const GREEN = '#059669'

// ── Assessment labels ─────────────────────────────────────────────────────────
const ASSESSMENT_LABELS: Record<string, string> = {
  'mnt-01': 'Maintenance 1/2 — Creating a Repair Request',
  'mnt-02': 'Maintenance 2/2 — Actioning the Maintenance Task',
  'cmp-01': 'Compliance 1/2 — Creating a Compliance Task',
  'cmp-02': 'Compliance 2/2 — Actioning the Compliance Task',
  'mnt-03': 'Inspections 1/2 — Creating an Inspection Task',
  'ins-02': 'Inspections 2/2 — Completing the Inspection',
  'sys-01': 'Move-Outs 1/2 — Initiating the Move-Out Process',
  'mvt-02': 'Move-Outs 2/2 — Completing the Move-Out',
  'sys-02': 'Support 1/2 — Raising a Support Task',
  'sup-02': 'Support 2/2 — Actioning the Support Task',
  'kno-01': 'Knowledge — Difficult Conversations',
  'kno-02': 'Knowledge — Handling Disrepair Claims',
  'kno-03': 'Knowledge — Understanding a P&L',
  'full-assessment':   'Full Programme Assessment',
  'master-assessment': 'Master Assessment',
}

const ALL_ASSESSMENT_IDS = Object.keys(ASSESSMENT_LABELS)

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page:         { fontFamily: 'Helvetica', fontSize: 9, color: NAVY, paddingTop: 40, paddingBottom: 50, paddingHorizontal: 40 },
  // Header
  headerBar:    { backgroundColor: NAVY, borderRadius: 8, padding: 20, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft:   { flex: 1 },
  headerLabel:  { fontSize: 7, color: '#8ECFCC', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  headerName:   { fontSize: 18, color: '#FFFFFF', fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  headerRole:   { fontSize: 9, color: '#5AADA8', marginBottom: 1 },
  headerEmail:  { fontSize: 8, color: '#6B7280' },
  headerRight:  { alignItems: 'flex-end' },
  headerDate:   { fontSize: 7, color: '#8ECFCC' },
  headerScore:  { fontSize: 22, color: GOLD, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  headerScoreLbl: { fontSize: 7, color: '#8ECFCC', textAlign: 'right' },
  // Stats row
  statsRow:     { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statBox:      { flex: 1, backgroundColor: LIGHT, borderRadius: 6, padding: 10 },
  statValue:    { fontSize: 18, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 2 },
  statLabel:    { fontSize: 7, color: MID },
  statSub:      { fontSize: 6, color: '#9CA3AF', marginTop: 1 },
  // Section
  sectionTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 6, marginTop: 12 },
  divider:      { borderBottomWidth: 1, borderBottomColor: '#E8E8ED', marginBottom: 8 },
  // Assessment rows
  assessmentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 5, marginBottom: 3 },
  assessmentLabel: { flex: 1, fontSize: 8 },
  assessmentScore: { fontSize: 9, fontFamily: 'Helvetica-Bold', width: 36, textAlign: 'right' },
  assessmentBadge: { fontSize: 7, fontFamily: 'Helvetica-Bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, marginLeft: 6 },
  // Sign-off gates
  gateRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 5, marginBottom: 3 },
  gateName:     { flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold' },
  gateDesc:     { flex: 2, fontSize: 7, color: MID },
  gateStatus:   { fontSize: 7, fontFamily: 'Helvetica-Bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, marginLeft: 6 },
  // Progress bar
  progressBg:   { height: 5, backgroundColor: '#E8E8ED', borderRadius: 3, marginTop: 4 },
  progressFill: { height: 5, borderRadius: 3 },
  // Footer
  footer:       { position: 'absolute', bottom: 24, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText:   { fontSize: 7, color: '#9CA3AF' },
  footerBrand:  { fontSize: 7, color: MID, fontFamily: 'Helvetica-Bold' },
  // Not attempted
  notAttempted: { fontSize: 8, color: '#9CA3AF', paddingVertical: 3, paddingHorizontal: 8 },
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(date: string | null | undefined) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function scoreColor(score: number) {
  if (score >= 80) return GREEN
  if (score >= 65) return AMBER
  return RED
}

// ── PDF Document ──────────────────────────────────────────────────────────────
function PassportDocument({
  name, email, role, startDate, generatedAt,
  completedCount, avgScore, results,
}: {
  name: string
  email: string
  role: string
  startDate: string
  generatedAt: string
  completedCount: number
  avgScore: number | null
  results: { assessment_id: string; score: number; passed: boolean; completed_at: string | null }[]
}) {
  // Latest attempt per assessment
  const latestByModule = new Map<string, typeof results[0]>()
  for (const r of results) {
    const existing = latestByModule.get(r.assessment_id)
    if (!existing || new Date(r.completed_at ?? 0) > new Date(existing.completed_at ?? 0)) {
      latestByModule.set(r.assessment_id, r)
    }
  }

  const progressPct = Math.round((completedCount / ALL_ASSESSMENT_IDS.length) * 100)
  const passedIds = new Set(results.filter(r => r.passed).map(r => r.assessment_id))
  const signOffGates = [
    { area: 'Gas Safety',         risk: 'High', description: 'Gas safety obligations & solo property management', signedOff: false },
    { area: 'Deposit Protection',  risk: 'High', description: 'Deposit processing through approved scheme',        signedOff: false },
  ]

  const roleLabel = role === 'manager' ? 'Manager'
    : role === 'admin' ? 'Admin'
    : role?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) ?? 'Property Manager'

  return (
    <Document title={`Competency Passport — ${name}`} author="Dwelly Training Portal">
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.headerBar}>
          <View style={s.headerLeft}>
            <Text style={s.headerLabel}>Competency Passport</Text>
            <Text style={s.headerName}>{name}</Text>
            <Text style={s.headerRole}>{roleLabel}</Text>
            <Text style={s.headerEmail}>{email}</Text>
            <Text style={[s.headerEmail, { marginTop: 6 }]}>Programme start: {fmt(startDate)}</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerDate}>Generated {generatedAt}</Text>
            {avgScore !== null && (
              <>
                <Text style={s.headerScore}>{avgScore}%</Text>
                <Text style={s.headerScoreLbl}>Avg Assessment Score</Text>
              </>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { value: `${completedCount}/${ALL_ASSESSMENT_IDS.length}`, label: 'Assessments Passed', sub: `of ${ALL_ASSESSMENT_IDS.length} total` },
            { value: `${progressPct}%`,  label: 'Programme Progress',  sub: 'based on assessments passed' },
            { value: avgScore !== null ? `${avgScore}%` : '—', label: 'Average Score', sub: 'pass threshold: 80%' },
            { value: '0/2', label: 'Sign-Off Gates', sub: '2 pending manager approval' },
          ].map(({ value, label, sub }) => (
            <View key={label} style={s.statBox}>
              <Text style={s.statValue}>{value}</Text>
              <Text style={s.statLabel}>{label}</Text>
              <Text style={s.statSub}>{sub}</Text>
            </View>
          ))}
        </View>

        {/* Progress bar */}
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width: `${progressPct}%`, backgroundColor: progressPct >= 60 ? TEAL : progressPct >= 20 ? GOLD : RED }]} />
        </View>
        <Text style={{ fontSize: 7, color: MID, marginTop: 3, marginBottom: 12 }}>
          Overall programme progress: {progressPct}%
        </Text>

        {/* Assessment Results */}
        <Text style={s.sectionTitle}>Assessment Results</Text>
        <View style={s.divider} />

        {ALL_ASSESSMENT_IDS.map(id => {
          const r = latestByModule.get(id)
          const label = ASSESSMENT_LABELS[id]
          if (!r) {
            return (
              <View key={id} style={[s.assessmentRow, { backgroundColor: '#F9FAFB' }]}>
                <Text style={[s.assessmentLabel, { color: '#9CA3AF' }]}>{label}</Text>
                <Text style={[s.assessmentBadge, { color: '#9CA3AF', backgroundColor: '#F3F4F6' }]}>Not attempted</Text>
              </View>
            )
          }
          const bg = r.passed ? '#F0FDF4' : '#FEF2F2'
          const badgeColor = r.passed ? GREEN : RED
          const badgeBg = r.passed ? '#DCFCE7' : '#FEE2E2'
          return (
            <View key={id} style={[s.assessmentRow, { backgroundColor: bg }]}>
              <Text style={s.assessmentLabel}>{label}</Text>
              <Text style={[s.assessmentScore, { color: scoreColor(r.score) }]}>{r.score}%</Text>
              <Text style={[s.assessmentBadge, { color: badgeColor, backgroundColor: badgeBg }]}>
                {r.passed ? 'Passed' : 'Failed'}
              </Text>
              <Text style={[s.assessmentBadge, { color: '#6B7280', backgroundColor: '#F3F4F6' }]}>
                {fmt(r.completed_at)}
              </Text>
            </View>
          )
        })}

        {/* Competency Sign-Off Gates */}
        <Text style={s.sectionTitle}>Competency Sign-Off Gates</Text>
        <View style={s.divider} />
        {signOffGates.map(g => (
          <View key={g.area} style={[s.gateRow, { backgroundColor: g.signedOff ? '#F0FDF4' : '#FEF2F2' }]}>
            <Text style={s.gateName}>{g.area}</Text>
            <Text style={s.gateDesc}>{g.description}</Text>
            <Text style={[s.gateStatus, {
              color: g.signedOff ? GREEN : RED,
              backgroundColor: g.signedOff ? '#DCFCE7' : '#FEE2E2',
            }]}>
              {g.signedOff ? 'Signed Off' : 'Pending'}
            </Text>
            <Text style={[s.gateStatus, { color: '#D97706', backgroundColor: '#FEF3C7', marginLeft: 4 }]}>
              {g.risk} Risk
            </Text>
          </View>
        ))}

        {/* T&C Supervision */}
        <Text style={s.sectionTitle}>T&C Supervision — 90-Day Supervised Period</Text>
        <View style={s.divider} />
        {[
          'Week 1 Observation',
          'Month 1 Review',
          'Month 2 Review',
          'Month 3 Sign-Off',
        ].map(label => (
          <View key={label} style={[s.assessmentRow, { backgroundColor: '#F9FAFB' }]}>
            <Text style={[s.assessmentLabel, { color: MID }]}>{label}</Text>
            <Text style={[s.assessmentBadge, { color: '#9CA3AF', backgroundColor: '#F3F4F6' }]}>Pending manager update</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Dwelly Training Portal · 2026–2027 Programme · Confidential</Text>
          <Text style={s.footerBrand}>dwelly.co.uk</Text>
        </View>

      </Page>
    </Document>
  )
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: profile }, { data: resultRows }] = await Promise.all([
    supabase.from('user_profiles').select('full_name, role, created_at').eq('id', user.id).maybeSingle(),
    supabase.from('assessment_results').select('assessment_id, score, passed, completed_at').eq('user_id', user.id),
  ])

  const name = profile?.full_name
    || user.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    || 'Unknown'
  const email = user.email ?? ''
  const role  = profile?.role ?? 'property-manager'
  const startDate = profile?.created_at ?? user.created_at

  const results = resultRows ?? []
  const passedIds = new Set(results.filter(r => r.passed && ALL_ASSESSMENT_IDS.includes(r.assessment_id)).map(r => r.assessment_id))
  const completedCount = passedIds.size
  const avgScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : null

  const generatedAt = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const buffer = await renderToBuffer(
    PassportDocument({ name, email, role, startDate, generatedAt, completedCount, avgScore, results })
  )

  const safeName = name.replace(/[^a-z0-9]/gi, '_')
  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Dwelly_Passport_${safeName}.pdf"`,
    },
  })
}
