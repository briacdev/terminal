export interface JavaRoadmapStepDefinition {
  id: number
  slug: string
  side: 'left' | 'right'
  phase: {
    en: string
    fr: string
  }
  title: {
    en: string
    fr: string
  }
  points: {
    en: string[]
    fr: string[]
  }
}

export const javaRoadmapSteps: JavaRoadmapStepDefinition[] = [
  {
    id: 1,
    slug: 'java-ecosystem-and-versioning-basics',
    side: 'right',
    phase: { en: 'Foundations', fr: 'Fondations' },
    title: {
      en: 'Java Origins, Versions and LTS',
      fr: 'Origines de Java, versions et LTS'
    },
    points: {
      en: [
        'History of Java and JVM ecosystem',
        'Release cadence and versioning model',
        'What LTS means and when to upgrade',
        'Current Java language state',
        'Where Java is used (software, backend, Android)'
      ],
      fr: [
        'Histoire de Java et écosystème JVM',
        'Cadence des releases et modèle de versioning',
        'Ce que signifie LTS et quand migrer',
        'État actuel du langage Java',
        'Où Java est utilisé (logiciels, backend, Android)'
      ]
    }
  },
  {
    id: 2,
    slug: 'install-jdk-and-tooling',
    side: 'left',
    phase: { en: 'Foundations', fr: 'Fondations' },
    title: {
      en: 'Install JDK and Tooling',
      fr: 'Installer le JDK et l’outillage'
    },
    points: {
      en: ['Install JDK 21+', 'Set JAVA_HOME/PATH', 'Use IntelliJ or VS Code'],
      fr: ['Installer JDK 21+', 'Configurer JAVA_HOME/PATH', 'Utiliser IntelliJ ou VS Code']
    }
  },
  {
    id: 3,
    slug: 'core-syntax-jvm-jdk-jre-mental-model',
    side: 'right',
    phase: { en: 'Core Syntax', fr: 'Syntaxe cœur' },
    title: {
      en: 'JVM, JDK, JRE Mental Model',
      fr: 'Modèle mental JVM, JDK, JRE'
    },
    points: {
      en: ['How bytecode works', 'Class loading basics', 'Compilation vs runtime'],
      fr: ['Fonctionnement du bytecode', 'Bases du class loading', 'Compilation vs exécution']
    }
  },
  {
    id: 4,
    slug: 'language-basics-variables-types-operators',
    side: 'left',
    phase: { en: 'Language Basics', fr: 'Bases du langage' },
    title: {
      en: 'Variables, Types, Operators',
      fr: 'Variables, types, opérateurs'
    },
    points: {
      en: ['Primitives vs wrappers', 'Type casting', 'Arithmetic and logical ops'],
      fr: ['Primitifs vs wrappers', 'Cast de types', 'Opérateurs arithmétiques et logiques']
    }
  },
  {
    id: 5,
    slug: 'language-basics-control-flow',
    side: 'right',
    phase: { en: 'Language Basics', fr: 'Bases du langage' },
    title: {
      en: 'Control Flow',
      fr: 'Contrôle de flux'
    },
    points: {
      en: ['if/else, switch', 'for/while/do-while', 'break, continue, return'],
      fr: ['if/else, switch', 'for/while/do-while', 'break, continue, return']
    }
  },
  {
    id: 6,
    slug: 'language-basics-methods-and-parameters',
    side: 'left',
    phase: { en: 'Language Basics', fr: 'Bases du langage' },
    title: {
      en: 'Methods and Parameters',
      fr: 'Méthodes et paramètres'
    },
    points: {
      en: ['Method signatures', 'Pass-by-value behavior', 'Overloading'],
      fr: ['Signatures de méthodes', 'Sémantique pass-by-value', 'Surcharge (overloading)']
    }
  },
  {
    id: 7,
    slug: 'oop-classes-and-objects',
    side: 'right',
    phase: { en: 'OOP', fr: 'POO' },
    title: {
      en: 'Classes and Objects',
      fr: 'Classes et objets'
    },
    points: {
      en: ['Fields and constructors', 'Instance vs static members', 'Encapsulation'],
      fr: ['Champs et constructeurs', 'Membres instance vs static', 'Encapsulation']
    }
  },
  {
    id: 8,
    slug: 'oop-inheritance-and-polymorphism',
    side: 'left',
    phase: { en: 'OOP', fr: 'POO' },
    title: {
      en: 'Inheritance and Polymorphism',
      fr: 'Héritage et polymorphisme'
    },
    points: {
      en: ['extends, super', 'Method overriding', 'Dynamic dispatch'],
      fr: ['extends, super', 'Redéfinition de méthodes', 'Dispatch dynamique']
    }
  },
  {
    id: 9,
    slug: 'oop-interfaces-and-abstract-classes',
    side: 'right',
    phase: { en: 'OOP', fr: 'POO' },
    title: {
      en: 'Interfaces and Abstract Classes',
      fr: 'Interfaces et classes abstraites'
    },
    points: {
      en: ['Contract-first design', 'Default/static methods', 'Composition over inheritance'],
      fr: ['Design contract-first', 'Méthodes default/static', 'Composition plutôt que héritage']
    }
  },
  {
    id: 10,
    slug: 'error-handling-exceptions',
    side: 'left',
    phase: { en: 'Error Handling', fr: 'Gestion des erreurs' },
    title: {
      en: 'Exceptions',
      fr: 'Exceptions'
    },
    points: {
      en: ['Checked vs unchecked', 'try/catch/finally', 'Custom exception types'],
      fr: ['Checked vs unchecked', 'try/catch/finally', 'Types d’exceptions personnalisées']
    }
  },
  {
    id: 11,
    slug: 'core-apis-strings-and-datetime',
    side: 'right',
    phase: { en: 'Core APIs', fr: 'APIs cœur' },
    title: {
      en: 'Strings and Date/Time',
      fr: 'Strings et Date/Time'
    },
    points: {
      en: ['StringBuilder, immutability', 'java.time API', 'Formatting and parsing'],
      fr: ['StringBuilder, immutabilité', 'API java.time', 'Formatage et parsing']
    }
  },
  {
    id: 12,
    slug: 'core-apis-collections-fundamentals',
    side: 'left',
    phase: { en: 'Core APIs', fr: 'APIs cœur' },
    title: {
      en: 'Collections Fundamentals',
      fr: 'Fondamentaux des collections'
    },
    points: {
      en: ['List, Set, Map', 'When to use each', 'Big-O basics'],
      fr: ['List, Set, Map', 'Quand utiliser chaque structure', 'Bases de complexité Big-O']
    }
  },
  {
    id: 13,
    slug: 'core-apis-generics',
    side: 'right',
    phase: { en: 'Core APIs', fr: 'APIs cœur' },
    title: {
      en: 'Generics',
      fr: 'Génériques'
    },
    points: {
      en: ['Type parameters', 'Wildcards ? extends/super', 'Generic methods'],
      fr: ['Paramètres de type', 'Wildcards ? extends/super', 'Méthodes génériques']
    }
  },
  {
    id: 14,
    slug: 'core-apis-enum-record-sealed-classes',
    side: 'left',
    phase: { en: 'Core APIs', fr: 'APIs cœur' },
    title: {
      en: 'Enum, Record, Sealed Classes',
      fr: 'Enum, Record, Sealed Classes'
    },
    points: {
      en: ['Model finite states', 'Immutable DTOs with record', 'Restrict inheritance'],
      fr: ['Modéliser des états finis', 'DTO immuables avec record', 'Restreindre l’héritage']
    }
  },
  {
    id: 15,
    slug: 'functional-java-lambdas-and-functional-interfaces',
    side: 'right',
    phase: { en: 'Functional Java', fr: 'Java fonctionnel' },
    title: {
      en: 'Lambdas and Functional Interfaces',
      fr: 'Lambdas et interfaces fonctionnelles'
    },
    points: {
      en: ['Predicate, Function, Consumer', 'Method references', 'Higher-order style'],
      fr: ['Predicate, Function, Consumer', 'Références de méthodes', 'Style higher-order']
    }
  },
  {
    id: 16,
    slug: 'functional-java-streams',
    side: 'left',
    phase: { en: 'Functional Java', fr: 'Java fonctionnel' },
    title: {
      en: 'Streams',
      fr: 'Streams'
    },
    points: {
      en: ['map/filter/reduce', 'Collectors', 'Avoid overusing streams'],
      fr: ['map/filter/reduce', 'Collectors', 'Éviter la sur-utilisation des streams']
    }
  },
  {
    id: 17,
    slug: 'functional-java-optional',
    side: 'right',
    phase: { en: 'Functional Java', fr: 'Java fonctionnel' },
    title: {
      en: 'Optional',
      fr: 'Optional'
    },
    points: {
      en: ['Null-safe flow', 'map/flatMap/orElse', 'API boundaries best practices'],
      fr: ['Flux null-safe', 'map/flatMap/orElse', 'Bonnes pratiques aux frontières d’API']
    }
  },
  {
    id: 18,
    slug: 'io-files-paths-nio2',
    side: 'left',
    phase: { en: 'I/O', fr: 'I/O' },
    title: {
      en: 'Files, Paths, NIO.2',
      fr: 'Fichiers, Paths, NIO.2'
    },
    points: {
      en: ['Read/write files', 'Directory traversal', 'Buffered APIs'],
      fr: ['Lire/écrire des fichiers', 'Parcours de répertoires', 'APIs bufferisées']
    }
  },
  {
    id: 19,
    slug: 'concurrency-threads-and-synchronization',
    side: 'right',
    phase: { en: 'Concurrency', fr: 'Concurrence' },
    title: {
      en: 'Threads and Synchronization',
      fr: 'Threads et synchronisation'
    },
    points: {
      en: ['Thread lifecycle', 'synchronized and locks', 'Race conditions'],
      fr: ['Cycle de vie des threads', 'synchronized et locks', 'Race conditions']
    }
  },
  {
    id: 20,
    slug: 'concurrency-executorservice',
    side: 'left',
    phase: { en: 'Concurrency', fr: 'Concurrence' },
    title: {
      en: 'ExecutorService',
      fr: 'ExecutorService'
    },
    points: {
      en: ['Thread pools', 'Callable/Future', 'Graceful shutdown'],
      fr: ['Pools de threads', 'Callable/Future', 'Arrêt propre (graceful shutdown)']
    }
  },
  {
    id: 21,
    slug: 'concurrency-completablefuture',
    side: 'right',
    phase: { en: 'Concurrency', fr: 'Concurrence' },
    title: {
      en: 'CompletableFuture',
      fr: 'CompletableFuture'
    },
    points: {
      en: ['Async pipelines', 'Error handling', 'Composing async tasks'],
      fr: ['Pipelines asynchrones', 'Gestion des erreurs', 'Composition de tâches async']
    }
  },
  {
    id: 22,
    slug: 'build-tooling-maven-or-gradle',
    side: 'left',
    phase: { en: 'Build Tooling', fr: 'Outils de build' },
    title: {
      en: 'Maven or Gradle',
      fr: 'Maven ou Gradle'
    },
    points: {
      en: ['Dependency scopes', 'Plugins and lifecycle', 'Profiles'],
      fr: ['Scopes de dépendances', 'Plugins et cycle de vie', 'Profils']
    }
  },
  {
    id: 23,
    slug: 'data-sql-fundamentals',
    side: 'right',
    phase: { en: 'Data', fr: 'Données' },
    title: {
      en: 'SQL Fundamentals',
      fr: 'Fondamentaux SQL'
    },
    points: {
      en: ['Joins and indexes', 'Transactions', 'Query optimization basics'],
      fr: ['Joins et index', 'Transactions', 'Bases d’optimisation de requêtes']
    }
  },
  {
    id: 24,
    slug: 'data-jdbc',
    side: 'left',
    phase: { en: 'Data', fr: 'Données' },
    title: {
      en: 'JDBC',
      fr: 'JDBC'
    },
    points: {
      en: ['Connections and statements', 'Prepared statements', 'Mapping results'],
      fr: ['Connexions et statements', 'Prepared statements', 'Mapping des résultats']
    }
  },
  {
    id: 25,
    slug: 'data-jpa-hibernate',
    side: 'right',
    phase: { en: 'Data', fr: 'Données' },
    title: {
      en: 'JPA/Hibernate',
      fr: 'JPA/Hibernate'
    },
    points: {
      en: ['Entity mapping', 'Lazy vs eager loading', 'N+1 and transaction boundaries'],
      fr: ['Mapping d’entités', 'Lazy vs eager loading', 'N+1 et frontières transactionnelles']
    }
  },
  {
    id: 26,
    slug: 'backend-api-essentials',
    side: 'left',
    phase: { en: 'Backend', fr: 'Backend' },
    title: {
      en: 'Backend API Essentials',
      fr: 'Essentiels API backend'
    },
    points: {
      en: ['Layered architecture', 'Configuration and validation', 'Error handling contracts'],
      fr: ['Architecture en couches', 'Configuration et validation', 'Contrats de gestion d’erreurs']
    }
  },
  {
    id: 27,
    slug: 'security-application-security-basics',
    side: 'right',
    phase: { en: 'Security', fr: 'Sécurité' },
    title: {
      en: 'Application Security Basics',
      fr: 'Bases de la sécurité applicative'
    },
    points: {
      en: ['AuthN/AuthZ concepts', 'Token/session approaches', 'Endpoint hardening'],
      fr: ['Concepts AuthN/AuthZ', 'Approches token/session', 'Durcissement des endpoints']
    }
  },
  {
    id: 28,
    slug: 'testing-junit5-mockito',
    side: 'left',
    phase: { en: 'Testing', fr: 'Tests' },
    title: {
      en: 'JUnit 5 + Mockito',
      fr: 'JUnit 5 + Mockito'
    },
    points: {
      en: ['Unit tests', 'Mocks and stubs', 'Test naming and structure'],
      fr: ['Tests unitaires', 'Mocks et stubs', 'Nommage et structure des tests']
    }
  },
  {
    id: 29,
    slug: 'delivery-docker-cicd',
    side: 'right',
    phase: { en: 'Delivery', fr: 'Livraison' },
    title: {
      en: 'Docker + CI/CD',
      fr: 'Docker + CI/CD'
    },
    points: {
      en: ['Containerize app', 'Build pipelines', 'Deploy strategies'],
      fr: ['Containeriser l’application', 'Pipelines de build', 'Stratégies de déploiement']
    }
  },
  {
    id: 30,
    slug: 'production-observability-and-performance',
    side: 'left',
    phase: { en: 'Production', fr: 'Production' },
    title: {
      en: 'Observability and Performance',
      fr: 'Observabilité et performance'
    },
    points: {
      en: ['Structured logs', 'Metrics and tracing', 'Profiling and tuning'],
      fr: ['Logs structurés', 'Métriques et tracing', 'Profiling et tuning']
    }
  }
]

