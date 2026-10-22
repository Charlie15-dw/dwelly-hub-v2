// Build the weekly PM meeting deck — w/c October agenda.
// Live-example slides are left as "LIVE DEMO" placeholders: Charlie shows these
// on his own test property rather than embedding screenshots.
const pptxgen = require("pptxgenjs");

const OUT = "/Users/charlielockwood/Desktop/Dwelly - PM Meeting wc October.pptx";

// ── Palette ────────────────────────────────────────────────────────────────
const INK   = "17352C";
const DKBG  = "123029";
const TINT  = "E7F3EE";
const GREEN = "2F8F6B";
const TEAL  = "1C7293";
const AMBER = "C77D2E";
const SAGE  = "5B8C7B";
const MOSS  = "6FA07E";
const SLATE = "50808E";
const WHITE = "FFFFFF";
const GREY  = "5A6B64";
const LINEC = "D9E7E0";
const GOOD  = "2E7D5B";  // good-example green
const GOODBG= "E6F2EC";
const BAD   = "B3261E";  // bad-example red
const BADBG = "FBEAE8";

const HEAD = "Cambria";
const BODY = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
pres.author = "Charlie Lockwood";
pres.title = "PM Meeting — w/c October";

// ── Masters ──────────────────────────────────────────────────────────────
pres.defineSlideMaster({ title: "TITLE",   background: { color: DKBG } });
pres.defineSlideMaster({ title: "SECTION", background: { color: DKBG } });
pres.defineSlideMaster({ title: "CLOSING", background: { color: DKBG } });
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: WHITE },
  objects: [
    { text: { text: "PM Weekly Meeting — w/c October", options: {
      x: 0.5, y: 7.04, w: 7, h: 0.3, fontSize: 9, color: SLATE,
      fontFace: BODY, isTextBox: true, margin: 0, valign: "middle" } } },
  ],
  slideNumber: { x: 12.5, y: 7.04, w: 0.4, h: 0.3, fontSize: 9, color: SLATE, fontFace: BODY, align: "right" },
});

// ── Helpers ────────────────────────────────────────────────────────────────
function title(slide, txt) {
  slide.addText(txt, { x: 0.5, y: 0.38, w: 11.2, h: 0.8, fontSize: 27, bold: true,
    color: INK, fontFace: HEAD, align: "left", valign: "middle", isTextBox: true, margin: 0 });
}

function subtitle(slide, txt) {
  slide.addText(txt, { x: 0.5, y: 1.14, w: 12.3, h: 0.4, fontSize: 13, color: GREY,
    fontFace: BODY, align: "left", isTextBox: true, margin: 0 });
}

function cornerCircles(slide) {
  slide.addShape(pres.ShapeType.ellipse, { x: 10.6, y: -1.7, w: 4.6, h: 4.6, fill: { color: GREEN, transparency: 80 }, line: { type: "none" } });
  slide.addShape(pres.ShapeType.ellipse, { x: 12.2, y: 5.0, w: 3.4, h: 3.4, fill: { color: TEAL, transparency: 84 }, line: { type: "none" } });
}

function cardShadow() {
  return { type: "outer", color: "9FB8AE", opacity: 0.45, blur: 9, offset: 3, angle: 90 };
}

function card(slide, x, y, w, h, fill) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.09,
    fill: { color: fill || WHITE }, line: { color: LINEC, width: 1 }, shadow: cardShadow() });
}

function sectionSlide(num, heading, sub) {
  const s = pres.addSlide({ masterName: "SECTION" });
  cornerCircles(s);
  s.addText(num, { x: 0.9, y: 2.2, w: 2, h: 0.8, fontSize: 20, bold: true, color: GREEN, fontFace: HEAD, align: "left", isTextBox: true, margin: 0 });
  s.addText(heading, { x: 0.85, y: 2.9, w: 11, h: 1.0, fontSize: 38, bold: true, color: WHITE, fontFace: HEAD, align: "left", valign: "middle", isTextBox: true, margin: 0 });
  if (sub) s.addText(sub, { x: 0.9, y: 4.15, w: 10.5, h: 0.9, fontSize: 16, color: "CFE6DB", fontFace: BODY, align: "left", valign: "top", isTextBox: true, margin: 0 });
  return s;
}

