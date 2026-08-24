export interface BlogPost {
  path: string
  title: string
  description: string
  titleFr?: string
  descriptionFr?: string
  date: string
  tags: string[]
  draft: boolean
  readingTime?: string
  cover?: string
  coverAlt?: string
  coverAltFr?: string
  body?: {
    toc?: {
      links?: Array<{
        id: string
        text: string
      }>
    }
  }
}

type RawBlogPost = BlogPost & Record<string, unknown>

const queryCollectionLoose = queryCollection as unknown as (collection: string) => {
  where: (field: string, operator: '=', value: boolean) => {
    order: (field: string, direction: 'DESC' | 'ASC') => {
      all: () => Promise<RawBlogPost[]>
    }
  }
}

const postSlugFromPath = (path: string) => path.replace(/^\/blog(?:-fr)?\//, '')

const localizePost = (post: RawBlogPost, override?: RawBlogPost): BlogPost => {
  const source = override || post
  const title = override
    ? source.title
    : source.titleFr || post.title
  const description = override
    ? source.description
    : source.descriptionFr || post.description

  return {
    ...post,
    ...override,
    path: post.path,
    title,
    description,
    tags: source.tags ?? post.tags ?? [],
    date: source.date || post.date,
    cover: source.cover || post.cover,
    readingTime: source.readingTime || post.readingTime
  }
}

export const usePosts = async (localeCode = 'en') => {
  const rawPosts = await queryCollection('posts')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all() as RawBlogPost[]

  if (localeCode !== 'fr') {
    return rawPosts
  }

  const rawPostsFr = await queryCollectionLoose('postsFr')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()

  const overridesBySlug = new Map(
    rawPostsFr.map((post) => [postSlugFromPath(post.path), post])
  )

  return rawPosts.map((post) => {
    const override = overridesBySlug.get(postSlugFromPath(post.path))
    return localizePost(post, override)
  })
}
