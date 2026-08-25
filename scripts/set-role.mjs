// One-off: set a user's role in user_profiles (e.g. promote to admin).
//
// Roles used across the app: 'property-manager' | 'manager' | 'admin'.
// Admins can see every member's detail page (including CRM 2.0 assessments and
// the reassignment panels) and reassign anyone.
//
// Run from your own terminal (where the real env resolves):
//   npx vercel env pull .env.reopen --environment=production
//   node scripts/set-role.mjs veronica@dwelly.group admin
//
// If the Supabase URL comes back as a Vercel "Sensitive" placeholder, pass it
// explicitly:
//   SB_URL="https://YOUR-REF.supabase.co" node scripts/set-role.mjs veronica@dwelly.group admin

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const email = process.argv[2]
const role = process.argv[3]
const ALLOWED_ROLES = ['property-manager', 'manager', 'admin']

if (!email || !role) {
  console.error('Usage: node scripts/set-role.mjs <email> <property-manager|manager|admin>')
  process.exit(1)
}
if (!ALLOWED_ROLES.includes(role)) {
  console.error(`Invalid role "${role}". Must be one of: ${ALLOWED_ROLES.join(', ')}`)
  process.exit(1)
}

// Load the pulled env file ourselves — Node's --env-file trips over the quotes
// Vercel writes, so parse it directly and strip any surrounding quotes.
function clean(v) {
  if (v == null) return ''
  let s = String(v).replace(/\r/g, '').trim()
  s = s.replace(/^export\s+/, '')
  while ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1)
  return s.trim()
}
function loadEnvFile(path) {
  const out = {}
  try {
    for (const raw of readFileSync(path, 'utf8').split('\n')) {
      const line = raw.replace(/\r/g, '')
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const k = line.slice(0, eq).replace(/^export\s+/, '').trim()
      if (!/^[A-Za-z0-9_]+$/.test(k)) continue
      out[k] = clean(line.slice(eq + 1))
    }
  } catch (e) {
    console.error(`Could not read ${path}: ${e.message}`)
  }
  return out
}
const fileEnv = loadEnvFile('.env.reopen')

const isReal = (v) => /^https?:\/\//i.test(v) && !/sensitive/i.test(v)

let url = clean(process.env.SB_URL)
if (!isReal(url)) url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL)
if (!isReal(url)) url = fileEnv.NEXT_PUBLIC_SUPABASE_URL
const key = clean(process.env.SUPABASE_SERVICE_ROLE_KEY) || fileEnv.SUPABASE_SERVICE_ROLE_KEY

console.log('Resolved URL:', isReal(url) ? `${url} (ok)` : `${url || '(empty)'} (INVALID)`)
console.log('Service key:', key ? `present (len ${key.length})` : '(empty)')

if (!isReal(url)) {
  console.error('\nCould not get the Supabase URL from the pulled env (it is a Vercel "Sensitive" var).')
  console.error('Grab your Project URL from the Supabase dashboard (Settings → API → Project URL) and re-run like:')
  console.error(`  SB_URL="https://YOUR-REF.supabase.co" node scripts/set-role.mjs ${email} ${role}`)
  process.exit(1)
}
if (!key) { console.error('\nMissing SUPABASE_SERVICE_ROLE_KEY — make sure .env.reopen exists in this folder.'); process.exit(1) }
const sb = createClient(url, key, { auth: { persistSession: false } })

// 1. Find the user
const { data: list, error: listErr } = await sb.auth.admin.listUsers({ perPage: 1000 })
if (listErr) { console.error('listUsers failed:', listErr.message); process.exit(1) }
const user = list.users.find(u => (u.email || '').toLowerCase() === email.toLowerCase())
if (!user) { console.error(`No user found for ${email}`); process.exit(1) }
console.log(`User: ${user.email}  (${user.id})`)

// 2. Show the current role
const { data: before, error: beforeErr } = await sb
  .from('user_profiles')
  .select('role')
  .eq('id', user.id)
  .maybeSingle()
if (beforeErr) { console.error('read profile failed:', beforeErr.message); process.exit(1) }
console.log(`Current role: ${before?.role ?? '(none)'}  →  new role: ${role}`)

if (before?.role === role) { console.log('\nAlready set to that role — nothing to do.'); process.exit(0) }

// 3. Update the role
const { error: updErr } = await sb
  .from('user_profiles')
  .update({ role })
  .eq('id', user.id)
if (updErr) { console.error('update failed:', updErr.message); process.exit(1) }

console.log(`\nDone. ${user.email} is now ${role}.`)