// Clean "LIVE DEMO" placeholder — Charlie runs the walkthrough live, so no
// scripted points sit on the slide. Just the marker and a one-line caption.
function liveDemoBox(slide, y, h, caption) {
  slide.addShape(pres.ShapeType.roundRect, { x: 0.5, y, w: 12.33, h, rectRadius: 0.1,
    fill: { color: "F4F9F6" }, line: { color: GREEN, width: 1.25, dashType: "dash" } });
  const cy = y + h / 2;
  slide.addShape(pres.ShapeType.roundRect, { x: 5.715, y: cy - 0.78, w: 1.9, h: 0.5, rectRadius: 0.25, fill: { color: GREEN }, line: { type: "none" } });
  slide.addText("LIVE DEMO", { x: 5.715, y: cy - 0.78, w: 1.9, h: 0.5, align: "center", valign: "middle",
    fontSize: 12, bold: true, color: WHITE, fontFace: BODY, charSpacing: 2, isTextBox: true, margin: 0 });
  slide.addText(caption, { x: 1.5, y: cy - 0.05, w: 10.33, h: 0.7, align: "center", valign: "middle",
    fontSize: 14, italic: true, color: GREY, fontFace: BODY, isTextBox: true, margin: 0 });
}

// Two-column good vs bad.
function goodBad(slide, y, h, goodHead, goodItems, badHead, badItems) {
  const w = 6.0, gap = 0.33, x2 = 0.5 + w + gap;
  // Good
  card(slide, 0.5, y, w, h, GOODBG);
  slide.addShape(pres.ShapeType.roundRect, { x: 0.5, y, w, h: 0.62, rectRadius: 0.09, fill: { color: GOOD }, line: { type: "none" } });
  slide.addText([{ text: "\u2713  ", options: { bold: true, color: WHITE } }, { text: goodHead, options: { bold: true, color: WHITE } }],
    { x: 0.75, y, w: w - 0.4, h: 0.62, align: "left", valign: "middle", fontSize: 14.5, fontFace: BODY, isTextBox: true, margin: 0 });
  slide.addText(goodItems.map(t => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, color: INK, fontFace: BODY, paraSpaceAfter: 6 } })),
    { x: 0.8, y: y + 0.82, w: w - 0.6, h: h - 1.0, align: "left", valign: "top", fontSize: 12.5, isTextBox: true, margin: 0 });
  // Bad
  card(slide, x2, y, w, h, BADBG);
  slide.addShape(pres.ShapeType.roundRect, { x: x2, y, w, h: 0.62, rectRadius: 0.09, fill: { color: BAD }, line: { type: "none" } });
  slide.addText([{ text: "\u2717  ", options: { bold: true, color: WHITE } }, { text: badHead, options: { bold: true, color: WHITE } }],
    { x: x2 + 0.25, y, w: w - 0.4, h: 0.62, align: "left", valign: "middle", fontSize: 14.5, fontFace: BODY, isTextBox: true, margin: 0 });
  slide.addText(badItems.map(t => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, color: INK, fontFace: BODY, paraSpaceAfter: 6 } })),
    { x: x2 + 0.3, y: y + 0.82, w: w - 0.6, h: h - 1.0, align: "left", valign: "top", fontSize: 12.5, isTextBox: true, margin: 0 });
}

// Simple numbered/bulleted point list with bold lead-in.
function points(slide, y, items, gap) {
  const g = gap || 1.0;
  items.forEach((it, i) => {
    const yy = y + i * g;
    slide.addShape(pres.ShapeType.ellipse, { x: 0.6, y: yy + 0.07, w: 0.44, h: 0.44, fill: { color: GREEN }, line: { type: "none" } });
    slide.addText(String(i + 1), { x: 0.6, y: yy + 0.07, w: 0.44, h: 0.44, align: "center", valign: "middle", fontSize: 13, bold: true, color: WHITE, fontFace: HEAD, isTextBox: true, margin: 0 });
    slide.addText([
      { text: it[0] + "   ", options: { bold: true, fontSize: 15, color: INK, fontFace: BODY } },
      { text: it[1], options: { fontSize: 12.5, color: GREY, fontFace: BODY } },
    ], { x: 1.25, y: yy - 0.03, w: 11.3, h: g - 0.1, align: "left", valign: "top", isTextBox: true, margin: 0 });
  });
}

