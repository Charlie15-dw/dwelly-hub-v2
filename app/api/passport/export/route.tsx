import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import {
  renderToBuffer, Document, Page, Text, View, StyleSheet,
  Svg, Path, Circle, G,
} from '@react-pdf/renderer'
import {
  SECTION_ORDER,
  PASS_MARK,
  computeSummary,
  computeSectionCompetency,
  buildAssessmentRecord,
  certificationStatus,
  type ResultRow,
  type CertificationStatus,
} from '@/lib/passport'
import { computeAchievements, type Achievement } from '@/lib/achievements-data'

// ── Colours ───────────────────────────────────────────────────────────────────
const NAVY    = '#1B2A4A'
const TEAL    = '#6ECFCC'
const GOLD     = '#C9A84C'
const GOLD_DK  = '#A9863A'
const LIGHT   = '#F5F5F7'
const MID     = '#6E6E73'
const RED     = '#DC2626'
const AMBER   = '#D97706'
const GREEN   = '#059669'
const GREY    = '#9CA3AF'

// ── Richer labels for the printed credential ────────────────────────────────────
const PDF_LABELS: Record<string, string> = {
  'mnt-01': 'Creating a Repair Request',
  'mnt-02': 'Actioning the Maintenance Task',
  'cmp-01': 'Creating a Compliance Task',
  'cmp-02': 'Actioning the Compliance Task',
  'mnt-03': 'Creating an Inspection Task',
  'ins-02': 'Completing the Inspection',
  'sys-01': 'Initiating the Move-Out Process',
  'mvt-02': 'Completing the Move-Out',
  'sys-02': 'Raising a Support Task',
  'sup-02': 'Actioning the Support Task',
  'kno-01': 'Dwelly Best Practice',
  'kno-02': 'Repairs & Legal Responsibilities',
  'kno-03': 'Property Finances & the Ledger',
  'full-assessment':   'Full Programme Assessment',
  'master-assessment': 'Master Assessment',
}

