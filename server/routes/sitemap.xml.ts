import { queryCollection } from '@nuxt/content/server'

const ROADMAP_PREFIXES = ['java', 'spring-boot', 'seo'] as const

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const publicRoadmapPath = (path: string, locale: 'en' | 'fr') => {
  const prefix = locale === 'fr' ? '/fr' : ''

  for (const roadmap of ROADMAP_PREFIXES) {
    if (path.startsWith(`/roadmaps/${roadmap}/`)) {
      return `${prefix}/${roadmap}/${path.slice(`/roadmaps/${roadmap}/`.length)}`
    }
    if (path.startsWith(`/roadmaps-fr/${roadmap}/`)) {
      return `${prefix}/${roadmap}/${path.slice(`/roadmaps-fr/${roadmap}/`.length)}`
    }
    if (path.startsWith(`/${roadmap}/`)) {
      return `${prefix}${path}`
    }
  }

  return null
}

const slugOf = (publicPath: string) => {
  return publicPath.replace(/^\/fr/, '')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl

  const posts = await queryCollection(event, 'posts')
    .where('draft', '=', false)
    .all()

  const projects = await queryCollection(event, 'projects').all()
  const roadmaps = await queryCollection(event, 'roadmaps')
    .where('draft', '=', false)
    .all()
  const roadmapsFr = await queryCollection(event, 'roadmapsFr')
    .where('draft', '=', false)
    .all()

  const staticPairs: Array<{ en: string, fr: string }> = [
    { en: '/', fr: '/fr' },
    { en: '/blog', fr: '/fr/blog' },
    { en: '/projects', fr: '/fr/projects' },
    { en: '/about', fr: '/fr/about' },
    { en: '/roadmaps', fr: '/fr/roadmaps' },
    { en: '/java', fr: '/fr/java' },
    { en: '/spring-boot', fr: '/fr/spring-boot' },
    { en: '/postgresql', fr: '/fr/postgresql' },
    { en: '/vue-js', fr: '/fr/vue-js' },
    { en: '/nuxt', fr: '/fr/nuxt' },
    { en: '/ai', fr: '/fr/ai' },
    { en: '/seo', fr: '/fr/seo' }
  ]

  const roadmapBySlug = new Map<string, { en?: string, fr?: string }>()

  for (const item of roadmaps) {
    const enPath = publicRoadmapPath(item.path, 'en')
    if (!enPath) {
      continue
    }
    const key = slugOf(enPath)
    const current = roadmapBySlug.get(key) ?? {}
    current.en = enPath
    roadmapBySlug.set(key, current)
  }

  for (const item of roadmapsFr) {
    const frPath = publicRoadmapPath(item.path, 'fr')
    if (!frPath) {
      continue
    }
    const key = slugOf(frPath)
    const current = roadmapBySlug.get(key) ?? {}
    current.fr = frPath
    if (!current.en) {
      current.en = key
    }
    roadmapBySlug.set(key, current)
  }

  const hreflangUrl = (loc: string, enPath: string, frPath: string) => {
    const en = xmlEscape(`${siteUrl}${enPath === '/' ? '' : enPath}`)
    const fr = xmlEscape(`${siteUrl}${frPath}`)
    const self = xmlEscape(`${siteUrl}${loc === '/' ? '' : loc}`)
    return `<url><loc>${self}</loc><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="fr" href="${fr}"/><xhtml:link rel="alternate" hreflang="x-default" href="${en}"/><changefreq>weekly</changefreq></url>`
  }

  const entries: string[] = []

  for (const pair of staticPairs) {
    entries.push(hreflangUrl(pair.en, pair.en, pair.fr))
    entries.push(hreflangUrl(pair.fr, pair.en, pair.fr))
  }

  for (const pair of roadmapBySlug.values()) {
    if (!pair.en || !pair.fr) {
      continue
    }
    entries.push(hreflangUrl(pair.en, pair.en, pair.fr))
    entries.push(hreflangUrl(pair.fr, pair.en, pair.fr))
  }

  for (const post of posts) {
    entries.push(`<url><loc>${xmlEscape(`${siteUrl}${post.path}`)}</loc><changefreq>weekly</changefreq></url>`)
  }

  for (const project of projects) {
    entries.push(`<url><loc>${xmlEscape(`${siteUrl}${project.path}`)}</loc><changefreq>weekly</changefreq></url>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