// Amber "why it matters" / rule banner.
function banner(slide, y, label, labelColor, bg, rich) {
  slide.addShape(pres.ShapeType.roundRect, { x: 0.5, y, w: 12.33, h: 1.25, rectRadius: 0.09, fill: { color: bg }, line: { type: "none" } });
  slide.addText(label, { x: 0.85, y: y + 0.17, w: 11.6, h: 0.3, fontSize: 10.5, bold: true, color: labelColor, fontFace: BODY, charSpacing: 2, align: "left", isTextBox: true, margin: 0 });
  slide.addText(rich, { x: 0.85, y: y + 0.48, w: 11.6, h: 0.68, fontSize: 14, fontFace: BODY, align: "left", valign: "top", isTextBox: true, margin: 0 });
}

// ════════════════════════════════════════════════════════════════════════
// 1. TITLE
// ════════════════════════════════════════════════════════════════════════
let s = pres.addSlide({ masterName: "TITLE" });
cornerCircles(s);
s.addShape(pres.ShapeType.roundRect, { x: 0.9, y: 2.1, w: 2.7, h: 0.5, rectRadius: 0.25, fill: { color: GREEN }, line: { type: "none" } });
s.addText("WEEKLY MEETING", { x: 0.9, y: 2.1, w: 2.7, h: 0.5, align: "center", valign: "middle", fontSize: 11, bold: true, color: WHITE, fontFace: BODY, charSpacing: 2, isTextBox: true, margin: 0 });
s.addText("PM Catch-up", { x: 0.85, y: 2.75, w: 10.5, h: 1.2, fontSize: 48, bold: true, color: WHITE, fontFace: HEAD, align: "left", valign: "middle", isTextBox: true, margin: 0 });
s.addText("This week's process points, SOP changes and the habits to tighten up.",
  { x: 0.9, y: 4.05, w: 9.6, h: 0.9, fontSize: 17, color: "CFE6DB", fontFace: BODY, align: "left", valign: "top", isTextBox: true, margin: 0 });
s.addText("w/c October", { x: 0.9, y: 5.4, w: 9.6, h: 0.4, fontSize: 13, italic: true, color: MOSS, fontFace: BODY, align: "left", isTextBox: true, margin: 0 });

// ════════════════════════════════════════════════════════════════════════
// 2. WHAT WE'LL COVER
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "What we'll cover");
subtitle(s, "This week's SOP changes and the habits to tighten up.");
const agenda = [
  ["Add Direct Info", "New info, not notes \u2014 and using it to Set Visit Date, including LL DIYs"],
  ["TT-chasing", "Keep chasing the tenant \u2014 even with time in hand"],
  ["Holds", "Long holds are gone \u2014 only 1 and 3 days"],
  ["Online quotations", "Always with photos"],
  ["Changing provider", "At two escalations"],
  ["Emergency maintenance", "The revised landlord-approval route"],
];
agenda.forEach((a, i) => {
  const col = i < 3 ? 0 : 1;
  const row = col === 0 ? i : i - 3;
  const x = col === 0 ? 0.6 : 6.9;
  const y = 1.9 + row * 1.45;
  s.addShape(pres.ShapeType.ellipse, { x, y, w: 0.6, h: 0.6, fill: { color: col === 0 ? GREEN : TEAL }, line: { type: "none" } });
  s.addText(String(i + 1), { x, y, w: 0.6, h: 0.6, align: "center", valign: "middle", fontSize: 16, bold: true, color: WHITE, fontFace: HEAD, isTextBox: true, margin: 0 });
  s.addText([
    { text: a[0] + "\n", options: { bold: true, fontSize: 14.5, color: INK, fontFace: BODY } },
    { text: a[1], options: { fontSize: 11, color: GREY, fontFace: BODY } },
  ], { x: x + 0.8, y: y - 0.04, w: 5.3, h: 1.2, align: "left", valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 0.98 });
});

