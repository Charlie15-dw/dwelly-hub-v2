'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import type { HubUpdate } from '@/lib/updates'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatDateShort(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function UpdateContent({ update }: { update: HubUpdate }) {
  return (
    <article className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-700">
          {formatDate(update.date)}
        </p>
        <h2 className="text-lg font-bold text-navy mt-1">{update.title}</h2>
        {update.intro && <p className="text-sm text-slate-600 mt-2">{update.intro}</p>}
      </div>

      {update.notes && update.notes.length > 0 && (
        <div className="space-y-2">
          {update.notes.map((note, i) => (
            <div key={i} className="flex gap-2.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
              <span className="text-sm text-amber-900">{note}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {update.sections.map(section => (
          <div key={section.heading}>
            <h3 className="text-sm font-semibold text-navy">{section.heading}</h3>
            {section.intro && <p className="text-sm text-slate-500 mt-1">{section.intro}</p>}
            <ul className="mt-1.5 space-y-1.5">
              {section.items.map((item, i) => (
                <li key={i} className="text-sm text-slate-600">
                  <div className="flex gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" aria-hidden />
                    <span>{item.text}</span>
                  </div>
                  {item.children && item.children.length > 0 && (
                    <ul className="mt-1.5 ml-5 space-y-1">
                      {item.children.map((child, j) => (
                        <li key={j} className="flex gap-2 text-slate-500">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" aria-hidden />
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
                <img
                  src={section.image.src}
                  alt={section.image.alt}
                  className="w-full rounded-lg border border-slate-200"
                />
              </figure>
            )}
          </div>
        ))}
      </div>

      {update.links && update.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {update.links.map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
            >
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
              <video
                src={video.src}
                controls
                preload="metadata"
                className="w-full rounded-lg border border-slate-200 bg-black"
              />
              {video.label && <figcaption className="text-xs text-slate-400">{video.label}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </article>
  )
}

export default function UpdatesCarousel({ updates }: { updates: HubUpdate[] }) {
  const [active, setActive] = useState(0)
  const topRef = useRef<HTMLDivElement>(null)

  const count = updates.length
  const go = useCallback((i: number) => {
    setActive(Math.max(0, Math.min(count - 1, i)))
  }, [count])

  // Keyboard navigation.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') setActive(i => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setActive(i => Math.min(count - 1, i + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count])

  function jumpTo(i: number) {
    go(i)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (count === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm text-slate-400">No updates yet. New releases will appear here.</p>
      </div>
    )
  }

  const current = updates[active]
  const atStart = active === 0
  const atEnd = active === count - 1

  return (
    <div className="space-y-6">
      <div ref={topRef} className="scroll-mt-6 space-y-3">
        {/* Navigation bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(active - 1)}
            disabled={atStart}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden />
            Newer
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Update {active + 1} of {count}</span>
            <div className="flex gap-1.5">
              {updates.map((u, i) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to update ${i + 1}`}
                  aria-current={i === active}
                  className={`w-2 h-2 rounded-full transition ${i === active ? 'bg-indigo-600' : 'bg-slate-300 hover:bg-slate-400'}`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(active + 1)}
            disabled={atEnd}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Older
            <ChevronRight className="w-4 h-4" aria-hidden />
          </button>
        </div>

        <div className="card p-6 min-h-[200px]">
          <UpdateContent update={current} />
        </div>
      </div>

      {/* Quick links */}
      <div className="border-t border-slate-100 pt-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Jump to an update</p>
        <ul className="space-y-1.5">
          {updates.map((u, i) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                className={`w-full text-left flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition border ${
                  i === active
                    ? 'bg-indigo-50 border-indigo-200 text-navy font-medium'
                    : 'border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{u.title}</span>
                <span className="text-xs text-slate-400 flex-shrink-0">{formatDateShort(u.date)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
