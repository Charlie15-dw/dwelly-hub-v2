import Link from 'next/link'
import { BookOpen, ChevronRight, ClipboardCheck, Scale, MessageCircle, BarChart2, Home, Handshake, Clock, ArrowRight } from 'lucide-react'
import { KNOWLEDGE_ARTICLES } from '@/lib/training-content'
import { cn } from '@/lib/utils'

const CATEGORY_META = {
  legal:         { label: 'Legal & Compliance',  icon: Scale,          colour: 'bg-red-50 text-red-700 border-red-200' },
  communication: { label: 'Communication',        icon: MessageCircle,  colour: 'bg-[#0071E3]/8 text-[#0071E3] border-[#0071E3]/20' },
  finance:       { label: 'Finance',              icon: BarChart2,      colour: 'bg-amber-50 text-amber-700 border-amber-200' },
  standards:     { label: 'Property Standards',   icon: Home,           colour: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  landlord:      { label: 'Landlord Relations',   icon: Handshake,      colour: 'bg-violet-50 text-violet-700 border-violet-200' },
}

const DIFFICULTY_META = {
  foundation:    { label: 'Foundation',    colour: 'bg-[#F5F5F7] text-[#6E6E73] border-[#D2D2D7]' },
  intermediate:  { label: 'Intermediate',  colour: 'bg-amber-50 text-amber-700 border-amber-200' },
  advanced:      { label: 'Advanced',      colour: 'bg-red-50 text-red-700 border-red-200' },
}

export default function KnowledgePage() {
  const legalArticles        = KNOWLEDGE_ARTICLES.filter(a => a.category === 'legal')
  const communicationArticles = KNOWLEDGE_ARTICLES.filter(a => a.category === 'communication')
  const financeArticles      = KNOWLEDGE_ARTICLES.filter(a => a.category === 'finance')
  const standardsArticles    = KNOWLEDGE_ARTICLES.filter(a => a.category === 'standards')
  const landlordArticles     = KNOWLEDGE_ARTICLES.filter(a => a.category === 'landlord')

  const categories = [
    { key: 'legal',         articles: legalArticles },
    { key: 'communication', articles: communicationArticles },
    { key: 'finance',       articles: financeArticles },
    { key: 'standards',     articles: standardsArticles },
    { key: 'landlord',      articles: landlordArticles },
  ] as const

  return (
    <div className="space-y-6">

      {/* Hero banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ backgroundColor: '#E0F7F4' }}>
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/60 rounded-r-2xl" />
        <div className="absolute right-8 top-3 w-28 h-28 rounded-full bg-white/50" />
        <div className="absolute right-20 bottom-1 w-16 h-16 rounded-full bg-white/40" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#5AADA8' }}>Knowledge Base</p>
          <h2 className="text-2xl font-bold text-[#1D1D1F]">Property &amp; Management Knowledge</h2>
          <p className="text-sm mt-1.5 text-[#1D1D1F]/65 max-w-xl">
            In-depth articles on tenancy law, property standards, finance, and communication — everything you need beyond the video modules.
          </p>
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 bg-white/70 border border-white rounded-xl px-3 py-2 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden />
              <span className="text-xs font-semibold text-[#1D1D1F]">{KNOWLEDGE_ARTICLES.length} Articles</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 border border-white rounded-xl px-3 py-2 shadow-sm">
              <ClipboardCheck className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden />
              <span className="text-xs font-semibold text-[#1D1D1F]">
                {KNOWLEDGE_ARTICLES.filter(a => a.quizModuleId).length} Assessments available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.map(({ key, articles }) => {
        if (articles.length === 0) return null
        const meta = CATEGORY_META[key]
        const Icon = meta.icon
        return (
          <div key={key}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border', meta.colour)}>
                <Icon className="w-3.5 h-3.5" aria-hidden />
                {meta.label}
              </div>
              <div className="flex-1 h-px bg-[#E8E8ED]" />
            </div>

            {/* Article cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {articles.map(article => {
                const diff = DIFFICULTY_META[article.difficulty]
                return (
                  <Link
                    key={article.id}
                    href={`/knowledge/${article.id}`}
                    className="card card-hover p-5 flex flex-col gap-3"
                  >
                    {/* Icon + difficulty */}
                    <div className="flex items-start justify-between">
                      <span className="text-2xl" aria-hidden>{article.icon}</span>
                      <span className={cn('text-[10px] font-semibold px-2 py-1 rounded-full border', diff.colour)}>
                        {diff.label}
                      </span>
                    </div>

                    {/* Title + subtitle */}
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[#1D1D1F] leading-snug">{article.title}</h3>
                      <p className="text-xs text-[#6E6E73] mt-1 leading-relaxed line-clamp-2">{article.subtitle}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#E8E8ED]">
                      <div className="flex items-center gap-1.5 text-[#6E6E73]">
                        <Clock className="w-3 h-3" aria-hidden />
                        <span className="text-xs">{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {article.quizModuleId && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#0071E3] bg-[#0071E3]/8 border border-[#0071E3]/20 px-2 py-0.5 rounded-full">
                            <ClipboardCheck className="w-3 h-3" aria-hidden />
                            Assessment
                          </span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 text-[#AEAEB2]" aria-hidden />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Assessments section */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck className="w-4 h-4 text-[#0071E3]" aria-hidden />
          <h3 className="text-sm font-bold text-[#1D1D1F]">Knowledge Assessments</h3>
        </div>
        <p className="text-xs text-[#6E6E73] mb-4">
          Test your understanding across the knowledge areas. Each assessment is linked to a specific article — read first, then take the quiz.
        </p>
        <div className="space-y-2">
          {KNOWLEDGE_ARTICLES.filter(a => a.quizModuleId).map(article => (
            <div key={article.id} className="flex items-center justify-between p-3 rounded-xl border border-[#E8E8ED] hover:border-[#0071E3]/30 hover:bg-[#0071E3]/3 transition-all group">
              <div className="flex items-center gap-3">
                <span className="text-lg" aria-hidden>{article.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#1D1D1F]">{article.title}</p>
                  <p className="text-xs text-[#6E6E73]">Linked to {article.readTime} article</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/knowledge/${article.id}`}
                  className="text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  Read article
                </Link>
                <ChevronRight className="w-3 h-3 text-[#D2D2D7] group-hover:text-[#0071E3] transition-colors" />
                <Link
                  href={`/quiz/${article.quizModuleId}`}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  Take quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
