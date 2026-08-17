'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ExternalLink, Check, CheckCheck, Megaphone } from 'lucide-react'
import Link from 'next/link'
import type { HubUpdate } from '@/lib/updates'

// Elevated Dwelly Updates — replaces the one-at-a-time carousel with a date
// rail (handoff). Read/unread is a per-device marker in localStorage: there is
// no DB table for "seen updates", so rather than invent one we track it on the
// browser. "Mark all as read" clears every dot at once.

const READ_KEY = 'hub_updates_read_v1'

function loadRead(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(READ_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function saveRead(ids: Set<string>) {
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify(Array.from(ids)))
  } catch {
    /* ignore quota / privacy-mode failures */
  }
}

function fmtLong(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtRail(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function ElevatedUpdates({ updates }: { updates: HubUpdate[] }) {
  const [read, setRead] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)
  const [activeId, setActiveId] = useState(updates[0]?.id ?? '')

  useEffect(() => {
    setRead(loadRead())
    setHydrated(true)
  }, [])

  const active = useMemo(() => updates.find(u => u.id === activeId) ?? updates[0], [activeId, updates])

  // Mark the open update read shortly after it's shown.
  useEffect(() => {
    if (!hydrated || !active) return
    if (read.has(active.id)) return
    const next = new Set(read)
    next.add(active.id)
    setRead(next)
    saveRead(next)
  }, [hydrated, active, read])

  // Unread count only means something once we've loaded from localStorage.
  const unread = hydrated ? updates.filter(u => !read.has(u.id)).length : 0

  function markAllRead() {
    const next = new Set(updates.map(u => u.id))
    setRead(next)
    saveRead(next)
  }

  function isUnread(id: string) {
    return hydrated && !read.has(id)
  }

  if (updates.length === 0) {
    return (
      <div className="max-w-[880px] space-y-6">
        <Header unread={0} onMarkAll={markAllRead} showMarkAll={false} />
        <div className="card p-8 text-center">
          <p className="text-sm text-[var(--text-tertiary)]">No updates yet. New releases will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[980px] space-y-6">
      <Header unread={unread} onMarkAll={markAllRead} showMarkAll={unread > 0} />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Date rail */}
        <nav className="md:w-[260px] md:flex-shrink-0">
          <ol className="card overflow-hidden">
            {updates.map(u => {
              const on = u.id === active?.id
              return (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(u.id)}
                    className={
                      'w-full text-left flex items-start gap-3 px-4 py-3.5 border-t border-navy-100 first:border-t-0 transition-colors ' +
                      (on ? 'bg-[#0071E3]/6' : 'hover:bg-navy-50')
                    }
                  >
                    <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" aria-hidden>
                      <span className={'block w-1.5 h-1.5 rounded-full ' + (isUnread(u.id) ? 'bg-[#0071E3]' : 'bg-transparent')} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={'block text-[14px] leading-snug truncate ' + (on ? 'font-semibold text-navy' : isUnread(u.id) ? 'font-semibold text-navy' : 'font-medium text-[var(--text-secondary)]')}>
                        {u.title}
                      </span>
                      <span className="block text-[12px] text-[var(--text-tertiary)] mt-0.5">{fmtRail(u.date)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* Detail */}
        <div className="flex-1 min-w-0">
          {active && <UpdateDetail update={active} />}
        </div>
      </div>
    </div>
  )
}

function Header({ unread, onMarkAll, showMarkAll }: { unread: number; onMarkAll: () => void; showMarkAll: boolean }) {
  return (
    <div className="space-y-4">
      <Link href="/hub" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      <section className="hub-fade relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hub-orb-a absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-[#0071E3]/30 blur-3xl" />
          <div className="hub-orb-b absolute -bottom-28 -left-16 w-[22rem] h-[22rem] rounded-full bg-[#0071E3]/12 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
              backgroundSize: '30px 30px',
              maskImage: 'radial-gradient(ellipse at 75% 0%, #000 0%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 75% 0%, #000 0%, transparent 70%)',
            }}
          />
        </div>
        <div className="relative px-7 py-9 sm:px-10 sm:py-10">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
                <Megaphone className="w-3.5 h-3.5 text-orange-200" aria-hidden />
                Dwelly Updates
              </span>
              <h1 className="text-[34px] leading-[1.1] font-bold tracking-tight text-white">
                What&rsquo;s new across Dwelly
              </h1>
              <p className="text-[15px] text-white/70 max-w-[440px]">
                {unread > 0 ? `${unread} new ${unread === 1 ? 'update' : 'updates'} since you last looked.` : 'Every release and improvement \u2014 newest first.'}
              </p>
            </div>
            {showMarkAll && (
              <button
                type="button"
                onClick={onMarkAll}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[13px] font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/15 flex-shrink-0"
              >
                <CheckCheck className="w-4 h-4" aria-hidden />
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function UpdateDetail({ update }: { update: HubUpdate }) {
  return (
    <article className="card p-7 space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0071E3]">{fmtLong(update.date)}</p>
        <h2 className="text-xl font-semibold text-navy mt-1">{update.title}</h2>
        {update.intro && <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{update.intro}</p>}
      </div>

      {update.notes && update.notes.length > 0 && (
        <div className="space-y-2">
          {update.notes.map((note, i) => (
            <div key={i} className="rag-amber rounded-xl border px-4 py-3">
              <p className="text-sm leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {update.sections.map(section => (
          <div key={section.heading}>
            <h3 className="text-sm font-semibold text-navy">{section.heading}</h3>
            {section.intro && <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{section.intro}</p>}
            <ul className="mt-1.5 space-y-1.5">
              {section.items.map((item, i) => (
                <li key={i} className="text-sm text-[var(--text-secondary)]">
                  <div className="flex gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[#0071E3] flex-shrink-0" aria-hidden />
                    <span>{item.text}</span>
                  </div>
                  {item.children && item.children.length > 0 && (
                    <ul className="mt-1.5 ml-5 space-y-1">
                      {item.children.map((child, j) => (
                        <li key={j} className="flex gap-2 text-[var(--text-tertiary)]">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-navy-200 flex-shrink-0" aria-hidden />
                          <span>{child}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            {section.image && (
              <figure className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={section.image.src} alt={section.image.alt} className="w-full rounded-xl border border-navy-100" />
              </figure>
            )}
          </div>
        ))}
      </div>

      {update.links && update.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {update.links.map(link => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="btn-outline text-[13px]">
              <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      )}

      {update.videos && update.videos.length > 0 && (
        <div className="space-y-3 pt-1">
          {update.videos.map(video => (
            <figure key={video.src} className="space-y-1.5">
              <video src={video.src} controls preload="metadata" className="w-full rounded-xl border border-navy-100 bg-black" />
              {video.label && <figcaption className="text-xs text-[var(--text-tertiary)]">{video.label}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-tertiary)] pt-2 border-t border-navy-100">
        <Check className="w-3.5 h-3.5 text-[#1A7F37]" aria-hidden />
        Read
      </div>
    </article>
  )
}
