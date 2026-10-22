// Build the weekly PM sync deck — w/c 19 October agenda.
// Same house style as the w/c 12 Oct deck: ~30 min walkthrough + 15 min Q&A.
// This week leans on live examples: two quick group quizzes (a Note vs Add
// Direct Info) plus a reminder on chasing the tenant's slots before the SP.
const pptxgen = require("pptxgenjs");

const OUT = "/Users/charlielockwood/Desktop/Dwelly - PM Sync wc 19 Oct.pptx";

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
const GOOD  = "2E7D5B";
const GOODBG= "E6F2EC";
const BAD   = "B3261E";
const BADBG = "FBEAE8";

const HEAD = "Cambria";
const BODY = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
pres.author = "Charlie Lockwood";
pres.title = "PM Sync — w/c 19 October";

// ── Masters ──────────────────────────────────────────────────────────────
pres.defineSlideMaster({ title: "TITLE",   background: { color: DKBG } });
pres.defineSlideMaster({ title: "CLOSING", background: { color: DKBG } });
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: WHITE },
  objects: [
    { text: { text: "PM Weekly Sync — w/c 19 October", options: {
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
function goodBad(slide, y, h, goodHead, goodItems, badHead, badItems) {
  const w = 6.0, gap = 0.33, x2 = 0.5 + w + gap;
  card(slide, 0.5, y, w, h, GOODBG);
  slide.addShape(pres.ShapeType.roundRect, { x: 0.5, y, w, h: 0.62, rectRadius: 0.09, fill: { color: GOOD }, line: { type: "none" } });
  slide.addText([{ text: "\u2713  ", options: { bold: true, color: WHITE } }, { text: goodHead, options: { bold: true, color: WHITE } }],
    { x: 0.75, y, w: w - 0.4, h: 0.62, align: "left", valign: "middle", fontSize: 14.5, fontFace: BODY, isTextBox: true, margin: 0 });
  slide.addText(goodItems.map(t => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, color: INK, fontFace: BODY, paraSpaceAfter: 6 } })),
    { x: 0.8, y: y + 0.82, w: w - 0.6, h: h - 1.0, align: "left", valign: "top", fontSize: 12.5, isTextBox: true, margin: 0 });
  card(slide, x2, y, w, h, BADBG);
  slide.addShape(pres.ShapeType.roundRect, { x: x2, y, w, h: 0.62, rectRadius: 0.09, fill: { color: BAD }, line: { type: "none" } });
  slide.addText([{ text: "\u2717  ", options: { bold: true, color: WHITE } }, { text: badHead, options: { bold: true, color: WHITE } }],
    { x: x2 + 0.25, y, w: w - 0.4, h: 0.62, align: "left", valign: "middle", fontSize: 14.5, fontFace: BODY, isTextBox: true, margin: 0 });
  slide.addText(badItems.map(t => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, color: INK, fontFace: BODY, paraSpaceAfter: 6 } })),
    { x: x2 + 0.3, y: y + 0.82, w: w - 0.6, h: h - 1.0, align: "left", valign: "top", fontSize: 12.5, isTextBox: true, margin: 0 });
}
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
function banner(slide, y, label, labelColor, bg, rich) {
  slide.addShape(pres.ShapeType.roundRect, { x: 0.5, y, w: 12.33, h: 1.25, rectRadius: 0.09, fill: { color: bg }, line: { type: "none" } });
  slide.addText(label, { x: 0.85, y: y + 0.17, w: 11.6, h: 0.3, fontSize: 10.5, bold: true, color: labelColor, fontFace: BODY, charSpacing: 2, align: "left", isTextBox: true, margin: 0 });
  slide.addText(rich, { x: 0.85, y: y + 0.48, w: 11.6, h: 0.68, fontSize: 14, fontFace: BODY, align: "left", valign: "top", isTextBox: true, margin: 0 });
}
// Three-option quiz row (neutral — the reveal is on the next slide).
function quizOptions(slide, y, opts) {
  const ow = 3.84, ogap = 0.4;
  opts.forEach((o, i) => {
    const x = 0.9 + i * (ow + ogap), h = 1.7;
    card(slide, x, y, ow, h, WHITE);
    slide.addShape(pres.ShapeType.ellipse, { x: x + 0.3, y: y + 0.28, w: 0.5, h: 0.5, fill: { color: o[3] }, line: { type: "none" } });
    slide.addText(o[0], { x: x + 0.3, y: y + 0.28, w: 0.5, h: 0.5, align: "center", valign: "middle", fontSize: 15, bold: true, color: WHITE, fontFace: HEAD, isTextBox: true, margin: 0 });
    slide.addText(o[1], { x: x + 0.95, y: y + 0.26, w: ow - 1.1, h: 0.55, align: "left", valign: "middle", fontSize: 14.5, bold: true, color: INK, fontFace: BODY, isTextBox: true, margin: 0 });
    slide.addText(o[2], { x: x + 0.3, y: y + 0.95, w: ow - 0.6, h: 0.6, align: "left", valign: "top", fontSize: 12, color: GREY, fontFace: BODY, isTextBox: true, margin: 0 });
  });
}
// A recreated CRM "Info from <party>" card (swap for a real screenshot if preferred).
const SCRBG = "F2F3F5", BLUE1 = "4F7CEF", BLUE2 = "7CA8F6";
function infoCard(slide, y, heading, who, arrowTo, bodyText, tsRight) {
  const x = 0.9, w = 11.5, h = 1.5;
  card(slide, x, y, w, h, WHITE);
  slide.addShape(pres.ShapeType.ellipse, { x: x + 0.3, y: y + 0.26, w: 0.4, h: 0.4, fill: { color: WHITE }, line: { color: "B4C0CA", width: 1 } });
  slide.addText("i", { x: x + 0.3, y: y + 0.26, w: 0.4, h: 0.4, align: "center", valign: "middle", fontSize: 12, italic: true, color: "7A8894", fontFace: HEAD, isTextBox: true, margin: 0 });
  slide.addText(heading, { x: x + 0.88, y: y + 0.22, w: 6, h: 0.45, align: "left", valign: "middle", fontSize: 14.5, bold: true, color: INK, fontFace: BODY, isTextBox: true, margin: 0 });
  if (tsRight) slide.addText(tsRight, { x: x + w - 3.6, y: y + 0.22, w: 3.3, h: 0.45, align: "right", valign: "middle", fontSize: 10.5, color: "9AA6AE", fontFace: BODY, isTextBox: true, margin: 0 });
  slide.addShape(pres.ShapeType.roundRect, { x: x + 0.88, y: y + 0.72, w: w - 1.2, h: 0.62, rectRadius: 0.06, fill: { color: SCRBG }, line: { type: "none" } });
  slide.addShape(pres.ShapeType.roundRect, { x: x + 1.12, y: y + 0.82, w: 2.4, h: 0.4, rectRadius: 0.2, fill: { color: BLUE1 }, line: { type: "none" } });
  slide.addText("\u2199 " + who, { x: x + 1.12, y: y + 0.82, w: 2.4, h: 0.4, align: "center", valign: "middle", fontSize: 10.5, bold: true, color: WHITE, fontFace: BODY, isTextBox: true, margin: 0 });
  slide.addText("\u2192", { x: x + 3.58, y: y + 0.82, w: 0.4, h: 0.4, align: "center", valign: "middle", fontSize: 14, color: "7A8894", fontFace: BODY, isTextBox: true, margin: 0 });
  slide.addShape(pres.ShapeType.roundRect, { x: x + 4.04, y: y + 0.82, w: 1.6, h: 0.4, rectRadius: 0.2, fill: { color: BLUE2 }, line: { type: "none" } });
  slide.addText(arrowTo, { x: x + 4.04, y: y + 0.82, w: 1.6, h: 0.4, align: "center", valign: "middle", fontSize: 10.5, bold: true, color: WHITE, fontFace: BODY, isTextBox: true, margin: 0 });
  slide.addText(bodyText, { x: x + 5.8, y: y + 0.82, w: w - 6.1, h: 0.4, align: "left", valign: "middle", fontSize: 12.5, italic: true, color: "6B7883", fontFace: BODY, isTextBox: true, margin: 0 });
}

