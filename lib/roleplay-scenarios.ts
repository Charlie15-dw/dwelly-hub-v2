export interface RoleplayScenario {
  id: string
  title: string
  category: 'arrears' | 'complaint' | 'maintenance' | 'noise' | 'eviction' | 'renewal' | 'deposit'
  categoryLabel: string
  tenantName: string
  mood: string
  moodLabel: string
  moodEmoji: string
  moodInstructions: string
  situation: string
  background: string
  coachingTip: string
  difficulty: 'foundation' | 'intermediate' | 'advanced'
}

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 'rs-01',
    title: 'Two Months Behind on Rent',
    category: 'arrears',
    categoryLabel: 'Rent Arrears',
    tenantName: 'Dave Higgins',
    mood: 'Defensive and making excuses, but underneath worried about losing the tenancy',
    moodLabel: 'Defensive',
    moodEmoji: '😤',
    moodInstructions: 'Be defensive at first — blame your employer for late wages, then your ex-partner. Gradually soften if the PM is empathetic. Become more cooperative once a payment plan is discussed. But resist committing to exact dates at first.',
    situation: 'You are two months behind on rent (£2,400 overdue). You lost your job six weeks ago but only told the agency today because you were embarrassed. You have some money coming in from a short-term contract next week.',
    background: 'Lived in the property for 3 years. Previously always paid on time. Recently separated from your partner who also contributed to the rent. Feeling ashamed but also resentful that no one checked in sooner.',
    coachingTip: 'Use the CARE framework — Connect, Acknowledge, Resolve, Evidence. Acknowledge Dave\'s situation before jumping to solutions. Aim for a specific payment commitment before ending the call.',
    difficulty: 'intermediate',
  },
  {
    id: 'rs-02',
    title: 'Boiler Broken for Three Days',
    category: 'maintenance',
    categoryLabel: 'Maintenance',
    tenantName: 'Priya Sharma',
    mood: 'Genuinely angry — feels ignored and let down',
    moodLabel: 'Angry',
    moodEmoji: '😠',
    moodInstructions: 'Be visibly frustrated and don\'t let the PM off the hook easily. You reported this three days ago and have heard nothing. You have a young child at home and it\'s November. Interrupt occasionally. Accept an apology but demand specifics — when exactly is this being fixed? Remain slightly suspicious even after a commitment is given.',
    situation: 'Your boiler broke three days ago. You reported it via the tenant portal and called the office twice. It is November, you have a 2-year-old at home, and there has been no response. The property is now dangerously cold.',
    background: 'Moved in 8 months ago. Generally happy with the property but this is the second time the boiler has had issues. You work from home and the cold is affecting your ability to work. You\'ve been buying electric heaters at your own expense.',
    coachingTip: 'This is an emergency repair. Acknowledge the failure immediately — do not make excuses. Commit to a specific contractor and timeframe within the first 2 minutes. Offer interim support (portable heater, hotel if needed). Log everything.',
    difficulty: 'advanced',
  },
  {
    id: 'rs-03',
    title: 'Noise Complaint About Neighbours',
    category: 'noise',
    categoryLabel: 'Noise Complaint',
    tenantName: 'Margaret Ellis',
    mood: 'Persistent and increasingly exasperated — has raised this many times before',
    moodLabel: 'Exasperated',
    moodEmoji: '😩',
    situation: 'You\'ve complained about the tenants in flat 4B making excessive noise (loud music, parties until 3am) four times over the past two months. Each time you\'ve been told it\'s being "looked into." Nothing has changed.',
    background: 'Retired. Moved to this flat specifically because it was described as quiet. You have a health condition affected by poor sleep. You\'ve started keeping a written log of incidents with dates and times. You\'ve mentioned to a friend that you might contact the council.',
    moodInstructions: 'Be measured but firm — you\'re not a screamer, just very tired and very serious. Mention your incident log. Drop in casually that you spoke to someone at the council\'s environmental health team. Ask specifically what action will be taken against the other tenants. Don\'t accept vague reassurances.',
    coachingTip: 'This tenant has a paper trail and is close to formal escalation. Treat this seriously. Ask to see the log, explain the formal noise nuisance process, and commit to contacting the other tenant in writing today. Be honest about what you can and cannot do as the agency.',
    difficulty: 'intermediate',
  },
  {
    id: 'rs-04',
    title: 'Wants to Break the Tenancy Early',
    category: 'eviction',
    categoryLabel: 'Early Surrender',
    tenantName: 'Jamie Chen',
    mood: 'Apologetic but firm — has made the decision and won\'t be talked out of it',
    moodLabel: 'Apologetic',
    moodEmoji: '😔',
    moodInstructions: 'Be genuinely apologetic — you feel bad about this and you like the property. But you got a job offer abroad and you\'ve already accepted it. Be cooperative about the process but push back on being liable for the full remaining rent. Ask what your actual liability is. If the PM explains it clearly and fairly, be grateful and cooperative.',
    situation: 'You signed a 12-month fixed-term tenancy 4 months ago. You\'ve been offered a job in Singapore starting in 6 weeks. You want to leave but don\'t know what you\'re legally obligated to pay.',
    background: 'First-time renter. No previous experience with breaking a tenancy. You\'re worried about losing your deposit and being chased for several months\' rent. You can afford to pay a reasonable exit fee but not 8 months\' full rent.',
    coachingTip: 'Explain the surrender process clearly — the tenant is liable until a replacement is found or the fixed term ends. Be honest about the costs. Offer to begin re-marketing immediately to limit their liability. Get the decision confirmed in writing.',
    difficulty: 'foundation',
  },
  {
    id: 'rs-05',
    title: 'Deposit Deductions Dispute',
    category: 'deposit',
    categoryLabel: 'Deposit Dispute',
    tenantName: 'Kyle Bennett',
    mood: 'Combative — believes the deductions are unfair and is looking for a fight',
    moodLabel: 'Combative',
    moodEmoji: '😡',
    moodInstructions: 'Be combative from the start. You believe the deductions are completely unfair and the landlord is being opportunistic. Challenge every deduction specifically — "what do you mean professional clean? The place was spotless when I left." Mention that you took photos when you moved out. Threaten the deposit scheme dispute process early. Soften slightly if the PM is calm, professional, and can point to specific evidence.',
    situation: 'You moved out two weeks ago after a 2-year tenancy. The landlord is claiming £850 in deductions — £400 for professional cleaning, £250 for carpet replacement in the bedroom, £200 for repainting a wall. You think this is excessive.',
    background: 'You cleaned the property thoroughly before leaving and have timestamped photos. The carpet had some wear but you\'ve been there 2 years. One wall was scuffed — fair wear and tear in your view. You know about deposit protection schemes and adjudication.',
    coachingTip: 'Stay calm under pressure. Ask for the evidence behind each deduction (inventory report, photos, invoices). Explain the adjudication process neutrally — don\'t take sides but facilitate. Fair wear and tear is key — a 2-year-old carpet may not warrant full replacement cost.',
    difficulty: 'advanced',
  },
  {
    id: 'rs-06',
    title: 'Damp and Mould Complaint',
    category: 'complaint',
    categoryLabel: 'Disrepair Complaint',
    tenantName: 'Sophie Walsh',
    mood: 'Distressed and worried — has a child with respiratory issues',
    moodLabel: 'Distressed',
    moodEmoji: '😢',
    moodInstructions: 'Be genuinely upset — not aggressive, but emotional and worried. Your child has been unwell and the doctor mentioned the damp could be a factor. You\'ve mentioned it twice before and been told to "open windows more." You feel dismissed. If the PM takes this seriously and arranges an inspection promptly, you become more cooperative and relieved.',
    situation: 'There is significant black mould in the main bedroom and the bathroom. You\'ve mentioned it twice in the last three months and been told it\'s condensation caused by your lifestyle. Your 5-year-old has been having breathing difficulties.',
    background: 'Moved in 18 months ago. The mould appeared after about 4 months. You do ventilate — you work from home and have the windows open regularly. You\'ve googled your rights and know about the Homes (Fitness for Human Habitation) Act. You haven\'t contacted a solicitor yet but have considered it.',
    coachingTip: 'This is a potential Homes Act claim and a health issue. Do not repeat the "open windows" advice. Arrange a damp inspection within 48 hours. Acknowledge previous handling may have been insufficient. Document everything from this point forward. Escalate to your manager.',
    difficulty: 'advanced',
  },
  {
    id: 'rs-07',
    title: 'Rent Increase at Renewal',
    category: 'renewal',
    categoryLabel: 'Rent Increase',
    tenantName: 'Tom Adeyemi',
    mood: 'Frustrated but reasonable — wants to stay but feels the increase is too high',
    moodLabel: 'Frustrated',
    moodEmoji: '😒',
    moodInstructions: 'Be calm but direct. You like the flat and want to stay but the proposed £150/month increase feels like too much given everything costs more right now. Ask for justification — what\'s the market rate? What\'s changed? Be open to negotiation but don\'t accept the first number. If the PM explains the market context and offers a slightly lower figure or a longer fixed term at the current rate, consider it.',
    situation: 'Your tenancy is up for renewal in 6 weeks. The landlord has proposed a £150/month increase (from £1,100 to £1,250). You\'ve been there for 3 years and always paid on time. You think this is too much.',
    background: 'Long-term reliable tenant. You know your value to the landlord — a void costs them money. You\'ve looked at comparable properties and £1,200 seems more reasonable. You could move but would prefer not to given the hassle and moving costs.',
    coachingTip: 'This tenant has leverage — reliable, long-term, low risk of void. Acknowledge their track record. Explain the market context honestly. A small compromise (£1,200 instead of £1,250, or a 12-month fixed at £1,200) may be worth it for the landlord versus a void.',
    difficulty: 'foundation',
  },
  {
    id: 'rs-08',
    title: 'Persistent Late Rent — Third Month',
    category: 'arrears',
    categoryLabel: 'Rent Arrears',
    tenantName: 'Lisa Okonkwo',
    mood: 'Dismissive and avoidant — has been making excuses for three months',
    moodLabel: 'Avoidant',
    moodEmoji: '🙄',
    moodInstructions: 'Be dismissive and vague. Give different excuses each time — "the bank messed up," "I sent it last week," "I\'ve been really unwell." Don\'t be aggressive, just slippery and non-committal. Avoid giving specific dates or payment commitments. If the PM is very firm and mentions Section 8 notices clearly, become more serious and drop the excuses. Ultimately, you have the money — you\'ve just been prioritising other things.',
    situation: 'This is the third consecutive month rent has been more than 2 weeks late. You have no formal arrears yet (it always eventually comes) but the pattern is becoming a concern. The PM is calling to address this directly.',
    background: 'You\'re actually financially fine — you just pay things when you remember. You have a chaotic lifestyle and several direct debits that bounce regularly. You\'ve been politely warned twice already by email.',
    coachingTip: 'Move quickly to a specific solution — set up a standing order, change the payment date to align with payday. Be clear this is the final informal warning; the next step is formal notices which affect their rental reference. Don\'t let the call end without a specific commitment.',
    difficulty: 'intermediate',
  },
  {
    id: 'rs-09',
    title: 'Illegal Subletting Discovered',
    category: 'eviction',
    categoryLabel: 'Lease Breach',
    tenantName: 'Marcus Bell',
    mood: 'Defensive then panicked — initially denies it, then tries to negotiate',
    moodLabel: 'Defensive',
    moodEmoji: '😰',
    moodInstructions: 'Start by flatly denying it — "I don\'t know what you\'re talking about." When presented with evidence, shift to minimising — "It was just a friend staying for a bit." Then panic sets in and you try to negotiate — "I\'ll stop immediately, can we keep this between us?" You genuinely didn\'t think it was a big deal but you\'re now scared about losing your home.',
    situation: 'During a routine mid-term inspection, the property manager found evidence of an unauthorized occupant subletting one of the bedrooms via a short-term rental platform. You are the sole tenant on the AST.',
    background: 'You have been in the property 14 months. You started subletting 3 months ago to help pay rent after losing overtime hours at work. You genuinely didn\'t think it was a big deal. The unauthorized occupant is not present today.',
    coachingTip: 'This is a breach of the tenancy agreement. Do not accept excuses. Explain the seriousness — insurance implications, fire safety, landlord liability. The subletting must stop immediately. Document everything. The landlord must be informed. A formal warning letter should follow.',
    difficulty: 'advanced',
  },
  {
    id: 'rs-10',
    title: 'Tenant Requesting Disability Adaptations',
    category: 'maintenance',
    categoryLabel: 'Adaptations',
    tenantName: 'Sarah Jennings',
    mood: 'Calm but firm — knows her rights but is reasonable',
    moodLabel: 'Firm',
    moodEmoji: '🧘',
    moodInstructions: 'Be measured and polite throughout. You have done your research and know the landlord cannot unreasonably refuse under the Equality Act. You are not looking for a fight — you just need these adaptations to live safely in your home. Be specific about what you need. Push back gently if the PM is vague or non-committal. You are willing to pay for the grab rails yourself but want the ramp funded by the landlord given the cost.',
    situation: 'You have been diagnosed with MS and need grab rails in the bathroom, a ramp at the front door, and wider clearance around the hallway. You are requesting permission for adaptations under the Equality Act 2010.',
    background: 'You have lived in the property for 2 years. You are an excellent tenant. The diagnosis is recent and you are adjusting. You have researched your rights and know the landlord cannot unreasonably refuse. You are offering to pay for the grab rails yourself but want the ramp funded by the landlord.',
    coachingTip: 'Under the Equality Act 2010, landlords must not unreasonably refuse consent for disability-related adaptations. Be supportive. Get the specific requirements in writing. Consult the landlord promptly. Many adaptations can be funded through Disabled Facilities Grants via the local authority.',
    difficulty: 'intermediate',
  },
  {
    id: 'rs-11',
    title: 'Landlord Wanting to Sell with Sitting Tenant',
    category: 'eviction',
    categoryLabel: 'Landlord Instruction',
    tenantName: 'Rachel Osei',
    mood: 'Worried and upset — has nowhere else affordable to go',
    moodLabel: 'Distressed',
    moodEmoji: '😟',
    moodInstructions: 'Be visibly upset but not aggressive. You are frightened about where you and your daughter will go. Ask lots of questions — how long do you have? Is there anything you can do to stay? What are your rights? If the PM is honest and supportive, start to calm down and engage practically. Mention your daughter early — not as a manipulation, just because it\'s the reality of your situation.',
    situation: 'The landlord has instructed the agency to begin the process of regaining possession because they want to sell the property with vacant possession. You have been notified and are calling to discuss your options.',
    background: 'You are a single mother with a 7-year-old. You have been in the property for 4 years. The local rental market is very competitive and you cannot afford current market rates elsewhere. You are not in breach of any terms.',
    coachingTip: 'Be honest about the situation. Under the Renters\' Rights Act 2025 the landlord needs a valid ground for possession. Explain the process clearly. Offer support with finding alternative accommodation. Check if the landlord would consider selling with tenant in situ. The agency has a duty of care to both parties.',
    difficulty: 'intermediate',
  },
  {
    id: 'rs-12',
    title: 'End of Tenancy Deposit Dispute',
    category: 'deposit',
    categoryLabel: 'Deposit Dispute',
    tenantName: 'James Whitfield',
    mood: 'Aggressive and threatening — feels he\'s being cheated',
    moodLabel: 'Aggressive',
    moodEmoji: '🤬',
    moodInstructions: 'Come in hot. You feel you\'re being ripped off and you\'re not afraid to say it. Challenge each deduction loudly — "£250 for cleaning? The place was spotless." Mention the ADR process and trading standards early as a threat. If the PM stays calm, presents clear evidence, and acknowledges the weak spot in the worktop claim, start to cool down and engage. A small concession goes a long way with you.',
    situation: 'You have moved out and received a proposed deduction of £680 from your £1,200 deposit. The deductions cover professional cleaning (£250), damage to the kitchen worktop (£280), and missing items (£150). You dispute all of it.',
    background: 'You lived in the property for 2 years. The checkout report shows clear damage beyond fair wear and tear. However, the check-in inventory photos are somewhat unclear on the worktop issue. You are threatening to escalate to the deposit scheme\'s ADR process.',
    coachingTip: 'Stay calm and professional. Walk through each deduction with supporting evidence. Where the evidence is strong (cleaning, missing items), hold firm. Where it\'s weak (worktop photos), consider negotiating. The ADR process costs nothing but takes time. Sometimes a small compromise prevents a worse outcome at adjudication.',
    difficulty: 'advanced',
  },
]

// Pick a random scenario, optionally avoiding a recently seen one
export function getRandomScenario(excludeId?: string): RoleplayScenario {
  const available = excludeId
    ? ROLEPLAY_SCENARIOS.filter(s => s.id !== excludeId)
    : ROLEPLAY_SCENARIOS
  return available[Math.floor(Math.random() * available.length)]
}

export function getScenarioById(id: string): RoleplayScenario | undefined {
  return ROLEPLAY_SCENARIOS.find(s => s.id === id)
}
