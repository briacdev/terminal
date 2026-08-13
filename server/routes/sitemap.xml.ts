import { queryCollection } from '@nuxt/content/server'

const siteUrlFromConfig = (siteUrl: string) => siteUrl.replace(/\/$/, '')

const normalizeRoadmapPath = (path: string) => {
  const replacements: Array<[string, string]> = [
    ['/roadmaps/postgresql/', '/postgresql/'],
    ['/roadmaps-fr/postgresql/', '/postgresql/'],
    ['/roadmaps/java/', '/java/'],
    ['/roadmaps-fr/java/', '/java/'],
    ['/roadmaps/seo/', '/seo/'],
    ['/roadmaps-fr/seo/', '/seo/'],
    ['/roadmaps/spring-boot/', '/spring-boot/'],
    ['/roadmaps-fr/spring-boot/', '/spring-boot/']
  ]

  for (const [from, to] of replacements) {
    if (path.startsWith(from)) {
      return path.replace(from, to)
    }
  }

  return path
}

const xmlEscape = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const urlEntry = (loc: string, alternates?: { en: string; fr: string }) => {
  const links = alternates
    ? [
        `<xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(alternates.en)}" />`,
        `<xhtml:link rel="alternate" hreflang="fr" href="${xmlEscape(alternates.fr)}" />`,
        `<xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(alternates.en)}" />`
      ].join('')
    : ''

  return `<url><loc>${xmlEscape(loc)}</loc>${links}<changefreq>weekly</changefreq></url>`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = siteUrlFromConfig(config.public.siteUrl)

  const posts = await queryCollection(event, 'posts')
    .where('draft', '=', false)
    .all()

  const projects = await queryCollection(event, 'projects').all()
  const roadmapsEn = await queryCollection(event, 'roadmaps').where('draft', '=', false).all()
  const roadmapsFr = await queryCollection(event, 'roadmapsFr').where('draft', '=', false).all()

  const bilingualIndexes = [
    '/',
    '/blog',
    '/projects',
    '/about',
    '/roadmaps',
    '/postgresql',
    '/java',
    '/seo',
    '/spring-boot',
    '/vue-js',
    '/nuxt',
    '/ai'
  ]

  const unique = (paths: string[]) => [...new Set(paths)]

  const entries = [
    ...bilingualIndexes.map((path) => {
      const en = `${siteUrl}${path === '/' ? '' : path}`
      const fr = `${siteUrl}/fr${path === '/' ? '' : path}`
      return urlEntry(en, { en, fr })
    }),
    ...unique(posts.map((post) => post.path)).map((path) => urlEntry(`${siteUrl}${path}`)),
    ...unique(projects.map((project) => project.path)).map((path) => urlEntry(`${siteUrl}${path}`)),
    ...unique(roadmapsEn.map((item) => normalizeRoadmapPath(item.path))).map((path) => {
      const en = `${siteUrl}${path}`
      const fr = `${siteUrl}/fr${path}`
      return urlEntry(en, { en, fr })
    }),
    ...unique(roadmapsFr.map((item) => `/fr${normalizeRoadmapPath(item.path)}`)).map((path) => {
      const publicPath = path.replace(/^\/fr/, '') || '/'
      const en = `${siteUrl}${publicPath}`
      const fr = `${siteUrl}${path}`
      return urlEntry(fr, { en, fr })
    })
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
