const BODY = [
  'User-Agent: *',
  'Allow: /',
  'Disallow: /api/',
  'Disallow: /consent',
  'Disallow: /cookies',
  'Disallow: /agreement',
  '',
  'Sitemap: https://interclinics.ru/sitemap.xml',
].join('\n')

export const dynamic = 'force-static'

export function GET() {
  return new Response(BODY, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