// ════════════════════════════════════════════════════════════════════════
// 1. TITLE
// ════════════════════════════════════════════════════════════════════════
let s = pres.addSlide({ masterName: "TITLE" });
cornerCircles(s);
s.addShape(pres.ShapeType.roundRect, { x: 0.9, y: 2.1, w: 2.5, h: 0.5, rectRadius: 0.25, fill: { color: GREEN }, line: { type: "none" } });
s.addText("WEEKLY SYNC", { x: 0.9, y: 2.1, w: 2.5, h: 0.5, align: "center", valign: "middle", fontSize: 11, bold: true, color: WHITE, fontFace: BODY, charSpacing: 2, isTextBox: true, margin: 0 });
s.addText("PM Catch-up", { x: 0.85, y: 2.75, w: 10.5, h: 1.2, fontSize: 48, bold: true, color: WHITE, fontFace: HEAD, align: "left", valign: "middle", isTextBox: true, margin: 0 });
s.addText("A few process points and two quick quizzes on real jobs — then your questions.",
  { x: 0.9, y: 4.05, w: 10.4, h: 0.9, fontSize: 17, color: "CFE6DB", fontFace: BODY, align: "left", valign: "top", isTextBox: true, margin: 0 });
s.addText("w/c 19 October  ·  30 min walkthrough + 15 min Q&A", { x: 0.9, y: 5.4, w: 10.5, h: 0.4, fontSize: 13, italic: true, color: MOSS, fontFace: BODY, align: "left", isTextBox: true, margin: 0 });

