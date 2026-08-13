import { useI18n } from '#i18n'
import { normalizePostgresqlRoadmapPath, sortPostgresqlRoadmapItems } from '../data/postgresql-roadmap'

export interface PostgresqlRoadmapPost {
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
  where: (field: string, operator: '=', value: boolean) => { all: () => Promise<PostgresqlRoadmapPost[]> }
}

export const usePostgresqlRoadmaps = async () => {
  const { locale } = useI18n()

  const rawPosts = locale.value === 'fr'
    ? await queryCollectionLoose('roadmapsFr').where('draft', '=', false).all()
    : await queryCollection('roadmaps').where('draft', '=', false).all() as PostgresqlRoadmapPost[]

  return sortPostgresqlRoadmapItems(
    rawPosts
      .filter((post) =>
        post.path.startsWith('/postgresql/') ||
        post.path.startsWith('/roadmaps/postgresql/') ||
        post.path.startsWith('/roadmaps-fr/postgresql/')
      )
      .map((post) => ({
        ...post,
        path: normalizePostgresqlRoadmapPath(post.path),
        tags: post.tags ?? []
      }))
  )
}
