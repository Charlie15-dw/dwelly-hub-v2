// ─── Scripted Roleplay Engine v2 ──────────────────────────────────────────────
// No API required — fully local keyword-matched conversation trees.
// v2: multi-variant responses, used-message deduplication, acknowledgment prefixes.

export type Stage = 'opening' | 'engaged' | 'tense' | 'progressing' | 'resolving'

export interface ScriptedResponse {
  triggers: string[]
  messages: string[]     // 2-3 variants — engine picks an unused one
  stageShift?: 1 | -1
}

export interface StageScript {
  responses: ScriptedResponse[]
  fallbacks: string[]         // 5+ variants — generic, no trigger matched
  questionFallbacks?: string[] // used when input is a direct question and no trigger fires
}

export interface ScenarioScript {
  opening: string
  stages: Record<Stage, StageScript>
  resolved: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickUnused(messages: string[], usedMessages: Set<string>): string {
  const unused = messages.filter(m => !usedMessages.has(m))
  const chosen = unused.length > 0 ? pick(unused) : pick(messages)
  usedMessages.add(chosen)
  return chosen
}

// Returns a short contextual opener based on what the user said
function getAcknowledgment(input: string, stage: Stage): string {
  const lower = input.toLowerCase()

  const isApology   = ['sorry', 'apologise', 'apologies', 'my apologies'].some(w => lower.includes(w))
  const isEmpathy   = ['understand', 'hear you', 'must be', 'sounds difficult', 'appreciate that', 'that must'].some(w => lower.includes(w))
  const isOffer     = ['payment plan', 'arrangement', 'work with you', 'help you', 'can arrange', 'support'].some(w => lower.includes(w))
  const isThreat    = ['evict', 'section 8', 'legal action', 'solicitor', 'court', 'formal notice'].some(w => lower.includes(w))
  const isQuestion  = lower.trim().endsWith('?')

  if (isThreat) return ''
  if (stage === 'tense') return ''

  if (isApology)  return pick(['Right, okay... ', 'I appreciate that. ', 'Well... '])
  if (isEmpathy)  return pick(['', 'Good. ', 'Okay. '])
  if (isOffer)    return pick(['', 'Okay so — ', ''])
  if (isQuestion) return pick(['', '', 'Right — '])

  const stageDefaults: Record<Stage, string[]> = {
    tense:      ['', '', ''],
    opening:    ['', '', 'Right. '],
    engaged:    ['', 'Okay. ', ''],
    progressing:['', 'Right. ', ''],
    resolving:  ['', 'Okay. ', ''],
  }
  return pick(stageDefaults[stage])
}

const STAGE_ORDER: Stage[] = ['tense', 'opening', 'engaged', 'progressing', 'resolving']

export function advanceStage(current: Stage, shift: number): Stage {
  const idx = STAGE_ORDER.indexOf(current)
  const next = Math.max(0, Math.min(STAGE_ORDER.length - 1, idx + shift))
  return STAGE_ORDER[next]
}

export function matchResponse(
  input: string,
  stage: Stage,
  script: ScenarioScript,
  positiveStreak: number,
  usedMessages: Set<string>,
  turnCount: number,
): { message: string; newStage: Stage } {
  const lower = input.toLowerCase()

  if (positiveStreak >= 4) {
    return { message: script.resolved, newStage: 'resolving' }
  }

  const stageScript = script.stages[stage]

  // Find best trigger match (longest matching trigger wins)
  let best: ScriptedResponse | null = null
  let bestLen = 0
  for (const r of stageScript.responses) {
    for (const t of r.triggers) {
      if (lower.includes(t) && t.length > bestLen) {
        best = r
        bestLen = t.length
      }
    }
  }

  const positiveSignals = [
    'sorry', 'apologise', 'understand', 'help', 'arrange', 'fix',
    'sort', 'payment plan', 'pay', 'support', 'concern', 'hear you',
    'absolutely', 'completely', 'appreciate', 'thank', 'agree', 'plan',
    'book', 'confirm', 'send', 'email', 'call back', 'follow up',
    'prioritise', 'urgent', 'right away', 'today', 'this week',
  ]
  const negativeSignals = [
    "can't", "policy", "not our fault", "nothing we can do",
    "your responsibility", "evict", "solicitor", "legal action",
    "not possible", "always", "never", "you should have", "not allowed",
    "breach", "formal proceedings",
  ]

  const hasPositive = positiveSignals.some(s => lower.includes(s))
  const hasNegative = negativeSignals.some(s => lower.includes(s))

  const ack = getAcknowledgment(input, stage)

  if (best) {
    const rawMessage = pickUnused(best.messages, usedMessages)
    const message = ack ? ack + rawMessage.charAt(0).toLowerCase() + rawMessage.slice(1) : rawMessage
    const newStage = best.stageShift
      ? advanceStage(stage, best.stageShift)
      : hasNegative ? advanceStage(stage, -1) : stage
    return { message, newStage }
  }

  // No trigger match — pick fallback pool based on whether input is a question
  const isDirectQuestion = lower.includes('?') ||
    ['will you', 'can you', 'have you', 'do you', 'are you', 'when will', 'when can', 'how much', 'what will'].some(q => lower.includes(q))
  const fallbackPool = isDirectQuestion && stageScript.questionFallbacks?.length
    ? stageScript.questionFallbacks
    : stageScript.fallbacks
  const rawFallback = pickUnused(fallbackPool, usedMessages)
  const message = ack ? ack + rawFallback.charAt(0).toLowerCase() + rawFallback.slice(1) : rawFallback
  const newStage = hasPositive
    ? advanceStage(stage, 1)
    : hasNegative
      ? advanceStage(stage, -1)
      : stage

  return { message, newStage }
}

// ─── Scenario Scripts ─────────────────────────────────────────────────────────

export const SCENARIO_SCRIPTS: Record<string, ScenarioScript> = {

  // ── rs-01: Two Months Behind on Rent ────────────────────────────────────────
  'rs-01': {
    opening: "Yeah, hi. I got your message. Look, I know I owe a bit but the bank messed up my transfer, it'll be there by end of week. There's no need to be calling me about it.",
    resolved: "Right. Okay. So if I set up the standing order for the 1st and pay £600 by Friday as a first payment... that works for me actually. I appreciate you working with me on this rather than just sending letters. I'll get it sorted.",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['evict', 'notice', 'legal', 'section 8', 'solicitor'],
            messages: [
              "Oh right, so we're going straight to threats are we? I've been here three years and this is how you treat me?",
              "Solicitors? Already? I'm two weeks late and you're talking about legal action. That's not on.",
              "Fine. Get your solicitor. I'll get mine. See how that works out for everyone.",
            ],
            stageShift: -1,
          },
          {
            triggers: ['immediately', 'right away', 'by tomorrow', 'must pay', 'full amount'],
            messages: [
              "I can't just magic money out of thin air! You clearly don't care about my situation at all.",
              "By tomorrow? You're having a laugh. I've explained the bank situation.",
              "Full amount immediately — do you have any idea what that sounds like to someone who's struggling?",
            ],
            stageShift: -1,
          },
        ],
        fallbacks: [
          "I don't appreciate the tone. I've already said the bank messed up — what more do you want from me?",
          "I've rented here three years without a problem. You're treating me like a criminal.",
          "Can you just back off a bit? I'm dealing with it.",
          "Look, I'm not running away. I'm still here, aren't I?",
          "I've never not paid. Eventually. You know that.",
        ],
        questionFallbacks: [
          "What do you want me to say? I've told you the bank messed up. I can't give you a date when I don't know.",
          "I don't know what answer you want. I'm telling you what I know.",
          "Look, I can't give you a guarantee right now. That's the honest answer.",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['understand', 'hear you', 'must be', 'difficult', 'tough', 'situation'],
            messages: [
              "Yeah... it has been tough actually. I lost my job six weeks ago. I was embarrassed to say anything. My ex was covering half the rent and she left so it's all on me now.",
              "I appreciate you saying that. I should have called sooner. I just didn't know what to say.",
              "Honest answer? It's been a disaster of a month. I didn't want to make excuses. I still don't. But it's been genuinely hard.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['payment plan', 'arrangement', 'work something out', 'work with you'],
            messages: [
              "A payment plan... I mean, I hadn't thought about that. What would that look like exactly?",
              "You're saying there's an option that doesn't involve me finding £2,400 immediately?",
              "A plan — yeah, okay. I can work with a plan. What are you thinking?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['how much', 'what you owe', 'balance', 'arrears', 'amount'],
            messages: [
              "It's two months isn't it. £2,400. I know. I'm not pretending it's not there.",
              "Two months. £1,200 each. I know exactly what I owe.",
              "It's £2,400. I've been trying not to look at the number if I'm honest.",
            ],
          },
          {
            triggers: ['when', 'date', 'by when', 'pay by', 'deadline'],
            messages: [
              "I've got a short-term contract starting next week. I should have some money coming in by Friday.",
              "I can be more specific — I get the contract payment on Thursday. I could do something this week.",
              "If we're talking dates — I can commit to something by the end of next week. Is that enough?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['confirm', 'in full', 'pay in full', 'full payment', 'guarantee', 'will you pay'],
            messages: [
              "In full right now? No. That's what I'm trying to explain. I don't have £2,400 sitting there. I need time.",
              "I can't confirm in full — not yet. But I'm not saying I won't pay. I just need a few days and a plan.",
              "That's the thing — I can't promise the full amount immediately. I can promise I'm going to sort it. Will you let me explain?",
            ],
          },
          {
            triggers: ['have you spoken', 'have you contacted', 'have you tried', 'did you'],
            messages: [
              "No, I haven't called the bank directly about it yet. I was hoping it would just come through.",
              "I've checked my account — the money went out on my side. Something's held it up.",
              "I've not got on to the bank yet. I kept thinking it would sort itself.",
            ],
          },
        ],
        fallbacks: [
          "Look, I'm not trying to avoid it. Things just got on top of me. The bank thing is real.",
          "I'll sort it, alright? I just need a bit of time.",
          "It's not like I don't want to pay. I've never missed rent before in my life.",
          "What are my options? Walk me through it.",
          "I'm not proud of this situation, if that's what you're wondering.",
        ],
        questionFallbacks: [
          "Look, I can't answer that straight out. It's more complicated than a yes or no right now.",
          "I don't have a clean answer for you. Things are tight and I'm trying to work it out.",
          "I want to say yes but I can't guarantee it right this second. Can we talk about what's realistic?",
          "Honestly? I don't know yet. That's the truth. I need a day or two.",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['standing order', 'direct debit', 'automatic', 'set up payment'],
            messages: [
              "A standing order would probably help me actually. I'm terrible at remembering dates. What day would it need to go out?",
              "Standing order — yeah, that removes the problem of me forgetting, doesn't it. When would it need to leave my account?",
              "That's actually a better idea than me manually doing it. What date works?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['partial', 'something now', 'part payment', 'some now', 'first payment'],
            messages: [
              "I could probably get £300 together this week. It's not the full amount but it's something. Would that help?",
              "What if I paid half of one month now and the rest when the contract comes in? Would that stop the clock on any formal process?",
              "I've got about £250 I can move across today. It's not much but it's real money, not a promise.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['how much can you', 'what can you afford', 'what works for you', 'what can you manage'],
            messages: [
              "Honestly? If I can pay £600 from the contract money next week and then catch up over two months, that's realistic.",
              "If you're asking what I can genuinely manage — £500 now when I'm paid, then £400 a month extra on top of rent.",
              "I don't want to promise something I can't keep. Realistically, £600 next week and then regular payments after that.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['sorry', 'apologise'],
            messages: [
              "No, it's... it's fine. I should have called sooner. I was just embarrassed about the whole thing if I'm honest.",
              "You don't need to apologise. I'm the one who should have picked up the phone earlier.",
              "It's okay. I knew it was coming. I'm glad we're talking about it now rather than... the alternative.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['confirm', 'in full', 'pay in full', 'full payment', 'guarantee', 'will you pay', 'commit'],
            messages: [
              "I can commit to a plan. The full amount in one go — no, not right now. But £600 Friday and then steady payments, yes.",
              "I can't say full amount by a specific date. But I can say I'm not going anywhere and I want to clear it.",
              "Here's what I can confirm: I will pay it. All of it. Just not all at once.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['have you', 'have you contacted', 'have you spoken', 'did you call'],
            messages: [
              "I haven't called the bank yet about the hold. I know I should have.",
              "I looked at my online banking — it shows the payment going out but nothing's arrived your end.",
              "Not yet. I've been meaning to but I kept thinking it would resolve itself.",
            ],
          },
        ],
        fallbacks: [
          "I appreciate you being reasonable about this. It's not been an easy few months.",
          "So what are my options then? I want to keep the flat.",
          "Right. Okay. I'm listening.",
          "Just tell me what you need from me and I'll do it.",
          "I feel like we're getting somewhere now. What does the plan look like?",
        ],
        questionFallbacks: [
          "What I can tell you is that I want to sort this. A specific number right now — I don't have one. But I want a plan.",
          "Can I be honest? I don't have a clean answer. But I'm not refusing to engage. What do you suggest?",
          "I can't answer that the way you want me to. Not yet. Can we talk about what's actually possible?",
          "The honest answer is I'm not sure. But I'm here talking to you, which means I'm trying.",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['confirm', 'email', 'writing', 'written', 'agreement', 'in writing'],
            messages: [
              "Yeah, send me an email with the plan and I'll reply confirming it. That's fair.",
              "Put it in writing and I'll sign it. I want it documented too — protects both of us.",
              "Email works. I'll respond same day.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['reference', 'record', 'no further action', 'rental history'],
            messages: [
              "That's a relief. I don't want this affecting my rental record — I've always been a good tenant overall.",
              "As long as this doesn't follow me around. I've been here three years, I want that on record too.",
              "Right. Clean slate once it's cleared. I can live with that.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['first payment', 'initial', 'start with', 'begin with'],
            messages: [
              "Okay. £600 by Friday as a first payment and then £400 a month on top of the rent until it's cleared. Does that work?",
              "I can do £600 Friday from the contract, then the standing order takes care of the monthly going forward.",
              "First payment Friday — £600. Then we're on a plan. I can stick to a plan.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['will you', 'can you confirm', 'do you agree', 'are you happy', 'is that okay'],
            messages: [
              "Yes. I can confirm that. Send it in writing and I'll reply to confirm.",
              "Yes — that works for me. Let's get it documented.",
              "I'm happy with that. Email it over.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Alright, that sounds doable. I just want to get this resolved.",
          "Right, so we've got a plan then. I can work with that.",
          "I appreciate you being decent about this, honestly.",
          "Okay. Let's just get it done. What do I need to do first?",
          "This feels manageable now. I was dreading this call.",
        ],
        questionFallbacks: [
          "Yes — that's what I'm agreeing to. Send it over and I'll confirm.",
          "If you're asking whether I accept that — yes. Let's get it sorted.",
          "That works. What's the next step?",
        ],
      },
      resolving: {
        responses: [
          {
            triggers: ['thank', 'thanks', 'appreciate'],
            messages: [
              "Yeah. Thanks for not just sending letters. I'll make sure the payment goes out Friday.",
              "I appreciate it too, genuinely. I know this wasn't straightforward.",
              "Cheers. I'll stick to it.",
            ],
          },
          {
            triggers: ['confirm', 'email', 'send over'],
            messages: [
              "Perfect. Send me that email and I'll reply straight away to confirm.",
              "Yeah, email me and I'll come back to you today.",
              "Send it over and I'll sign it. Today.",
            ],
          },
        ],
        fallbacks: [
          "Okay, I think we've got a plan. I'll stick to it.",
          "Right. Friday payment, then the standing order from the 1st. Got it.",
          "Thanks for being straight with me. I'll sort it.",
          "I'll get the standing order set up tonight.",
          "Okay. We're good. I appreciate it.",
        ],
        questionFallbacks: [
          "Yes. Confirmed. Send me that email.",
          "That's the agreement — yes. Let's get it in writing.",
          "I'm confirming yes. Friday payment and then the standing order.",
        ],
      },
    },
  },

  // ── rs-02: Boiler Broken for Three Days ─────────────────────────────────────
  'rs-02': {
    opening: "Finally! I have been calling your office for THREE days. Three days with no heating and no hot water. I have a two year old in this flat. It's November. This is absolutely unacceptable.",
    resolved: "Right. Okay. A plumber today, guaranteed. I'll be honest, I'm still annoyed this took three days but if it gets fixed today then fine. Please make sure he actually turns up — I can't keep taking time off work for this.",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['policy', "can't", 'not possible', 'not our fault', 'tenant responsibility'],
            messages: [
              "Not your fault?! The boiler is broken — how is that MY responsibility? I want to speak to your manager right now.",
              "Policy? I have a two-year-old with no heating in November and you're quoting me policy?",
              "Can't? Can't what — can't get someone out in three days? What am I paying rent for?",
            ],
            stageShift: -1,
          },
          {
            triggers: ['few more days', 'by the end of the week', 'next week', 'a couple of days'],
            messages: [
              "A FEW MORE DAYS? Are you serious? I have a child here! Do you understand what you're saying to me?",
              "Next week is not good enough. I have a toddler. This is a health and safety issue.",
              "You're telling me a child can go without heating for another few days and that's acceptable to you?",
            ],
            stageShift: -1,
          },
          {
            triggers: ['log a job', 'raise a ticket', 'system', 'process'],
            messages: [
              "I don't want to hear about your system. I want my heating FIXED. What are you actually doing about it right now?",
              "I've already had two 'logged jobs'. Nothing happened. What does logging it actually do?",
              "Your system is clearly not working. My daughter is cold. Can we skip the admin and get to the part where someone comes?",
            ],
            stageShift: -1,
          },
        ],
        fallbacks: [
          "This is a complete joke. Three days without heating with a toddler.",
          "I've spent £80 on electric heaters from Argos already. Someone needs to pay me back for that.",
          "If this isn't sorted today I am calling environmental health.",
          "I'm not being unreasonable. Three days. No heating. In November.",
          "Do you have children? Would you accept this?",
        ],
        questionFallbacks: [
          "What do you think is happening? My heating is broken and no one has come. That's what's happening.",
          "I don't know why you're asking me questions — I'm the one who needs answers.",
          "Can someone come today? That's the only question that matters right now.",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['sorry', 'apologise', 'sincerely', 'completely understand', 'unacceptable'],
            messages: [
              "It IS unacceptable. Thank you for saying that. Now what are you doing about it TODAY?",
              "I'm sorry for shouting but I've been calling since Monday. My daughter hasn't had a proper bath in three days.",
              "Okay. An apology is something. But I need action, not apologies. What's happening today?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['today', 'this morning', 'emergency', 'straight away', 'immediately', 'urgent'],
            messages: [
              "Today? You can actually get someone today? Because I was told 'someone would be in touch' on Monday and nothing happened.",
              "This morning would be ideal. I can't take another half day off work. What time?",
              "If someone comes today I'll calm down. I've just been so frustrated. What time are we talking?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['contractor', 'engineer', 'plumber', 'heating engineer'],
            messages: [
              "When? What time? I've already taken two days off work waiting for a callback that never came.",
              "A heating engineer — right. What time? And will they actually show up?",
              "I need a time window. Not 'morning' — an actual time. I can't sit here all day again.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['can you be in', 'will you be home', 'are you available', 'access', 'when are you in'],
            messages: [
              "I'm working from home today — I'll be in all day. What time is the engineer coming?",
              "I can be in whenever. I've already taken enough time off waiting. Just give me a time.",
              "I'm available all day. I just need a proper time, not a vague window.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Three days. No heating. No hot water. A toddler. What more do I need to say?",
          "I've been patient. I've called three times. This is not okay.",
          "I want to know what you're going to do about it. Not tomorrow. Today.",
          "Look, I'm not enjoying being angry about this. Just tell me there's a solution.",
          "Can you tell me specifically what's happening now? Not what's been logged — what's actually being done.",
        ],
        questionFallbacks: [
          "Can someone come today? That's my only question.",
          "What I want to know is — when exactly is someone coming? Today? Tomorrow?",
          "I'll answer whatever you ask as long as it gets someone here faster.",
          "Are you able to get someone out today? Yes or no?",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['before noon', 'this morning', 'first thing', 'by 12', 'morning slot', 'am'],
            messages: [
              "Before noon? Okay. I need a name and a time. Last time someone said 'morning' and turned up at 4pm.",
              "Morning works if I get a proper confirmation. Text me the engineer's name and ETA.",
              "Okay. Before noon. I'll hold you to that.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['heater', 'portable', 'temporary', 'in the meantime'],
            messages: [
              "That would help for my daughter's room tonight. But I want the boiler fixed, not just a heater as a solution.",
              "If you can drop one round today that would help. But I need the boiler fixed. This can't be the answer.",
              "A temporary heater for tonight — fine. But if the engineer doesn't come, we're having this conversation again.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['credit', 'reimburse', 'compensate', 'refund', 'costs back', 'argos'],
            messages: [
              "I've got the Argos receipt. It was £82. I'd want that back yes.",
              "£82 for two heaters. I have the receipt. Will the landlord refund that?",
              "I shouldn't have had to spend that. £82 receipt — I'll email it over.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['confirm', 'your name', 'note this', 'reference number'],
            messages: [
              "So you're confirming a heating engineer today, before noon. And you'll send me a text. Right?",
              "Can I get your name? I want to know who I spoke to if he doesn't arrive.",
              "Fine. I'm noting this down — engineer today, before noon, text confirmation. Agreed?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['can you confirm', 'will he come', 'is that guaranteed', 'are you sure', 'can you guarantee'],
            messages: [
              "I need you to be certain. Not 'should be' — certain. Can you confirm that?",
              "Guaranteed? Because last time I was told the same thing and no one came.",
              "I'll hold you personally to that. If no one turns up, I'm calling back immediately.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "I need specifics. What time? Which contractor? How will I know they're coming?",
          "I'll believe it when I see it to be honest.",
          "As long as it actually happens this time.",
          "What happens if he cancels? Because last time no one even called.",
          "Give me a direct number I can call if there's a problem this afternoon.",
        ],
        questionFallbacks: [
          "What time exactly? I need an actual time, not 'morning'.",
          "Can you give me a specific time window? I have a toddler to plan around.",
          "Will I get a text before he arrives? I don't want to miss him.",
          "What's the engineer's name and number in case he's running late?",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['text', 'confirmation', 'message', 'email', 'confirm time'],
            messages: [
              "Fine. Send me a text with the time and the engineer's name. If I don't get that by 9am I'm calling you back.",
              "Text me. That's all I need. Engineer name, time, phone number in case he's running late.",
              "A text confirmation. Yes. And if I don't get it, I'm calling again.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['previous report', 'logged', 'records', 'noted your calls', 'can see'],
            messages: [
              "Right. So you can see I've been calling since Monday. Good. I want it acknowledged this wasn't dealt with quickly enough.",
              "At least the calls are on record. That matters if this goes anywhere.",
              "So it's documented. That's something. I want it on file that this took three days with a child in the property.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['is there anything else', 'anything else you need', 'happy with that', 'okay with that'],
            messages: [
              "Just get the engineer here. That's all I need.",
              "No — just fix the boiler and we're done.",
              "If it gets fixed today, yes. That's all I want.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Okay. I'm going to hold you to that.",
          "Fine. As long as it's sorted today.",
          "I'll be in all morning. Make sure they actually come.",
          "I need this fixed today. I mean it.",
          "Tell me you're confident this is happening.",
        ],
        questionFallbacks: [
          "Yes — I can be in. What time is the engineer coming?",
          "Of course I'm available. I've been waiting three days. Just tell me when.",
          "I'll make myself available. What's the time?",
        ],
      },
      resolving: {
        responses: [
          {
            triggers: ['thank', 'thanks', 'appreciate', 'sorry again'],
            messages: [
              "Okay. I appreciate the call back finally. Just make sure it happens.",
              "Right. Thank you. I hope we don't have to do this again.",
              "Alright. Thank you for sorting it. My daughter needs a bath tonight.",
            ],
          },
        ],
        fallbacks: [
          "Alright. Engineer today, before noon. Text to confirm. I'll hold you to that.",
          "Right. Let's hope this is the end of it.",
          "Fine. As long as it's actually fixed today.",
          "Okay. I'll be waiting. Thank you.",
          "Right. I hope this is the last time we have to have this conversation.",
        ],
        questionFallbacks: [
          "Yes — confirmed. Engineer today, before noon.",
          "Yes I'll be in. Just make sure someone comes.",
          "Confirmed. Thank you.",
        ],
      },
    },
  },

  // ── rs-03: Noise Complaint ───────────────────────────────────────────────────
  'rs-03': {
    opening: "I'm calling again about the noise from 4B. This is the fourth time I've raised this and nothing has changed. I have a log here — 14 separate incidents over two months. Last Thursday it was 2:47am.",
    resolved: "Right. A formal written warning to the tenant today, and you'll follow up with me in 48 hours. That's the first concrete action I've heard. If there are any more incidents after that warning, I expect further action. I'll keep my log going.",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['difficult to prove', "can't control", 'not much we can do', 'neighbour dispute'],
            messages: [
              "I know it's difficult but I have fourteen written incidents. Are you telling me that's not enough?",
              "Environmental health seemed to think it was worth their time. Maybe they can help where you can't.",
              "Can't control it — I understand that. But you can write to the tenant. Can you not do that?",
            ],
            stageShift: -1,
          },
          {
            triggers: ['speak to them', "we'll have a word", "look into it", 'investigate'],
            messages: [
              "You said that last time. And the time before. What specifically are you going to DO?",
              "A word. You said that in November too. What happened after that word?",
              "I don't need you to look into it. I've done that. Fourteen times. I need action.",
            ],
            stageShift: -1,
          },
        ],
        fallbacks: [
          "I've been patient. I've followed the correct process. Fourteen incidents. What does it take?",
          "I've spoken to someone at the council's environmental health team. They said I have grounds.",
          "I'm not an unreasonable person but my health is being affected. I'm not sleeping.",
          "Four complaints. Nothing changed. At what point does this become your problem?",
          "I've been keeping this log because I knew this day would come. Here we are.",
        ],
        questionFallbacks: [
          "Do I have the log? Yes — 14 incidents, every date and time. Do you want me to email it now?",
          "What have I done so far? I've called four times and raised it formally twice. That's what I've done.",
          "Have I spoken to the neighbour? No — that's not my place. That's yours.",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['serious', 'seriously', 'acknowledge', 'hear you', 'understand', 'concern'],
            messages: [
              "Good. Because I want to be taken seriously. I'm retired, I chose this flat for a quiet life.",
              "Thank you. That's what I've needed to hear since October.",
              "Good. I have fourteen incidents documented. I am taking this seriously. I need you to as well.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['log', 'record', 'evidence', 'incidents', 'dates'],
            messages: [
              "Yes I have the log here. Dates, times, duration, nature of the noise. 14 incidents. I can email it right now.",
              "I'll email it to you immediately. It's thorough — timestamps, type of noise, duration.",
              "I've been meticulous. I knew I'd need it. Shall I send it over now?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['formal', 'written warning', 'letter', 'notice', 'action'],
            messages: [
              "A formal written warning — yes. That's something concrete. Will the tenant know it came from a complaint?",
              "A letter from the agency — that's what I've been asking for. When would that go out?",
              "Written warning. Yes. Finally. What happens if the behaviour continues after that?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['what action', 'what will you do', 'next steps', 'process'],
            messages: [
              "What does the formal process look like from here? I want to understand the timeline.",
              "Walk me through it. If you send a warning and it's ignored, what's next?",
              "I'd like to know the escalation path. Warning, then what?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['do you have', 'can you send', 'have you logged', 'how many'],
            messages: [
              "Yes, fourteen incidents. Dates, times, duration. I can email it right now.",
              "I have it all — 14 incidents in a log I've been keeping since October. Do you want it now?",
              "I've been logging everything. Do you want me to email the full log across now?",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "I'd like to know what's going to be different this time.",
          "2:47am on Thursday. I have it written down. Fourth time that week.",
          "I just want it to stop. That's all I want.",
          "What do I need to provide to make this move forward?",
          "Tell me there's something you can actually do.",
        ],
        questionFallbacks: [
          "Do I have the log? Yes — 14 incidents, every date and time. Do you want me to email it now?",
          "What have I done so far? I've called four times and raised it formally twice. That's what I've done.",
          "Have I spoken to the neighbour? No — that's not my place. That's yours.",
          "How many times? Four complaints. Nothing changed. That's the answer to your question.",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['written warning', 'formal notice', 'letter to tenant', 'in writing'],
            messages: [
              "A formal written warning today. Good. That's the first concrete step. What happens after if there are more incidents?",
              "And will a copy of that warning be kept on file? I want a paper trail.",
              "Today — you can guarantee today? Because I need to know it's happening, not that it will happen.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['follow up', 'get back to you', 'check in', '48 hours', 'this week'],
            messages: [
              "48 hours. Fine. I'll hold you to that. And I want a direct number if it happens over the weekend.",
              "You'll call me in 48 hours? Put it in the calendar. I'll be waiting.",
              "Two days. Okay. And if there's another incident before then?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['email', 'send me', 'confirmation', 'confirm'],
            messages: [
              "Please do send me an email confirming the action being taken. I'm keeping a paper trail of everything.",
              "Yes — email me today with what's been done. I want it in writing.",
              "An email confirmation — yes. And include a timeline of previous complaints and their responses.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['council', 'environmental health', 'formal complaint'],
            messages: [
              "I haven't filed the council complaint yet but I'm close. I'd rather give you the chance first.",
              "I've had preliminary conversations with environmental health. They're interested in the log.",
              "The council route is available to me. I'd prefer to resolve it through you but that's the next step.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['will you', 'can you confirm', 'have you', 'do you have', 'can you send', 'are you available', 'when did', 'how long'],
            messages: [
              "When will the warning go out? I need a specific date, not 'we'll look into it'.",
              "Can I send you the log? Yes — I'll email it right now if it helps move this forward.",
              "How long has this been going on? Two months of documented incidents. I have every one.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Right. So what's the actual timeline on this?",
          "I appreciate that. What comes next if the warning doesn't work?",
          "I just need to know someone is taking this seriously.",
          "This is the first real conversation I've had about this. I'm glad we're here.",
          "Is there anything you need from me to make the warning stronger?",
        ],
        questionFallbacks: [
          "When will the warning go out? I need a specific date, not 'we'll look into it'.",
          "Can I send you the log? Yes — I'll email it right now if it helps move this forward.",
          "What happens next? That's what I'm asking you.",
          "Have I kept records? Yes. Fourteen incidents. I have everything you need.",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['eviction', 'tenancy breach', 'section 8', 'end tenancy'],
            messages: [
              "I'm not asking for anyone to be evicted. I just want the noise to stop. Is that realistic?",
              "I don't want to escalate to that. I want a quiet life. Can a warning achieve that?",
              "The threat of tenancy action — yes. That might be enough to change the behaviour.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['confirm', 'email', 'document', 'record', 'timeline'],
            messages: [
              "Please include the timeline of previous complaints in that email. I want it documented.",
              "Good. Email me and I'll acknowledge it. I'm keeping all of this.",
              "Email confirmation — yes. And note that this is the fourth time I've raised it.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "As long as action is taken today, I'm willing to give it a chance.",
          "Alright. I'll be watching. My log continues.",
          "That sounds more like it. Thank you.",
          "I'll keep records either way.",
          "I appreciate you finally engaging with this properly.",
        ],
        questionFallbacks: [
          "Will I get a written confirmation? Yes — I want that. Email me what action is being taken.",
          "Can you send that to me in writing? Absolutely — email me today with what's been done.",
          "When will I know it's been actioned? I need a specific date. Not 'soon'.",
        ],
      },
      resolving: {
        responses: [],
        fallbacks: [
          "Okay. Written warning today, follow-up in 48 hours. That's what I needed two months ago.",
          "I appreciate you taking this seriously. I'll keep my log going just in case.",
          "Right. That's a plan. I hope it works.",
          "Thank you. I just want to sleep.",
          "That's all I've been asking for. Let's see if it makes a difference.",
        ],
        questionFallbacks: [
          "Will you follow up in 48 hours? Yes — hold you to that. I'll be waiting.",
          "Can you confirm what was agreed? Written warning today, follow-up in 48 hours. That's the plan.",
          "Have you logged this call? I expect it's on record. I'm keeping my own record too.",
        ],
      },
    },
  },

  // ── rs-04: Early Surrender ───────────────────────────────────────────────────
  'rs-04': {
    opening: "Hi, yes, um — this is a bit awkward. I've been offered a job in Singapore and I've accepted it. I start in six weeks. I know I'm in a fixed term tenancy... I'm not sure what happens now.",
    resolved: "That's really helpful, thank you. So my liability ends as soon as a replacement tenant moves in — you'll start remarketing straight away and I'll cover any reasonable re-letting costs. That feels fair. Can you put that in writing?",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['full rent', 'remaining months', 'eight months', 'liable for all', 'contractual'],
            messages: [
              "Eight months of rent? That's nearly £9,000. I can't pay that. Is that actually enforceable?",
              "I understand there's a contract. But surely there's a middle ground here.",
              "Eight months... I wasn't expecting that. Is that the absolute position?",
            ],
            stageShift: -1,
          },
          {
            triggers: ['breach', 'you signed', 'contract', 'legal obligation'],
            messages: [
              "I understand I signed a contract. I'm not trying to avoid my responsibilities. I just need to understand my options.",
              "I know I signed it. I'm not disputing that. I'm asking what I can do about it now.",
              "Yes — I signed it. I'm not arguing that. I want to know the realistic outcome here.",
            ],
          },
        ],
        fallbacks: [
          "I'm not trying to just disappear — I want to sort this out properly.",
          "I feel terrible about it. The job was just too good to turn down.",
          "What are my actual options? I genuinely don't know.",
          "I want to be cooperative. What do you need from me?",
          "Tell me the worst case and we'll work backwards from there.",
        ],
        questionFallbacks: [
          "What are my options? That's exactly what I'm trying to find out.",
          "How much will it cost me? I want to plan for it. I'm not trying to avoid paying what's fair.",
          "Can I leave early without paying the full remainder? I genuinely don't know — that's why I'm calling.",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['surrender', 'early exit', 'mutual agreement', 'deed of surrender'],
            messages: [
              "A deed of surrender — okay, I've not heard that term before. What does that involve?",
              "Mutual surrender — that sounds more constructive than what I was imagining. Tell me more.",
              "Is that a formal legal document? And who arranges it?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['replacement', 'new tenant', 'remarket', 're-let', 'find someone'],
            messages: [
              "So if you find a new tenant quickly, my liability ends at that point? That's much more reasonable.",
              "And you'd start looking immediately? I can have the flat ready for viewings within days.",
              "How quickly could you realistically find someone? It's a good flat — is demand high?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['liability', 'responsible for', 'costs', 'fees', 're-let fee'],
            messages: [
              "What costs are we talking about exactly? Re-letting fees? I expected something but I want to understand the figure.",
              "If it's one month's re-let fee I can plan for that. What's the likely amount?",
              "I'm prepared for some costs — I just want to know what I'm agreeing to before I agree.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['understand', 'appreciate', 'difficult', 'circumstances', 'unexpected'],
            messages: [
              "I do appreciate that. It came out of nowhere — I've been here four months and I've had no problems.",
              "Thank you. It wasn't an easy decision but these opportunities don't come twice.",
              "I really do want to be as cooperative as possible on this.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['what are your options', 'how much', 'what happens', 'what do you owe', 'what are you liable'],
            messages: [
              "What are my options? That's exactly what I'm trying to find out. I want to understand the full picture.",
              "How much would it cost me to leave early? I want to plan for it.",
              "I honestly don't know what I owe — that's why I'm calling. Can you walk me through it?",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "I've been here four months and I've been a good tenant. No problems at all.",
          "I want to do this the right way. What's the formal process?",
          "I just want to know what I'm actually liable for.",
          "Is this something you've dealt with before? What usually happens?",
          "I'm not trying to dodge anything — I just need clarity.",
        ],
        questionFallbacks: [
          "What are my options? That's exactly what I'm trying to find out.",
          "How much will it cost me? I want to plan for it properly.",
          "Can I leave early without paying the full remainder? I genuinely don't know — that's why I'm asking.",
          "Will you need me to keep paying until a new tenant is found? I want to understand what I'm agreeing to.",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['start marketing', 'advertise', 'rightmove', 'list it', 'find tenant quickly', 'viewings'],
            messages: [
              "The sooner the better. I'll make the flat available for viewings immediately — I can move things into storage if needed.",
              "I'll accommodate viewings at any time. I want this resolved as quickly as you do.",
              "I can be flexible about when people come round. Evenings, weekends — whatever it takes.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['re-let fee', 'admin fee', 'reasonable costs', 'one month', 'one months'],
            messages: [
              "One month's rent as a re-let fee — I can work with that. As long as I know what I'm agreeing to.",
              "That's what I was budgeting for roughly. So one month's fee and no further liability once a replacement is in?",
              "One month — okay. And that's it? No other charges on top?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['in writing', 'written agreement', 'email', 'confirm', 'document'],
            messages: [
              "Yes please — I'd like everything in writing before I agree to anything. Can you email a summary?",
              "I'd want that documented. Not because I don't trust you — just for both our protection.",
              "Written confirmation — absolutely. Can you send it today?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['will you', 'can you confirm', 'have you', 'do you have', 'can you send', 'are you available', 'when can', 'what do you need'],
            messages: [
              "When can viewings start? As soon as you want — I'll make myself available at any time.",
              "What do I need to sign? Whatever you need — just send it over and I'll turn it around today.",
              "Are you available for viewings? Yes. Evenings, weekends — I can work around anything.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "That sounds more manageable. I was worried about owing months of rent.",
          "I want to leave on good terms. I might need a reference in Singapore.",
          "What do you need from me to get the ball rolling?",
          "I'm relieved this conversation is going in this direction.",
          "How soon can we get the formal process started?",
        ],
        questionFallbacks: [
          "When can viewings start? As soon as you want — I'll make myself available.",
          "What do I need to sign? Whatever you need, just send it over.",
          "Do you have a timeline for finding a replacement? The sooner the better for me.",
          "Can you confirm what I'd owe if a tenant is found in three weeks? I want to plan.",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['reference', 'landlord reference', 'good standing'],
            messages: [
              "That's really important to me — I'll need a reference for accommodation abroad. I want to leave on good terms.",
              "A good reference from you would mean a lot. I've been a good tenant.",
              "Can I count on a positive reference? That's as important to me as the financial side.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['confirm', 'send email', 'written', 'document', 'today'],
            messages: [
              "Please do email that over. I'll review it and come back to you today.",
              "Send it today and I'll reply straight away. I want this wrapped up quickly.",
              "I'll look at it the moment it arrives. Today, yes.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Okay. That all sounds fair and reasonable.",
          "I appreciate you explaining it clearly. This is my first time dealing with this.",
          "Right. Let's get it sorted quickly then.",
          "I'm glad we could talk this through like adults.",
          "What's the next step from here?",
        ],
        questionFallbacks: [
          "Will you send me the paperwork today? Yes please — I'll sign it as soon as it arrives.",
          "Can you confirm when marketing starts? The sooner the better. I want this resolved.",
          "Do you have everything you need from me? I think so — but let me know if not.",
        ],
      },
      resolving: {
        responses: [],
        fallbacks: [
          "That's a relief. I was worried this was going to be a much bigger problem.",
          "Perfect. Email me the surrender agreement and I'll sign it straight away.",
          "Thank you for being reasonable about this.",
          "I'll start organising storage this week. Make it easy for viewings.",
          "Right. Let's get this done. Thank you.",
        ],
        questionFallbacks: [
          "Will I get the agreement by email? Yes — send it today and I'll sign it today.",
          "Can you confirm it's all agreed? Yes — re-let fee, liability ends when the tenant moves in. That's what we said.",
          "Do you have my forwarding address? Not yet — I'll email it across.",
        ],
      },
    },
  },

  // ── rs-05: Deposit Dispute ───────────────────────────────────────────────────
  'rs-05': {
    opening: "Right, I've just seen the deductions from my deposit and I'm not happy. £850? For what exactly? The place was spotless when I left. I have photos. Who do I talk to about this?",
    resolved: "Okay. So if you can provide the actual invoice for the cleaning with before-and-after photos, and confirm that the carpet replacement is prorated for fair wear and tear over two years... I'm willing to look at those figures again. But I'm not accepting £850 without evidence.",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['policy', 'standard', 'normal charge', 'always charge'],
            messages: [
              "It's not 'standard' to charge £400 for cleaning a flat I'd already cleaned. Do you have photos showing it was dirty?",
              "Standard charge? That implies you charge this regardless of condition. Is that right?",
              "If it's standard it should be in the tenancy agreement. Can you show me where?",
            ],
            stageShift: -1,
          },
          {
            triggers: ['full carpet', 'full replacement', 'brand new', 'full cost'],
            messages: [
              "Full carpet replacement after a two-year tenancy? That's fair wear and tear. You cannot charge me for that.",
              "I know the law on this. Carpets have a lifespan. After two years you can't charge me the full replacement value.",
              "A two-year-old carpet being fully replaced at my cost? That's not how deposit deductions work.",
            ],
            stageShift: -1,
          },
          {
            triggers: ["can't do anything", 'landlord decision', 'up to landlord', 'nothing i can do'],
            messages: [
              "Someone has to be able to do something. What's the deposit scheme for otherwise?",
              "I'll take it to the scheme then. I'm happy to do that. But I wanted to try this route first.",
              "If it's entirely the landlord's decision then give me his contact details please.",
            ],
            stageShift: -1,
          },
        ],
        fallbacks: [
          "I left that flat in better condition than I found it. These charges are outrageous.",
          "I know about deposit adjudication. I'll take this to the scheme.",
          "I have timestamped photos from move-out day. I'm not paying for something I didn't do.",
          "£850 is two months of my energy bill. I'm not handing that over without evidence.",
          "I want actual invoices, not estimates. Has this work even been done?",
        ],
        questionFallbacks: [
          "Do I have photos? Yes. Timestamped. From move-out day. The flat was spotless.",
          "What evidence do I have? More than you'd expect. Photos, my own inventory walk, receipts.",
          "Have I cleaned the property? Yes — professionally, actually. I have the receipt.",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['evidence', 'photos', 'inventory', 'check-out report', 'documentation'],
            messages: [
              "Yes, I want to see the evidence. What photos do you have? Because I have photos too and the flat was clean.",
              "Send me the check-out report. I want to compare it to my move-in inventory.",
              "I'll look at any evidence you have. I'm confident about my position.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['fair wear and tear', 'two years', 'reasonable', 'depreciation'],
            messages: [
              "Exactly — two years of normal use. The carpet had a bit of wear. That's what fair wear and tear means.",
              "If you're acknowledging fair wear and tear, then the full replacement cost is off the table, right?",
              "Good. We're on the same page on that. So what's the adjusted figure?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['itemised', 'breakdown', 'invoice', 'quote', 'explain each'],
            messages: [
              "Yes. I want an itemised breakdown with actual invoices or quotes for every single deduction.",
              "Itemised — great. And not estimates. Actual invoices from whoever did the work.",
              "I'll review each deduction if you can send me the breakdown with supporting evidence.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['dispute', 'adjudication', 'scheme', 'tds', 'dps', 'my deposits'],
            messages: [
              "I know the adjudication process. I'm happy to go through it if we can't resolve this.",
              "I've done my research on the deposit scheme process. I'm not afraid to use it.",
              "Adjudication is available to me. I'd rather settle here but I'm prepared to go that route.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['do you have photos', 'what evidence', 'can you prove', 'have you got'],
            messages: [
              "Yes. Timestamped photos from move-out day. The flat was spotless.",
              "I have photos, a professional cleaning receipt, and my own inventory notes. I came prepared.",
              "Yes — photos with timestamps, taken the morning I handed the keys back. I know exactly what I'm talking about.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "£400 for a professional clean on a flat I already cleaned? Show me the invoice.",
          "I need to see the invoices. Actual proof of what was spent.",
          "I'm not going to just accept this without a proper explanation.",
          "I have time. I'll pursue this through the scheme if I have to.",
          "Just walk me through each deduction. What's the £400 for specifically?",
        ],
        questionFallbacks: [
          "Do I have photos? Yes. Timestamped. From move-out day. The flat was spotless.",
          "What evidence do I have? More than you'd expect. Photos, my own inventory walk, receipts.",
          "Have I cleaned the property? Yes — professionally, actually. I have the receipt.",
          "Can I prove it? Absolutely. I can send you photos right now if that would help.",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['prorate', 'pro-rata', 'depreciation', 'age of carpet', 'portion', 'lifespan'],
            messages: [
              "Prorating the carpet for two years of a five-year lifespan — so two fifths of replacement cost. That's fair.",
              "Two-fifths. Okay. What does that actually come to? What was the total replacement figure?",
              "Pro-rata on the carpet — yes. That's the correct approach. I can accept that calculation.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['check-in', 'move-in', 'original condition', 'inventory at start'],
            messages: [
              "What does the check-in inventory say about the carpet? If it already had wear when I moved in, that's relevant.",
              "I want to see the move-in inventory alongside the check-out report. Can you send both?",
              "The check-in photos should show the starting condition. What do they say about the carpet?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['reduce', 'lower', 'negotiate', 'revised figure', 'come down'],
            messages: [
              "I'm open to a fair figure. I just don't think £850 is it. What's the minimum with proper evidence?",
              "What would the landlord accept with the prorating applied and the cleaning properly evidenced?",
              "Give me a revised number based on fair wear and tear rules. I'll look at it seriously.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['adjudication', 'dispute process', 'scheme referee'],
            messages: [
              "If we go to adjudication I'm confident about the cleaning charge. Adjudicators tend to be fair on wear and tear.",
              "I'm ready to use the scheme. But I'd prefer to avoid it if there's a reasonable number here.",
              "I've read the scheme guidelines. My position is strong on the carpet at least.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['will you', 'can you confirm', 'have you', 'do you have', 'can you send', 'are you available', 'when did', 'how long'],
            messages: [
              "Is that the adjudicator's standard? Because I've read the guidelines and fair wear and tear applies.",
              "What's the reduced figure? Put a number on it.",
              "Can I send my photos? Yes — I'll email them now. Timestamped, move-out day.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "I'm not looking for trouble. I just want to be charged fairly.",
          "Show me the evidence and I'll respond to it. That's all I'm asking.",
          "What would you do in my position? You'd want to see the invoices too.",
          "What's the realistic figure if you apply fair wear and tear correctly?",
          "I'm willing to settle today if the number is fair.",
        ],
        questionFallbacks: [
          "Is that the adjudicator's standard? Because I've read the guidelines and fair wear and tear applies.",
          "What's the reduced figure? Put a number on it.",
          "Can I send my photos? Yes — right now if you want them.",
          "Have you looked at the move-in inventory? Because the carpet had wear when I arrived.",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['revised', 'new figure', 'adjusted', 'reduced', 'lower amount'],
            messages: [
              "What's the new figure? Tell me and I'll decide if I'm happy to settle or go to adjudication.",
              "Put the revised number to me. If it's reasonable I'll accept it today.",
              "Give me the adjusted amount with the prorating applied and I'll give you an answer.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['send over', 'email', 'documents', 'invoice', 'photos', 'evidence'],
            messages: [
              "Good. Email everything over and I'll look at it today. If the evidence is solid I'll respond quickly.",
              "Send it all — check-out report, invoices, photos. I'll review it properly.",
              "I'll look at it the moment it arrives. If it's fair, I won't drag this out.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Alright. Let me see the documentation and we can go from there.",
          "I'm not being difficult. I just want to be treated fairly.",
          "If the evidence supports a fair deduction, I'll accept it.",
          "Send it over and we'll talk again today.",
          "I'm close to agreeing — I just need to see the paperwork.",
        ],
        questionFallbacks: [
          "Can you send the evidence today? Yes — send it and I'll review it same day.",
          "Will you accept a lower figure? I'll accept a fair figure. That's different.",
          "Do you want my photos? Yes. Email them across and I'll make sure they're with the file.",
        ],
      },
      resolving: {
        responses: [],
        fallbacks: [
          "Okay. Send me the revised breakdown with invoices and I'll review it.",
          "That sounds more reasonable. Let's see the paperwork.",
          "Right. If the evidence is there and the calculation is fair, we're done.",
          "Good. Email it over. I'll come back to you same day.",
          "Okay. I think we can settle this today if the numbers add up.",
        ],
        questionFallbacks: [
          "Will I accept the revised figure? Send me the paperwork and I'll tell you.",
          "Can we settle this today? Yes — if the number is right. Send it over.",
          "Have you confirmed the prorating? That's what I need to see before I agree.",
        ],
      },
    },
  },

  // ── rs-06: Damp and Mould ────────────────────────────────────────────────────
  'rs-06': {
    opening: "I need to talk to you about the mould in my bedroom. I've mentioned it twice and both times I was told to open windows more. My daughter has been having breathing difficulties. The doctor mentioned the damp could be a factor.",
    resolved: "An inspection this week — okay, yes. Thank you. I just want someone to actually look at it properly. I've been opening the windows, I do ventilate, this isn't condensation from me cooking. Something is wrong structurally.",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['open windows', 'ventilate', 'condensation', 'lifestyle', 'cooking'],
            messages: [
              "I've been told to open windows twice already. I work from home — the windows are open every day. This is not condensation.",
              "I've heard this twice. The windows are open. The mould is on an external wall. That's not lifestyle.",
              "I ventilate this flat constantly. The mould is on an external wall, not around the shower.",
            ],
            stageShift: -1,
          },
          {
            triggers: ['your fault', 'tenant responsibility', 'how you live'],
            messages: [
              "I cannot believe you're saying that when my child has been to the doctor. This conversation is being noted.",
              "My child has breathing difficulties and you're suggesting it's how I live? I need this escalated.",
              "I want to speak to someone senior. Right now.",
            ],
            stageShift: -1,
          },
          {
            triggers: ["can't do anything", 'not our issue', 'speak to landlord', 'nothing we can'],
            messages: [
              "The landlord doesn't respond to messages. That's why I'm calling the agency.",
              "If you can't help me, who can? Because I'm not going away.",
              "I've already looked at the Homes (Fitness for Human Habitation) Act. I know my rights here.",
            ],
            stageShift: -1,
          },
        ],
        fallbacks: [
          "My daughter is five years old and she's been unwell. I would have thought that might create some urgency.",
          "I've already looked at the Fitness for Human Habitation Act. I know what I'm entitled to.",
          "I'm not going away. This needs to be fixed.",
          "I've been keeping a log of this for months. I have everything documented.",
          "Tell me what I need to do to get someone to actually come and look at it.",
        ],
        questionFallbacks: [
          "Have I kept records? Yes — dates, photos, what was said each time. I have it all.",
          "Has my daughter been to the doctor? Yes. I have a letter. The doctor mentioned indoor air quality.",
          "How long has this been going on? Two months of visible mould. Longer of damp smell.",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['sorry', 'apologise', 'serious', 'health', 'understand', 'concern'],
            messages: [
              "Yes, her breathing difficulties started about two months ago — around when the mould got worse.",
              "Thank you for saying that. The doctor's letter mentions indoor air quality. I can email it to you.",
              "I'm glad you're treating it seriously. I've felt dismissed twice already.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['inspection', 'survey', 'look at it', 'assess', 'come and see', 'visit'],
            messages: [
              "An inspection — yes, please. It's on the external wall in the main bedroom. Not just the bathroom.",
              "I want someone to actually look at it. Not give advice over the phone. Can we book a date now?",
              "That's what I need. Can we schedule it this week?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['48 hours', 'this week', 'soon', 'priority', 'urgent', 'quickly'],
            messages: [
              "This week? That's the first time anyone's said that. Can we book a specific date right now?",
              "This week — yes. A date. Not a vague 'soon'. Can we put something in the diary?",
              "If it's this week I'll make myself available at any time. What works?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['penetrating', 'structural', 'external', 'cause', 'investigate', 'source'],
            messages: [
              "That's what I've been saying — it's on the external wall. Water's coming in from somewhere.",
              "Finally someone is listening. It's not condensation. Can you send someone who specialises in damp?",
              "Yes — the cause matters. Not just treatment. I want the source identified.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['how long', 'when did', 'have you reported', 'do you have records'],
            messages: [
              "Two months of visible mould, longer of a damp smell. I first raised it in writing in February.",
              "I reported it twice — once in February, once in March. Both times I was told to open windows.",
              "I have records of every time I raised this. Dates, what was said, what happened next. Nothing.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "All I want is for someone to come and properly look at it. Not dismiss it.",
          "My daughter's health is my priority. This needs to be treated as urgent.",
          "I've been very patient. I've tried to do things the right way.",
          "What do I need to do to make this happen this week?",
          "I've stopped arguing and I'm just asking for an inspection. Can we do that?",
        ],
        questionFallbacks: [
          "Have I kept records? Yes — dates, photos, what was said each time. I have it all.",
          "Has my daughter been to the doctor? Yes. I have a letter — I can email it to you.",
          "How long has this been going on? Two months of visible mould. Longer of damp smell.",
          "Do I have photos? Yes. I'll send them now if you want to see what I'm dealing with.",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['damp specialist', 'damp survey', 'damp expert', 'surveyor', 'specialist'],
            messages: [
              "A proper damp survey — that's what it needs. Not someone looking for five minutes and saying 'open windows'.",
              "A specialist, not a general maintenance person. Yes. Someone who can identify the source.",
              "Can you guarantee it'll be a damp specialist and not just a general contractor?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['book', 'schedule', 'appointment', 'specific date', 'when exactly'],
            messages: [
              "Can we book it now? I don't want another 'someone will be in touch'. I want a date.",
              "Give me a date and I'll confirm right now. I'll rearrange anything.",
              "Book it while I've got you. I've had too many vague promises.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['log', 'record', 'document', 'written', 'note', 'previous'],
            messages: [
              "I've been keeping a log — when I reported it, what was said, photos with dates. I have all of it.",
              "Good. I'll email you the log so you have a full picture before the inspection.",
              "I've documented everything. Photos, dates, the doctor's visit. It's thorough.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['will you', 'can you confirm', 'have you', 'do you have', 'can you send', 'are you available', 'when can', 'when did'],
            messages: [
              "When can someone come? This week — I need a specific day, not a vague promise.",
              "Can I send photos? I'll send them right now if it helps get someone here faster.",
              "Are you available for an inspector? Yes — any time this week. I'll rearrange everything.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "What I need is a specific date for an inspection this week. Can you give me that?",
          "If someone comes and confirms it's structural damp, what happens next?",
          "I just want it fixed. I've been patient for months.",
          "This week. A real appointment. That's all I'm asking for.",
          "I can move my daughter into the living room if it means getting work done sooner.",
        ],
        questionFallbacks: [
          "When can someone come? This week — I need a specific day.",
          "Can I send photos? I'll send them right now if it helps.",
          "Have you been able to book anyone? That's all I'm asking — a date, this week.",
          "Do you need me to do anything before the inspection? Just tell me what helps.",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['confirm', 'text', 'email', 'appointment confirmed'],
            messages: [
              "Please send me an email confirming the inspection date and who's coming. I keep records of everything.",
              "Email me the confirmation today. And the name of whoever is coming.",
              "Yes — and include what kind of specialist they are. I want to know it's the right person.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['remediation', 'fix', 'treatment', 'works', 'repairs'],
            messages: [
              "I want the cause fixed, not just mould spray on the surface. If it's structural, it needs a structural fix.",
              "Treatment is fine for now but I want the source addressed. Not just symptoms.",
              "What happens after the inspection? If they find something structural, what's the process?",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Okay. This week, with a proper damp assessment. I'm holding you to that.",
          "That's the most reassuring this conversation has been. Thank you.",
          "Please make sure it actually happens.",
          "Right. I feel like we're finally getting somewhere.",
          "I just want it fixed before it gets worse.",
        ],
        questionFallbacks: [
          "Will you send confirmation by email? Yes please — I want the date and the specialist's name in writing.",
          "Can you confirm it's a damp specialist and not a general handyman? That's all I'm asking.",
          "When exactly? I need a day, not just 'this week'. Can you give me that now?",
        ],
      },
      resolving: {
        responses: [],
        fallbacks: [
          "Right. An inspection this week with a damp specialist. Email confirming the date. That's what I needed.",
          "Thank you. That's all I've been asking for. I'll make sure I'm available.",
          "Good. And please make it someone who actually knows about damp, not a general handyman.",
          "I appreciate it. Let's hope this is the start of getting it sorted.",
          "Okay. Finally. Thank you.",
        ],
        questionFallbacks: [
          "Will I be there for the inspection? Yes — I'll make sure I'm home all day.",
          "Can you confirm the appointment by email? Yes — please send it today so I have it in writing.",
          "Do I need to do anything to prepare? Just make sure the specialist can access the bedroom wall.",
        ],
      },
    },
  },

  // ── rs-07: Rent Increase ─────────────────────────────────────────────────────
  'rs-07': {
    opening: "Right, I've had the renewal letter. £150 a month increase — that's £1,800 a year extra. I've been here three years, always paid on time, and this feels like a lot. Can we talk about it?",
    resolved: "£1,200 — okay. That's a £100 increase which I can accept given it's been three years. As long as it's a twelve-month fixed term so I've got stability. Can you confirm that in the renewal paperwork?",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['take it or leave it', 'market rate', "can't negotiate", 'final offer', 'landlord decision'],
            messages: [
              "Right. So three years of being a perfect tenant means nothing? I'll start looking at other properties then.",
              "Final offer at £1,250? I've seen comparables at £1,150 to £1,200 on Rightmove. This week.",
              "If that's the position, I'll be handing in my notice. A void month costs more than the difference.",
            ],
            stageShift: -1,
          },
          {
            triggers: ['costs gone up', 'mortgage', 'energy bills', 'expenses'],
            messages: [
              "My costs have gone up too. That's exactly why a £150 increase is a lot to absorb.",
              "I understand costs have risen for everyone. That's why I'm asking to discuss it rather than just saying no.",
              "I know things are more expensive for landlords. I'm not unsympathetic. I'm just asking for a conversation.",
            ],
            stageShift: -1,
          },
        ],
        fallbacks: [
          "Moving costs me £2,000 in fees and deposits. I'd rather not. But not at £1,250.",
          "I've looked at Rightmove. Comparable places are at £1,150 to £1,200.",
          "I want to stay. I'm just asking for a reasonable conversation.",
          "Three years, no problems, no missed payments. Doesn't that mean anything?",
          "I'm not asking to pay less than I do now. I'm asking whether £150 is negotiable.",
        ],
        questionFallbacks: [
          "Have I looked at other properties? Yes — Rightmove, this week. I have the links.",
          "What would I accept? A reasonable increase. Not £150.",
          "Am I going to leave? I don't want to. But not at £1,250.",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['understand', 'fair point', 'appreciate', 'good tenant', 'track record', 'three years'],
            messages: [
              "Exactly. Three years, no arrears, no complaints, no damage. That has a value to the landlord.",
              "Thank you for acknowledging that. A reliable long-term tenant is worth something.",
              "My track record is good. That reduces the landlord's risk. It's worth something at renewal.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['market rate', 'comparable', 'similar properties', 'area', 'rightmove'],
            messages: [
              "I've looked. Similar two-beds in this postcode are going for £1,150 to £1,200. So £1,250 is at the top.",
              "I've done my research. I'm happy to share the listings I found if that helps.",
              "At £1,250 I'd be paying above market rate. I can show you the comparables if useful.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['negotiate', 'discuss', 'compromise', 'middle ground', 'work something out'],
            messages: [
              "What's the landlord's position? Is there any flexibility? I accept some increase — just not £150.",
              "I'm open to a middle ground. What does the landlord need from his side?",
              "I'm not looking for a big win here. A fair compromise — that's all.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['void', 'empty', 'new tenant', 'reletting', 'cost of moving'],
            messages: [
              "Exactly. A void month at £1,100 costs more than the difference between £1,200 and £1,250.",
              "Re-advertising, fees, waiting for a new tenant — none of that is free.",
              "I'm not making this argument for my benefit. I'm saying the landlord's interests are served by keeping me too.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['have you looked', 'would you consider', 'what would you accept', 'what increase'],
            messages: [
              "I've been on Rightmove this week. Similar two-beds nearby are going for £1,150 to £1,200.",
              "I'd consider a hundred. Not a hundred and fifty. That's my honest answer.",
              "What increase would I accept? Something that reflects the market. Not above it.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "I want to stay. Is £1,250 fixed or is the landlord open to a conversation?",
          "I've been a good tenant. Surely that counts for something.",
          "Is there a number that works for everyone? What would that look like?",
          "What's the landlord's reasoning for the full £150? Help me understand.",
          "I don't want to leave. I really don't. But I need the number to make sense.",
        ],
        questionFallbacks: [
          "Have I looked at other properties? Yes — Rightmove, this week. I have the links.",
          "What would I accept? A reasonable increase. Not £150.",
          "Am I going to leave? I don't want to. But I need the number to make sense.",
          "Will I sign at £1,250? No. That's the honest answer.",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['£1,200', '1200', 'hundred', '£100 increase', 'hundred pounds'],
            messages: [
              "£1,200 — a £100 increase. I could probably work with that. What's the term?",
              "That's more in line with what I was expecting. A hundred a month I can absorb.",
              "£1,200 for twelve months fixed and I'll sign this week. Is that possible?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['twelve month', '12 month', 'fixed term', 'fixed for a year', 'stability'],
            messages: [
              "A twelve-month fixed at £1,200 — that gives me security and the landlord a guaranteed income. Makes sense for both.",
              "Twelve months fixed is important to me. I don't want a periodic tenancy. Can you confirm that's on the table?",
              "Fixed for a year at £1,200 — I can work with that. Let's do it.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['speak to landlord', 'check with', 'come back to you', 'confirm', 'put it to'],
            messages: [
              "Okay. Speak to the landlord and come back to me. I'd like to know by end of this week.",
              "Put the case to him — long-term reliable tenant, market rates, void risk. See what he says.",
              "That's all I'm asking — just put it to him. Can you get back to me by Friday?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['will you', 'can you confirm', 'have you', 'do you have', 'can you send', 'are you available', 'when can', 'when did'],
            messages: [
              "Will the landlord negotiate? That's what I'm asking you to find out.",
              "When can I expect a response? I need to make a decision by end of week.",
              "Have you put this to him before? What did he say last time a tenant pushed back?",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "What's the realistic position? Give it to me straight.",
          "If the landlord came to £1,200, I'd sign today.",
          "I just want a fair deal. I'm not trying to exploit anyone.",
          "What do you think he'll say if you put it to him?",
          "Help me understand what's driving the £150 figure. Is there room?",
        ],
        questionFallbacks: [
          "Will the landlord negotiate? That's what I'm asking you to find out.",
          "When can I expect a response? I need to make a decision by end of week.",
          "Have you spoken to him yet? I'm not trying to be difficult — I just need an answer.",
          "Can you put it to him today? I'm happy to wait until tomorrow. But I need an answer this week.",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['confirm', 'paperwork', 'send over', 'renewal documents', 'sign'],
            messages: [
              "Send over the renewal at £1,200 for twelve months and I'll sign it. Thank you.",
              "Documents at £1,200, twelve months fixed. I'll turn them around same day.",
              "Yes — send everything over. I'll review and sign today.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['by friday', 'by end of week', 'few days', 'shortly'],
            messages: [
              "Fine. I'll wait to hear. But if I don't hear by Friday I'll need to start looking.",
              "Friday. That's fine. I appreciate you putting it to him.",
              "Okay. Friday then. I'll hold off making any decisions until I hear from you.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "I appreciate you putting the case to the landlord. That's all I'm asking.",
          "Reasonable conversation — that's all it takes.",
          "Let me know what they say.",
          "Thank you. I hope we can wrap this up this week.",
          "I'll wait to hear. Thanks for being decent about it.",
        ],
        questionFallbacks: [
          "Will you hear back today? Let me know when you do — I'm making a decision by end of week.",
          "Can you confirm what you're asking him? £1,200, twelve months fixed. That's the position.",
          "Do you think he'll say yes? I genuinely don't know — that's why I'm asking you.",
        ],
      },
      resolving: {
        responses: [],
        fallbacks: [
          "Good. £1,200 for twelve months. Send me the paperwork and I'll sign.",
          "Thank you. That's a fair outcome. I'll stay put.",
          "Right. Done. I'll sign this week.",
          "Good result for both of us. I appreciate the conversation.",
          "Perfect. Let's get the paperwork sorted.",
        ],
        questionFallbacks: [
          "Will I sign this week? Yes — send over the paperwork and I'll do it today.",
          "Can you confirm it's twelve months fixed? That's what I need before I sign anything.",
          "Do you have everything you need from me? I think so — just send the renewal over.",
        ],
      },
    },
  },

  // ── rs-08: Persistent Late Payer ─────────────────────────────────────────────
  'rs-08': {
    opening: "Oh hi yeah, look — the rent. I know, I know. I sent it last week actually, must be a bank thing. You know what banks are like. Should be with you any day.",
    resolved: "Right. Standing order, set up by Friday, going out on the 28th. And if it misses that date once more it goes to the formal process. I hear you. I'll sort the standing order tonight actually.",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['section 8', 'eviction', 'legal', 'notice', 'formal action'],
            messages: [
              "Woah, isn't that a bit extreme? It always comes. You've always had the money.",
              "Formal action for rent that arrives late? Has it ever actually not arrived?",
              "I've never not paid. You know that. Is this really necessary?",
            ],
          },
          {
            triggers: ['every month', 'pattern', 'third time', 'consistent', 'repeated', 'again'],
            messages: [
              "Okay look, I know it's been a bit erratic lately. Things have been busy.",
              "It's not been ideal. I know. But I do always pay.",
              "Three times — okay, when you put it like that. But it's always arrived, hasn't it.",
            ],
          },
        ],
        fallbacks: [
          "Look it always comes doesn't it. I don't see what the big deal is.",
          "I'll sort it. I always sort it.",
          "The bank's been playing up. What do you want me to do?",
          "It's not like I'm avoiding it. It's just admin.",
          "I just forget sometimes. It's not deliberate.",
        ],
        questionFallbacks: [
          "Have I set up a standing order? No, not yet. I keep meaning to.",
          "When will I pay? This week. Definitely.",
          "Do I know I'm late? Yeah, yeah. I know.",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['standing order', 'direct debit', 'automatic payment', 'set up payment'],
            messages: [
              "A standing order? I suppose I could do that. What date would it go out?",
              "I've thought about that actually. Would that fix the issue from your end?",
              "Standing order — yeah, then I don't have to think about it. Probably better for everyone.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['payday', 'when do you get paid', 'salary date', 'when does money come in'],
            messages: [
              "I get paid on the 30th usually. Sometimes 28th if it falls on a weekend.",
              "End of the month — 28th to 30th depending. So I need it going out on the 28th ideally.",
              "My salary hits on the 30th. If the standing order goes out the same day there's no gap.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['formal notice', 'section 8', 'official warning', 'record', 'reference'],
            messages: [
              "A formal notice — that could affect my reference though. I don't want that on my record.",
              "I don't want anything official going on my rental history. I might need to move.",
              "Okay that gets my attention. A formal notice would be a problem for me long-term.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['when will you pay', 'specific date', 'commit', 'promise', 'guarantee'],
            messages: [
              "I'll pay it by Wednesday. This week. Is that specific enough?",
              "Fine. Wednesday. I'll transfer it myself, not wait for the bank.",
              "I'll do it today actually. Right now if you want. Let me just find the app.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['when will you', 'have you sent', 'did you transfer', 'can you confirm payment'],
            messages: [
              "Have I sent it? Not yet. But I'm doing it this week — Wednesday at the latest.",
              "Did I transfer it? Look, it's coming. Wednesday. I'll do it Wednesday.",
              "Can I confirm payment? Not yet. But it's happening. This week.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Yeah yeah I'll pay it. What's today — I'll get it done by end of week.",
          "It's not like I'm spending it on myself. Things have just been hectic.",
          "Alright, when do you need it by exactly?",
          "I hear what you're saying. It's sloppy, I know.",
          "What's the easiest way to sort this so we don't keep having this chat?",
        ],
        questionFallbacks: [
          "Have I set up a standing order? No, not yet. I keep meaning to.",
          "When will I pay? This week. Definitely.",
          "Do I know I'm late? Yeah, yeah. I know.",
          "Can I confirm when the payment's going out? Wednesday. That's what I'm telling you.",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['friday', 'wednesday', 'by end of week', 'specific day', 'this week'],
            messages: [
              "Wednesday. Fine. I'll do it Wednesday. That's a commitment.",
              "I'll transfer it Wednesday morning before 10am. Will you be able to see it by end of that day?",
              "Wednesday. Yeah. I'll set a reminder now while I've got you on.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['standing order', 'the 28th', 'the 30th', 'match payday', 'same day'],
            messages: [
              "The 28th — so it goes out the day I'm paid. Makes sense. I'll set it up tonight.",
              "If I set it up for the 28th it should hit you on the 1st. Would that work?",
              "Fine. 28th standing order. I'll do it through my banking app this evening.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['rental reference', 'landlord reference', 'future rental', 'affect record'],
            messages: [
              "I don't want problems with references. I might need to move in a year or two.",
              "Right. If this goes on my rental record it's a problem. I'm taking that seriously.",
              "A reference issue would follow me. Okay. I'm actually listening now.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['will you', 'can you confirm', 'have you', 'do you have', 'can you send', 'are you available', 'when did', 'how long'],
            messages: [
              "Can I set up a standing order? I suppose so, yes. What date works for you?",
              "When exactly will I pay? Wednesday. I'll do it Wednesday.",
              "Have I done it before? No — I've always done it manually. That's the problem.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Alright, I hear you. It's not ideal, I know.",
          "What's the easiest way to sort the standing order?",
          "Fine. I'll stop making excuses. What do you need from me?",
          "I get it. The same conversation every month isn't good for either of us.",
          "I'll sort it properly this time. Standing order — what are the details?",
        ],
        questionFallbacks: [
          "Can I set up a standing order? I suppose so, yes. What date?",
          "When exactly? Wednesday. I'll do it Wednesday.",
          "Have I done this before? No — and that's probably why we keep having this conversation.",
          "Will I actually do it this time? Yes. I will. Standing order, done.",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['confirm', 'email', 'written', 'follow up', 'final warning'],
            messages: [
              "Fine — send me an email and I'll reply confirming the standing order is set up.",
              "Email me and I'll send back a screenshot of the standing order once it's done.",
              "Yes — written confirmation. Fine. I'll reply same day.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['by friday', 'set up by', 'before the weekend'],
            messages: [
              "Friday. Standing order set up. I'll screenshot it and send it over.",
              "Before Friday, yes. I'll do it tonight if that makes this easier.",
              "Friday is fine. I'll reply to your email with confirmation.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Okay. I hear what you're saying. Standing order. I'll do it this week.",
          "Alright. I know I've been sloppy. I'll fix it.",
          "What's the account number again? I'll do it now while I've got you.",
          "Fine. Tonight. I'll set it up and email you to confirm.",
          "I think we've finally got somewhere here. Standing order, done by Friday.",
        ],
        questionFallbacks: [
          "Will I set it up by Friday? Yes. I'll do it tonight.",
          "Can you confirm you've received the payment? Not yet — but it's going out Wednesday.",
          "Have I done the standing order yet? Not yet. But I'm doing it. Tonight.",
        ],
      },
      resolving: {
        responses: [],
        fallbacks: [
          "Right. Standing order set up by Friday, going out on the 28th. I'll actually do it tonight.",
          "Okay. I get it. No more of this. I'll sort it now.",
          "Done. I'm setting the reminder as we speak.",
          "Standing order, 28th, done by Friday. Got it.",
          "Right. Sorted. I appreciate you being straight with me rather than just sending letters.",
        ],
        questionFallbacks: [
          "Will I actually do it tonight? Yes. Standing order, sorted.",
          "Can you confirm the payment date going forward? 28th of every month. That's the plan.",
          "Have I set the reminder? Doing it now. Standing order, 28th.",
        ],
      },
    },
  },

  // ─── rs-09: Illegal Subletting Discovered — Marcus Bell ─────────────────────
  'rs-09': {
    opening: "Right, okay, what's this about then? My mate's been staying a few nights, that's all. He's between flats. I'm not subletting anything, he's literally just sleeping on the sofa.",
    resolved: "Okay. I get it. No more guests staying long-term without permission. I'll speak to Danny tonight and he'll be out by the weekend. And I'll put it in writing — email you tomorrow to confirm. I don't want any trouble with the tenancy.",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['evict', 'eviction', 'breach', 'terminate'],
            messages: [
              "Evict me? Over this? Come on, he's been here three weeks, it's not like I've set up a letting agency from my spare room!",
              "You can't evict me for having a mate stay. That's ridiculous. I've been a good tenant for two years.",
              "Breach of tenancy? Seriously? He's sleeping on a sofa bed, not running a business.",
            ],
          },
          {
            triggers: ['subletting', 'sublet', 'sub-let'],
            messages: [
              "I'm NOT subletting! He hasn't paid me a penny. Ask him yourself if you want.",
              "Subletting means charging rent, doesn't it? I haven't taken a single pound from him.",
              "That's a massive accusation. I'm not subletting. He's a friend in a rough patch.",
            ],
          },
          {
            triggers: ['insurance', 'liability', 'fire safety'],
            messages: [
              "Insurance? I didn't even think about that. But that's the landlord's problem, isn't it?",
              "What's insurance got to do with it? He's one person on a sofa.",
              "I didn't realise it affected insurance. But he's literally just sleeping here.",
            ],
          },
          {
            triggers: ['airbnb', 'advertised', 'listing', 'online'],
            messages: [
              "Airbnb?! Absolutely not. You can check, there's nothing online. This is my home, not a hotel.",
              "I would never put it on Airbnb. That's a completely different thing. My mate just needed somewhere to crash.",
              "There's no listing anywhere. I wouldn't even know how to set that up. This is just a friend staying.",
            ],
          },
          {
            triggers: ['unauthorized', 'unauthorised', 'permission', 'without consent'],
            messages: [
              "I didn't think I needed permission for a mate to stay! Nobody told me that.",
              "Unauthorised? Since when do I need a form signed for someone to sleep on my sofa?",
              "Okay, I probably should have asked. But I genuinely didn't think it was that kind of situation.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "This is being blown way out of proportion. He's just a mate.",
          "I've been here two years and never caused any problems. This feels really unfair.",
          "What am I supposed to do, let him sleep on the street?",
          "I didn't think having someone stay was against the rules.",
          "Look, I know how it looks, but it's honestly not what you think.",
        ],
        questionFallbacks: [
          "How long has he been here? I dunno, maybe three weeks? It's not been that long.",
          "Am I being charged for this? What do you mean charged? For having a guest?",
          "What happens next then? Are you going to do something formal over this?",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['how long', 'when did', 'staying since'],
            messages: [
              "He's been here... I dunno, couple of weeks? Maybe three? His landlord kicked him out with no notice.",
              "Started about three weeks ago. He was literally on the street — what was I supposed to do?",
              "Not that long. Few weeks. He's looking for his own place.",
            ],
          },
          {
            triggers: ['who', 'name', 'person'],
            messages: [
              "His name's Danny. He's a mate from work. Known him years.",
              "It's my friend Danny. I've known him since school. He's not some random stranger.",
              "Danny — he works with me. Good bloke, just hit a rough patch.",
            ],
          },
          {
            triggers: ['paying', 'money', 'rent', 'contribution'],
            messages: [
              "He hasn't given me a single penny. Honestly. He buys milk sometimes but that's it.",
              "No money's changed hands. None. He's a friend, not a lodger.",
              "He's not paying me anything. I'm just helping him out.",
            ],
          },
        ],
        fallbacks: [
          "Look, I didn't think it was a big deal. People have guests stay all the time.",
          "He's looking for a place. It's temporary. A few more weeks at most.",
          "I should have mentioned it, I know. But I honestly didn't think it mattered.",
          "He keeps to himself. Quiet as anything. The neighbours wouldn't even know.",
          "I just figured — it's my flat, my mate needs help, what's the harm?",
        ],
        questionFallbacks: [
          "Does he have his own key? Well, yeah, I gave him a spare so he's not stuck outside when I'm at work.",
          "Has he moved his stuff in? He's got a bag of clothes and a PlayStation. It's hardly moving in.",
          "Did I tell anyone he was staying? No. I didn't think I had to.",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['explain', 'understand', 'situation', 'tell me'],
            messages: [
              "Alright, fine. He's been here about three weeks. His landlord sold up and he had nowhere to go. I said he could crash here while he sorts himself out.",
              "Okay, so the situation is — Danny lost his flat. He's on the housing list but it's taking ages. I offered him the sofa in the meantime.",
              "Look, I'll be straight with you. He's been staying here since his tenancy ended. He's not paying rent. He's just... here.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['tenancy', 'agreement', 'clause', 'terms'],
            messages: [
              "I didn't read every line of the tenancy agreement, no. I probably should have.",
              "I remember signing something but I don't remember anything about guests. I'll look at it again.",
              "Okay if it's in the agreement then fair enough. I just didn't realise.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['neighbour', 'complaint', 'noise', 'reported'],
            messages: [
              "A neighbour complained? Who? We've been quiet as anything. That's really annoying.",
              "Reported us? For what? He doesn't make any noise. This is someone being nosy.",
              "If someone's complained, I'd like to know who. We haven't done anything wrong.",
            ],
          },
        ],
        fallbacks: [
          "I'm listening. Go on then — what do I need to do?",
          "I get that there's a process. I just didn't know about it.",
          "Okay, I hear you. I should have said something sooner.",
          "So what happens now? I mean, I don't want any grief over this.",
          "Alright. I'll cooperate. Just tell me what needs to happen.",
        ],
        questionFallbacks: [
          "What exactly am I supposed to have done wrong? I genuinely want to understand.",
          "Can I get this in writing so I know exactly what the rules are?",
          "Would it have been different if I'd asked permission first?",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['stop', 'remove', 'leave', 'out', 'vacate'],
            messages: [
              "Alright, I'll speak to Danny tonight. He can go to his sister's in Croydon while he sorts a flat.",
              "Okay, I'll tell him. He won't like it but I get it. He'll be out by the weekend.",
              "Fine. I'll have him out within the week. I just need to give him a day or two to arrange something.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['immediately', 'today', 'now', 'tonight'],
            messages: [
              "Tonight? That's a bit harsh but... okay. I'll ring him now and tell him.",
              "I'll speak to him as soon as I'm off this call. He can go to his sister's tonight.",
              "Alright, I'll sort it today. I don't want this getting worse.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['agree', 'promise', 'commit'],
            messages: [
              "I agree. No more long-term guests without asking first. Lesson learned.",
              "Yeah, I promise. I'll ask permission next time. I get why it matters now.",
              "Committed. Danny's out this week and I'll check with you before anyone stays again.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['letter', 'write', 'email', 'formal'],
            messages: [
              "A formal letter? Fine, send it. I'd rather have it in writing so I know where I stand.",
              "Email me whatever you need to. I'll read it properly this time.",
              "If you need to put it in writing, go ahead. I'll respond to it.",
            ],
          },
        ],
        fallbacks: [
          "Right. I'll sort it. Danny can go to his sister's while he finds a place.",
          "I know I should have handled this better. I'll make it right.",
          "He'll be out by the weekend. I'll text you to confirm.",
          "I don't want any marks on my tenancy record. I'll deal with it.",
          "Okay. No more unofficial guests. Got it.",
        ],
        questionFallbacks: [
          "How long do I have to get him out? A few days is all I'm asking.",
          "Will this affect my tenancy going forward? I've been good otherwise.",
          "Do I need to do anything in writing to confirm?",
        ],
      },
      resolving: {
        responses: [
          {
            triggers: ['confirm', 'writing', 'email'],
            messages: [
              "I'll email you tomorrow to confirm he's gone. And I'll keep a copy for my records.",
              "Yeah, I'll confirm in writing once he's moved out. Probably by Friday.",
              "I'll send you an email. Danny will be out and I'll let you know as soon as it's done.",
            ],
          },
          {
            triggers: ['understand', 'agree', 'going forward'],
            messages: [
              "I understand. No unauthorised occupants. If someone needs to stay, I ask first. Simple enough.",
              "I agree. Going forward, I'll check before anyone stays more than a couple of nights.",
              "Understood. I don't want to risk my tenancy over something like this again.",
            ],
          },
          {
            triggers: ['thank', 'appreciate'],
            messages: [
              "Thanks for being reasonable about it. I know I messed up.",
              "I appreciate you not going straight to formal action. I'll sort it.",
              "Cheers. I'll get it done and keep you updated.",
            ],
          },
        ],
        fallbacks: [
          "Right. Danny out by Friday, email to confirm, no more long-term guests without permission. Done.",
          "I'll sort it tonight. Thanks for explaining it instead of just sending a letter.",
          "Okay. Consider it handled. I'll be in touch once he's gone.",
          "I appreciate the heads-up. I'll make sure it doesn't happen again.",
          "Sorted. I'll keep you posted. And I'll actually read the tenancy agreement this time.",
        ],
        questionFallbacks: [
          "Is there anything else I need to do? I want to make sure this is properly resolved.",
          "Will you send me something confirming we've discussed this? Just for my records.",
          "Can I call you once he's moved out to confirm everything's sorted?",
        ],
      },
    },
  },

  // ─── rs-10: Tenant Requesting Disability Adaptations — Sarah Jennings ───────
  'rs-10': {
    opening: "Hello, thanks for seeing me. I wanted to talk about some adaptations I need for the flat. I've got MS — multiple sclerosis — and my mobility has been getting worse over the past year. I'm finding it harder to manage with the bathroom as it is, and there are a couple of other things that would really help me stay independent.",
    resolved: "That's brilliant, thank you so much. So you'll write to the landlord about the grab rails and the shower adaptation, and send me the DFG application details. I feel much better about this now. I was really worried I'd have to move, and I love this flat. Thanks for actually listening.",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['refuse', "can't do", 'not possible', "won't allow"],
            messages: [
              "I understand there are processes, but under the Equality Act, a landlord can't unreasonably refuse disability adaptations. I've looked into this quite carefully.",
              "With respect, the law is quite clear on this. Reasonable adaptations for a disability can't just be refused without a very good reason.",
              "I'd really rather not have to go down a formal route. But I do know my rights under the Equality Act 2010, and I'd hope we can sort this without any of that.",
            ],
          },
          {
            triggers: ['landlord won', 'owner won', 'not willing'],
            messages: [
              "I understand the landlord might have concerns, but these are reasonable adjustments. Perhaps if you explain the legal position, they might see it differently?",
              "Could you explain to the landlord that refusing reasonable adaptations for a disabled tenant could leave them exposed legally? I'm not threatening — I just want them to understand.",
              "I appreciate you're in the middle, but the landlord does have a legal obligation here. Maybe if I write a letter explaining exactly what I need and why?",
            ],
          },
          {
            triggers: ['cost', 'expensive', 'pay', 'who pays'],
            messages: [
              "I've looked into the Disabled Facilities Grant — the council can fund most of these adaptations. It wouldn't necessarily cost the landlord anything.",
              "There's funding available through the DFG. I've already spoken to an occupational therapist who can do an assessment. The cost doesn't have to fall on the landlord.",
              "I understand cost is a concern. But grab rails are very inexpensive, and the bigger adaptations can be funded through the council's DFG scheme.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "I don't want to be difficult about this. I just need some basic things to stay safe in my own home.",
          "I've been a good tenant — always paid on time, looked after the place. I just need a bit of support now.",
          "This isn't about being demanding. It's about being safe. I nearly fell in the bath last week.",
          "I'd really like to work this out amicably. I love this flat and I don't want to have to move.",
          "I know it might seem like a lot, but these are really basic safety things. Grab rails, a shower seat. Nothing extravagant.",
        ],
        questionFallbacks: [
          "Is there a reason the landlord wouldn't agree to grab rails? They're so minor.",
          "Have you dealt with disability adaptations before? There's a clear process for it.",
          "Can we at least start with the smaller things while we discuss the rest?",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['what do you need', 'what adaptations', 'list', 'details'],
            messages: [
              "The main things are grab rails in the bathroom and by the front door, a shower adaptation — either a walk-in or a shower seat — and ideally a second handrail on the stairs. That's really it.",
              "I need grab rails in the bathroom, something to make the shower accessible — I can't step over the bath anymore — and a handrail fitted by the front step. Nothing structural.",
              "There are three things really: bathroom grab rails, an accessible shower solution, and a handrail by the entrance. My OT has actually written a report listing them all.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['ms', 'condition', 'diagnosis', 'health'],
            messages: [
              "I was diagnosed three years ago. It's relapsing-remitting MS, so I have good days and bad days. But overall, my mobility is declining and I need to adapt while I still can.",
              "It's multiple sclerosis. Some days I'm fine, other days my legs just don't cooperate. The occupational therapist said the flat needs some adjustments to keep me safe.",
              "I've had MS for about three years now. The neurologist and my OT both agree that home adaptations would significantly reduce my risk of falls.",
            ],
          },
          {
            triggers: ['how can we help', 'happy to', 'of course', 'absolutely'],
            messages: [
              "Oh, that's such a relief to hear. I was nervous about asking, honestly. Shall I send over the OT report?",
              "Thank you, that really means a lot. I've got all the documentation ready — OT assessment, GP letter, the lot. I can email it over today.",
              "That's wonderful, thank you. I've done my research and I've got a list of exactly what's needed. None of it is major structural work.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "I've been thinking about this for a while. I wanted to approach it properly rather than just demanding things.",
          "My occupational therapist has done a full assessment. I've got everything documented.",
          "I just want to be able to live safely in my home. That's all this is about really.",
          "I know it's extra work for you and I appreciate you taking the time to discuss it.",
          "I've been putting this off because I was worried about the reaction. But I can't keep managing without the adaptations.",
        ],
        questionFallbacks: [
          "Have you had tenants request adaptations before? I'm not sure of the process from your end.",
          "Would it help if I sent the occupational therapist's report directly?",
          "What's the best way to formally request this — letter, email?",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['understand', 'tell me', 'explain', 'more detail'],
            messages: [
              "Of course. The bathroom is the biggest issue. I can't get in and out of the bath safely anymore. My OT recommends either a level-access shower or a shower seat with grab rails. The grab rails alone would cost about 50 pounds fitted.",
              "Sure. So the grab rails are the most urgent — bathroom, front door, and stairs. The shower adaptation is the bigger job but it's the one that would make the most difference to my daily life.",
              "The OT report breaks it all down. Essentially, the flat needs to be safe for someone with limited mobility. Right now, the bathroom is genuinely dangerous for me.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['ot', 'occupational therapist', 'assessment', 'report'],
            messages: [
              "Yes, I've had a full OT assessment. She came to the flat, measured everything, and wrote a detailed report. I can send it to you today.",
              "The OT visited two weeks ago. She's recommended specific adaptations and she's happy to liaise with the landlord directly if that would help.",
              "I've got the OT report right here actually. It lists everything with measurements and specifications. Very thorough.",
            ],
          },
          {
            triggers: ['landlord', 'owner', 'permission'],
            messages: [
              "I understand you need the landlord's permission. Would it help if I wrote directly to them as well? I want to make it as easy as possible.",
              "Of course, the landlord needs to agree. But legally, they can only refuse if there's a really strong reason. And these are minor adaptations.",
              "I'm happy to wait while you speak to the landlord. I just want to make sure the request is formally logged so we can get the ball rolling.",
            ],
          },
        ],
        fallbacks: [
          "I've tried to be as organised as possible. I know this is extra work for everyone.",
          "The OT was very clear that these adaptations are necessary, not just nice to have.",
          "I'm not asking for anything extravagant. Just basic safety modifications.",
          "I've looked at the DFG process and I'm happy to do the application myself if someone can point me in the right direction.",
          "My GP has also written a supporting letter if that helps with the landlord.",
        ],
        questionFallbacks: [
          "Would it help to have the OT contact you directly? She's very good at explaining the medical need.",
          "How long does this usually take once the landlord agrees? I'm just trying to plan.",
          "Is there a standard form I need to fill in for the adaptation request?",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['arrange', 'organise', 'set up', 'book'],
            messages: [
              "That would be wonderful. If you can arrange for the grab rails first, that would make an immediate difference. The shower can follow once the DFG comes through.",
              "Yes please. If you could arrange for someone to come and fit the rails, I can be here any day — I work from home most of the time now.",
              "Brilliant. I'll make sure I'm available whenever suits. And I'll get the DFG application submitted this week.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['write', 'letter', 'landlord', 'contact'],
            messages: [
              "Yes, if you could write to the landlord with the OT report attached, that would be ideal. I've got a PDF I can send you right now.",
              "A letter to the landlord would be great. I can draft something from my end too if that helps — between us and the OT report, it should be straightforward.",
              "Perfect. I'll email the OT report and GP letter to you today, and you can forward them to the landlord with your recommendation.",
            ],
          },
          {
            triggers: ['grant', 'dfg', 'fund', 'council', 'funding'],
            messages: [
              "I've already started the DFG process. The council said I need the landlord's written consent before they can approve the grant. So that's the key bit.",
              "The DFG can cover up to 30,000 pounds — obviously I won't need anything like that. But it means the landlord won't be out of pocket.",
              "I spoke to the council last week. They said once I have landlord consent and the OT report, the DFG application should be quite straightforward.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "This is really positive. I feel like we're making progress.",
          "I'll get all the paperwork together today and send it over.",
          "Thank you for taking this seriously. It means a lot.",
          "I'm happy to do whatever I need to from my end to move this along.",
          "The OT said she can do a follow-up visit with a contractor if needed, to make sure everything's fitted correctly.",
        ],
        questionFallbacks: [
          "When do you think you'll hear back from the landlord? Just so I can plan.",
          "Should I apply for the DFG now or wait until the landlord confirms?",
          "Is there anything else you need from me at this stage?",
        ],
      },
      resolving: {
        responses: [
          {
            triggers: ['confirm', 'confirmed', 'go ahead'],
            messages: [
              "Oh that's wonderful news, thank you. I'll get the DFG application submitted today and send you a copy for your records.",
              "Brilliant. I'm so relieved. I'll confirm everything by email so we've all got it in writing.",
              "Thank you so much. I'll email you the OT report, GP letter, and DFG application reference all together.",
            ],
          },
          {
            triggers: ['timeline', 'when', 'how long', 'schedule'],
            messages: [
              "If the DFG comes through in six to eight weeks, and the grab rails can go in sooner, that would be perfect timing actually.",
              "I'm not in a rush — well, I am, but I understand these things take time. As long as we've started the process, I'm happy.",
              "Could we aim to have the grab rails in within a fortnight and the shower adaptation once the grant is approved? That would work really well.",
            ],
          },
          {
            triggers: ['proceed', 'arrange', 'next steps'],
            messages: [
              "Perfect. I'll send everything over today and follow up with the council tomorrow. Thank you for being so helpful.",
              "Wonderful. I know exactly what I need to do now. OT report to you, DFG application to the council, and grab rails booked in.",
              "Great. I'll get moving on my end straight away. You've been really kind about all this.",
            ],
          },
        ],
        fallbacks: [
          "Thank you so much. I was dreading this conversation and it's been completely fine.",
          "I really appreciate how professionally you've handled this. Not everyone would be so understanding.",
          "I'll send everything over by end of day. And thank you again — genuinely.",
          "This has taken a weight off my mind. I'll get the paperwork sorted straight away.",
          "I feel much better about staying in the flat now. Thank you for working with me on this.",
        ],
        questionFallbacks: [
          "Is there a specific email address I should send the documents to?",
          "Would you like me to copy the OT into the email so she can answer any technical questions?",
          "Can I call you if I have any questions about the DFG application?",
        ],
      },
    },
  },

  // ─── rs-11: Landlord Wanting to Sell with Sitting Tenant — Rachel Osei ──────
  'rs-11': {
    opening: "Hi... I got a letter saying the landlord wants to sell the property? I've been here four years. I've got a seven-year-old daughter. What does this actually mean for us? Are we going to have to leave?",
    resolved: "Okay. So I've got at least two months from a Section 21, you'll help with a reference letter, and I should contact the council about the housing register. And you said you'd check if the new buyer might keep me on as a tenant. I feel so much better now — thank you. I was in a complete panic before I came in.",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['leave', 'move out', 'vacate', 'get out'],
            messages: [
              "You can't just tell me to leave! I've got a child — where are we supposed to go? We've been here four years!",
              "Move out? Just like that? Do you have any idea how hard it is to find a flat as a single mum in this area?",
              "I'm not leaving without a fight. My daughter's school is round the corner. Her whole life is here.",
            ],
          },
          {
            triggers: ['evict', 'notice', 'section 21', 'court'],
            messages: [
              "You're going to evict us? After four years of paying rent on time, never a single complaint, and this is how it ends?",
              "Court? I can't afford a solicitor! I can barely afford the rent as it is. This isn't fair.",
              "A Section 21... I've heard of those. So the landlord doesn't even need a reason? How is that right?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['nothing we can do', "can't help", 'not our problem', 'out of our hands'],
            messages: [
              "It's not your problem? I'm your tenant! You've been managing this flat for four years — surely that means something?",
              "Please don't say there's nothing you can do. There must be something. Some process, some time at least.",
              "I know it's the landlord's decision but you must be able to help somehow. You know me. You know I'm a good tenant.",
            ],
          },
        ],
        fallbacks: [
          "I'm sorry, I'm just really scared. I don't know what to do.",
          "My daughter keeps asking if we're going to lose our home. I don't know what to tell her.",
          "This flat is the only stable thing we've had. I can't go back to how things were before.",
          "I haven't slept since the letter came. I keep going over it in my head.",
          "Sorry, I know I'm getting upset. This is just... it's everything to us.",
        ],
        questionFallbacks: [
          "How long do I actually have? Please be honest with me.",
          "Is there any way the new owner might keep me as a tenant?",
          "What happens if I can't find somewhere in time? Do I end up on the street?",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['sell', 'selling', 'sale', 'buyer'],
            messages: [
              "So the landlord's definitely selling? Is it already on the market? Have there been viewings?",
              "When did the landlord decide this? I didn't get any warning before that letter.",
              "Is there any chance they might change their mind? Or is it definitely happening?",
            ],
          },
          {
            triggers: ['tenancy', 'contract', 'agreement', 'lease'],
            messages: [
              "I'm on a rolling periodic tenancy. What does that actually mean in terms of how long I have?",
              "My fixed term ended two years ago. Does that make it easier for them to get rid of me?",
              "What does my tenancy agreement actually say about this? I dug it out but I couldn't make sense of it.",
            ],
          },
          {
            triggers: ['daughter', 'child', 'school', 'family'],
            messages: [
              "My daughter's settled. She's finally doing well at school. I can't uproot her again.",
              "She's seven. She doesn't understand why we might have to leave. I'm trying to keep her calm but...",
              "We moved here for the school. It took ages to get her settled. Starting again somewhere else... I can't even think about it.",
            ],
          },
        ],
        fallbacks: [
          "I just need to understand what's happening. Nobody's explained anything properly.",
          "I've always been a good tenant. Four years, rent on time, never any issues.",
          "I just feel completely blindsided. One letter and my whole life is up in the air.",
          "I don't even know where to start. I've never been in this situation before.",
          "Sorry, I'm trying to be calm about this. It's just a lot to take in.",
        ],
        questionFallbacks: [
          "What are my actual rights here? I don't know anything about this stuff.",
          "Does the landlord have to give me a certain amount of notice?",
          "Can viewings just happen whenever, or do I get a say?",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['explain', 'process', 'how does it work', 'what happens'],
            messages: [
              "Okay, so walk me through it. What's the actual process from here? When would I have to be out by?",
              "Right. I'm listening. Just... explain it to me step by step please. I want to understand properly.",
              "Thank you for explaining. So what's the timeline? When does the clock start ticking?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['rights', 'entitled', 'legal', 'law'],
            messages: [
              "So I do have rights? Thank God. I thought the landlord could just throw us out whenever they wanted.",
              "Two months' notice minimum? Okay, that's something at least. And they have to do it properly?",
              "What if they don't follow the proper process? Can I challenge it?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['options', 'what can I do', 'help', 'advice'],
            messages: [
              "What are my options then? I mean realistically. I need to start planning.",
              "If you can point me in the right direction, that would help. I just don't know where to begin.",
              "Is there someone I can talk to? A housing adviser or something? I can't afford a solicitor.",
            ],
          },
        ],
        fallbacks: [
          "Okay. I'm calming down now. I just needed someone to actually talk to me about this.",
          "Thank you for being straight with me. I'd rather know the truth than be kept in the dark.",
          "So it's not immediate then? That helps. I just need time to think.",
          "I've started looking at what's available and it's... well, it's not great. But at least I know the timeframe now.",
          "Right. I need to make a plan. For Lily's sake if nothing else.",
        ],
        questionFallbacks: [
          "Can the new buyer just carry on with my tenancy? Is that an option?",
          "If I went to the council, would they help me find somewhere?",
          "What about Shelter? Would they be able to advise me?",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['support', 'help', 'reference', 'reference letter'],
            messages: [
              "A reference letter would be amazing actually. Four years of paying on time — that should count for something with a new landlord.",
              "If you could give me a good reference, that would really help. I've been looking and every landlord wants references.",
              "Yes please. A strong reference from you could make all the difference. Thank you.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['find', 'alternative', 'somewhere', 'housing'],
            messages: [
              "I've started looking. It's tough in this area but I know I need to be realistic. If you hear of anything on your books, would you let me know?",
              "I'm going to register on the council housing list this week. And I'll look at what's available privately too.",
              "My mum said we can stay with her temporarily if we need to. So at least we won't be on the street. But I want our own place.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['time', 'longer', 'extension', 'more time'],
            messages: [
              "If there's any chance of getting a bit more time beyond the two months, that would make such a difference. Even an extra month.",
              "I'll use every day of the notice period. And if the sale takes longer, can I stay until completion?",
              "The more time I have, the better chance I have of finding somewhere decent. I don't want to rush into a bad flat.",
            ],
          },
          {
            triggers: ['council', 'housing register', 'local authority'],
            messages: [
              "I'll contact the council tomorrow. Do you think they'll help? With a child, surely we're a priority?",
              "I've heard the housing register takes ages. But I need to get on it either way, don't I?",
              "My friend said to contact the housing options team. I'll do that first thing Monday.",
            ],
          },
        ],
        fallbacks: [
          "I'm starting to feel a bit more in control of this now. Thank you.",
          "Okay, so I need to register with the council, start looking privately, and ask you for a reference. I can do that.",
          "I'll sit down tonight and make a proper plan. Lily needs to see me handling this, not falling apart.",
          "At least I know what's happening now. The not knowing was the worst part.",
          "Thank you for being kind about this. I know it's not your fault the landlord's selling.",
        ],
        questionFallbacks: [
          "Could you check if the buyer might want to keep a tenant? Some investors prefer sitting tenants, don't they?",
          "Would you be able to help me find somewhere else on your books?",
          "What paperwork do I need to get together for a new tenancy application?",
        ],
      },
      resolving: {
        responses: [
          {
            triggers: ['thank', 'appreciate', 'grateful'],
            messages: [
              "Thank you. Really. I came in here terrified and I'm leaving with a plan. That means everything.",
              "I really appreciate you taking the time. I know you're busy and this can't be fun for you either.",
              "Thanks for being honest and kind. Not everyone in this industry would have been.",
            ],
          },
          {
            triggers: ['plan', 'next steps', 'sorted'],
            messages: [
              "Right, so my plan is: council housing team Monday, start looking at private rentals, and get a reference from you. I feel so much more together about this now.",
              "I know what I need to do now. Council, reference, start searching. And try to stay positive for Lily.",
              "I've got a plan. That's what I needed. I can handle the rest as long as I know what's happening.",
            ],
          },
          {
            triggers: ['reference letter', 'reference'],
            messages: [
              "If you could do that reference letter this week, I can start applying for flats straight away. Thank you.",
              "A reference by Friday would be perfect. I've already seen a couple of places I want to apply for.",
              "I'll email you with my details for the reference. Four years, no arrears, no damage — that should speak for itself.",
            ],
          },
        ],
        fallbacks: [
          "I feel so much better now. I was in a complete state before I came in.",
          "Lily and I will be alright. We always are. I just needed to know where we stand.",
          "Thank you. I'll keep you posted on how the search goes.",
          "Right. I'm going to go home, make a cup of tea, and start planning properly.",
          "You've been really helpful. I'll be in touch about the reference this week.",
        ],
        questionFallbacks: [
          "Can I come back in if I have more questions once I've spoken to the council?",
          "If something comes up on your books that would suit us, would you give me a ring?",
          "Is there anything else I should be doing that I haven't thought of?",
        ],
      },
    },
  },

  // ─── rs-12: End of Tenancy Deposit Dispute — James Whitfield ────────────────
  'rs-12': {
    opening: "Right, I want to talk about my deposit. Nine hundred quid I paid and you're trying to keep over four hundred of it. That's theft as far as I'm concerned. The flat was spotless when I left — I spent two days cleaning it. This is an absolute scam.",
    resolved: "Fine. Two hundred and twenty deducted, six hundred and eighty back to me, settled through the DPS. I still think the worktop thing is harsh but I'll accept it to get this done. I want it processed this week though. And I want the breakdown in writing — email it to me today.",
    stages: {
      tense: {
        responses: [
          {
            triggers: ['evidence', 'photo', 'photos', 'proof'],
            messages: [
              "Photos? Anyone can take photos of a mark and claim it wasn't there before. Were these taken at checkout? By who? I want to see dates on them.",
              "Let me see these so-called photos then. I've got my own photos from the day I moved out. The place was immaculate.",
              "Your evidence is what — some photos and a checkout report from a company you hired? That's hardly independent, is it?",
            ],
          },
          {
            triggers: ['inventory', 'check-in', 'check-out', 'checkout'],
            messages: [
              "The check-in inventory was done in ten minutes. I watched them. They barely looked at anything. And now suddenly everything's a deduction?",
              "I never even got a copy of the check-in report. How can you compare to something I've never seen?",
              "The checkout clerk spent five minutes with a clipboard. She didn't even test the oven. This is a joke.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['dps', 'deposit scheme', 'dispute', 'tribunal'],
            messages: [
              "I'll go to the DPS if I have to. I know how it works. And they don't usually side with agents who take the mick.",
              "Fine, I'll raise a dispute through the deposit scheme. I've already started looking at how to do it.",
              "I'd rather sort this here, but if you're going to be unreasonable, I'll let the DPS decide. I've got nothing to hide.",
            ],
          },
        ],
        fallbacks: [
          "Four hundred quid in deductions for normal wear and tear. Unbelievable.",
          "I've rented for fifteen years and never had a single deposit deduction. Not once.",
          "This feels like you're trying to fund the landlord's next renovation out of my pocket.",
          "I cleaned that flat top to bottom. Oven, carpets, the lot. And you're telling me it wasn't good enough?",
          "I know my rights. You can't just keep my money without proper justification.",
        ],
        questionFallbacks: [
          "Who decided on these amounts? Was it the landlord or did you just pick a number?",
          "When exactly were these photos taken? Before or after your cleaners went in?",
          "How is a two-year-old carpet looking slightly worn a deduction? That's literally wear and tear.",
        ],
      },
      opening: {
        responses: [
          {
            triggers: ['cleaning', 'clean', 'cleaner', 'dirty'],
            messages: [
              "I spent two full days cleaning that flat. I used a carpet cleaner, I did the oven with proper oven cleaner, I cleaned inside every cupboard. Two days.",
              "Dirty? I bleached the bathroom, I mopped every floor, I cleaned the windows inside and out. You're having a laugh.",
              "I even hired a carpet cleaner from Rug Doctor. The carpets were cleaner when I left than when I moved in.",
            ],
          },
          {
            triggers: ['worktop', 'kitchen', 'surface', 'counter'],
            messages: [
              "That worktop was already scratched when I moved in! I reported it in the first month and was told 'don't worry about it.'",
              "The worktop? It's a cheap laminate that scratches if you look at it. That's not damage, that's a substandard fitting.",
              "You're charging me 150 quid for a worktop that was already past its best before I even got the keys.",
            ],
          },
          {
            triggers: ['amount', 'how much', 'breakdown', 'four hundred', '400'],
            messages: [
              "Fine. Go on then. Talk me through it line by line. I want to know exactly what you think I owe and why.",
              "Four hundred and twenty pounds. I want to see exactly where that number comes from. Every single penny.",
              "Break it down for me. Because right now it just looks like a random number someone's pulled out of thin air.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "I left that flat in better condition than I found it. This is not on.",
          "I've got photos of every room taken the day I moved out. On my phone with timestamps.",
          "The landlord should be thanking me for looking after the place, not taking my deposit.",
          "I'm not being funny but 400 quid is a lot of money. I need that for my new flat.",
          "I've been a model tenant for two years. This is how you treat people? By nickeling them on the way out?",
        ],
        questionFallbacks: [
          "Do you have a full breakdown of every deduction? I want to see it.",
          "Was the landlord even at the checkout? Do they know what the flat looked like?",
          "Have you actually compared the check-in and check-out reports side by side?",
        ],
      },
      engaged: {
        responses: [
          {
            triggers: ['explain', 'deduction', 'items', 'what for'],
            messages: [
              "Fine, go through them one at a time. But I'm telling you now, I'll dispute anything that's wear and tear.",
              "Okay, I'm listening. But if any of these deductions are for normal use, I'm not accepting them.",
              "Go on then. Line by line. And show me the evidence for each one, not just a number.",
            ],
            stageShift: 1,
          },
          {
            triggers: ['cleaning', 'oven', 'bathroom', 'standard'],
            messages: [
              "Professional cleaning standard? Nobody told me it had to be 'professional standard.' I cleaned it myself and it was spotless.",
              "The oven was clean! I spent an hour on it with Oven Pride. What more do you want?",
              "If the cleaning needed to be professional, that should have been made clear before I left, not after as a deduction.",
            ],
          },
          {
            triggers: ['worktop', 'scratch', 'damage', 'mark'],
            messages: [
              "Those scratches were there when I moved in. I even mentioned it to the previous agent. Check your records.",
              "It's a laminate worktop in a rented flat. Some light scratching after two years is wear and tear by anyone's definition.",
              "Okay, show me the check-in photo of the worktop. If it was pristine in the photo, fine. But I bet it wasn't.",
            ],
          },
          {
            triggers: ['carpet', 'stain', 'mark', 'floor'],
            messages: [
              "I hired a carpet cleaner! A proper one. Those marks are from furniture — that's wear and tear.",
              "The carpet was already five years old when I moved in. It's not going to look new after seven years.",
              "Furniture indentations aren't damage. Every carpet in every rented flat has them. That's just living.",
            ],
          },
        ],
        fallbacks: [
          "Okay. I'm not happy about this but I'm listening. Go through the list.",
          "Some of these I might accept. But there are at least two that are completely unjustified.",
          "I just want it to be fair. If I genuinely damaged something, fine. But don't charge me for wear and tear.",
          "I've been reasonable up to now. I'd appreciate the same courtesy back.",
          "Let's just go through them properly. I've got all day if needed.",
        ],
        questionFallbacks: [
          "Can you show me the check-in photos next to the check-out photos? Side by side?",
          "What's the actual cost of the cleaning you're saying was needed? Is it a real quote?",
          "How old was the carpet when I moved in? That matters for fair wear and tear.",
        ],
      },
      progressing: {
        responses: [
          {
            triggers: ['negotiate', 'reduce', 'lower', 'less'],
            messages: [
              "Alright, what are you actually proposing? If the number's reasonable, I'll consider it.",
              "Okay, I'm open to negotiating. But I'm not paying for the full carpet and I'm not paying for the worktop. Those are wear and tear.",
              "If you drop the worktop and reduce the cleaning, I might be able to live with it. What would that bring it down to?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['compromise', 'fair', 'meet halfway', 'middle ground', 'half'],
            messages: [
              "Meet in the middle? Okay. If you're saying 420, I'm saying zero. So... 210? Plus or minus?",
              "I can be reasonable. If you knock off the worktop and the carpet, what are we left with? That's closer to what I'd accept.",
              "Fair is fair. I'll accept the professional clean charge if you drop the worktop damage. Deal?",
            ],
            stageShift: 1,
          },
          {
            triggers: ['accept', 'agree', 'okay', 'fine'],
            messages: [
              "What's the final number then? If it's under 250 I'll probably sign off on it today.",
              "Alright. If we've agreed on the breakdown, put it in writing and I'll confirm.",
              "Okay. I don't love it, but I can live with it. Just get it processed quickly please.",
            ],
            stageShift: 1,
          },
        ],
        fallbacks: [
          "Look, I want this sorted as much as you do. Let's find a number that works.",
          "I don't want to go to the DPS. It takes ages. Let's just sort it between us.",
          "If you're willing to be reasonable, so am I. What's the bottom line?",
          "Alright, I've had my rant. Let's be practical about this.",
          "I still think the worktop is unfair. But if the total comes down, I can accept the rest.",
        ],
        questionFallbacks: [
          "If I agree to this, how quickly do I get the rest of my deposit back?",
          "Can we put the agreed amount in writing right now so there's no confusion?",
          "What happens if I accept some deductions but dispute others through the DPS?",
        ],
      },
      resolving: {
        responses: [
          {
            triggers: ['agree', 'accept', 'settled', 'done'],
            messages: [
              "Fine. Agreed. Get the paperwork done and release the rest of my deposit this week.",
              "Alright. I'll accept that. But I want it processed through the DPS within five working days.",
              "Okay, deal. Put it in writing, I'll sign it, and let's both move on.",
            ],
          },
          {
            triggers: ['confirm', 'writing', 'email', 'breakdown'],
            messages: [
              "Send me the agreed breakdown by email today. I want it in writing before I confirm anything through the DPS.",
              "I want the full breakdown emailed to me — what was proposed, what we agreed, and what I'm getting back. Then I'll authorise the release.",
              "Get me the confirmation in writing and I'll sign off on the DPS. But it needs to be this week.",
            ],
          },
          {
            triggers: ['settle', 'process', 'release', 'pay'],
            messages: [
              "Just get it processed. I need that money for my new place. How long until it hits my account?",
              "Right, initiate the release through the DPS today if you can. The sooner this is done, the better for everyone.",
              "Process it. I want the agreed amount back in my account by the end of the week if possible.",
            ],
          },
        ],
        fallbacks: [
          "Right. Not happy about the worktop, but I'll take the deal to get it over with.",
          "Let's just get this done. Life's too short to argue over 50 quid.",
          "I still think agents take the mick with deposits, but you've been fairly straight with me today.",
          "Email me the breakdown, process the release, and we'll call it done.",
          "Okay. Sorted. I want it in writing and processed this week.",
        ],
        questionFallbacks: [
          "How long does the DPS release actually take once we've both agreed?",
          "Will you email me the agreed breakdown today or do I need to chase?",
          "Is there anything else I need to sign or is the DPS agreement enough?",
        ],
      },
    },
  },
}