// ════════════════════════════════════════════════════════════════════════
// 2. WHAT WE'LL COVER
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "What we'll cover");
subtitle(s, "A few reminders and two quizzes on jobs from this week, then the floor is yours.");
const agenda = [
  ["Ask Dobby — now in the Widget", "Ask process questions right inside the CRM", GREEN],
  ["One call, several jobs", "Log the call on each job so no false no-call shows", TEAL],
  ["Email sign-off photo", "A quick check everyone needs done", SAGE],
  ["Where your info goes", "Direct Info vs Notes — two quick quizzes on real jobs", AMBER],
  ["Getting out of manual mode", "Ping Masha or Veronica and they'll move it on", MOSS],
  ["Chase the right party", "Tenant slots before the SP — a quick reminder", SLATE],
];
agenda.forEach((a, i) => {
  const y = 1.72 + i * 0.84;
  s.addShape(pres.ShapeType.ellipse, { x: 0.6, y, w: 0.56, h: 0.56, fill: { color: a[2] }, line: { type: "none" } });
  s.addText(String(i + 1), { x: 0.6, y, w: 0.56, h: 0.56, align: "center", valign: "middle", fontSize: 15, bold: true, color: WHITE, fontFace: HEAD, isTextBox: true, margin: 0 });
  s.addText(a[0], { x: 1.38, y: y - 0.02, w: 11.2, h: 0.6, align: "left", valign: "middle", fontSize: 15.5, bold: true, color: INK, fontFace: BODY, isTextBox: true, margin: 0 });
});

// ════════════════════════════════════════════════════════════════════════
// 3. ASK DOBBY — NOW IN THE WIDGET (the win)
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Ask Dobby — now inside the Widget");
subtitle(s, "You can ask Dobby process questions right inside the Context Widget, without leaving the job.");
const dobby = [
  ["What it is", GREEN, "Dobby, the Dwelly assistant, now lives in the Context Widget inside the CRM — ask a question and get an answer on the spot."],
  ["What it answers", TEAL, "SOP and process questions. It pulls from the SOPs matched to the job plus Dwelly training, so the steps fit what you're actually working on."],
  ["Shorter by design", SLATE, "Widget answers are tight, dash-point steps — quicker than the fuller Hub Dobby. For a deep-dive, the Hub Dobby is still there."],
];
dobby.forEach((c, i) => {
  const x = 0.6 + i * 4.15, w = 3.85, y = 1.95, h = 2.75;
  card(s, x, y, w, h, WHITE);
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 0.62, rectRadius: 0.09, fill: { color: c[1] }, line: { type: "none" } });
  s.addText(c[0], { x, y, w, h: 0.62, align: "center", valign: "middle", fontSize: 15, bold: true, color: WHITE, fontFace: HEAD, isTextBox: true, margin: 0 });
  s.addText(c[2], { x: x + 0.3, y: y + 0.85, w: w - 0.6, h: 1.75, align: "left", valign: "top", fontSize: 12.5, color: GREY, fontFace: BODY, isTextBox: true, margin: 0 });
});
banner(s, 5.0, "GIVE IT A GO", GREEN, TINT, [
  { text: "Next time you'd reach for the channel, ask the Widget's Dobby first. ", options: { bold: true, color: INK } },
  { text: "It answers from the SOPs matched to that job.", options: { color: GREEN, bold: true } },
]);

