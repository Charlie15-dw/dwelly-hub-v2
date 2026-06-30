import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Megaphone } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import { hubUpdatesSorted } from '@/lib/updates'

export default async function UpdatesPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  const updates = hubUpdatesSorted()

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/hub" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-indigo-700 bg-indigo-100 border-indigo-200">
          <Megaphone className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Dwelly Updates</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            What&rsquo;s changing across Dwelly &mdash; newest first.
          </p>
        </div>
      </div>

      {updates.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-400">No updates yet. New releases will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map(update => {
            const dateLabel = new Date(update.date).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })
            return (
              <article key={update.id} className="card p-6 space-y-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-700">{dateLabel}</p>
                  <h2 className="text-lg font-bold text-navy mt-1">{update.title}</h2>
                  {update.intro && (
                    <p className="text-sm text-slate-600 mt-2">{update.intro}</p>
                  )}
                </div>

                <div className="space-y-4">
                  {update.sections.map(section => (
                    <div key={section.heading}>
                      <h3 className="text-sm font-semibold text-navy">{section.heading}</h3>
                      <ul className="mt-1.5 space-y-1">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-600">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

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
                        {video.label && (
                          <figcaption className="text-xs text-slate-400">{video.label}</figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
