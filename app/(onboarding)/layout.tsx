import { UserProvider } from '@/components/UserProvider'
import { SettingsProvider } from '@/components/SettingsProvider'
import OnboardingHeader from '@/components/onboarding/OnboardingHeader'

// The segregated shell for new starters. No Hub sidebar, no command palette —
// just the staged journey. Content pages (lessons, guides, videos, quizzes)
// live in the Hub route group and get their own slim onboarding chrome there.
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SettingsProvider>
        <div className="relative min-h-[100dvh] bg-[#F5F5F7]">
          <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="hub-orb-a absolute -top-32 -right-24 w-[32rem] h-[32rem] rounded-full bg-orange-500/[0.06] blur-3xl" />
            <div className="hub-orb-b absolute top-1/3 -left-32 w-[28rem] h-[28rem] rounded-full bg-orange-400/[0.05] blur-3xl" />
          </div>
          <OnboardingHeader />
          <main id="main-content" className="hub-fade mx-auto w-full max-w-[1100px] px-4 sm:px-6 py-8">
            {children}
          </main>
        </div>
      </SettingsProvider>
    </UserProvider>
  )
}