// ════════════════════════════════════════════════════════════════════════
// 4. FALSE NO-CALLS — ONE CALL, SEVERAL JOBS
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "One call, several jobs — log it on each");
subtitle(s, "When you call an SP once and cover several jobs on the same call, make sure each job shows it.");
points(s, 1.95, [
  ["The trap", "You call the SP about job 1 and discuss jobs 2 and 3 on the same call. Jobs 2 and 3 have no call logged against them — so the SOP adherence report flags a false \u201Cno-call\u201D on both."],
  ["The fix", "When you click Wait for Response on jobs 2 and 3, add a note like \u201Ccalled the SP in job 1\u201D. That ties the call to each job, and the false no-call disappears."],
], 1.35);
banner(s, 4.8, "GOOD TO KNOW", GREEN, TINT, [
  { text: "One call covering several jobs? Note \u201Ccalled in job X\u201D on each. ", options: { bold: true, color: INK } },
  { text: "Ivan is spot-checking these and will amend the report where it's wrong.", options: { color: INK } },
]);

// ════════════════════════════════════════════════════════════════════════
// 5. EMAIL SIGN-OFF PHOTO — QUICK CHECK
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Email sign-off photo — quick check");
subtitle(s, "A two-minute setup every PM needs in place.");
points(s, 1.95, [
  ["Check yours is set up", "Every PM should have their email sign-off photo set up. Take a moment to confirm yours is there."],
  ["Hit a permissions issue?", "If you can't set it up because of permissions, don't sit on it — escalate to Olya or Elya and they'll sort the access."],
], 1.35);
banner(s, 4.8, "TWO MINUTES NOW", GREEN, TINT, [
  { text: "Already done? Nothing to do. ", options: { bold: true, color: INK } },
  { text: "Not done? Two minutes now saves a chaser later.", options: { color: INK } },
]);

// ════════════════════════════════════════════════════════════════════════
// 6. WHERE DOES YOUR INFORMATION GO? (framing for the two quizzes)
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Where does your information go?");
subtitle(s, "Two reminders this week — Direct Info and Notes. Here's the quick map before the examples.");
const dests = [
  ["Add Direct Info", GREEN, "New info from a party — especially availability (tenant / SP / LL slots). The agent acts on it."],
  ["Set Visit Date", TEAL, "A slot both sides have already agreed. Not for passing on raw info."],
  ["Wait for Response", AMBER, "Your own activity or chase — \u201Ccalled, no answer, sending a letter\u201D. Clears the flag."],
  ["A Note", SLATE, "Logged on the job only. Triggers nothing — the agent won't see it or act on it."],
];
dests.forEach((c, i) => {
  const x = 0.6 + i * 3.15, w = 2.85, y = 1.95, h = 2.55;
  card(s, x, y, w, h, WHITE);
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 0.6, rectRadius: 0.09, fill: { color: c[1] }, line: { type: "none" } });
  s.addText(c[0], { x: x + 0.1, y, w: w - 0.2, h: 0.6, align: "center", valign: "middle", fontSize: 13.5, bold: true, color: WHITE, fontFace: HEAD, isTextBox: true, margin: 0 });
  s.addText(c[2], { x: x + 0.25, y: y + 0.78, w: w - 0.5, h: 1.65, align: "left", valign: "top", fontSize: 12, color: GREY, fontFace: BODY, isTextBox: true, margin: 0 });
});
s.addText("The two that get mixed up most are Direct Info and a Note — so let's test them.",
  { x: 0.6, y: 4.75, w: 11.9, h: 0.5, align: "left", valign: "middle", fontSize: 13, italic: true, color: SLATE, fontFace: BODY, isTextBox: true, margin: 0 });

// ════════════════════════════════════════════════════════════════════════
// 7. QUIZ 1 — THE NOTE (request 3337)
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Quiz 1 — where should this have gone?");
subtitle(s, "A PM logged the tenant's availability like this, as a Note on the job. Take a look.");
// Recreated "Note" card
card(s, 0.9, 1.68, 11.5, 1.5, WHITE);
s.addShape(pres.ShapeType.roundRect, { x: 1.2, y: 1.98, w: 0.95, h: 0.42, rectRadius: 0.06, fill: { color: SCRBG }, line: { type: "none" } });
s.addText("Note", { x: 1.2, y: 1.98, w: 0.95, h: 0.42, align: "center", valign: "middle", fontSize: 12, bold: true, color: "7A8894", fontFace: BODY, isTextBox: true, margin: 0 });
s.addText("\u201Ctenant is free any day any time in the week, she works weekends\u201D",
  { x: 1.2, y: 2.52, w: 10.9, h: 0.5, align: "left", valign: "middle", fontSize: 14.5, italic: true, color: INK, fontFace: BODY, isTextBox: true, margin: 0 });