// ── Certification pill styling (text colour on the dark hero) ───────────────────
const CERT_META: Record<CertificationStatus, { label: string; color: string }> = {
  certified:     { label: 'Certified',   color: '#6EE7B7' },
  'recert-due':  { label: 'Re-cert Due', color: '#FCD34D' },
  'in-training': { label: 'In Training', color: '#7CC0FF' },
  'not-started': { label: 'Not Started', color: '#C7C7CC' },
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, color: NAVY, paddingTop: 34, paddingBottom: 48, paddingHorizontal: 34 },

  // Hero
  hero:        { backgroundColor: NAVY, borderRadius: 12, padding: 22, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroTopRule: { height: 3, backgroundColor: GOLD, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  heroLeft:    { flex: 1, paddingRight: 16 },
  eyebrowRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  eyebrow:     { fontSize: 7.5, color: GOLD, fontFamily: 'Helvetica-Bold', letterSpacing: 2 },
  monoRow:     { flexDirection: 'row', alignItems: 'center' },
  monogram:    { width: 46, height: 46, borderRadius: 12, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  monoText:    { fontSize: 17, color: NAVY, fontFamily: 'Helvetica-Bold' },
  heroName:    { fontSize: 20, color: '#FFFFFF', fontFamily: 'Helvetica-Bold' },
  heroRole:    { fontSize: 9.5, color: 'rgba(255,255,255,0.72)', marginTop: 1 },
  pillRow:     { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  pill:        { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, paddingVertical: 3, paddingHorizontal: 9 },
  pillDot:     { width: 5, height: 5, borderRadius: 3, marginRight: 5 },
  pillText:    { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  heroMeta:    { fontSize: 8, color: 'rgba(255,255,255,0.5)', marginLeft: 12 },
  credId:      { fontSize: 7.5, color: 'rgba(255,255,255,0.55)', marginTop: 12, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },

  // Ring overlay
  ringWrap:    { width: 118, height: 118, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ringCenter:  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  ringPct:     { fontSize: 26, color: '#FFFFFF', fontFamily: 'Helvetica-Bold' },
  ringLbl:     { fontSize: 7, color: 'rgba(255,255,255,0.6)', fontFamily: 'Helvetica-Bold', letterSpacing: 1.5, marginTop: 2 },
  ringSub:     { fontSize: 7.5, color: 'rgba(255,255,255,0.55)', marginTop: 6, textAlign: 'center' },

  // Stat cards
  statsRow:  { flexDirection: 'row', gap: 8, marginBottom: 18 },
  statBox:   { flex: 1, backgroundColor: LIGHT, borderRadius: 8, padding: 11 },
  statValue: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: NAVY },
  statLabel: { fontSize: 7, color: MID, marginTop: 3 },
  statSub:   { fontSize: 6, color: GREY, marginTop: 1 },

  // Section headings
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 2 },
  sectionSub:   { fontSize: 7.5, color: MID, marginBottom: 8 },
  block:        { marginBottom: 18 },

  // Competency rows
  compRow:     { marginBottom: 8 },
  compHead:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  compName:    { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: NAVY },
  compStatus:  { fontSize: 7.5, fontFamily: 'Helvetica-Bold' },
  barBg:       { height: 5, backgroundColor: '#E8E8ED', borderRadius: 3 },
  barFill:     { height: 5, borderRadius: 3 },
  compFoot:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  compMeta:    { fontSize: 7, color: MID },

  // Assessment record
  groupLabel:  { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: GREY, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3, marginTop: 6 },
  aRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 5, marginBottom: 2 },
  aLabel:      { flex: 1, fontSize: 8 },
  aDate:       { fontSize: 7, color: GREY, width: 62, textAlign: 'right' },
  aScore:      { fontSize: 9, fontFamily: 'Helvetica-Bold', width: 30, textAlign: 'right' },
  aBadge:      { fontSize: 6.5, fontFamily: 'Helvetica-Bold', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, marginLeft: 6, width: 46, textAlign: 'center' },

  // Badges grid
  badgeGrid:   { flexDirection: 'row', flexWrap: 'wrap' },
  badgeCell:   { width: '33.33%', paddingHorizontal: 4, marginBottom: 12, alignItems: 'center' },
  badgeTitle:  { fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 5 },
  badgeDesc:   { fontSize: 6.5, color: MID, textAlign: 'center', marginTop: 2, lineHeight: 1.3 },
  badgeState:  { fontSize: 6, fontFamily: 'Helvetica-Bold', letterSpacing: 0.8, marginTop: 3 },

  // Supervision timeline
  tlRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8, backgroundColor: '#F9FAFB', borderRadius: 5, marginBottom: 3 },
  tlDot:   { width: 7, height: 7, borderRadius: 4, borderWidth: 1.5, borderColor: '#C7C7CC', backgroundColor: '#FFFFFF', marginRight: 8 },
  tlLabel: { flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', color: NAVY },
  tlNote:  { fontSize: 7, color: MID, flex: 1 },
  tlBadge: { fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: GREY, backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },

  // Footer
  footer:      { position: 'absolute', bottom: 22, left: 34, right: 34, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E8E8ED', paddingTop: 6 },
  footerText:  { fontSize: 7, color: GREY },
  footerBrand: { fontSize: 7, color: MID, fontFamily: 'Helvetica-Bold' },
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(date: string | null | undefined) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function scoreColor(score: number | null) {
  if (score === null) return GREY
  if (score >= PASS_MARK) return GREEN
  if (score >= 65) return AMBER
  return RED
}

function statusColor(status: 'proficient' | 'developing' | 'not-started') {
  return status === 'proficient' ? GREEN : status === 'developing' ? AMBER : GREY
}

function statusLabel(status: 'proficient' | 'developing' | 'not-started') {
  return status === 'proficient' ? 'Proficient' : status === 'developing' ? 'Developing' : 'Not started'
}

// Polar → cartesian, 0° at the top, clockwise.
function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function arcPath(cx: number, cy: number, r: number, pct: number): string {
  const end = (360 * Math.min(pct, 99.999)) / 100
  const [sx, sy] = polar(cx, cy, r, 0)
  const [ex, ey] = polar(cx, cy, r, end)
  const large = end > 180 ? 1 : 0
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`
}

function starPath(cx: number, cy: number, outer: number, inner: number, points = 5): string {
  const step = Math.PI / points
  let d = ''
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = i * step - Math.PI / 2
    const x = cx + r * Math.cos(a)
    const y = cy + r * Math.sin(a)
    d += `${i === 0 ? 'M' : 'L'} ${x} ${y} `
  }
  return d + 'Z'
}

// ── Progress ring ─────────────────────────────────────────────────────────────
function ProgressRing({ pct }: { pct: number }) {
  const size = 118
  const c = size / 2
  const r = 50
  return (
    <View style={s.ringWrap}>
      <Svg width={size} height={size}>
        <Circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={11} />
        {pct >= 99.999
          ? <Circle cx={c} cy={c} r={r} fill="none" stroke={TEAL} strokeWidth={11} />
          : <Path d={arcPath(c, c, r, pct)} fill="none" stroke={TEAL} strokeWidth={11} strokeLinecap="round" />}
      </Svg>
      <View style={s.ringCenter}>
        <Text style={s.ringPct}>{pct}%</Text>
        <Text style={s.ringLbl}>COMPLETE</Text>
      </View>
    </View>
  )
}

// ── Gold verification seal ──────────────────────────────────────────────────────
function Seal() {
  return (
    <Svg width={13} height={13} style={{ marginRight: 6 }}>
      <Circle cx={6.5} cy={6.5} r={6} fill={GOLD} />
      <Circle cx={6.5} cy={6.5} r={4.4} fill="none" stroke={GOLD_DK} strokeWidth={0.7} />
      <Path d={starPath(6.5, 6.5, 3.2, 1.4)} fill="#FFFFFF" />
    </Svg>
  )
}

// ── Achievement medallion ───────────────────────────────────────────────────────
function Medallion({ earned }: { earned: boolean }) {
  return (
    <Svg width={38} height={38}>
      <Circle cx={19} cy={19} r={17} fill={earned ? GOLD : '#EAEAEF'} />
      <Circle cx={19} cy={19} r={17} fill="none" stroke={earned ? GOLD_DK : '#D2D2D7'} strokeWidth={1.4} />
      {earned ? (
        <Path d="M 11 19.5 L 16.5 25 L 27 13.5" stroke="#FFFFFF" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <G>
          <Path d="M 15 19 L 15 15.5 A 4 4 0 0 1 23 15.5 L 23 19" fill="none" stroke="#B7B7BE" strokeWidth={1.8} />
          <Path d="M 13.5 19 L 24.5 19 L 24.5 25.5 L 13.5 25.5 Z" fill="#B7B7BE" />
        </G>
      )}
    </Svg>
  )
}

// ── PDF Document ──────────────────────────────────────────────────────────────
function PassportDocument({
  name, role, startDate, generatedAt, credentialId, daysUntilRecert, recertLabel, results, achievements,
}: {
  name: string
  role: string
  startDate: string
  generatedAt: string
  credentialId: string
  daysUntilRecert: number
  recertLabel: string
  results: ResultRow[]
  achievements: Achievement[]
}) {
  const summary = computeSummary(results)
  const sections = computeSectionCompetency(results)
  const record = buildAssessmentRecord(results)
  const cert = certificationStatus(summary, daysUntilRecert)
  const certMeta = CERT_META[cert]
  const earnedCount = achievements.filter(a => a.earned).length

  const monogram = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const coreRecord = record.filter(r => r.section !== 'Milestone')
  const milestoneRecord = record.filter(r => r.section === 'Milestone')

  const TC_CHECKPOINTS = [
    { label: 'Week 1 · Observation', note: 'Shadowing & first supervised tasks' },
    { label: 'Month 1 · Review',      note: 'Progress check with line manager' },
    { label: 'Month 2 · Review',      note: 'Independent task competency check' },
    { label: 'Month 3 · Sign-Off',    note: 'Final supervised-period sign-off' },
  ]

  return (
    <Document title={`Competency Passport — ${name}`} author="The Hub · Dwelly">
      <Page size="A4" style={s.page}>

        {/* Hero */}
        <View>
          <View style={s.heroTopRule} />
          <View style={s.hero}>
            <View style={s.heroLeft}>
              <View style={s.eyebrowRow}>
                <Seal />
                <Text style={s.eyebrow}>COMPETENCY PASSPORT</Text>
              </View>
              <View style={s.monoRow}>
                <View style={s.monogram}><Text style={s.monoText}>{monogram}</Text></View>
                <View>
                  <Text style={s.heroName}>{name}</Text>
                  <Text style={s.heroRole}>{role}</Text>
                </View>
              </View>
              <View style={s.pillRow}>
                <View style={s.pill}>
                  <View style={[s.pillDot, { backgroundColor: certMeta.color }]} />
                  <Text style={[s.pillText, { color: certMeta.color }]}>{certMeta.label}</Text>
                </View>
                <Text style={s.heroMeta}>Programme start · {fmt(startDate)}</Text>
              </View>
              <Text style={s.credId}>CREDENTIAL ID · {credentialId}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <ProgressRing pct={summary.progressPct} />
              <Text style={s.ringSub}>{summary.passedCount} of {summary.totalCount}{'\n'}assessments passed</Text>
            </View>
          </View>
        </View>

        {/* Stat cards */}
        <View style={s.statsRow}>
          {[
            { value: `${summary.passedCount}/${summary.totalCount}`, label: 'Assessments Passed', sub: `${summary.progressPct}% of programme` },
            { value: summary.avgScore !== null ? `${summary.avgScore}%` : '—', label: 'Average Score', sub: `pass threshold ${PASS_MARK}%` },
            { value: `${earnedCount}/${achievements.length}`, label: 'Badges Earned', sub: 'achievements unlocked' },
            { value: summary.passRate !== null ? `${summary.passRate}%` : '—', label: 'Pass Rate', sub: 'across all attempts' },
          ].map(({ value, label, sub }) => (
            <View key={label} style={s.statBox}>
              <Text style={s.statValue}>{value}</Text>
              <Text style={s.statLabel}>{label}</Text>
              <Text style={s.statSub}>{sub}</Text>
            </View>
          ))}
        </View>

        {/* Competency by area */}
        <View style={s.block}>
          <Text style={s.sectionTitle}>Competency by Area</Text>
          <Text style={s.sectionSub}>Progress across the six core competency areas</Text>
          {SECTION_ORDER.map(sectionName => {
            const comp = sections.find(x => x.section === sectionName)!
            const col = statusColor(comp.status)
            const pct = Math.round((comp.passed / comp.total) * 100)
            return (
              <View key={sectionName} style={s.compRow} wrap={false}>
                <View style={s.compHead}>
                  <Text style={s.compName}>{sectionName}</Text>
                  <Text style={[s.compStatus, { color: col }]}>{statusLabel(comp.status)}</Text>
                </View>
                <View style={s.barBg}><View style={[s.barFill, { width: `${pct}%`, backgroundColor: col }]} /></View>
                <View style={s.compFoot}>
                  <Text style={s.compMeta}>{comp.passed}/{comp.total} passed</Text>
                  <Text style={[s.compMeta, { color: scoreColor(comp.avgScore), fontFamily: 'Helvetica-Bold' }]}>
                    {comp.avgScore !== null ? `${comp.avgScore}% avg` : 'No attempts'}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* Assessment record */}
        <View style={s.block} break>
          <Text style={s.sectionTitle}>Assessment Record</Text>
          <Text style={s.sectionSub}>Every programme assessment · latest attempt</Text>
          {SECTION_ORDER.map(sectionName => {
            const items = coreRecord.filter(r => r.section === sectionName)
            if (items.length === 0) return null
            return (
              <View key={sectionName} wrap={false}>
                <Text style={s.groupLabel}>{sectionName}</Text>
                {items.map(r => <AssessmentRow key={r.id} rec={r} />)}
              </View>
            )
          })}
          {milestoneRecord.length > 0 && (
            <View wrap={false}>
              <Text style={s.groupLabel}>Milestone</Text>
              {milestoneRecord.map(r => <AssessmentRow key={r.id} rec={r} />)}
            </View>
          )}
        </View>

        {/* Achievement badges */}
        <View style={s.block} wrap={false}>
          <Text style={s.sectionTitle}>Achievement Badges</Text>
          <Text style={s.sectionSub}>{earnedCount} of {achievements.length} unlocked</Text>
          <View style={s.badgeGrid}>
            {achievements.map(a => (
              <View key={a.id} style={s.badgeCell}>
                <Medallion earned={a.earned} />
                <Text style={[s.badgeTitle, { color: a.earned ? NAVY : GREY }]}>{a.title}</Text>
                <Text style={s.badgeDesc}>{a.description}</Text>
                <Text style={[s.badgeState, { color: a.earned ? GOLD_DK : '#C7C7CC' }]}>
                  {a.earned ? 'UNLOCKED' : 'LOCKED'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 90-day supervised period */}
        <View style={s.block} wrap={false}>
          <Text style={s.sectionTitle}>90-Day Supervised Period</Text>
          <Text style={s.sectionSub}>Terms &amp; conditions supervision — signed off by your line manager</Text>
          {TC_CHECKPOINTS.map(cp => (
            <View key={cp.label} style={s.tlRow}>
              <View style={s.tlDot} />
              <Text style={s.tlLabel}>{cp.label}</Text>
              <Text style={s.tlNote}>{cp.note}</Text>
              <Text style={s.tlBadge}>Pending manager sign-off</Text>
            </View>
          ))}
        </View>

        {/* Re-certification */}
        <View style={[s.block, { flexDirection: 'row', alignItems: 'center', backgroundColor: LIGHT, borderRadius: 8, padding: 12 }]} wrap={false}>
          <View style={{ width: 3, alignSelf: 'stretch', backgroundColor: GOLD, borderRadius: 2, marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: NAVY }}>Annual Re-Certification · {recertLabel}</Text>
            <Text style={{ fontSize: 7.5, color: MID, marginTop: 3, lineHeight: 1.3 }}>
              Compliance-critical re-certification covering deposit protection, gas safety, and tenancy legislation.
              {daysUntilRecert > 0 ? ` ${daysUntilRecert} days remaining.` : ' Re-certification now due.'}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Issued via The Hub · Dwelly Training Programme 2026–2027 · Generated {generatedAt} · Confidential</Text>
          <Text style={s.footerBrand}>dwelly.co.uk</Text>
        </View>

      </Page>
    </Document>
  )
}

function AssessmentRow({ rec }: { rec: ReturnType<typeof buildAssessmentRecord>[number] }) {
  const label = PDF_LABELS[rec.id] ?? rec.label
  if (!rec.attempted) {
    return (
      <View style={[s.aRow, { backgroundColor: '#F9FAFB' }]}>
        <Text style={[s.aLabel, { color: GREY }]}>{label}</Text>
        <Text style={[s.aBadge, { color: GREY, backgroundColor: '#F3F4F6' }]}>Not attempted</Text>
      </View>
    )
  }
  const badgeColor = rec.passed ? GREEN : RED
  const badgeBg = rec.passed ? '#DCFCE7' : '#FEE2E2'
  return (
    <View style={[s.aRow, { backgroundColor: rec.passed ? '#F0FDF4' : '#FEF2F2' }]}>
      <Text style={s.aLabel}>{label}</Text>
      <Text style={s.aDate}>{fmt(rec.completedAt)}</Text>
      <Text style={[s.aScore, { color: scoreColor(rec.score) }]}>{rec.score !== null ? `${rec.score}%` : '—'}</Text>
      <Text style={[s.aBadge, { color: badgeColor, backgroundColor: badgeBg }]}>{rec.passed ? 'Passed' : 'Failed'}</Text>
    </View>
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
    || user.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    || 'Unknown'
  const rawRole = profile?.role ?? 'property-manager'
  const role = rawRole === 'manager' ? 'Manager'
    : rawRole === 'admin' ? 'Admin'
    : rawRole.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
  const startDate = profile?.created_at ?? user.created_at

  const results = (resultRows ?? []) as ResultRow[]
  const achievements = computeAchievements(
    results.map(r => ({ assessment_id: r.assessment_id, score: r.score, passed: r.passed })),
    user.id,
  )

  // Re-certification window: 1 year from account creation.
  const recert = new Date(startDate)
  recert.setFullYear(recert.getFullYear() + 1)
  const daysUntilRecert = Math.ceil((recert.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const recertLabel = recert.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  // Stable, human-readable credential id derived from the user id.
  const hex = user.id.replace(/[^a-f0-9]/gi, '').toUpperCase()
  const credentialId = `DW-${hex.slice(0, 4)}-${hex.slice(4, 8)}`

  const generatedAt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const buffer = await renderToBuffer(
    PassportDocument({ name, role, startDate, generatedAt, credentialId, daysUntilRecert, recertLabel, results, achievements }),
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
