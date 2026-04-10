import { getSitemapEntries } from '@/lib/sitemap-entries'

const URLSET_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Статическая выдача на билде — тот же смысл, что у прежнего `app/sitemap.ts`. */
export const dynamic = 'force-static'

export function GET() {
  const entries = getSitemapEntries()
  const parts: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${URLSET_NS}">`,
  ]

  for (const e of entries) {
    const loc = escapeXml(e.loc.replace(/\s+/g, ''))
    const pr = e.priority.toFixed(1)
    parts.push(
      `<url><loc>${loc}</loc><changefreq>${e.changefreq}</changefreq><priority>${pr}</priority></url>`
    )
  }

  parts.push('</urlset>')
  const body = parts.join('\n')

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