// ════════════════════════════════════════════════════════════════════════
// 3. WHO TO TAG
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Who to tag");
subtitle(s, "Route it to the right person first time.");
const tags = [
  ["Maintenance", "Masha", GREEN],
  ["Compliance", "Veronica", TEAL],
  ["Closing a task", "Elya", AMBER],
];
tags.forEach((t, i) => {
  const x = 0.6 + i * 4.15;
  card(s, x, 1.9, 3.85, 2.3, WHITE);
  s.addShape(pres.ShapeType.roundRect, { x, y: 1.9, w: 3.85, h: 0.8, rectRadius: 0.09, fill: { color: t[2] }, line: { type: "none" } });
  s.addText(t[0], { x, y: 1.9, w: 3.85, h: 0.8, align: "center", valign: "middle", fontSize: 16, bold: true, color: WHITE, fontFace: HEAD, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Tag\n", options: { fontSize: 11, color: GREY, fontFace: BODY, charSpacing: 1 } },
    { text: t[1], options: { fontSize: 26, bold: true, color: INK, fontFace: HEAD } },
  ], { x, y: 2.95, w: 3.85, h: 1.1, align: "center", valign: "top", isTextBox: true, margin: 0 });
});
banner(s, 4.75, "WHEN YOU TAG TO CLOSE A TASK", AMBER, "FBEEDD", [
  { text: "Always include the reason. ", options: { bold: true, color: INK } },
  { text: "And if it's a compliance task, fill out the form first \u2014 every time, before it's closed.", options: { color: INK } },
]);

// ════════════════════════════════════════════════════════════════════════
// 4. STANDING REMINDERS (the same every week)
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Before we start — the standing KPIs");
subtitle(s, "The same every week. Where we hold the line.");
const kpis = [
  ["Calls", "No silent waits on the line.", GREEN],
  ["Visit dates", "100% of jobs have a visit date (except LL DIY).", TEAL],
  ["SLA", "Under 4 hours.", SLATE],
];
kpis.forEach((k, i) => {
  const x = 0.6 + i * 4.15;
  card(s, x, 1.9, 3.85, 2.2, WHITE);
  s.addShape(pres.ShapeType.roundRect, { x, y: 1.9, w: 3.85, h: 0.8, rectRadius: 0.09, fill: { color: k[2] }, line: { type: "none" } });
  s.addText(k[0], { x, y: 1.9, w: 3.85, h: 0.8, align: "center", valign: "middle", fontSize: 18, bold: true, color: WHITE, fontFace: HEAD, isTextBox: true, margin: 0 });
  s.addText(k[1], { x: x + 0.3, y: 2.95, w: 3.25, h: 1.0, align: "center", valign: "top", fontSize: 13, color: GREY, fontFace: BODY, isTextBox: true, margin: 0 });
});
banner(s, 4.5, "WHY THE STAGES MATTER", AMBER, "FBEEDD", [
  { text: "Keep the stage honest — it drives the chasers. ", options: { bold: true, color: INK } },
  { text: "Things like asking for an invoice in result_awaiting when the visit never happened, or waiting on a quote while still in scheduling, break the automation and the trust in it.", options: { color: INK } },
]);

// ════════════════════════════════════════════════════════════════════════
// 4. SECTION — ADD DIRECT INFO
// ════════════════════════════════════════════════════════════════════════
sectionSlide("01", "Add Direct Info", "Using it well — and keeping it separate from notes and visit dates.");