export const normalizeJavaRoadmapPath = (value: string) => {
  if (value.startsWith('/java/')) {
    return value
  }

  if (value.startsWith('/roadmaps/java/')) {
    return value.replace('/roadmaps/java/', '/java/')
  }

  if (value.startsWith('/roadmaps-fr/java/')) {
    return value.replace('/roadmaps-fr/java/', '/java/')
  }

  return value
}

export const javaRoadmapPathOrder = javaRoadmapSteps.map((step) => `/java/${step.slug}`)

export const javaRoadmapStepBySlug = new Map(
  javaRoadmapSteps.map((step) => [step.slug, step])
)

export const getJavaRoadmapStepByPath = (path: string) => {
  const normalized = normalizeJavaRoadmapPath(path)
  const slug = normalized.replace(/^\/java\//, '')
  return javaRoadmapStepBySlug.get(slug) ?? null
}

export const sortJavaRoadmapItems = <T extends { path: string }>(items: T[]) => {
  const order = new Map(javaRoadmapPathOrder.map((path, index) => [path, index]))

  return [...items].sort((a, b) => {
    const left = order.get(normalizeJavaRoadmapPath(a.path)) ?? Number.MAX_SAFE_INTEGER
    const right = order.get(normalizeJavaRoadmapPath(b.path)) ?? Number.MAX_SAFE_INTEGER
    return left - right
  })
}
