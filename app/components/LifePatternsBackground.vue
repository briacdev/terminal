<script setup lang="ts">
type WorkerFrameMessage = {
  type: 'frame'
  cells: Int32Array<ArrayBufferLike>
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

const MIN_FRAME_INTERVAL_MS = 33
const GENERATION_INTERVAL_MS = 120
const RESIZE_DEBOUNCE_MS = 150
const CELL_SIZE_DESKTOP = 4
const CELL_SIZE_MOBILE = 3

let worker: Worker | null = null
let animationFrame: number | null = null
let resizeTimer: number | null = null
let motionMediaQuery: MediaQueryList | null = null
let motionListener: ((event: MediaQueryListEvent) => void) | null = null
let visibilityListener: (() => void) | null = null
let windowResizeListener: (() => void) | null = null

let latestCells: Int32Array<ArrayBufferLike> = new Int32Array()
let cols = 0
let rows = 0
let cellSize = CELL_SIZE_DESKTOP
let lastFrameAt = 0
let lastGenerationRequestAt = 0
let workerBusy = false
let workerReady = false
let isReducedMotion = false

const canAnimate = () => Boolean(worker && workerReady && !isReducedMotion && !document.hidden)

const fallbackPattern = [
  [1, 0], [2, 1], [0, 2], [1, 2], [2, 2],
  [8, 0], [9, 0], [10, 0], [14, 3], [15, 3], [16, 3],
  [18, 8], [19, 8], [20, 8], [18, 9], [20, 9], [19, 10]
] as const

const buildFallbackCells = () => {
  const originX = Math.max(Math.floor(cols * 0.2), 4)
  const originY = Math.max(Math.floor(rows * 0.16), 4)
  const cells = new Int32Array(fallbackPattern.length * 2)

  fallbackPattern.forEach(([x, y], index) => {
    cells[index * 2] = originX + x
    cells[index * 2 + 1] = originY + y
  })

  return cells
}

const stopLoop = () => {
  if (animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

const draw = () => {
  const canvas = canvasRef.value

  if (!canvas) {
    return
  }

  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  const width = window.innerWidth
  const height = window.innerHeight
  const dpr = window.devicePixelRatio || 1
  const canvasWidth = Math.floor(width * dpr)
  const canvasHeight = Math.floor(height * dpr)

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0)
  context.clearRect(0, 0, width, height)
  context.fillStyle = 'rgba(255, 255, 255, 0.12)'
  context.strokeStyle = 'rgba(255, 255, 255, 0.14)'
  context.lineWidth = 1

  for (let index = 0; index < latestCells.length; index += 2) {
    const x = latestCells[index] || 0
    const y = latestCells[index + 1] || 0
    const px = x * cellSize
    const py = y * cellSize

    if (px + cellSize < 0 || py + cellSize < 0 || px > width || py > height) {
      continue
    }

    context.fillRect(px, py, cellSize - 1, cellSize - 1)
    context.strokeRect(px + 0.5, py + 0.5, Math.max(cellSize - 2, 1), Math.max(cellSize - 2, 1))
  }
}

const animate = (timestamp: number) => {
  animationFrame = null

  if (!canAnimate()) {
    return
  }

  const frameReady = timestamp - lastFrameAt >= MIN_FRAME_INTERVAL_MS
  const generationReady = timestamp - lastGenerationRequestAt >= GENERATION_INTERVAL_MS

  if (frameReady && generationReady && !workerBusy) {
    lastFrameAt = timestamp
    lastGenerationRequestAt = timestamp
    workerBusy = true
    worker?.postMessage({ type: 'tick' })
  }

  animationFrame = window.requestAnimationFrame(animate)
}

const startLoop = () => {
  if (animationFrame !== null || !canAnimate()) {
    return
  }

  animationFrame = window.requestAnimationFrame(animate)
}

const updateActivity = () => {
  if (canAnimate()) {
    startLoop()
    return
  }

  stopLoop()
}

const postWorldSize = (messageType: 'init' | 'resize') => {
  const compact = window.innerWidth < 900
  cellSize = compact ? CELL_SIZE_MOBILE : CELL_SIZE_DESKTOP
  cols = Math.max(Math.ceil(window.innerWidth / cellSize), 1)
  rows = Math.max(Math.ceil(window.innerHeight / cellSize), 1)

  if (!worker) {
    latestCells = buildFallbackCells()
    draw()
    return
  }

  workerReady = true
  workerBusy = false
  worker.postMessage({ type: messageType, cols, rows, compact })
}

const syncCanvas = (messageType: 'init' | 'resize' = 'resize') => {
  postWorldSize(messageType)
  updateActivity()
}

const scheduleResizeSync = () => {
  if (resizeTimer !== null) {
    window.clearTimeout(resizeTimer)
  }

  resizeTimer = window.setTimeout(() => {
    resizeTimer = null
    syncCanvas('resize')
  }, RESIZE_DEBOUNCE_MS)
}

const createWorker = () => {
  try {
    worker = new Worker('/workers/game-of-life.js')
  } catch {
    worker = null
    latestCells = buildFallbackCells()
    draw()
    return
  }

  worker.onmessage = (event: MessageEvent<WorkerFrameMessage>) => {
    if (event.data.type !== 'frame') {
      return
    }

    latestCells = event.data.cells
    workerBusy = false

    if (!document.hidden) {
      draw()
    }
  }

  worker.onerror = () => {
    worker?.terminate()
    worker = null
    workerReady = false
    workerBusy = false
    stopLoop()
    latestCells = buildFallbackCells()
    draw()
  }
}

onMounted(() => {
  motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  isReducedMotion = motionMediaQuery.matches
  motionListener = (event) => {
    isReducedMotion = event.matches
    syncCanvas('resize')
  }
  motionMediaQuery.addEventListener('change', motionListener)

  visibilityListener = () => {
    updateActivity()
  }
  document.addEventListener('visibilitychange', visibilityListener)

  windowResizeListener = () => {
    scheduleResizeSync()
  }
  window.addEventListener('resize', windowResizeListener)

  createWorker()
  syncCanvas('init')
})

onUnmounted(() => {
  stopLoop()

  if (resizeTimer !== null) {
    window.clearTimeout(resizeTimer)
  }

  worker?.terminate()

  if (motionMediaQuery && motionListener) {
    motionMediaQuery.removeEventListener('change', motionListener)
  }

  if (visibilityListener) {
    document.removeEventListener('visibilitychange', visibilityListener)
  }

  if (windowResizeListener) {
    window.removeEventListener('resize', windowResizeListener)
  }
})
</script>

<template>
  <div class="life-background" aria-hidden="true">
    <canvas ref="canvasRef" class="life-canvas" />
  </div>
</template>

<style scoped>
.life-background {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.life-canvas {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.44;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.04));
}

@media (max-width: 900px) {
  .life-canvas {
    opacity: 0.34;
  }
}

@media (prefers-reduced-motion: reduce) {
  .life-canvas {
    opacity: 0.24;
  }
}
</style>
