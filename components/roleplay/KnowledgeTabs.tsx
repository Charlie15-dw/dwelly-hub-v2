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
      <div className="flex items-center gap-1 bg-[#F2F2F3] border border-[#E2E2E4] rounded-2xl p-1 w-fit">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                active === tab.id
                  ? 'bg-white text-[#101010] shadow-sm border border-[#E2E2E4]'
                  : 'text-[#7D7C86] hover:text-[#101010]',
              )}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden />
              {tab.label}
              {tab.id === 'roleplay' && (
                <span className="text-[10px] font-semibold text-[#2C68ED] bg-[#2C68ED]/10 border border-[#2C68ED]/20 px-1.5 py-0.5 rounded-full">
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
