export interface PostgresqlRoadmapStepDefinition {
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

export const postgresqlRoadmapSteps: PostgresqlRoadmapStepDefinition[] = [
  {
    id: 1,
    slug: 'postgresql-fundamentals',
    side: 'left',
    phase: { en: 'Foundations', fr: 'Fondations' },
    title: {
      en: 'PostgreSQL Fundamentals',
      fr: 'Fondamentaux PostgreSQL'
    },
    points: {
      en: ['What PostgreSQL is', 'When to choose it', 'How the ecosystem fits together'],
      fr: ['Ce qu’est PostgreSQL', 'Quand le choisir', 'Comment l’écosystème s’articule']
    }
  },
  {
    id: 2,
    slug: 'install-and-connect',
    side: 'right',
    phase: { en: 'Foundations', fr: 'Fondations' },
    title: {
      en: 'Install PostgreSQL and Connect',
      fr: 'Installer PostgreSQL et se connecter'
    },
    points: {
      en: ['Install a local server', 'Create a role and a database', 'Connect with psql and a GUI'],
      fr: ['Installer un serveur local', 'Créer un rôle et une base', 'Se connecter avec psql et une GUI']
    }
  },
  {
    id: 3,
    slug: 'databases-roles-and-schemas',
    side: 'left',
    phase: { en: 'Foundations', fr: 'Fondations' },
    title: {
      en: 'Databases, Roles, and Schemas',
      fr: 'Bases, rôles et schémas'
    },
    points: {
      en: ['Separate databases from schemas', 'Use search_path deliberately', 'Adopt stable naming conventions'],
      fr: ['Séparer bases et schémas', 'Utiliser search_path volontairement', 'Adopter des conventions de nommage stables']
    }
  },
  {
    id: 4,
    slug: 'data-types-for-applications',
    side: 'right',
    phase: { en: 'Modeling', fr: 'Modélisation' },
    title: {
      en: 'Data Types for Applications',
      fr: 'Types de données pour les applications'
    },
    points: {
      en: ['Pick types for real app data', 'Prefer identity over serial', 'Avoid vague catch-all columns'],
      fr: ['Choisir les types pour de vraies données', 'Préférer identity à serial', 'Éviter les colonnes fourre-tout']
    }
  },
  {
    id: 5,
    slug: 'constraints-and-keys',
    side: 'left',
    phase: { en: 'Modeling', fr: 'Modélisation' },
    title: {
      en: 'Constraints and Keys',
      fr: 'Contraintes et clés'
    },
    points: {
      en: ['NOT NULL, UNIQUE, and CHECK', 'Primary and foreign keys', 'Protect data at the database layer'],
      fr: ['NOT NULL, UNIQUE et CHECK', 'Clés primaires et étrangères', 'Protéger les données côté base']
    }
  },
  {
    id: 6,
    slug: 'table-design-and-relationships',
    side: 'right',
    phase: { en: 'Modeling', fr: 'Modélisation' },
    title: {
      en: 'Table Design and Relationships',
      fr: 'Conception des tables et relations'
    },
    points: {
      en: ['Normalize without overdoing it', 'Model one-to-many and many-to-many', 'Choose surrogate vs natural keys'],
      fr: ['Normaliser sans en faire trop', 'Modéliser one-to-many et many-to-many', 'Choisir clés techniques vs naturelles']
    }
  },
  {
    id: 7,
    slug: 'select-filter-sort-paginate',
    side: 'left',
    phase: { en: 'SQL', fr: 'SQL' },
    title: {
      en: 'SELECT, Filter, Sort, Paginate',
      fr: 'SELECT, filtrer, trier, paginer'
    },
    points: {
      en: ['Write precise SELECT lists', 'Filter and sort safely', 'Paginate without surprises'],
      fr: ['Écrire des SELECT précis', 'Filtrer et trier proprement', 'Paginer sans surprises']
    }
  },
  {
    id: 8,
    slug: 'insert-update-delete-upsert',
    side: 'right',
    phase: { en: 'SQL', fr: 'SQL' },
    title: {
      en: 'INSERT, UPDATE, DELETE, UPSERT',
      fr: 'INSERT, UPDATE, DELETE, UPSERT'
    },
    points: {
      en: ['Write data with RETURNING', 'Update and delete with WHERE', 'Use ON CONFLICT for upserts'],
      fr: ['Écrire des données avec RETURNING', 'UPDATE et DELETE avec WHERE', 'Utiliser ON CONFLICT pour les upserts']
    }
  },
  {
    id: 9,
    slug: 'joins',
    side: 'left',
    phase: { en: 'SQL', fr: 'SQL' },
    title: {
      en: 'Joins in PostgreSQL',
      fr: 'Jointures PostgreSQL'
    },
    points: {
      en: ['INNER vs LEFT join', 'Avoid accidental row explosion', 'Alias tables for readable SQL'],
      fr: ['INNER vs LEFT join', 'Éviter l’explosion accidentelle de lignes', 'Alias de tables pour un SQL lisible']
    }
  },
  {
    id: 10,
    slug: 'aggregations-group-by-and-windows',
    side: 'right',
    phase: { en: 'SQL', fr: 'SQL' },
    title: {
      en: 'Aggregations, GROUP BY, Windows',
      fr: 'Agrégations, GROUP BY, fenêtres'
    },
    points: {
      en: ['GROUP BY and HAVING', 'Useful aggregate functions', 'Window functions for ranking'],
      fr: ['GROUP BY et HAVING', 'Fonctions d’agrégation utiles', 'Fonctions de fenêtrage pour le ranking']
    }
  },
  {
    id: 11,
    slug: 'subqueries-and-ctes',
    side: 'left',
    phase: { en: 'SQL', fr: 'SQL' },
    title: {
      en: 'Subqueries and CTEs',
      fr: 'Sous-requêtes et CTE'
    },
    points: {
      en: ['Correlated vs independent subqueries', 'WITH for readable steps', 'Choose CTE vs subquery on purpose'],
      fr: ['Sous-requêtes corrélées vs indépendantes', 'WITH pour des étapes lisibles', 'Choisir CTE ou sous-requête volontairement']
    }
  },
  {
    id: 12,
    slug: 'indexes',
    side: 'right',
    phase: { en: 'Performance', fr: 'Performance' },
    title: {
      en: 'PostgreSQL Indexes',
      fr: 'Index PostgreSQL'
    },
    points: {
      en: ['B-tree as the default index', 'Index filters and join keys', 'Balance read speed and write cost'],
      fr: ['B-tree comme index par défaut', 'Indexer filtres et clés de jointure', 'Équilibrer lectures et coût d’écriture']
    }
  },
  {
    id: 13,
    slug: 'explain-analyze',
    side: 'left',
    phase: { en: 'Performance', fr: 'Performance' },
    title: {
      en: 'EXPLAIN ANALYZE and Query Plans',
      fr: 'EXPLAIN ANALYZE et plans de requêtes'
    },
    points: {
      en: ['Read EXPLAIN ANALYZE output', 'Spot sequential scans and bad joins', 'Tune queries in small iterations'],
      fr: ['Lire la sortie d’EXPLAIN ANALYZE', 'Repérer sequential scans et mauvais joins', 'Tuner les requêtes par petites itérations']
    }
  },
  {
    id: 14,
    slug: 'transactions-and-isolation',
    side: 'right',
    phase: { en: 'Concurrency', fr: 'Concurrence' },
    title: {
      en: 'Transactions and Isolation',
      fr: 'Transactions et isolation'
    },
    points: {
      en: ['Keep transactions short', 'Read committed vs repeatable read', 'Know what ACID actually guarantees'],
      fr: ['Garder les transactions courtes', 'Read committed vs repeatable read', 'Savoir ce que ACID garantit vraiment']
    }
  },
  {
    id: 15,
    slug: 'locks-and-concurrency',
    side: 'left',
    phase: { en: 'Concurrency', fr: 'Concurrence' },
    title: {
      en: 'Locks and Concurrency',
      fr: 'Verrous et concurrence'
    },
    points: {
      en: ['Row locks vs table locks', 'Diagnose deadlocks', 'Design low-contention workflows'],
      fr: ['Verrous de ligne vs de table', 'Diagnostiquer les deadlocks', 'Concevoir des flux à faible contention']
    }
  },
  {
    id: 16,
    slug: 'jsonb-for-flexible-data',
    side: 'right',
    phase: { en: 'PostgreSQL Features', fr: 'Fonctionnalités PostgreSQL' },
    title: {
      en: 'JSONB for Flexible Data',
      fr: 'JSONB pour les données flexibles'
    },
    points: {
      en: ['JSON vs JSONB', 'Query and index JSONB', 'Keep relational columns for core facts'],
      fr: ['JSON vs JSONB', 'Interroger et indexer JSONB', 'Garder des colonnes relationnelles pour les faits clés']
    }
  },
  {
    id: 17,
    slug: 'full-text-search',
    side: 'left',
    phase: { en: 'PostgreSQL Features', fr: 'Fonctionnalités PostgreSQL' },
    title: {
      en: 'Full-Text Search',
      fr: 'Recherche plein texte'
    },
    points: {
      en: ['tsvector and tsquery', 'Rank and highlight matches', 'Maintain search indexes'],
      fr: ['tsvector et tsquery', 'Classer et surligner les résultats', 'Maintenir les index de recherche']
    }
  },
  {
    id: 18,
    slug: 'schema-migrations',
    side: 'right',
    phase: { en: 'Operations', fr: 'Opérations' },
    title: {
      en: 'Schema Migrations',
      fr: 'Migrations de schéma'
    },
    points: {
      en: ['Version every schema change', 'Expand then contract safely', 'Avoid unplanned production DDL'],
      fr: ['Versionner chaque changement de schéma', 'Étendre puis contracter sans risque', 'Éviter le DDL improvisé en production']
    }
  },
  {
    id: 19,
    slug: 'backup-and-restore',
    side: 'left',
    phase: { en: 'Operations', fr: 'Opérations' },
    title: {
      en: 'Backup and Restore',
      fr: 'Sauvegarde et restauration'
    },
    points: {
      en: ['Use pg_dump and pg_restore', 'Know logical vs physical backups', 'Verify restores, not only backups'],
      fr: ['Utiliser pg_dump et pg_restore', 'Distinguer sauvegardes logiques et physiques', 'Vérifier les restaurations, pas seulement les backups']
    }
  },
  {
    id: 20,
    slug: 'maintenance-and-production',
    side: 'right',
    phase: { en: 'Production', fr: 'Production' },
    title: {
      en: 'Maintenance and Production',
      fr: 'Maintenance et production'
    },
    points: {
      en: ['Watch autovacuum and bloat', 'Use connection pooling', 'Plan replication and failover'],
      fr: ['Surveiller autovacuum et bloat', 'Utiliser le connection pooling', 'Prévoir réplication et failover']
    }
  }
]

export const normalizePostgresqlRoadmapPath = (value: string) => {
  if (value.startsWith('/postgresql/')) {
    return value
  }

  if (value.startsWith('/roadmaps/postgresql/')) {
    return value.replace('/roadmaps/postgresql/', '/postgresql/')
  }

  if (value.startsWith('/roadmaps-fr/postgresql/')) {
    return value.replace('/roadmaps-fr/postgresql/', '/postgresql/')
  }

  return value
}

export const postgresqlRoadmapPathOrder = postgresqlRoadmapSteps.map((step) => `/postgresql/${step.slug}`)

export const sortPostgresqlRoadmapItems = <T extends { path: string }>(items: T[]) => {
  const order = new Map(postgresqlRoadmapPathOrder.map((path, index) => [path, index]))

  return [...items].sort((a, b) => {
    const left = order.get(normalizePostgresqlRoadmapPath(a.path)) ?? Number.MAX_SAFE_INTEGER
    const right = order.get(normalizePostgresqlRoadmapPath(b.path)) ?? Number.MAX_SAFE_INTEGER
    return left - right
  })
}
