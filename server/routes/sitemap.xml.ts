import { queryCollection } from '@nuxt/content/server'
import { javaRoadmapPathOrder } from '../../app/data/java-roadmap'
import { seoRoadmapPathOrder } from '../../app/data/seo-roadmap'

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const buildLocalizedEntry = (siteUrl: string, path: string) => {
  const enUrl = `${siteUrl}${path}`
  const frUrl = `${siteUrl}/fr${path}`

  return [
    '<url>',
    `<loc>${escapeXml(enUrl)}</loc>`,
    '<changefreq>weekly</changefreq>',
    `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />`,
    `<xhtml:link rel="alternate" hreflang="fr" href="${escapeXml(frUrl)}" />`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enUrl)}" />`,
    '</url>',
    '<url>',
    `<loc>${escapeXml(frUrl)}</loc>`,
    '<changefreq>weekly</changefreq>',
    `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />`,
    `<xhtml:link rel="alternate" hreflang="fr" href="${escapeXml(frUrl)}" />`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enUrl)}" />`,
    '</url>'
  ].join('')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl as string

  const posts = await queryCollection(event, 'posts')
    .where('draft', '=', false)
    .all()

  const projects = await queryCollection(event, 'projects').all()

  const staticPaths = ['/', '/blog', '/projects', '/about', '/roadmaps', '/java', '/seo', '/spring-boot']
  const blogPaths = posts.map((post) => post.path)
  const projectPaths = projects.map((project) => project.path)

  const entries = [
    ...staticPaths.map((path) => buildLocalizedEntry(siteUrl, path)),
    ...blogPaths.map((path) => `<url><loc>${escapeXml(`${siteUrl}${path}`)}</loc><changefreq>weekly</changefreq></url>`),
    ...projectPaths.map((path) => `<url><loc>${escapeXml(`${siteUrl}${path}`)}</loc><changefreq>weekly</changefreq></url>`),
    ...javaRoadmapPathOrder.map((path) => buildLocalizedEntry(siteUrl, path)),
    ...seoRoadmapPathOrder.map((path) => buildLocalizedEntry(siteUrl, path))
  ].join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
