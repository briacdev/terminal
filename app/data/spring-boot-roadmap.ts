export interface SpringBootRoadmapStepDefinition {
  id: number
  slug: string
  side: 'left' | 'right'
  readingTime: string
  date: string
  tags: string[]
  phase: {
    en: string
    fr: string
  }
  title: {
    en: string
    fr: string
  }
  description: {
    en: string
    fr: string
  }
  points: {
    en: string[]
    fr: string[]
  }
}

export const springBootRoadmapSteps: SpringBootRoadmapStepDefinition[] = [
  {
    id: 1,
    slug: 'spring-boot-fundamentals',
    side: 'left',
    readingTime: '9 min',
    date: '2026-03-12',
    tags: ['spring-boot', 'fundamentals', 'auto-configuration'],
    phase: { en: 'Foundations', fr: 'Fondations' },
    title: { en: 'Spring Boot Fundamentals', fr: 'Fondamentaux Spring Boot' },
    description: {
      en: 'Understand what Spring Boot adds on top of Spring: starters, auto-configuration, and a first runnable application.',
      fr: 'Comprendre ce que Spring Boot ajoute à Spring: starters, auto-configuration, et une première application exécutable.'
    },
    points: {
      en: ['Spring vs Spring Boot', 'Starters and auto-configuration', 'A minimal runnable app'],
      fr: ['Spring vs Spring Boot', 'Starters et auto-configuration', 'Une application minimale qui tourne']
    }
  },
  {
    id: 2,
    slug: 'project-setup',
    side: 'right',
    readingTime: '10 min',
    date: '2026-03-13',
    tags: ['spring-boot', 'setup', 'maven', 'gradle'],
    phase: { en: 'Foundations', fr: 'Fondations' },
    title: { en: 'Project Setup', fr: 'Initialisation du projet' },
    description: {
      en: 'Create a clean Spring Boot project with Initializr, standard folders, and a Maven or Gradle wrapper workflow.',
      fr: 'Créer un projet Spring Boot propre avec Initializr, une structure standard, et un wrapper Maven ou Gradle.'
    },
    points: {
      en: ['Spring Initializr workflow', 'Standard folder conventions', 'Maven or Gradle wrapper'],
      fr: ['Workflow Spring Initializr', 'Conventions de dossiers', 'Wrapper Maven ou Gradle']
    }
  },
  {
    id: 3,
    slug: 'dependency-injection-and-beans',
    side: 'left',
    readingTime: '11 min',
    date: '2026-03-14',
    tags: ['spring-boot', 'beans', 'dependency-injection'],
    phase: { en: 'Core', fr: 'Cœur' },
    title: { en: 'Dependency Injection and Beans', fr: 'Injection de dépendances et beans' },
    description: {
      en: 'Learn the Spring container: bean lifecycle, constructor injection, and when to write a configuration class.',
      fr: 'Apprendre le conteneur Spring: cycle de vie des beans, injection par constructeur, et classes de configuration.'
    },
    points: {
      en: ['Bean lifecycle', 'Constructor injection', 'Configuration classes'],
      fr: ['Cycle de vie des beans', 'Injection par constructeur', 'Classes de configuration']
    }
  },
  {
    id: 4,
    slug: 'configuration-and-profiles',
    side: 'right',
    readingTime: '10 min',
    date: '2026-03-15',
    tags: ['spring-boot', 'configuration', 'profiles'],
    phase: { en: 'Core', fr: 'Cœur' },
    title: { en: 'Configuration and Profiles', fr: 'Configuration et profils' },
    description: {
      en: 'Externalize Spring Boot settings with application.yml, local/staging/production profiles, and safe secret handling.',
      fr: 'Externaliser la configuration Spring Boot avec application.yml, des profils local/staging/production, et des secrets sûrs.'
    },
    points: {
      en: ['application.yml strategy', 'local/staging/production profiles', 'Secrets outside source control'],
      fr: ['Stratégie application.yml', 'Profils local/staging/production', 'Secrets hors du dépôt']
    }
  },
  {
    id: 5,
    slug: 'rest-controllers',
    side: 'left',
    readingTime: '11 min',
    date: '2026-03-16',
    tags: ['spring-boot', 'rest', 'api'],
    phase: { en: 'Web', fr: 'Web' },
    title: { en: 'REST Controllers', fr: 'Controllers REST' },
    description: {
      en: 'Build HTTP endpoints with Spring MVC: request mappings, request/response records, and correct status codes.',
      fr: 'Construire des endpoints HTTP avec Spring MVC: mappings, records requête/réponse, et statuts HTTP corrects.'
    },
    points: {
      en: ['Request mapping', 'Request and response records', 'HTTP status handling'],
      fr: ['Mapping des requêtes', 'Records de requête et de réponse', 'Gestion des statuts HTTP']
    }
  },
  {
    id: 6,
    slug: 'validation-and-error-handling',
    side: 'right',
    readingTime: '11 min',
    date: '2026-03-17',
    tags: ['spring-boot', 'validation', 'errors'],
    phase: { en: 'Web', fr: 'Web' },
    title: { en: 'Validation and Error Handling', fr: 'Validation et gestion des erreurs' },
    description: {
      en: 'Validate incoming payloads with Bean Validation and return one consistent API error contract from a global handler.',
      fr: 'Valider les payloads avec Bean Validation et renvoyer un contrat d\'erreur API unique via un handler global.'
    },
    points: {
      en: ['Bean Validation', 'Global exception handling', 'Consistent API error contracts'],
      fr: ['Bean Validation', 'Exception handling global', 'Contrats d\'erreur API cohérents']
    }
  },
  {
    id: 7,
    slug: 'layered-design',
    side: 'left',
    readingTime: '10 min',
    date: '2026-03-18',
    tags: ['spring-boot', 'architecture', 'dto'],
    phase: { en: 'Architecture', fr: 'Architecture' },
    title: { en: 'Layered Design', fr: 'Design en couches' },
    description: {
      en: 'Keep controllers thin, put business rules in services, and map DTOs so persistence models stay internal.',
      fr: 'Garder les controllers fins, placer les règles métier dans les services, et mapper des DTO sans exposer la persistance.'
    },
    points: {
      en: ['Controller, service, repository boundaries', 'Where business logic belongs', 'DTO mapping strategy'],
      fr: ['Frontières controller, service, repository', 'Où placer la logique métier', 'Stratégie de mapping DTO']
    }
  },
  {
    id: 8,
    slug: 'spring-data-jpa-basics',
    side: 'right',
    readingTime: '12 min',
    date: '2026-03-19',
    tags: ['spring-boot', 'jpa', 'persistence'],
    phase: { en: 'Data', fr: 'Données' },
    title: { en: 'Spring Data JPA Basics', fr: 'Bases Spring Data JPA' },
    description: {
      en: 'Persist data with Spring Data JPA: entities, repositories, CRUD methods, pagination, and query-method naming.',
      fr: 'Persister avec Spring Data JPA: entités, repositories, CRUD, pagination, et conventions de méthodes de requête.'
    },
    points: {
      en: ['Entities and repositories', 'CRUD and pagination', 'Query method conventions'],
      fr: ['Entités et repositories', 'CRUD et pagination', 'Conventions de méthodes de requête']
    }
  },
  {
    id: 9,
    slug: 'criteriabuilder-and-dynamic-queries',
    side: 'left',
    readingTime: '11 min',
    date: '2026-03-20',
    tags: ['spring-boot', 'jpa', 'specifications'],
    phase: { en: 'Data', fr: 'Données' },
    title: { en: 'CriteriaBuilder and Dynamic Queries', fr: 'CriteriaBuilder et requêtes dynamiques' },
    description: {
      en: 'Build type-safe, composable filters with CriteriaBuilder and Spring Data JPA Specifications when query methods are not enough.',
      fr: 'Construire des filtres type-safe et composables avec CriteriaBuilder et les Specifications JPA quand les query methods ne suffisent plus.'
    },
    points: {
      en: ['Type-safe predicates', 'Composable dynamic filters', 'Specification-style queries'],
      fr: ['Prédicats type-safe', 'Filtres dynamiques composables', 'Requêtes style Specification']
    }
  },
  {
    id: 10,
    slug: 'database-migrations',
    side: 'right',
    readingTime: '10 min',
    date: '2026-03-21',
    tags: ['spring-boot', 'flyway', 'migrations'],
    phase: { en: 'Data', fr: 'Données' },
    title: { en: 'Database Migrations', fr: 'Migrations de base de données' },
    description: {
      en: 'Version your schema with Flyway so local, staging, and production databases evolve in the same controlled order.',
      fr: 'Versionner le schéma avec Flyway pour que local, staging et production évoluent dans le même ordre contrôlé.'
    },
    points: {
      en: ['Flyway versioned scripts', 'Repeatable vs versioned migrations', 'Environment-safe schema changes'],
      fr: ['Scripts Flyway versionnés', 'Migrations versionnées vs répétables', 'Changements de schéma sûrs par environnement']
    }
  },
  {
    id: 11,
    slug: 'security-fundamentals',
    side: 'left',
    readingTime: '11 min',
    date: '2026-03-22',
    tags: ['spring-boot', 'security', 'spring-security'],
    phase: { en: 'Security', fr: 'Sécurité' },
    title: { en: 'Security Fundamentals', fr: 'Fondamentaux sécurité' },
    description: {
      en: 'Protect a Spring Boot API with Spring Security: authentication vs authorization, the filter chain, and endpoint rules.',
      fr: 'Protéger une API Spring Boot avec Spring Security: authentification vs autorisation, filter chain, et règles d\'endpoints.'
    },
    points: {
      en: ['Authentication vs authorization', 'Filter chain mental model', 'Endpoint protection rules'],
      fr: ['Authentification vs autorisation', 'Modèle mental de la filter chain', 'Règles de protection des endpoints']
    }
  },
  {
    id: 12,
    slug: 'jwt-and-api-key',
    side: 'right',
    readingTime: '11 min',
    date: '2026-03-23',
    tags: ['spring-boot', 'security', 'jwt', 'api-key'],
    phase: { en: 'Security', fr: 'Sécurité' },
    title: { en: 'JWT and API Key Approaches', fr: 'Approches JWT et API Key' },
    description: {
      en: 'Choose API authentication: JWT for user sessions, API keys for service-to-service calls, plus rotation and trade-offs.',
      fr: 'Choisir l\'authentification API: JWT pour les utilisateurs, clés API pour le service-to-service, rotation et compromis.'
    },
    points: {
      en: ['Token validation flow', 'API key rotation basics', 'When to pick JWT vs API keys'],
      fr: ['Flux de validation de token', 'Bases de rotation des clés API', 'Quand choisir JWT ou des clés API']
    }
  },
  {
    id: 13,
    slug: 'unit-testing',
    side: 'left',
    readingTime: '10 min',
    date: '2026-03-24',
    tags: ['spring-boot', 'testing', 'junit', 'mockito'],
    phase: { en: 'Testing', fr: 'Tests' },
    title: { en: 'Unit Testing', fr: 'Tests unitaires' },
    description: {
      en: 'Test Spring Boot services in isolation with JUnit 5, Mockito, and a Given/When/Then structure that stays readable.',
      fr: 'Tester les services Spring Boot isolément avec JUnit 5, Mockito, et une structure Given/When/Then lisible.'
    },
    points: {
      en: ['JUnit 5 structure', 'Mockito for collaborators', 'Given/When/Then style'],
      fr: ['Structure JUnit 5', 'Mockito pour les collaborateurs', 'Style Given/When/Then']
    }
  },
  {
    id: 14,
    slug: 'integration-testing',
    side: 'right',
    readingTime: '12 min',
    date: '2026-03-25',
    tags: ['spring-boot', 'testing', 'testcontainers'],
    phase: { en: 'Testing', fr: 'Tests' },
    title: { en: 'Integration Testing', fr: 'Tests d\'intégration' },
    description: {
      en: 'Prove the API and persistence stack together with MockMvc, @SpringBootTest, Testcontainers, and stable test data.',
      fr: 'Vérifier l\'API et la persistance ensemble avec MockMvc, @SpringBootTest, Testcontainers, et des données de test stables.'
    },
    points: {
      en: ['API and repository tests', 'Testcontainers setup', 'Stable test data strategy'],
      fr: ['Tests API et repository', 'Setup Testcontainers', 'Stratégie de données de test stables']
    }
  },
  {
    id: 15,
    slug: 'caching-strategy',
    side: 'left',
    readingTime: '10 min',
    date: '2026-03-26',
    tags: ['spring-boot', 'cache', 'performance'],
    phase: { en: 'Performance', fr: 'Performance' },
    title: { en: 'Caching Strategy', fr: 'Stratégie de cache' },
    description: {
      en: 'Speed up reads with Spring Cache: @Cacheable, TTL and eviction, and invalidation that stays correct after writes.',
      fr: 'Accélérer les lectures avec Spring Cache: @Cacheable, TTL et eviction, et une invalidation correcte après écriture.'
    },
    points: {
      en: ['Spring Cache abstraction', 'TTL and eviction', 'Cache invalidation after writes'],
      fr: ['Abstraction Spring Cache', 'TTL et eviction', 'Invalidation après écriture']
    }
  },
  {
    id: 16,
    slug: 'async-processing',
    side: 'right',
    readingTime: '10 min',
    date: '2026-03-27',
    tags: ['spring-boot', 'async', 'performance'],
    phase: { en: 'Performance', fr: 'Performance' },
    title: { en: 'Async Processing', fr: 'Traitements async' },
    description: {
      en: 'Offload slow work with @Async, a dedicated executor, and error handling that does not hide failures on another thread.',
      fr: 'Déporter le travail lent avec @Async, un executor dédié, et une gestion d\'erreurs visible hors du thread HTTP.'
    },
    points: {
      en: ['@Async basics', 'Executor thread pools', 'Async error handling'],
      fr: ['Bases de @Async', 'Pools de threads Executor', 'Gestion des erreurs async']
    }
  },
  {
    id: 17,
    slug: 'scheduled-jobs',
    side: 'left',
    readingTime: '9 min',
    date: '2026-03-28',
    tags: ['spring-boot', 'scheduling', 'jobs'],
    phase: { en: 'Performance', fr: 'Performance' },
    title: { en: 'Scheduled Jobs', fr: 'Tâches planifiées' },
    description: {
      en: 'Run background work with @Scheduled: cron vs fixed delay, overlap control, and idempotent jobs that survive retries.',
      fr: 'Exécuter du travail de fond avec @Scheduled: cron vs délai fixe, contrôle des chevauchements, et tâches idempotentes.'
    },
    points: {
      en: ['@Scheduled patterns', 'Cron vs fixed delay or rate', 'Idempotent background tasks'],
      fr: ['Patterns @Scheduled', 'Cron vs délai ou taux fixe', 'Tâches de fond idempotentes']
    }
  },
  {
    id: 18,
    slug: 'actuator-metrics-and-tracing',
    side: 'right',
    readingTime: '11 min',
    date: '2026-03-29',
    tags: ['spring-boot', 'actuator', 'observability'],
    phase: { en: 'Observability', fr: 'Observabilité' },
    title: { en: 'Actuator, Metrics and Tracing', fr: 'Actuator, métriques et tracing' },
    description: {
      en: 'Operate a Spring Boot app with Actuator health probes, Micrometer metrics, and request traces you can correlate.',
      fr: 'Opérer une app Spring Boot avec les probes Actuator, les métriques Micrometer, et des traces corrélables.'
    },
    points: {
      en: ['Health and readiness probes', 'Micrometer metrics', 'Trace correlation'],
      fr: ['Probes health et readiness', 'Métriques Micrometer', 'Corrélation des traces']
    }
  },
  {
    id: 19,
    slug: 'build-and-containerization',
    side: 'left',
    readingTime: '10 min',
    date: '2026-03-30',
    tags: ['spring-boot', 'docker', 'build'],
    phase: { en: 'Delivery', fr: 'Delivery' },
    title: { en: 'Build and Containerization', fr: 'Build et containerisation' },
    description: {
      en: 'Package a Spring Boot API as an executable jar, build a Docker image, and inject runtime configuration outside the image.',
      fr: 'Packager une API Spring Boot en jar exécutable, construire une image Docker, et injecter la config hors de l\'image.'
    },
    points: {
      en: ['Executable jars', 'Docker image strategy', 'Runtime configuration'],
      fr: ['Jars exécutables', 'Stratégie d\'image Docker', 'Configuration runtime']
    }
  },
  {
    id: 20,
    slug: 'ci-cd-pipeline',
    side: 'right',
    readingTime: '10 min',
    date: '2026-03-31',
    tags: ['spring-boot', 'ci-cd', 'delivery'],
    phase: { en: 'Delivery', fr: 'Delivery' },
    title: { en: 'CI/CD Pipeline', fr: 'Pipeline CI/CD' },
    description: {
      en: 'Ship Spring Boot with a pipeline that runs tests, publishes artifacts, and deploys progressively instead of hoping local builds match production.',
      fr: 'Livrer Spring Boot avec un pipeline qui teste, publie l\'artefact, et déploie progressivement au lieu de copier un build local.'
    },
    points: {
      en: ['Test quality gates', 'Artifact publishing', 'Progressive deployment'],
      fr: ['Quality gates de tests', 'Publication d\'artefacts', 'Déploiement progressif']
    }
  },
  {
    id: 21,
    slug: 'production-hardening',
    side: 'left',
    readingTime: '11 min',
    date: '2026-04-01',
    tags: ['spring-boot', 'production', 'operations'],
    phase: { en: 'Production', fr: 'Production' },
    title: { en: 'Production Hardening', fr: 'Durcissement production' },
    description: {
      en: 'Harden a live Spring Boot API: secure defaults, rollback, and an operational runbook for incidents.',
      fr: 'Durcir une API Spring Boot en production: defaults sûrs, rollback, et un runbook opérationnel en cas d\'incident.'
    },
    points: {
      en: ['Secure production defaults', 'Rollback strategy', 'Operational runbook mindset'],
      fr: ['Defaults production sécurisés', 'Stratégie de rollback', 'Mentalité runbook opérationnel']
    }
  }
]

export const normalizeSpringBootRoadmapPath = (value: string) => {
  if (value.startsWith('/spring-boot/')) {
    return value
  }

  if (value.startsWith('/roadmaps/spring-boot/')) {
    return value.replace('/roadmaps/spring-boot/', '/spring-boot/')
  }

  if (value.startsWith('/roadmaps-fr/spring-boot/')) {
    return value.replace('/roadmaps-fr/spring-boot/', '/spring-boot/')
  }

  return value
}

export const springBootRoadmapPathOrder = springBootRoadmapSteps.map((step) => `/spring-boot/${step.slug}`)

export const sortSpringBootRoadmapItems = <T extends { path: string }>(items: T[]) => {
  const order = new Map(springBootRoadmapPathOrder.map((path, index) => [path, index]))

  return [...items].sort((a, b) => {
    const left = order.get(normalizeSpringBootRoadmapPath(a.path)) ?? Number.MAX_SAFE_INTEGER
    const right = order.get(normalizeSpringBootRoadmapPath(b.path)) ?? Number.MAX_SAFE_INTEGER
    return left - right
  })
}

export const getSpringBootRoadmapStepBySlug = (slug: string) => {
  return springBootRoadmapSteps.find((step) => step.slug === slug) ?? null
}
