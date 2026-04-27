export interface ProjectItem {
  path: string
  title: string
  description: string
  tags: string[]
  stack: string[]
  year: number
  active: boolean
  cover?: string
  body?: {
    toc?: {
      links?: Array<{
        id: string
        text: string
      }>
    }
  }
  links?: {
    repo?: string
    demo?: string
  }
}

type RawProjectRecord = ProjectItem & Record<string, unknown>

const queryCollectionLoose = queryCollection as unknown as (collection: string) => {
  all: () => Promise<RawProjectRecord[]>
}

const projectSlugFromPath = (path: string) => path.replace(/^\/projects(?:-fr)?\//, '')

const normalizeProject = (project: RawProjectRecord, override?: RawProjectRecord): ProjectItem => {
  const source = override || project
  const stack = Array.isArray(source.stack)
    ? source.stack.filter((item): item is string => typeof item === 'string')
    : []
  const active = typeof source.active === 'boolean' ? source.active : false

  return {
    ...project,
    ...override,
    path: project.path,
    tags: source.tags ?? [],
    stack,
    active
  }
}

export const useProjects = async (localeCode = 'en') => {
  const rawProjects = await queryCollection('projects')
    .order('year', 'DESC')
    .all()

  if (localeCode !== 'fr') {
    return rawProjects.map((project) => normalizeProject(project as unknown as RawProjectRecord))
  }

  const rawProjectsFr = await queryCollectionLoose('projectsFr').all()
  const overridesBySlug = new Map(
    rawProjectsFr.map((project) => [projectSlugFromPath(project.path), project])
  )

  const projects: ProjectItem[] = rawProjects.map((project) => {
    const englishProject = project as unknown as RawProjectRecord
    const override = overridesBySlug.get(projectSlugFromPath(project.path))
    return normalizeProject(englishProject, override)
  })

  return projects
}
