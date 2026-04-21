'use client'

interface SkillScore {
  label: string
  value: number
  max: number
}

const SIZE = 280
const CENTER = SIZE / 2
const RADIUS = 110
const LEVELS = [0.25, 0.5, 0.75, 1]

function polarToCartesian(angle: number, radius: number): [number, number] {
  const rad = ((angle - 90) * Math.PI) / 180
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)]
}

function polygonPoints(count: number, radius: number): string {
  const step = 360 / count
  return Array.from({ length: count })
    .map((_, i) => polarToCartesian(i * step, radius).join(','))
    .join(' ')
}

export default function SkillsRadar({ scores }: { scores: SkillScore[] }) {
  const count = scores.length
  const step = 360 / count

  // Data polygon
  const dataPoints = scores
    .map((s, i) => {
      const pct = Math.min(s.value / s.max, 1)
      return polarToCartesian(i * step, RADIUS * pct).join(',')
    })
    .join(' ')

  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold text-navy mb-1">Skills Overview</h3>
      <p className="text-xs text-slate-500 mb-4">Competency across all areas based on assessment scores</p>

      <div className="flex justify-center">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="max-w-full" aria-label="Skills radar chart">
          {/* Guide polygons */}
          {LEVELS.map(level => (
            <polygon
              key={level}
              points={polygonPoints(count, RADIUS * level)}
              fill="none"
              stroke="#E8E8ED"
              strokeWidth={level === 1 ? 1.5 : 0.8}
            />
          ))}

          {/* Axis lines */}
          {scores.map((_, i) => {
            const [x, y] = polarToCartesian(i * step, RADIUS)
            return (
              <line
                key={i}
                x1={CENTER} y1={CENTER} x2={x} y2={y}
                stroke="#E8E8ED" strokeWidth={0.8}
              />
            )
          })}

          {/* Data polygon */}
          <polygon
            points={dataPoints}
            fill="rgba(0,113,227,0.12)"
            stroke="#0071E3"
            strokeWidth={2}
            strokeLinejoin="round"
          />

          {/* Data points */}
          {scores.map((s, i) => {
            const pct = Math.min(s.value / s.max, 1)
            const [x, y] = polarToCartesian(i * step, RADIUS * pct)
            return <circle key={i} cx={x} cy={y} r={3.5} fill="#0071E3" />
          })}

          {/* Labels */}
          {scores.map((s, i) => {
            const labelRadius = RADIUS + 22
            const [x, y] = polarToCartesian(i * step, labelRadius)
            return (
              <text
                key={i}
                x={x} y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-slate-500"
                style={{ fontSize: '9px', fontWeight: 600 }}
              >
                {s.label}
              </text>
            )
          })}

          {/* Score labels */}
          {scores.map((s, i) => {
            const pct = Math.min(s.value / s.max, 1)
            const [x, y] = polarToCartesian(i * step, RADIUS * pct - 14)
            return (
              <text
                key={`score-${i}`}
                x={x} y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-navy"
                style={{ fontSize: '9px', fontWeight: 800 }}
              >
                {Math.round(pct * 100)}%
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
