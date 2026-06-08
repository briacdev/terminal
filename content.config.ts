import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        titleFr: z.string().optional(),
        descriptionFr: z.string().optional(),
        date: z.union([z.string(), z.date()]).transform((value) => {
          if (typeof value === 'string') {
            return value
          }
          return value.toISOString().slice(0, 10)
        }),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        cover: z.string().optional(),
        coverAlt: z.string().optional(),
        coverAltFr: z.string().optional(),
        readingTime: z.string().optional()
      })
    }),

    roadmaps: defineCollection({
      type: 'page',
      source: 'roadmaps/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.union([z.string(), z.date()]).transform((value) => {
          if (typeof value === 'string') {
            return value
          }
          return value.toISOString().slice(0, 10)
        }),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        cover: z.string().optional(),
        readingTime: z.string().optional()
      })
    }),

    roadmapsFr: defineCollection({
      type: 'page',
      source: 'roadmaps-fr/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.union([z.string(), z.date()]).transform((value) => {
          if (typeof value === 'string') {
            return value
          }
          return value.toISOString().slice(0, 10)
        }),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        cover: z.string().optional(),
        readingTime: z.string().optional()
      })
    }),

    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()).default([]),
        stack: z.array(z.string()).default([]),
        year: z.number(),
        active: z.boolean().default(false),
        cover: z.string().optional(),
        links: z
          .object({
            repo: z.string().optional(),
            demo: z.string().optional()
          })
          .default({})
      })
    }),

    projectsFr: defineCollection({
      type: 'page',
      source: 'projects-fr/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()).default([]),
        stack: z.array(z.string()).default([]),
        year: z.number(),
        active: z.boolean().default(false),
        cover: z.string().optional(),
        links: z
          .object({
            repo: z.string().optional(),
            demo: z.string().optional()
          })
          .default({})
      })
    }),
    
    pages: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional()
      })
    })
  }
})