s.addText([
  { text: "A Note was added with the tenant's availability.   ", options: { bold: true, color: INK, fontSize: 15 } },
  { text: "What happens next?", options: { color: GREY, fontSize: 13.5 } },
], { x: 0.9, y: 4.02, w: 11.5, h: 0.45, align: "left", valign: "middle", isTextBox: true, margin: 0 });
quizOptions(s, 4.55, [
  ["A", "The agent books it", "It reads the note and sets the visit", GREEN],
  ["B", "Nothing happens", "A note just sits on the job", TEAL],
  ["C", "The tenant's told", "It goes out as a reminder", AMBER],
]);
s.addText("Have a guess \u2014 we'll reveal where it belongs on the next slide.", { x: 0.9, y: 6.42, w: 11.5, h: 0.35, align: "left", valign: "middle", fontSize: 11.5, italic: true, color: SLATE, fontFace: BODY, isTextBox: true, margin: 0 });

// ════════════════════════════════════════════════════════════════════════
// 8. QUIZ 1 — REVEAL
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Quiz 1 — it's B: nothing happens");
subtitle(s, "A Note triggers nothing. Availability like this belongs in Add Direct Info, so the agent can act on it.");
goodBad(s, 1.75, 3.3,
  "Add Direct Info — the agent acts",
  [
    "\u201CFree any day, works weekends\u201D \u2192 Add Direct Info",
    "The agent can set the visit / chase the SP with it",
    "Scheduling actually moves forward",
  ],
  "A Note — logged, then nothing",
  [
    "The same words as a Note just sit there",
    "The agent never sees it \u2014 no visit, no chaser",
    "The job stalls and re-flags later",
  ]);
banner(s, 5.3, "THE RULE", GREEN, TINT, [
  { text: "Availability from a party \u2192 Add Direct Info. ", options: { bold: true, color: INK } },
  { text: "Notes are your own record only \u2014 they trigger nothing.", options: { color: GREEN, bold: true } },
]);

// ════════════════════════════════════════════════════════════════════════
// 9. QUIZ 2 — ADD DIRECT INFO (request 1313)
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Quiz 2 — does this need Direct Info?");
subtitle(s, "The AI assistant captured this from the tenant. The call's already logged on the job.");
infoCard(s, 1.68, "Info from Tenant", "Mrs Newland (12495)", "AI assistant", "will be talking to her husband tonight and giving us dates after that", null);
s.addText([
  { text: "It's info straight from the tenant.   ", options: { bold: true, color: INK, fontSize: 15 } },
  { text: "What should you do with it?", options: { color: GREY, fontSize: 13.5 } },
], { x: 0.9, y: 4.0, w: 11.5, h: 0.45, align: "left", valign: "middle", isTextBox: true, margin: 0 });
quizOptions(s, 4.55, [
  ["A", "Add Direct Info", "It came straight from the tenant", GREEN],
  ["B", "Add a Note", "Keep a record on the job", TEAL],
  ["C", "Nothing needed", "Call's logged; reminders run", AMBER],
]);
s.addText("Have a guess \u2014 we'll reveal it on the next slide.", { x: 0.9, y: 6.42, w: 11.5, h: 0.35, align: "left", valign: "middle", fontSize: 11.5, italic: true, color: SLATE, fontFace: BODY, isTextBox: true, margin: 0 });

// ════════════════════════════════════════════════════════════════════════
// 10. QUIZ 2 — REVEAL
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Quiz 2 — it's C: nothing needed here");
subtitle(s, "It's info from the tenant, but it doesn't move the task on \u2014 so it doesn't belong in Direct Info.");
goodBad(s, 1.75, 3.3,
  "Leave it \u2014 the system's got it",
  [
    "The call is already logged on the task",
    "The scheduled reminders keep going if we don't hear",
    "Real dates, when they land, are what move it on",
  ],
  "Don't force it into Direct Info",
  [
    "Direct Info is only for info that moves the task on",
    "\u201CDates to follow\u201D doesn't progress the job",
    "A Note would work for a record \u2014 but isn't needed here",
  ]);
banner(s, 5.3, "THE RULE", GREEN, TINT, [
  { text: "Direct Info is for info that moves the task forward. ", options: { bold: true, color: INK } },
  { text: "A holding \u201CI'll come back to you\u201D doesn't \u2014 the logged call and reminders have it covered.", options: { color: GREEN, bold: true } },
]);

