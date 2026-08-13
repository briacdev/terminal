import { useI18n } from '#i18n'
import { normalizeSpringBootRoadmapPath, sortSpringBootRoadmapItems } from '../data/spring-boot-roadmap'

export interface SpringBootRoadmapPost {
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
  path: (value: string) => { first: () => Promise<SpringBootRoadmapPost | null> }
  where: (field: string, operator: '=', value: boolean) => { all: () => Promise<SpringBootRoadmapPost[]> }
}

export const useSpringBootRoadmaps = async () => {
  const { locale } = useI18n()

  const rawPosts = locale.value === 'fr'
    ? await queryCollectionLoose('roadmapsFr').where('draft', '=', false).all()
    : await queryCollection('roadmaps').where('draft', '=', false).all() as SpringBootRoadmapPost[]

  return sortSpringBootRoadmapItems(
    rawPosts
      .filter((post) =>
        post.path.startsWith('/spring-boot/') ||
        post.path.startsWith('/roadmaps/spring-boot/') ||
        post.path.startsWith('/roadmaps-fr/spring-boot/')
      )
      .map((post) => ({
        ...post,
        path: normalizeSpringBootRoadmapPath(post.path),
        tags: post.tags ?? []
      }))
  )
}

export const useSpringBootRoadmapPost = async (slug: string[]) => {
  const { locale } = useI18n()
  const path = `/spring-boot/${slug.join('/')}`
  const legacyEnPath = `/roadmaps/spring-boot/${slug.join('/')}`
  const legacyFrPath = `/roadmaps-fr/spring-boot/${slug.join('/')}`

  let post: SpringBootRoadmapPost | null = null

  if (locale.value === 'fr') {
    post = await queryCollectionLoose('roadmapsFr').path(path).first()
    if (!post) {
      post = await queryCollectionLoose('roadmapsFr').path(legacyFrPath).first()
    }
  }

  if (!post) {
    post = await queryCollection('roadmaps').path(path).first() as SpringBootRoadmapPost | null
    if (!post) {
      post = await queryCollection('roadmaps').path(legacyEnPath).first() as SpringBootRoadmapPost | null
    }
  }

  return post
}
