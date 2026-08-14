import KnowledgeExplorer from '@/components/knowledge/KnowledgeExplorer'
import ElevatedKnowledge from '@/components/knowledge/ElevatedKnowledge'
import ContentCompletionButton from '@/components/hub/ContentCompletionButton'
import { createServerClient } from '@/lib/supabase/server'
import { isHubBeta, isHubElevated } from '@/lib/preview'

export default async function KnowledgePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Gated elevated variant for the two review accounts.
  if (isHubElevated(user?.email)) {
    return (
      <div className="space-y-6">
        <ElevatedKnowledge />
        <ContentCompletionButton contentType="knowledge" label="Knowledge Base" />
      </div>
    )
  }

  const beta = isHubBeta(user?.email)

  return (
    <div className="space-y-6">
      <KnowledgeExplorer beta={beta} />
      {/* Mark the whole Knowledge Base as complete */}
      <ContentCompletionButton contentType="knowledge" label="Knowledge Base" />
    </div>
  )
}
