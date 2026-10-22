import KnowledgeExplorer from '@/components/knowledge/KnowledgeExplorer'
import ElevatedKnowledge from '@/components/knowledge/ElevatedKnowledge'
import KnowledgeCourses from '@/components/knowledge/KnowledgeCourses'
import ContentCompletionButton from '@/components/hub/ContentCompletionButton'
import { createServerClient } from '@/lib/supabase/server'
import { isHubBeta, isHubElevated } from '@/lib/preview'

export default async function KnowledgePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Gated elevated variant for the two review accounts.
  if (isHubElevated(user?.email)) {
    return (
      <div className="space-y-8">
        {/* Certified courses sit right at the top — clear and easy to find */}
        <KnowledgeCourses />
        <ElevatedKnowledge />
        <ContentCompletionButton contentType="knowledge" label="Knowledge Base" />
      </div>
    )
  }

  const beta = isHubBeta(user?.email)

  return (
    <div className="space-y-8">
      {/* Certified courses sit right at the top — clear and easy to find */}
      <KnowledgeCourses />
      <KnowledgeExplorer beta={beta} />
      {/* Mark the whole Knowledge Base as complete */}
      <ContentCompletionButton contentType="knowledge" label="Knowledge Base" />
    </div>
  )
}
