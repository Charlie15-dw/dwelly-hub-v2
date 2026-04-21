'use client'

import { useState } from 'react'
import { BookOpen, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import RoleplayChat from './RoleplayChat'

interface Tab {
  id: 'article' | 'roleplay'
  label: string
  icon: React.ElementType
}

const TABS: Tab[] = [
  { id: 'article',  label: 'Article',            icon: BookOpen },
  { id: 'roleplay', label: 'Roleplay Simulator',  icon: Mic      },
]

interface KnowledgeTabsProps {
  articleContent: React.ReactNode
}

export default function KnowledgeTabs({ articleContent }: KnowledgeTabsProps) {
  const [active, setActive] = useState<'article' | 'roleplay'>('article')

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-[#F5F5F7] border border-[#E8E8ED] rounded-2xl p-1 w-fit">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                active === tab.id
                  ? 'bg-white text-[#1D1D1F] shadow-sm border border-[#E8E8ED]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]',
              )}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden />
              {tab.label}
              {tab.id === 'roleplay' && (
                <span className="text-[10px] font-semibold text-[#0071E3] bg-[#0071E3]/10 border border-[#0071E3]/20 px-1.5 py-0.5 rounded-full">
                  AI
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {active === 'article'  && articleContent}
      {active === 'roleplay' && <RoleplayChat />}
    </div>
  )
}
