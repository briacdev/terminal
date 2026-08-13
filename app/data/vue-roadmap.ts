export interface VueRoadmapStepDefinition {
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

export const vueRoadmapSteps: VueRoadmapStepDefinition[] = [
  {
    id: 1,
    slug: 'what-vue-js-is',
    side: 'left',
    phase: { en: 'Foundations', fr: 'Fondations' },
    title: { en: 'What Vue.js Is', fr: 'Comprendre Vue.js' },
    points: {
      en: ['Progressive framework mental model', 'When Vue is a good fit', 'Vue 3 ecosystem overview'],
      fr: ['Modèle mental du framework progressif', 'Quand Vue est un bon choix', "Vue d'ensemble de l'écosystème Vue 3"]
    }
  },
  {
    id: 2,
    slug: 'vite-setup-and-project-structure',
    side: 'right',
    phase: { en: 'Foundations', fr: 'Fondations' },
    title: { en: 'Vite Setup and Project Structure', fr: 'Setup Vite et structure du projet' },
    points: {
      en: ['Install Node.js and a package manager', 'Scaffold a Vue app with Vite', 'Read the generated folder layout'],
      fr: ['Installer Node.js et un package manager', 'Créer une app Vue avec Vite', 'Lire la structure générée']
    }
  },
  {
    id: 3,
    slug: 'single-file-components',
    side: 'left',
    phase: { en: 'Building UI', fr: 'Interface' },
    title: { en: 'Single-File Components', fr: 'Composants Single-File' },
    points: {
      en: ['script setup, template, and style blocks', 'One component per file', 'How Vue compiles an SFC'],
      fr: ['Blocs script setup, template et style', 'Un composant par fichier', 'Comment Vue compile un SFC']
    }
  },
  {
    id: 4,
    slug: 'template-syntax-and-directives',
    side: 'right',
    phase: { en: 'Building UI', fr: 'Interface' },
    title: { en: 'Template Syntax and Directives', fr: 'Syntaxe template et directives' },
    points: {
      en: ['Text interpolation', 'v-bind and v-on', 'v-if, v-show, and v-for'],
      fr: ['Interpolation de texte', 'v-bind et v-on', 'v-if, v-show et v-for']
    }
  },
  {
    id: 5,
    slug: 'reactivity-fundamentals',
    side: 'left',
    phase: { en: 'Reactivity', fr: 'Réactivité' },
    title: { en: 'Reactivity with ref and reactive', fr: 'Réactivité avec ref et reactive' },
    points: {
      en: ['ref for values and objects', 'reactive for object state', 'When to unwrap .value'],
      fr: ['ref pour les valeurs et objets', 'reactive pour un état objet', 'Quand déballer .value']
    }
  },
  {
    id: 6,
    slug: 'computed-watch-and-lifecycle',
    side: 'right',
    phase: { en: 'Reactivity', fr: 'Réactivité' },
    title: { en: 'Computed, Watch, and Lifecycle', fr: 'Computed, watch et cycle de vie' },
    points: {
      en: ['derived state with computed', 'watch vs watchEffect', 'onMounted and related hooks'],
      fr: ['État dérivé avec computed', 'watch vs watchEffect', 'onMounted et hooks associés']
    }
  },
  {
    id: 7,
    slug: 'components-props-and-events',
    side: 'left',
    phase: { en: 'Components', fr: 'Composants' },
    title: { en: 'Components, Props, and Events', fr: 'Composants, props et événements' },
    points: {
      en: ['Split UI into reusable units', 'Pass data with props', 'Emit events to parents'],
      fr: ["Découper l'UI en unités réutilisables", 'Passer des données avec les props', 'Remonter des événements au parent']
    }
  },
  {
    id: 8,
    slug: 'slots-and-component-composition',
    side: 'right',
    phase: { en: 'Components', fr: 'Composants' },
    title: { en: 'Slots and Component Composition', fr: 'Slots et composition' },
    points: {
      en: ['Default and named slots', 'Scoped slots for lists', 'Flexible layout components'],
      fr: ['Slots par défaut et nommés', 'Slots scopés pour les listes', 'Composants de layout flexibles']
    }
  },
  {
    id: 9,
    slug: 'composables',
    side: 'left',
    phase: { en: 'Composition API', fr: 'Composition API' },
    title: { en: 'Composables', fr: 'Les composables Vue' },
    points: {
      en: ['Extract reusable logic', 'Keep UI and business rules apart', 'Name composables with use'],
      fr: ['Extraire une logique réutilisable', 'Séparer UI et règles métier', 'Nommer les composables avec use']
    }
  },
  {
    id: 10,
    slug: 'forms-and-v-model',
    side: 'right',
    phase: { en: 'App Features', fr: "Fonctionnalités d'app" },
    title: { en: 'Forms and v-model', fr: 'Formulaires et v-model' },
    points: {
      en: ['Two-way binding', 'Inputs, checkboxes, and selects', 'defineModel on custom fields'],
      fr: ['Liaison bidirectionnelle', 'Inputs, checkboxes et selects', 'defineModel sur des champs custom']
    }
  },
  {
    id: 11,
    slug: 'vue-router-essentials',
    side: 'left',
    phase: { en: 'App Features', fr: "Fonctionnalités d'app" },
    title: { en: 'Vue Router Essentials', fr: 'Essentiels de Vue Router' },
    points: {
      en: ['Nested and dynamic routes', 'Navigation guards', 'Route-aware UI with useRoute'],
      fr: ['Routes imbriquées et dynamiques', 'Guards de navigation', 'UI liée à la route avec useRoute']
    }
  },
  {
    id: 12,
    slug: 'pinia-state-management',
    side: 'right',
    phase: { en: 'App Features', fr: "Fonctionnalités d'app" },
    title: { en: 'Pinia State Management', fr: "Gestion d'état avec Pinia" },
    points: {
      en: ['Setup stores vs option stores', 'Getters and actions', 'When local state is enough'],
      fr: ['Stores setup vs option', 'Getters et actions', "Quand l'état local suffit"]
    }
  },
  {
    id: 13,
    slug: 'fetching-data',
    side: 'left',
    phase: { en: 'App Features', fr: "Fonctionnalités d'app" },
    title: { en: 'Fetching Data in Vue', fr: 'Données asynchrones et appels API' },
    points: {
      en: ['Loading and error states', 'Fetch on mount or route change', 'Avoid race conditions'],
      fr: ['États loading et error', 'Fetcher au montage ou au changement de route', 'Éviter les conditions de course']
    }
  },
  {
    id: 14,
    slug: 'styling-vue-applications',
    side: 'right',
    phase: { en: 'Quality', fr: 'Qualité' },
    title: { en: 'Styling Vue Applications', fr: 'Styler une application Vue' },
    points: {
      en: ['Scoped CSS', 'Utility-first styling with Tailwind', 'Keep component styles consistent'],
      fr: ['CSS scopé', 'Approche utility-first avec Tailwind', 'Garder des styles de composants cohérents']
    }
  },
  {
    id: 15,
    slug: 'accessibility-and-ux',
    side: 'left',
    phase: { en: 'Quality', fr: 'Qualité' },
    title: { en: 'Accessibility and UX in Vue', fr: 'Accessibilité et UX dans Vue' },
    points: {
      en: ['Keyboard navigation', 'Semantic HTML and ARIA', 'Accessible forms and feedback'],
      fr: ['Navigation clavier', 'HTML sémantique et ARIA', 'Formulaires et feedback accessibles']
    }
  },
  {
    id: 16,
    slug: 'testing-vue-applications',
    side: 'right',
    phase: { en: 'Quality', fr: 'Qualité' },
    title: { en: 'Testing Vue Applications', fr: 'Tester une application Vue' },
    points: {
      en: ['Vitest basics', 'Vue Test Utils', 'Component tests vs integration tests'],
      fr: ['Bases de Vitest', 'Vue Test Utils', "Tests de composants vs d'intégration"]
    }
  },
  {
    id: 17,
    slug: 'performance-and-rendering',
    side: 'left',
    phase: { en: 'Production', fr: 'Production' },
    title: { en: 'Vue Performance and Rendering', fr: 'Performance et rendu Vue' },
    points: {
      en: ['Use keys correctly', 'Lazy-load heavy components', 'Avoid extra watchers and re-renders'],
      fr: ['Bien utiliser les keys', 'Lazy-load des composants lourds', 'Éviter watchers et re-renders inutiles']
    }
  },
  {
    id: 18,
    slug: 'build-and-deploy',
    side: 'right',
    phase: { en: 'Production', fr: 'Production' },
    title: { en: 'Build and Deploy a Vue App', fr: "Build et déploiement d'une app Vue" },
    points: {
      en: ['Production builds', 'Environment variables', 'When to move from Vue to Nuxt'],
      fr: ['Builds de production', "Variables d'environnement", 'Quand passer de Vue à Nuxt']
    }
  }
]

export const normalizeVueRoadmapPath = (value: string) => {
  if (value.startsWith('/vue-js/')) {
    return value
  }

  if (value.startsWith('/roadmaps/vue-js/')) {
    return value.replace('/roadmaps/vue-js/', '/vue-js/')
  }

  if (value.startsWith('/roadmaps-fr/vue-js/')) {
    return value.replace('/roadmaps-fr/vue-js/', '/vue-js/')
  }

  return value
}

export const vueRoadmapPathOrder = vueRoadmapSteps.map((step) => `/vue-js/${step.slug}`)

export const sortVueRoadmapItems = <T extends { path: string }>(items: T[]) => {
  const order = new Map(vueRoadmapPathOrder.map((path, index) => [path, index]))

  return [...items].sort((a, b) => {
    const left = order.get(normalizeVueRoadmapPath(a.path)) ?? Number.MAX_SAFE_INTEGER
    const right = order.get(normalizeVueRoadmapPath(b.path)) ?? Number.MAX_SAFE_INTEGER
    return left - right
  })
}
