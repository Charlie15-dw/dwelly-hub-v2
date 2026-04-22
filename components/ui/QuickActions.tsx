import Link from 'next/link'
import { Play, ClipboardCheck } from 'lucide-react'

const actions = [
  { href: '/modules',     label: 'Continue Module',   icon: Play,           colour: 'bg-orange/8 text-orange border-orange/20 hover:bg-orange/12' },
  { href: '/assessments', label: 'Take Assessment',   icon: ClipboardCheck, colour: 'bg-teal/8 text-teal border-teal/20 hover:bg-teal/12' },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map(({ href, label, icon: Icon, colour }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-2.5 p-3.5 rounded-xl border transition-all ${colour}`}
        >
          <Icon className="w-4 h-4 flex-shrink-0" aria-hidden />
          <span className="text-xs font-semibold">{label}</span>
        </Link>
      ))}
    </div>
  )
}
