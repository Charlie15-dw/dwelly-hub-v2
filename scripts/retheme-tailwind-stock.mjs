// One-off, second pass: Tailwind's built-in stock colour classes (slate/zinc,
// indigo) were never touched by retheme-hex.mjs (which only remaps literal
// #hex values), so most of the app's neutral chrome and decorative accents
// were still on the old Apple-grey/indigo palette under a brand-coloured
// shell. Folds them into the brand tokens already defined in
// tailwind.config.ts — navy (neutral grey/black scale) and orange (the blue
// accent scale) — by shade number, since both scales are fully populated
// 50-900 and the stock scales never go outside that range here.
//
// Deliberately NOT touched: red/amber/green/emerald/yellow/blue/purple — these
// carry real RAG/pass-fail/warning/badge semantics across assessments and
// admin dashboards (see CLAUDE.md: "leave unchanged — RAG status colors").
//
// Run: node scripts/retheme-tailwind-stock.mjs
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { join, extname } from 'path'

const ROOT = new URL('..', import.meta.url).pathname
const DIRS = ['app', 'components', 'lib'].map((d) => join(ROOT, d))
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx'])

const REPLACEMENTS = [
  [/-(?:slate|zinc)-(\d{2,3})\b/g, '-navy-$1'],
  [/-indigo-(\d{2,3})\b/g, '-orange-$1'],
]

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) {
      if (name === 'node_modules' || name === '.next') continue
      walk(p, files)
    } else if (EXTS.has(extname(name))) {
      files.push(p)
    }
  }
  return files
}

let filesChanged = 0
let totalReplacements = 0

for (const dir of DIRS) {
  for (const file of walk(dir)) {
    const src = readFileSync(file, 'utf8')
    let out = src
    let count = 0
    for (const [re, to] of REPLACEMENTS) {
      out = out.replace(re, (_match, shade) => {
        count++
        return to.replace('$1', shade)
      })
    }
    if (count > 0) {
      writeFileSync(file, out)
      filesChanged++
      totalReplacements += count
      console.log(`${file.replace(ROOT, '')}: ${count} replaced`)
    }
  }
}

console.log(`\nDone. ${filesChanged} files changed, ${totalReplacements} stock-colour classes replaced.`)
