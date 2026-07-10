import KnowledgeExplorer from '@/components/knowledge/KnowledgeExplorer'
import ContentCompletionButton from '@/components/hub/ContentCompletionButton'
import { createServerClient } from '@/lib/supabase/server'
import { isHubBeta } from '@/lib/preview'

export default async function KnowledgePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const beta = isHubBeta(user?.email)

  return (
    <div className="space-y-6">
      <KnowledgeExplorer beta={beta} />
      {/* Mark the whole Knowledge Base as complete */}
      <ContentCompletionButton contentType="knowledge" label="Knowledge Base" />
    </div>
  )
}
