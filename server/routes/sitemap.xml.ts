import { queryCollection } from '@nuxt/content/server'
import { vueRoadmapSteps } from '../../app/data/vue-roadmap'

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const localizedUrl = (siteUrl: string, locale: 'en' | 'fr', path: string) => {
  if (locale === 'fr') {
    return `${siteUrl}/fr${path}`
  }

  return `${siteUrl}${path}`
}

const bilingualEntry = (siteUrl: string, path: string) => {
  const enUrl = escapeXml(localizedUrl(siteUrl, 'en', path))
  const frUrl = escapeXml(localizedUrl(siteUrl, 'fr', path))

  return [
    `<url>`,
    `<loc>${enUrl}</loc>`,
    `<xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `<xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />`,
    `<changefreq>weekly</changefreq>`,
    `</url>`,
    `<url>`,
    `<loc>${frUrl}</loc>`,
    `<xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `<xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />`,
    `<changefreq>weekly</changefreq>`,
    `</url>`
  ].join('')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl

  const posts = await queryCollection(event, 'posts')
    .where('draft', '=', false)
    .all()

  const projects = await queryCollection(event, 'projects').all()

  const staticUrls = ['/', '/blog', '/projects', '/about']
  const contentUrls = [...posts.map((post) => post.path), ...projects.map((project) => project.path)]
  const legacyEntries = [...staticUrls, ...contentUrls]
    .map((path) => `<url><loc>${escapeXml(`${siteUrl}${path}`)}</loc><changefreq>weekly</changefreq></url>`)
    .join('')

  const vuePaths = ['/vue-js', ...vueRoadmapSteps.map((step) => `/vue-js/${step.slug}`)]
  const vueEntries = vuePaths.map((path) => bilingualEntry(siteUrl, path)).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${legacyEntries}${vueEntries}</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