// ════════════════════════════════════════════════════════════════════════
// 5. ADD DIRECT INFO vs NOTES
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Add Direct Info — what it's actually for");
subtitle(s, "One job only: provider, landlord or tenant availability, entered from the party's point of view. Everything else has its own place.");
const buckets = [
  ["Add Direct Info", GREEN, "Availability only \u2014 written as the party told us",
    ["Tenant: \u201CI can do Tue AM or Thu after 3\u201D", "Provider: \u201CAvailable Wednesday\u201D", "LL DIY: \u201CMy contractor attends Friday\u201D"]],
  ["Wait for Response", TEAL, "An update on your own activity \u2014 e.g. after a call",
    ["\u201CCalled tenant, no answer\u201D", "Chased the provider, awaiting a reply", "Used to pause while a party comes back to us"]],
  ["Send Comms + Add Note", AMBER, "A note about the task \u2014 something to remember",
    ["\u201CLandlord wants a quote before any works\u201D", "A standing preference or instruction", "Context the next person needs on the job"]],
];
buckets.forEach((b, i) => {
  const x = 0.6 + i * 4.15, w = 3.85;
  card(s, x, 1.95, w, 3.45, WHITE);
  s.addShape(pres.ShapeType.roundRect, { x, y: 1.95, w, h: 0.7, rectRadius: 0.09, fill: { color: b[1] }, line: { type: "none" } });
  s.addText(b[0], { x, y: 1.95, w, h: 0.7, align: "center", valign: "middle", fontSize: 14.5, bold: true, color: WHITE, fontFace: HEAD, isTextBox: true, margin: 0 });
  s.addText(b[2], { x: x + 0.25, y: 2.8, w: w - 0.5, h: 0.75, align: "left", valign: "top", fontSize: 11.5, bold: true, italic: true, color: INK, fontFace: BODY, isTextBox: true, margin: 0 });
  s.addText(b[3].map(t => ({ text: t, options: { bullet: { code: "2022", indent: 12 }, color: GREY, fontFace: BODY, paraSpaceAfter: 6 } })),
    { x: x + 0.3, y: 3.55, w: w - 0.55, h: 1.7, align: "left", valign: "top", fontSize: 11, isTextBox: true, margin: 0 });
});
banner(s, 5.7, "THE RULE", GREEN, TINT, [
  { text: "Direct Info is only ever availability, from the party's point of view \u2014 never your own activity. ", options: { bold: true, color: INK } },
  { text: "Activity updates \u2192 Wait for Response. Task notes \u2192 Send Comms.", options: { color: GREEN, bold: true } },
]);

// ════════════════════════════════════════════════════════════════════════
// 6. ADD DIRECT INFO + SET VISIT DATE — LIVE DEMO
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Add Direct Info + Set Visit Date");
subtitle(s, "The system has to mirror the real world — so every chaser fires on a date that's actually true.");
banner(s, 1.7, "THE RULE", GREEN, TINT, [
  { text: "Capture off-system availability with Add Direct Info on the party's behalf, then Set Visit Date. ", options: { bold: true, color: INK } },
  { text: "Set Visit Date records an agreed appointment, not a proposal \u2014 use it only once both sides have confirmed the same slot.", options: { color: GREEN, bold: true } },
]);
liveDemoBox(s, 3.2, 3.5, "Good vs bad \u2014 including examples that don't make sense \u2014 on the prepped test jobs.");

// ════════════════════════════════════════════════════════════════════════
// 7. LL DIYs — VISIT DATE VIA ADD DIRECT INFO — LIVE DEMO
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "LL DIYs — setting the visit date");
subtitle(s, "On DIY the landlord uses his own tradesman — we order nothing, but we still broker access and reflect reality.");
banner(s, 1.7, "THE RULE", GREEN, TINT, [
  { text: "Get slots from the tenant, pass them to the landlord, relay the confirmed slot back \u2014 then Set Visit Date via Add Direct Info. ", options: { bold: true, color: INK } },
  { text: "DIY is the one exception to 100% visit dates, but a set date still beats a blank job \u2014 and it carries the longest, most-forgotten SLA in the flow.", options: { color: GREEN, bold: true } },
]);
liveDemoBox(s, 3.2, 3.5, "Shown live on the test DIY job \u2014 a dated job vs one left blank.");

