const CELL_MARGIN = 10
const MIN_PATTERN_GAP = 8
const INSTANCE_COUNT = 15
const LARGE_PATTERN_COUNT = 4
const CANNON_PATTERN_COUNT = 2
const MAX_RANDOM_PLACEMENT_ATTEMPTS = 180
const PACK_OFFSET = 100000
const PACK_MULTIPLIER = 200000

let live = new Set()
let cols = 0
let rows = 0
let compact = false

const offsetCells = (cells, offsetX, offsetY) => cells.map(([x, y]) => [x + offsetX, y + offsetY])
const mergeCells = (...groups) => groups.flat()

const gliderCells = [
  [1, 0],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2]
]

const beaconCells = [
  [0, 1],
  [1, 1],
  [0, 2],
  [1, 2],
  [2, 3],
  [3, 3],
  [2, 4],
  [3, 4]
]

const pulsarCells = [
  [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
  [0, 2], [5, 2], [7, 2], [12, 2],
  [0, 3], [5, 3], [7, 3], [12, 3],
  [0, 4], [5, 4], [7, 4], [12, 4],
  [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
  [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
  [0, 8], [5, 8], [7, 8], [12, 8],
  [0, 9], [5, 9], [7, 9], [12, 9],
  [0, 10], [5, 10], [7, 10], [12, 10],
  [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12]
]

const gosperGliderGunCells = [
  [24, 0],
  [22, 1], [24, 1],
  [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2],
  [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3],
  [0, 4], [1, 4], [10, 4], [16, 4], [20, 4], [21, 4],
  [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5], [22, 5], [24, 5],
  [10, 6], [16, 6], [24, 6],
  [11, 7], [15, 7],
  [12, 8], [13, 8]
]

const GOSPER_GUN_WIDTH = 36
const mirroredGosperGliderGunCells = gosperGliderGunCells.map(([x, y]) => [GOSPER_GUN_WIDTH - 1 - x, y])

const cannonPatterns = [
  {
    id: 'gosper-glider-gun',
    liveCells: gosperGliderGunCells,
    size: 'large'
  },
  {
    id: 'twin-gosper-cannons',
    liveCells: mergeCells(
      gosperGliderGunCells,
      offsetCells(mirroredGosperGliderGunCells, 46, 4)
    ),
    size: 'large'
  },
  {
    id: 'cannon-battery',
    liveCells: mergeCells(
      gosperGliderGunCells,
      offsetCells(gosperGliderGunCells, 0, 18),
      offsetCells(mirroredGosperGliderGunCells, 46, 9)
    ),
    size: 'large'
  }
]

const standardPatterns = [
  {
    id: 'blinker',
    liveCells: [
      [0, 0],
      [1, 0],
      [2, 0]
    ],
    size: 'regular'
  },
  {
    id: 'toad',
    liveCells: [
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
      [1, 1],
      [2, 1]
    ],
    size: 'regular'
  },
  {
    id: 'beacon',
    liveCells: beaconCells,
    size: 'regular'
  },
  {
    id: 'pulsar',
    liveCells: pulsarCells,
    size: 'large'
  },
  {
    id: 'double-pulsar',
    liveCells: mergeCells(
      pulsarCells,
      offsetCells(pulsarCells, 18, 0)
    ),
    size: 'large'
  },
  {
    id: 'glider',
    liveCells: gliderCells,
    size: 'regular'
  },
  {
    id: 'glider-swarm',
    liveCells: mergeCells(
      gliderCells,
      offsetCells(gliderCells, 8, 3),
      offsetCells(gliderCells, 16, 0),
      offsetCells(gliderCells, 24, 4)
    ),
    size: 'large'
  },
  {
    id: 'lwss',
    liveCells: [
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [0, 1],
      [4, 1],
      [4, 2],
      [0, 3],
      [3, 3]
    ],
    size: 'regular'
  },
  {
    id: 'r-pentomino',
    liveCells: [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [1, 2]
    ],
    size: 'regular'
  },
  {
    id: 'acorn',
    liveCells: [
      [1, 0],
      [3, 1],
      [0, 2],
      [1, 2],
      [4, 2],
      [5, 2],
      [6, 2]
    ],
    size: 'regular'
  },
  {
    id: 'diehard',
    liveCells: [
      [6, 0],
      [0, 1],
      [1, 1],
      [1, 2],
      [5, 2],
      [6, 2],
      [7, 2]
    ],
    size: 'regular'
  },
  {
    id: 'small-exploder',
    liveCells: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [2, 2],
      [1, 3]
    ],
    size: 'regular'
  },
  {
    id: 'beacon-matrix',
    liveCells: mergeCells(
      beaconCells,
      offsetCells(beaconCells, 10, 0),
      offsetCells(beaconCells, 0, 10),
      offsetCells(beaconCells, 10, 10)
    ),
    size: 'large'
  }
]

const patterns = [...cannonPatterns, ...standardPatterns]

const keyFor = (x, y) => (x + PACK_OFFSET) * PACK_MULTIPLIER + y + PACK_OFFSET

const parseKey = (value) => {
  const x = Math.floor(value / PACK_MULTIPLIER) - PACK_OFFSET
  const y = value - (x + PACK_OFFSET) * PACK_MULTIPLIER - PACK_OFFSET
  return [x, y]
}

const randomInt = (min, max) => {
  if (max <= min) {
    return min
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}

const shuffle = (items) => {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index)
    const current = next[index]
    next[index] = next[swapIndex]
    next[swapIndex] = current
  }

  return next
}

const normalizeCells = (cells) => {
  const minX = Math.min(...cells.map(([x]) => x))
  const minY = Math.min(...cells.map(([, y]) => y))

  return cells.map(([x, y]) => [x - minX, y - minY])
}

const rotateCells = (cells) => normalizeCells(cells.map(([x, y]) => [-y, x]))
const mirrorCells = (cells) => normalizeCells(cells.map(([x, y]) => [-x, y]))

const randomizePatternCells = (cells) => {
  let next = normalizeCells(cells)

  if (Math.random() > 0.5) {
    next = mirrorCells(next)
  }

  const turns = randomInt(0, 3)

  for (let turn = 0; turn < turns; turn += 1) {
    next = rotateCells(next)
  }

  return next
}

const patternDimensions = (cells) => ({
  width: Math.max(...cells.map(([x]) => x)) + 1,
  height: Math.max(...cells.map(([, y]) => y)) + 1
})

const collidesWithPlaced = (candidate, placedPatterns) => placedPatterns.some((placedPattern) => {
  const separatedHorizontally =
    candidate.origin[0] + candidate.width + MIN_PATTERN_GAP <= placedPattern.origin[0] ||
    placedPattern.origin[0] + placedPattern.width + MIN_PATTERN_GAP <= candidate.origin[0]

  const separatedVertically =
    candidate.origin[1] + candidate.height + MIN_PATTERN_GAP <= placedPattern.origin[1] ||
    placedPattern.origin[1] + placedPattern.height + MIN_PATTERN_GAP <= candidate.origin[1]

  return !(separatedHorizontally || separatedVertically)
})

const createPlacedPattern = (pattern, liveCells, x, y) => {
  const { width, height } = patternDimensions(liveCells)

  return {
    id: pattern.id,
    liveCells,
    origin: [x, y],
    width,
    height
  }
}

const canFitPattern = (width, height) => cols - width - CELL_MARGIN * 2 >= 0 && rows - height - CELL_MARGIN * 2 >= 0

const findOpenSlot = (pattern, liveCells, placedPatterns) => {
  const { width, height } = patternDimensions(liveCells)

  if (!canFitPattern(width, height)) {
    return null
  }

  const maxX = cols - width - CELL_MARGIN
  const maxY = rows - height - CELL_MARGIN

  for (let attempt = 0; attempt < MAX_RANDOM_PLACEMENT_ATTEMPTS; attempt += 1) {
    const x = randomInt(CELL_MARGIN, maxX)
    const y = randomInt(CELL_MARGIN, maxY)
    const candidate = createPlacedPattern(pattern, liveCells, x, y)

    if (!collidesWithPlaced(candidate, placedPatterns)) {
      return candidate
    }
  }

  for (let y = CELL_MARGIN; y <= maxY; y += 2) {
    for (let x = CELL_MARGIN; x <= maxX; x += 2) {
      const candidate = createPlacedPattern(pattern, liveCells, x, y)

      if (!collidesWithPlaced(candidate, placedPatterns)) {
        return candidate
      }
    }
  }

  return null
}

const seedWorld = () => {
  const next = new Set()
  const targetCount = compact ? 7 : INSTANCE_COUNT
  const largeTarget = compact ? 1 : LARGE_PATTERN_COUNT
  const cannonTarget = compact ? 1 : CANNON_PATTERN_COUNT
  const selectedCannons = shuffle(cannonPatterns).slice(0, cannonTarget)
  const selectedIds = new Set(selectedCannons.map((pattern) => pattern.id))
  const supplementalLargePatterns = shuffle(
    patterns.filter((pattern) => pattern.size === 'large' && !selectedIds.has(pattern.id))
  ).slice(0, Math.max(largeTarget - selectedCannons.length, 0))

  supplementalLargePatterns.forEach((pattern) => {
    selectedIds.add(pattern.id)
  })

  const regularPatterns = shuffle(
    patterns.filter((pattern) => !selectedIds.has(pattern.id))
  ).slice(0, Math.max(targetCount - selectedCannons.length - supplementalLargePatterns.length, 0))

  const selectedPatterns = shuffle([...selectedCannons, ...supplementalLargePatterns, ...regularPatterns])
  const placedPatterns = []

  selectedPatterns.forEach((pattern) => {
    const randomizedCells = randomizePatternCells(pattern.liveCells)
    const placedPattern = findOpenSlot(pattern, randomizedCells, placedPatterns)

    if (!placedPattern) {
      return
    }

    placedPatterns.push(placedPattern)

    placedPattern.liveCells.forEach(([x, y]) => {
      next.add(keyFor(placedPattern.origin[0] + x, placedPattern.origin[1] + y))
    })
  })

  live = next
}

const nextGeneration = () => {
  const neighborCounts = new Map()

  live.forEach((value) => {
    const [x, y] = parseKey(value)

    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) {
          continue
        }

        const nx = x + dx
        const ny = y + dy

        if (nx < -CELL_MARGIN || ny < -CELL_MARGIN || nx > cols + CELL_MARGIN || ny > rows + CELL_MARGIN) {
          continue
        }

        const neighborKey = keyFor(nx, ny)
        neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) || 0) + 1)
      }
    }
  })

  const next = new Set()

  neighborCounts.forEach((count, value) => {
    const isAlive = live.has(value)

    if (count === 3 || (isAlive && count === 2)) {
      next.add(value)
    }
  })

  live = next
}

const buildVisibleFrame = () => {
  const visible = []

  live.forEach((value) => {
    const [x, y] = parseKey(value)

    if (x < 0 || y < 0 || x >= cols || y >= rows) {
      return
    }

    visible.push(x, y)
  })

  return Int32Array.from(visible)
}

const postFrame = () => {
  const cells = buildVisibleFrame()
  self.postMessage({ type: 'frame', cells }, [cells.buffer])
}

const configureWorld = (message) => {
  cols = Math.max(Number(message.cols) || 1, 1)
  rows = Math.max(Number(message.rows) || 1, 1)
  compact = Boolean(message.compact)
  seedWorld()
  postFrame()
}

self.onmessage = (event) => {
  const message = event.data || {}

  if (message.type === 'init' || message.type === 'resize') {
    configureWorld(message)
    return
  }

  if (message.type === 'tick') {
    if (!cols || !rows) {
      return
    }

    nextGeneration()

    if (live.size < 18) {
      seedWorld()
    }

    postFrame()
  }
}
