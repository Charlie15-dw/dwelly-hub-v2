interface ProgressRingProps {
  /** 0–100 */
  value: number
  /** overall diameter in px */
  size?: number
  /** stroke thickness in px */
  stroke?: number
  /** ring colour */
  color?: string
  /** track (unfilled) colour */
  trackColor?: string
  /** large number shown in the centre */
  label?: string
  /** small caption under the label */
  caption?: string
  /** colour for the centre label */
  labelColor?: string
  /** colour for the caption */
  captionColor?: string
}

// A pure SVG donut/progress ring. No client state — safe in a server component.
export default function ProgressRing({
  value,
  size = 140,
  stroke = 12,
  color = '#0071E3',
  trackColor = 'rgba(255,255,255,0.18)',
  label,
  caption,
  labelColor = '#FFFFFF',
  captionColor = 'rgba(255,255,255,0.65)',
}: ProgressRingProps) {
  const pct = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct / 100)

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-label={`${pct}% complete`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tabular-nums leading-none" style={{ color: labelColor }}>
          {label ?? `${pct}%`}
        </span>
        {caption && (
          <span className="text-[10px] uppercase tracking-wide font-semibold mt-1" style={{ color: captionColor }}>
            {caption}
          </span>
        )}
      </div>
    </div>
  )
}