// ════════════════════════════════════════════════════════════════════════
// 8. TT-CHASING SOP
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "TT-chasing — keep chasing, even with time in hand");
subtitle(s, "People stop chasing the tenant when there's \u201Cplenty of time\u201D — that's not the SOP. The chase continues, step by step, until the tenant is booked.");
points(s, 1.9, [
  ["Keep chasing", "Time in hand is not a reason to stop. Call when the task needs action, then escalate exactly as the SOP says (next slide) until the tenant is booked."],
  ["Log it in Wait for Response", "Every chase action \u2014 the voicemail, the follow-up email, the WhatsApp \u2014 goes in Wait for Response, not Send Comms or a note. Send Comms / notes are for task context, never your own activity."],
], 1.35);
banner(s, 4.75, "A STRICT RULE — NOT A SUGGESTION", AMBER, "FBEEDD", [
  { text: "We can't force-book an appointment (barring a court order). ", options: { bold: true, color: INK } },
  { text: "Follow the exact steps on the next slide to get the tenant booked.", options: { color: INK } },
]);

// ════════════════════════════════════════════════════════════════════════
// 10. TENANT NOT RESPONDING — THE SOP (flow, from the SOP screenshot)
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Tenant not responding — the SOP");
subtitle(s, "Once a job is escalated or flagged, call the tenant first — then work the two escalations exactly.");
// Force-book warning
s.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 1.5, w: 12.33, h: 0.5, rectRadius: 0.08, fill: { color: BADBG }, line: { type: "none" } });
s.addText([
  { text: "WE CANNOT FORCE-BOOK ANY APPOINTMENT  ", options: { bold: true, color: BAD, charSpacing: 1 } },
  { text: "\u2014 unless there's a court order.", options: { color: INK } },
], { x: 0.85, y: 1.5, w: 11.6, h: 0.5, align: "left", valign: "middle", fontSize: 12.5, fontFace: BODY, isTextBox: true, margin: 0 });
// Two escalation cards
const esc = [
  [0.5, "Escalation 1", GREEN, [
    ["No reply:", BAD, " leave a voicemail + follow-up email, then Wait for Response \u2192 3 days."],
    ["No response:", BAD, " repeat the step once."],
    ["If they respond:", GOOD, " Add Direct Info with their dates."],
  ]],
  [6.83, "Escalation 2", TEAL, [
    ["No response after the 2nd attempt:", BAD, " send a WhatsApp, add a job note \u201CWhatsApp message sent\u201D, then Wait for Response \u2192 3 days."],
    ["No response:", BAD, " arrange a physical letter by post requesting a call-back to the agency."],
    ["No reply within a week of the letter:", BAD, " a property specialist / PM visits and speaks to the tenant."],
  ]],
];
esc.forEach(c => {
  const x = c[0], head = c[1], hcol = c[2], steps = c[3];
  const w = 6.0, y = 2.2, h = 3.15;
  card(s, x, y, w, h, WHITE);
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 0.6, rectRadius: 0.09, fill: { color: hcol }, line: { type: "none" } });
  s.addText(head, { x: x + 0.25, y, w: w - 0.5, h: 0.6, align: "left", valign: "middle", fontSize: 14, bold: true, color: WHITE, fontFace: HEAD, isTextBox: true, margin: 0 });
  const runs = [];
  steps.forEach(st => {
    runs.push({ text: st[0] + " ", options: { bold: true, color: st[1], bullet: { code: "2022", indent: 12 } } });
    runs.push({ text: st[2], options: { color: INK, breakLine: true } });
  });
  s.addText(runs, { x: x + 0.25, y: y + 0.78, w: w - 0.5, h: h - 0.95, align: "left", valign: "top", fontSize: 11.5, fontFace: BODY, paraSpaceAfter: 8, isTextBox: true, margin: 0 });
});
// Bottom row: the Notify step + the Add Direct Info side note
s.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 5.5, w: 8.4, h: 1.3, rectRadius: 0.09, fill: { color: TINT }, line: { type: "none" } });
s.addText("THEN", { x: 0.8, y: 5.65, w: 7.8, h: 0.3, fontSize: 10.5, bold: true, color: GREEN, fontFace: BODY, charSpacing: 2, align: "left", isTextBox: true, margin: 0 });
s.addText("Notify the tenant with notice per the tenancy agreement \u2014 if they comply, proceed with the job; if they refuse at any point, go back to the escalation point.",
  { x: 0.8, y: 5.95, w: 7.8, h: 0.8, align: "left", valign: "top", fontSize: 12.5, color: INK, fontFace: BODY, isTextBox: true, margin: 0 });
