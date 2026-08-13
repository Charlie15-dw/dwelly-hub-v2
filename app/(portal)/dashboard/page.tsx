import { redirect } from 'next/navigation'

// The Hub home is now the single home for everyone. There used to be a second
// "Overall progress" number here that was computed differently from the Hub's,
// so the two homes disagreed. Rather than reconcile the numbers we removed the
// second home: /dashboard permanently redirects to /hub, which reads progress
// from the one source (lib/hub-progress.ts).
export default function DashboardPage() {
  redirect('/hub')
}
