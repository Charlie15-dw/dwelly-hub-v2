import KnowledgeExplorer from '@/components/knowledge/KnowledgeExplorer'
import ContentCompletionButton from '@/components/hub/ContentCompletionButton'

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <KnowledgeExplorer />
      {/* Mark the whole Knowledge Base as complete */}
      <ContentCompletionButton contentType="knowledge" label="Knowledge Base" />
    </div>
  )
}
