import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://briacd.com'

const githubToken = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.GITHUB_TOKEN || ''
const footerGithubUrl = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.FOOTER_GITHUB_URL || ''
const footerLinkedinUrl = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.FOOTER_LINKEDIN_URL || ''
const footerEmail = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.FOOTER_EMAIL || ''
const umamiWebsiteId = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.UMAMI_WEBSITE_ID || ''
const contentIntegrityCheck = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.NODE_ENV === 'production'

export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',
  devtools: { enabled: true },
  modules: [
    [
      '@nuxt/image',
      {
        quality: 80,
        format: ['webp', 'jpg'],
        screens: {
          xs: 320,
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280
        }
      }
    ],
    '@nuxt/ui',
    '@nuxt/content',
    [
      '@nuxtjs/i18n',
      {
        strategy: 'prefix_except_default',
        defaultLocale: 'en',
        detectBrowserLanguage: false,
        langDir: 'locales',
        locales: [
          { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
          { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' }
        ],
        compilation: {
          strictMessage: false
        }
      }
    ]
  ],
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()] as any
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      titleTemplate: '%s | Briac',
      meta: [
        {
          name: 'description',
          content: 'Freelance developer focused on secure, production-ready web systems and practical tooling.'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:site_name',
          content: 'Briac Blog'
        },
        {
          property: 'og:title',
          content: 'Briac Blog'
        },
        {
          property: 'og:description',
          content: 'Freelance developer focused on secure, production-ready web systems and practical tooling.'
        },
        {
          property: 'og:url',
          content: siteUrl
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      ],

      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'RSS Feed',
          href: '/rss.xml'
        }
      ],
      
      script: umamiWebsiteId
        ? [
            {
              defer: true,
              src: 'https://cloud.umami.is/script.js',
              'data-website-id': umamiWebsiteId
            }
          ]
        : []
    }
  },
  runtimeConfig: {
    content: {
      integrityCheck: contentIntegrityCheck
    },
    githubToken,
    public: {
      siteUrl,
      githubUsername: 'briacdev',
      footerGithubUrl,
      footerLinkedinUrl,
      footerEmail,
      umamiWebsiteId
    }
  },
  nitro: {
    prerender: {
      routes: ['/rss.xml', '/sitemap.xml', '/robots.txt']
    }
  }
})
