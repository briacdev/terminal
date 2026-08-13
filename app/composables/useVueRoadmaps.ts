import { useI18n } from '#i18n'
import { normalizeVueRoadmapPath, sortVueRoadmapItems } from '../data/vue-roadmap'

export interface VueRoadmapPost {
  path: string
  title: string
  description: string
  date: string
  tags: string[]
  draft: boolean
  readingTime?: string
  cover?: string
  body?: {
    toc?: {
      links?: Array<{
        id: string
        text: string
      }>
    }
  }
}

const queryCollectionLoose = queryCollection as unknown as (collection: string) => {
  path: (value: string) => { first: () => Promise<VueRoadmapPost | null> }
  where: (field: string, operator: '=', value: boolean) => { all: () => Promise<VueRoadmapPost[]> }
}

export const useVueRoadmaps = async () => {
  const { locale } = useI18n()

  const rawPosts = locale.value === 'fr'
    ? await queryCollectionLoose('roadmapsFr').where('draft', '=', false).all()
    : await queryCollection('roadmaps').where('draft', '=', false).all() as VueRoadmapPost[]

  return sortVueRoadmapItems(
    rawPosts
      .filter((post) =>
        post.path.startsWith('/vue-js/') ||
        post.path.startsWith('/roadmaps/vue-js/') ||
        post.path.startsWith('/roadmaps-fr/vue-js/')
      )
      .map((post) => ({
        ...post,
        path: normalizeVueRoadmapPath(post.path),
        tags: post.tags ?? []
      }))
  )
}

export const useVueRoadmapPost = async (slug: string[]) => {
  const { locale } = useI18n()
  const joinedSlug = slug.join('/')
  const path = `/vue-js/${joinedSlug}`
  const legacyEnPath = `/roadmaps/vue-js/${joinedSlug}`
  const legacyFrPath = `/roadmaps-fr/vue-js/${joinedSlug}`

  let post: VueRoadmapPost | null = null

  if (locale.value === 'fr') {
    post = await queryCollectionLoose('roadmapsFr').path(path).first()
    if (!post) {
      post = await queryCollectionLoose('roadmapsFr').path(legacyFrPath).first()
    }
  }

  if (!post) {
    post = await queryCollection('roadmaps').path(path).first() as VueRoadmapPost | null
    if (!post) {
      post = await queryCollection('roadmaps').path(legacyEnPath).first() as VueRoadmapPost | null
    }
  }

  return post
}
