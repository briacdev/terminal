import { useI18n } from '#i18n'
import { normalizeJavaRoadmapPath, sortJavaRoadmapItems } from '../data/java-roadmap'

export interface JavaRoadmapPost {
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
  where: (field: string, operator: '=', value: boolean) => { all: () => Promise<JavaRoadmapPost[]> }
}

export const useJavaRoadmaps = async () => {
  const { locale } = useI18n()

  const rawPosts = locale.value === 'fr'
    ? await queryCollectionLoose('roadmapsFr').where('draft', '=', false).all()
    : await queryCollection('roadmaps').where('draft', '=', false).all() as JavaRoadmapPost[]

  return sortJavaRoadmapItems(
    rawPosts
      .filter((post) =>
        post.path.startsWith('/java/') ||
        post.path.startsWith('/roadmaps/java/') ||
        post.path.startsWith('/roadmaps-fr/java/')
      )
      .map((post) => ({
        ...post,
        path: normalizeJavaRoadmapPath(post.path),
        tags: post.tags ?? []
      }))
  )
}