s.addShape(pres.ShapeType.roundRect, { x: 9.1, y: 5.5, w: 3.73, h: 1.3, rectRadius: 0.09, fill: { color: "EAF2F7" }, line: { color: TEAL, width: 1 } });
s.addText([
  { text: "Add Direct Info ", options: { bold: true, italic: true, color: TEAL } },
  { text: "can add tenant-suggested dates at any point during Scheduling.", options: { italic: true, color: INK } },
], { x: 9.35, y: 5.6, w: 3.25, h: 1.1, align: "left", valign: "middle", fontSize: 11.5, fontFace: BODY, isTextBox: true, margin: 0 });

// ════════════════════════════════════════════════════════════════════════
// 10. HOLDS
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Holds — the new rules");
subtitle(s, "Long holds are gone. Only 1-day and 3-day holds exist now.");
points(s, 1.8, [
  ["Only 1 and 3 days", "Long holds are banned. If a job genuinely needs months (e.g. a planned delay), tell Elya the reason and how long to postpone it by \u2014 don't park it on a hold."],
  ["Provisional cleans", "A provisional clean doesn't belong on a hold \u2014 book it in and Set Visit Date, even provisionally, so it progresses instead of dropping off and resurfacing."],
], 1.4);
banner(s, 5.0, "THE PATTERN TO BREAK", AMBER, "FBEEDD", [
  { text: "A hold isn't a parking space. ", options: { bold: true, color: INK } },
  { text: "If a job can't move, the answer is a date or a word with Elya \u2014 not hold after hold, which only makes it resurface unmanaged.", options: { color: INK } },
]);

// ════════════════════════════════════════════════════════════════════════
// 11. ONLINE QUOTATION — PHOTOS
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Online quotations must have photos");
subtitle(s, "The provider prices remotely \u2014 they don't visit first. They quote from exactly what you attach: the photos and the written report.");
goodBad(s, 1.75, 3.3,
  "With photos + a clear report",
  [
    "The provider can price it remotely, first time",
    "No back-and-forth to understand the issue",
    "Straight to a quote \u2014 no lag",
  ],
  "No photos / a one-line report",
  [
    "The provider can't put a number on it, so they come back to ask",
    "The request sits in online quotation for days while messages go back and forth",
    "The tenant waits longer and you handle the same job twice",
  ]);
banner(s, 5.3, "WHY IT MATTERS", GREEN, TINT, [
  { text: "Photos = jobs solved quicker with no lag. ", options: { bold: true, color: GREEN } },
  { text: "Triage is the cheapest place to get this right \u2014 and online quotations without photos are now visible in the SOP adherence report.", options: { color: INK } },
]);

// ════════════════════════════════════════════════════════════════════════
// 12. CHANGING PROVIDER AT TWO ESCALATIONS
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Change provider at two escalations");
subtitle(s, "The same SOP exists in compliance \u2014 and it applies to maintenance too.");
points(s, 1.95, [
  ["Two escalations \u2192 change provider", "A provider is pinged at +1 working day and escalates to you at +2 with nothing back. At two escalations, assign a different provider rather than chasing the same firm."],
  ["Use Change SP", "The old provider gets a polite stand-down, a new one is assigned, and the request stays on the stage to be priced or scheduled."],
  ["Both triggers, both flows", "Applies to scheduling and online_quotation escalations alike \u2014 it's the established compliance SOP, so treat maintenance exactly the same."],
], 1.2);

