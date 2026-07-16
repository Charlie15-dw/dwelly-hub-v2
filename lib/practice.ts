// Conversation Practice scenarios for The Hub.
//
// Each scenario has the AI play a realistic counterparty (an angry tenant, a
// cost-conscious landlord, etc.) so property managers can rehearse the hard
// conversations in a safe space. A separate "coach" mode steps the AI out of
// character to give constructive feedback on how the PM handled it.

export type PracticeDifficulty = 'foundation' | 'intermediate' | 'advanced'

export interface PracticeScenario {
  id: string
  title: string
  difficulty: PracticeDifficulty
  // Short blurb shown on the scenario card.
  summary: string
  // Who the AI is playing.
  persona: string
  // The situation, given to the model to set the scene.
  situation: string
  // What good handling looks like — used by the coach to assess.
  coachingFocus: string[]
  // The counterparty's opening line, shown to seed the conversation.
  opening: string
}

export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 'no-hot-water',
    title: 'Tenant with no hot water',
    difficulty: 'foundation',
    summary: 'A frustrated tenant has had no hot water for three days and feels ignored.',
    persona: 'Priya, a tenant in a one-bed flat who has reported a broken boiler twice with no update.',
    situation:
      'The tenant has had no hot water for three days. She reported it twice and heard nothing back. She is frustrated and feels ignored, but is reasonable if she feels heard and given a clear plan.',
    coachingFocus: [
      'Acknowledge the impact and apologise for the lack of updates',
      'Treat no hot water as an urgent repair and set a clear next step with a timeframe',
      'Take ownership rather than blaming the contractor or system',
      'Confirm how and when you will follow up',
    ],
    opening: "Hi, I've now been three days with no hot water and nobody has got back to me. This is completely unacceptable. What are you actually doing about it?",
  },
  {
    id: 'landlord-fees',
    title: 'Landlord disputing fees',
    difficulty: 'intermediate',
    summary: 'A landlord thinks the management fees are too high and wants them cut.',
    persona: 'Mr Osei, an experienced landlord with three properties who feels the management fee is poor value this month.',
    situation:
      'The landlord is questioning the management fee, saying "nothing has happened this month" and threatening to move to a cheaper agent. He responds well to evidence of value and a calm, confident tone.',
    coachingFocus: [
      'Stay calm and avoid getting defensive about the fee',
      'Demonstrate the value delivered with specifics (compliance, vetting, issue handling)',
      'Understand his underlying concern rather than just defending the price',
      'Protect the relationship while holding a fair position',
    ],
    opening: "I've been looking at my statement and honestly I can't see what I'm paying you for this month. Nothing's happened. Why shouldn't I move to an agent who charges half what you do?",
  },
  {
    id: 'deposit-deductions',
    title: 'Tenant disputing deposit deductions',
    difficulty: 'advanced',
    summary: 'A departing tenant is angry about cleaning and damage deductions at checkout.',
    persona: 'Jordan, a tenant who has just moved out and disputes deductions for cleaning and a damaged carpet.',
    situation:
      'At checkout you have proposed deductions for professional cleaning and a stained carpet. The tenant insists the flat was clean and the stain was there when they moved in. They may escalate to the deposit scheme. Handling requires evidence, fairness and awareness of betterment and fair wear and tear.',
    coachingFocus: [
      'Reference the check-in/check-out evidence and inventory',
      'Explain deductions fairly, accounting for fair wear and tear and betterment',
      'Stay professional and avoid being drawn into an argument',
      'Signpost the deposit scheme dispute process calmly and correctly',
    ],
    opening: "I've just seen you want to take money off my deposit for cleaning AND the carpet. The place was spotless when I left and that stain was there when I moved in. I'm not paying a penny of this.",
  },
  {
    id: 'rent-arrears',
    title: 'Tenant in rent arrears',
    difficulty: 'intermediate',
    summary: 'A tenant has fallen behind on rent and is embarrassed and defensive.',
    persona: 'Sam, a normally reliable tenant who is two months behind after losing hours at work.',
    situation:
      'The tenant is two months in arrears after a drop in income. They are embarrassed, a bit defensive, and worried about eviction. A supportive but clear conversation about a realistic repayment plan works best.',
    coachingFocus: [
      'Open with empathy, not accusation',
      'Establish the facts and the reason without judgement',
      'Agree a realistic, specific repayment plan',
      'Be clear about consequences without threatening',
    ],
    opening: "Look, I know I'm behind, alright? Things have been really tight. I don't need a lecture. I'll pay when I can.",
  },
]

export function getPracticeScenario(id: string): PracticeScenario | undefined {
  return PRACTICE_SCENARIOS.find(s => s.id === id)
}

export const PRACTICE_DIFFICULTY_LABELS: Record<PracticeDifficulty, string> = {
  foundation: 'Foundation',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}
