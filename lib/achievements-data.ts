export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Completed your very first training module.",
    icon: "👣",
    earned: true,
    earnedDate: "2026-03-15",
  },
  {
    id: "quick-learner",
    title: "Quick Learner",
    description: "Completed three training modules within a single week.",
    icon: "⚡",
    earned: true,
    earnedDate: "2026-03-22",
  },
  {
    id: "assessment-ace",
    title: "Assessment Ace",
    description: "Passed any module assessment on the very first attempt.",
    icon: "🎯",
    earned: true,
    earnedDate: "2026-03-25",
  },
  {
    id: "perfect-score",
    title: "Perfect Score",
    description: "Achieved a flawless 100% score on any module assessment.",
    icon: "💯",
    earned: false,
  },
  {
    id: "compliance-champion",
    title: "Compliance Champion",
    description: "Successfully completed every required compliance training module.",
    icon: "🛡️",
    earned: false,
  },
  {
    id: "roleplay-pro",
    title: "Roleplay Pro",
    description: "Completed five roleplay scenarios demonstrating key skills.",
    icon: "🎭",
    earned: true,
    earnedDate: "2026-04-01",
  },
  {
    id: "streak-master",
    title: "Streak Master",
    description: "Logged active learning progress for seven consecutive days.",
    icon: "🔥",
    earned: true,
    earnedDate: "2026-04-05",
  },
  {
    id: "knowledge-seeker",
    title: "Knowledge Seeker",
    description: "Read every article available in the knowledge base library.",
    icon: "📚",
    earned: false,
  },
  {
    id: "module-marathon",
    title: "Module Marathon",
    description: "Powered through five complete training modules in one week.",
    icon: "🏃",
    earned: false,
  },
  {
    id: "passport-holder",
    title: "Passport Holder",
    description: "Received your first official competency sign-off in your passport.",
    icon: "🎫",
    earned: true,
    earnedDate: "2026-04-02",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Completed an entire training module before 9am.",
    icon: "🌅",
    earned: false,
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Completed an entire training module after 8pm.",
    icon: "🦉",
    earned: false,
  },
  {
    id: "recap-regular",
    title: "Recap Regular",
    description: "Completed three monthly recap sessions to reinforce your learning.",
    icon: "🔄",
    earned: true,
    earnedDate: "2026-04-10",
  },
  {
    id: "master-assessor",
    title: "Master Assessor",
    description: "Passed the comprehensive master assessment covering all programme content.",
    icon: "👑",
    earned: false,
  },
  {
    id: "full-house",
    title: "Full House",
    description: "Completed every one of the 19 modules in the training programme.",
    icon: "🏠",
    earned: false,
  },
]