// ════════════════════════════════════════════════════════════════════════
// 13. EMERGENCY MAINTENANCE SOP
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Emergency maintenance — revised SOP");
subtitle(s, "Request landlord approval as usual and let the escalation raise \u2014 don't call ahead of it, even on an emergency. Two ways it then resolves.");
// Two outcome cards
card(s, 0.5, 1.85, 6.0, 2.5, GOODBG);
s.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 1.85, w: 6.0, h: 0.7, rectRadius: 0.09, fill: { color: GOOD }, line: { type: "none" } });
s.addText("Outcome A", { x: 0.8, y: 1.85, w: 5.4, h: 0.7, align: "left", valign: "middle", fontSize: 15, bold: true, color: WHITE, fontFace: BODY, isTextBox: true, margin: 0 });
s.addText("The landlord approves on the phone. Proceed on that approval as normal.",
  { x: 0.8, y: 2.75, w: 5.4, h: 1.4, align: "left", valign: "top", fontSize: 14, color: INK, fontFace: BODY, isTextBox: true, margin: 0 });

card(s, 6.83, 1.85, 6.0, 2.5, TINT);
s.addShape(pres.ShapeType.roundRect, { x: 6.83, y: 1.85, w: 6.0, h: 0.7, rectRadius: 0.09, fill: { color: TEAL }, line: { type: "none" } });
s.addText("Outcome B", { x: 7.13, y: 1.85, w: 5.4, h: 0.7, align: "left", valign: "middle", fontSize: 15, bold: true, color: WHITE, fontFace: BODY, isTextBox: true, margin: 0 });
s.addText([
  { text: "We can't reach them / they don't approve in time. Continue by pressing ", options: { color: INK } },
  { text: "\u201CContinue without LL approval\u201D", options: { bold: true, color: INK } },
  { text: " so the emergency isn't held up.", options: { color: INK } },
], { x: 7.13, y: 2.75, w: 5.4, h: 1.4, align: "left", valign: "top", fontSize: 14, fontFace: BODY, isTextBox: true, margin: 0 });

banner(s, 4.7, "THE POINT", AMBER, "FBEEDD", [
  { text: "Request approval first and let the escalation raise \u2014 triage is for triaging, not calling. ", options: { bold: true, color: INK } },
  { text: "The \u201CContinue without LL approval\u201D route is the fallback when an emergency can't wait \u2014 not the default.", options: { color: INK } },
]);

// ════════════════════════════════════════════════════════════════════════
// 14. CLOSING
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CLOSING" });
cornerCircles(s);
s.addText("What to take away", { x: 0.85, y: 1.4, w: 11, h: 0.9, fontSize: 34, bold: true, color: WHITE, fontFace: HEAD, align: "left", valign: "middle", isTextBox: true, margin: 0 });
const takeaways = [
  ["Add Direct Info = availability only, from the party's point of view.", GREEN],
  ["Visit date in the system, up to date, 100% of the time.", TEAL],
  ["No long holds \u2014 set a date or speak to Elya.", MOSS],
  ["Photos on every online quotation.", SAGE],
];
takeaways.forEach((t, i) => {
  const y = 2.55 + i * 0.92;
  s.addShape(pres.ShapeType.ellipse, { x: 0.9, y: y + 0.05, w: 0.5, h: 0.5, fill: { color: t[1] }, line: { type: "none" } });
  s.addText(String(i + 1), { x: 0.9, y: y + 0.05, w: 0.5, h: 0.5, align: "center", valign: "middle", fontSize: 15, bold: true, color: DKBG, fontFace: HEAD, isTextBox: true, margin: 0 });
  s.addText(t[0], { x: 1.6, y, w: 10.8, h: 0.6, fontSize: 18, color: WHITE, fontFace: BODY, align: "left", valign: "middle", isTextBox: true, margin: 0 });
});
s.addText("Questions \u2014 and anything from your own jobs this week.", { x: 0.9, y: 6.35, w: 11, h: 0.5, fontSize: 15, italic: true, bold: true, color: MOSS, fontFace: HEAD, align: "left", isTextBox: true, margin: 0 });

pres.writeFile({ fileName: OUT }).then(f => console.log("WROTE", OUT));
