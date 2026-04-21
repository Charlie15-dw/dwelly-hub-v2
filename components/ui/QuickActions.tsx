import Link from 'next/link'
import { Play, ClipboardCheck, Shield, MessageCircle } from 'lucide-react'

const actions = [
  { href: '/modules',     label: 'Continue Module',   icon: Play,           colour: 'bg-orange/8 text-orange border-orange/20 hover:bg-orange/12' },
  { href: '/assessments', label: 'Take Assessment',   icon: ClipboardCheck, colour: 'bg-teal/8 text-teal border-teal/20 hover:bg-teal/12' },
  { href: '/compliance',  label: 'Check Compliance',  icon: Shield,         colour: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { href: '/dobby',       label: 'Ask Dobby',         icon: MessageCircle,  colour: 'bg-navy/5 text-navy border-navy/10 hover:bg-navy/8' },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
