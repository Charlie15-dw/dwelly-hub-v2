// One-off: global old-palette -> dwelly.group brand hex remap.
// Run: node scripts/retheme-hex.mjs
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { join, extname } from 'path'

const ROOT = new URL('..', import.meta.url).pathname
const DIRS = ['app', 'components', 'lib'].map((d) => join(ROOT, d))
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css'])

const REMAP = {
  '#F5F5F7': '#F2F2F3',
  '#E8E8ED': '#E2E2E4',
  '#D2D2D7': '#C8C8CC',
  '#AEAEB2': '#AEAEB4',
  '#8E8E93': '#94949C',
  '#636366': '#7D7C86',
  '#48484A': '#5E5E65',
  '#3A3A3C': '#404044',
  '#2C2C2E': '#262628',
  '#1D1D1F': '#101010',
  '#0071E3': '#2C68ED',
  '#0077ED': '#3D74EE',
  '#CCE4FF': '#D5E1FB',
  '#F0F7FF': '#EEF3FE',
  '#99C8FF': '#ABC3F8',
  '#66ADFF': '#80A4F4',
  '#3391FF': '#5686F1',
  '#0064CC': '#295DD2',
  '#0056B3': '#2551B4',
  '#004A99': '#214595',
  '#003D80': '#1D3873',
}

const pairs = Object.entries(REMAP).sort((a, b) => b[0].length - a[0].length)

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
    for (const [from, to] of pairs) {
      const re = new RegExp(from, 'gi')
      out = out.replace(re, (m) => {
        count++
        return to
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

console.log(`\nDone. ${filesChanged} files changed, ${totalReplacements} hex literals replaced.`)
