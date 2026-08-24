import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl

  const posts = await queryCollection(event, 'posts')
    .where('draft', '=', false)
    .all()

  const projects = await queryCollection(event, 'projects').all()

  const staticUrls = ['/', '/blog', '/projects', '/about', '/fr', '/fr/blog', '/fr/projects', '/fr/about']
  const contentUrls = [
    ...posts.map((post) => post.path),
    ...posts.map((post) => `/fr${post.path}`),
    ...projects.map((project) => project.path),
    ...projects.map((project) => `/fr${project.path}`)
  ]
  const urls = [...staticUrls, ...contentUrls]

  const entries = urls
    .map((path) => `<url><loc>${siteUrl}${path}</loc><changefreq>weekly</changefreq></url>`)
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