// ════════════════════════════════════════════════════════════════════════
// 11. GETTING OUT OF MANUAL MODE (request 2692)
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Getting a job out of manual mode");
subtitle(s, "You're no longer stuck \u2014 there's a clean way back to the right stage.");
// Recreated decision card
card(s, 0.9, 1.6, 11.5, 1.35, WHITE);
s.addShape(pres.ShapeType.roundRect, { x: 1.2, y: 1.84, w: 2.9, h: 0.42, rectRadius: 0.06, fill: { color: "FDF3E6" }, line: { type: "none" } });
s.addText("Operator Decision Requested", { x: 1.2, y: 1.84, w: 2.9, h: 0.42, align: "center", valign: "middle", fontSize: 11, bold: true, color: AMBER, fontFace: BODY, isTextBox: true, margin: 0 });
s.addText("Operator", { x: 8.8, y: 1.84, w: 3.3, h: 0.42, align: "right", valign: "middle", fontSize: 10.5, color: "9AA6AE", fontFace: BODY, isTextBox: true, margin: 0 });
s.addText([
  { text: "Reason:  ", options: { bold: true, color: INK } },
  { text: "\u201Cneed to tell the tt the date as the system hasn't cleared\u2026\u201D", options: { italic: true, color: "6B7883" } },
], { x: 1.2, y: 2.38, w: 10.9, h: 0.45, align: "left", valign: "middle", fontSize: 13, fontFace: BODY, isTextBox: true, margin: 0 });
points(s, 3.2, [
  ["Ping Masha or Veronica", "If a job's stuck in manual, message Masha or Veronica with the context \u2014 what the job needs and why it's there."],
  ["They move it for you", "They'll move the job to the appropriate stage so it can carry on \u2014 no need to leave it sitting in manual."],
], 1.1);
banner(s, 5.55, "THE RULE", GREEN, TINT, [
  { text: "Stuck in manual? Ping Masha or Veronica with context \u2014 ", options: { bold: true, color: INK } },
  { text: "they'll move it to the right stage.", options: { color: GREEN, bold: true } },
]);

// ════════════════════════════════════════════════════════════════════════
// 12. CHASE THE RIGHT PARTY — TENANT SLOTS BEFORE THE SP (a point, not a quiz)
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CONTENT" });
title(s, "Chase the right party \u2014 tenant slots first");
subtitle(s, "Something we've been noticing on the SOP adherence side \u2014 a quick reminder, not a quiz.");
points(s, 1.95, [
  ["The pattern we're seeing", "Providers are being chased to book, but we haven't got the tenant's availability yet \u2014 so there's nothing concrete for the SP to book against."],
  ["Chase the correct party first", "Get the tenant's slots before you approach the SP. Then go to the SP with real dates and agree the visit against them, as the SOP sets out."],
], 1.35);
banner(s, 4.8, "GOOD TO KNOW", GREEN, TINT, [
  { text: "Tenant availability first, then the SP. ", options: { bold: true, color: INK } },
  { text: "Chasing the provider without slots just creates confusing, duplicate scheduling.", options: { color: INK } },
]);

// ════════════════════════════════════════════════════════════════════════
// 13. Q&A — CLOSING
// ════════════════════════════════════════════════════════════════════════
s = pres.addSlide({ masterName: "CLOSING" });
cornerCircles(s);
s.addShape(pres.ShapeType.roundRect, { x: 0.9, y: 2.0, w: 1.7, h: 0.5, rectRadius: 0.25, fill: { color: GREEN }, line: { type: "none" } });
s.addText("15 MINUTES", { x: 0.9, y: 2.0, w: 1.7, h: 0.5, align: "center", valign: "middle", fontSize: 10.5, bold: true, color: WHITE, fontFace: BODY, charSpacing: 1.5, isTextBox: true, margin: 0 });
s.addText("Over to you", { x: 0.85, y: 2.7, w: 11, h: 1.1, fontSize: 52, bold: true, color: WHITE, fontFace: HEAD, align: "left", valign: "middle", isTextBox: true, margin: 0 });
s.addText("What's come up on your jobs this week?", { x: 0.9, y: 4.05, w: 11, h: 0.6, fontSize: 20, color: "CFE6DB", fontFace: BODY, align: "left", valign: "top", isTextBox: true, margin: 0 });
s.addText("Questions from both teams \u2014 anything on the points above, or anything you've hit day to day.",
  { x: 0.9, y: 4.8, w: 11, h: 0.6, fontSize: 13, italic: true, color: MOSS, fontFace: BODY, align: "left", isTextBox: true, margin: 0 });

pres.writeFile({ fileName: OUT }).then(f => console.log("WROTE", OUT));
