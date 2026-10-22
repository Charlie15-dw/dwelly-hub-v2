import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import {
  renderToBuffer, Document, Page, Text, View, StyleSheet,
  Svg, Path, Circle,
} from '@react-pdf/renderer'
import { getKnowledgeCourse } from '@/lib/data'

// ── Brand palette (matches the printed Competency Passport) ─────────────────
const NAVY  = '#1B2A4A'
const TEAL  = '#6ECFCC'
const GOLD  = '#C9A84C'
const WHITE = '#FFFFFF'

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: NAVY, padding: 36 },
  frame: {
    flex: 1,
    border: `1.5pt solid ${GOLD}`,
    borderRadius: 14,
    paddingVertical: 54,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: { fontSize: 11, color: GOLD, fontFamily: 'Helvetica-Bold', letterSpacing: 4, marginBottom: 6 },
  brand:   { fontSize: 15, color: 'rgba(255,255,255,0.7)', fontFamily: 'Helvetica-Bold', letterSpacing: 2, marginBottom: 34 },
  pre:     { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 10 },
  name:    { fontSize: 34, color: WHITE, fontFamily: 'Helvetica-Bold', marginBottom: 18, textAlign: 'center' },
  body:    { fontSize: 13, color: 'rgba(255,255,255,0.78)', textAlign: 'center', lineHeight: 1.6, maxWidth: 380, marginBottom: 6 },
  course:  { fontSize: 16, color: WHITE, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 6, marginBottom: 36 },
  rule:    { width: 90, height: 2, backgroundColor: GOLD, marginBottom: 30 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaBox: { alignItems: 'center', paddingHorizontal: 22 },
  metaLabel: { fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: 1, marginBottom: 3 },
  metaValue: { fontSize: 10, color: 'rgba(255,255,255,0.9)', fontFamily: 'Helvetica-Bold' },
  divider: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.18)' },
  footer:  { position: 'absolute', bottom: 30, left: 36, right: 36, textAlign: 'center' },
  footerText: { fontSize: 8, color: 'rgba(255,255,255,0.4)' },
})

function Seal() {
  return (
    <Svg width={76} height={76} style={{ marginBottom: 26 }}>
      <Circle cx={38} cy={38} r={36} fill="rgba(110,207,204,0.12)" stroke={TEAL} strokeWidth={1.5} />
      {/* House mark */}
      <Path d="M 22 38 L 38 24 L 54 38" fill="none" stroke={TEAL} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M 26 36 L 26 52 L 50 52 L 50 36" fill="none" stroke={TEAL} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      {/* Gold check badge */}
      <Circle cx={54} cy={54} r={11} fill={GOLD} />
      <Path d="M 49 54 L 53 58 L 60 50" fill="none" stroke={WHITE} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function CertificateDocument({
  name, courseTitle, dateLabel, credentialId,
}: {
  name: string
  courseTitle: string
  dateLabel: string
  credentialId: string
}) {
  return (
    <Document title={`Dwelly Certificate — ${courseTitle}`} author="The Hub · Dwelly">
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.frame}>
          <Seal />
          <Text style={s.eyebrow}>DWELLY CERTIFIED</Text>
          <Text style={s.brand}>THE HUB · DWELLY</Text>

          <Text style={s.pre}>This certifies that</Text>
          <Text style={s.name}>{name}</Text>

          <Text style={s.body}>has successfully completed the assessment and is certified in</Text>
          <Text style={s.course}>{courseTitle}</Text>

          <View style={s.rule} />

          <View style={s.metaRow}>
            <View style={s.metaBox}>
              <Text style={s.metaLabel}>DATE</Text>
              <Text style={s.metaValue}>{dateLabel}</Text>
            </View>
            <View style={s.divider} />
            <View style={s.metaBox}>
              <Text style={s.metaLabel}>CREDENTIAL ID</Text>
              <Text style={s.metaValue}>{credentialId}</Text>
            </View>
            <View style={s.divider} />
            <View style={s.metaBox}>
              <Text style={s.metaLabel}>ISSUED BY</Text>
              <Text style={s.metaValue}>The Hub · Dwelly</Text>
            </View>
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Issued via The Hub · Dwelly Training Programme · Verify at dwelly.co.uk
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get('course') ?? ''
  const course = getKnowledgeCourse(courseId)
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })

  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // The certificate is only issued once the learner has actually passed.
  const { data: results } = await supabase
    .from('assessment_results')
    .select('passed, completed_at')
    .eq('user_id', user.id)
    .eq('assessment_id', courseId)
    .eq('passed', true)
    .order('completed_at', { ascending: false })
    .limit(1)
  const pass = results?.[0]
  if (!pass) {
    return NextResponse.json({ error: 'Course not yet passed' }, { status: 403 })
  }

  const { data: profile } = await supabase
    .from('user_profiles').select('full_name').eq('id', user.id).maybeSingle()

  const name = profile?.full_name?.trim()
    || user.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    || 'Dwelly Learner'

  const completedAt = pass.completed_at ? new Date(pass.completed_at) : new Date()
  const dateLabel = completedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Stable, human-readable credential id derived from the user id + course.
  const hex = (user.id + courseId).replace(/[^a-f0-9]/gi, '').toUpperCase()
  const credentialId = `DW-${hex.slice(0, 4)}-${hex.slice(4, 8)}`

  const buffer = await renderToBuffer(
    CertificateDocument({
      name,
      courseTitle: course.title,
      dateLabel,
      credentialId,
    }),
  )

  const safeCourse = course.title.replace(/[^a-z0-9]/gi, '_')
  const safeName = name.replace(/[^a-z0-9]/gi, '_')
  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Dwelly_Certificate_${safeCourse}_${safeName}.pdf"`,
    },
  })
}
