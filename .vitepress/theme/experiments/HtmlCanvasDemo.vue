<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Canvas layout and geometry synchronization have evolved independently in
// Chromium. Keep capability checks local until this experimental API settles.
// https://developer.chrome.com/blog/html-in-canvas-origin-trial
// https://github.com/WICG/html-in-canvas
type CanvasMode = 'drawable' | 'layoutsubtree'
type ExperimentalCanvas = HTMLCanvasElement & {
  requestPaint?: () => void
  updateElementGeometry?: (...args: unknown[]) => void
  layoutSubtree?: boolean
  content?: string
}
type ExperimentalContext = CanvasRenderingContext2D & {
  drawElementImage?: (
    element: Element,
    dx: number,
    dy: number,
    width: number,
    height: number
  ) => DOMMatrix | undefined
}

const stage = ref<HTMLElement | null>(null)
const card = ref<HTMLElement | null>(null)
const mode = ref<CanvasMode | null>(null)
const status = ref<
  'checking' | 'unsupported' | 'starting' | 'ready' | 'failed'
>('checking')
const angle = ref(-6)
const monochrome = ref(false)
const likes = ref(0)
const note = ref('把一点好奇，写进网页。')

const isNative = computed(() => mode.value !== null)
const statusLabel = computed(
  () =>
    ({
      checking: '检测浏览器能力中',
      unsupported: '当前为 HTML 预览',
      starting: '正在准备原生画布',
      ready: '原生 HTML-in-Canvas 已启用',
      failed: '已回退到 HTML 预览'
    })[status.value]
)

let canvas: ExperimentalCanvas | null = null
let context: ExperimentalContext | null = null
let resizeObserver: ResizeObserver | undefined
let pixelRatioQuery: MediaQueryList | undefined
let initialPaintTimeout: ReturnType<typeof setTimeout> | undefined
let disposed = false

function clearInitialPaintTimeout() {
  if (initialPaintTimeout !== undefined) {
    clearTimeout(initialPaintTimeout)
    initialPaintTimeout = undefined
  }
}

function cleanupCanvas() {
  clearInitialPaintTimeout()
  resizeObserver?.disconnect()
  pixelRatioQuery?.removeEventListener('change', onPixelRatioChange)
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  canvas?.removeEventListener('paint', paint)
  resizeObserver = undefined
  pixelRatioQuery = undefined
  canvas = null
  context = null
}

function fallback() {
  cleanupCanvas()
  if (card.value) card.value.style.removeProperty('transform')
  mode.value = null
  status.value = 'failed'
}

function requestPaint() {
  if (!canvas || document.hidden) return
  try {
    canvas.requestPaint?.()
  } catch {
    fallback()
  }
}

function paint() {
  if (!canvas || !context?.drawElementImage || !card.value) return
  const element = card.value
  const width = element.offsetWidth
  const height = element.offsetHeight
  if (!width || !height) return

  try {
    // Work in backing-store pixels, with explicit destination dimensions to
    // avoid differences in default sizing between the two API revisions.
    const ratio = canvas.width / canvas.clientWidth
    const radians = (angle.value * Math.PI) / 180
    const boundsWidth =
      Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians))
    const boundsHeight =
      Math.abs(height * Math.cos(radians)) + Math.abs(width * Math.sin(radians))
    // Keep the rotated card inside the canvas on narrow screens. The native
    // geometry synchronization applies the same scale to its interactive DOM.
    const fit = Math.min(
      1,
      (canvas.clientWidth - 24) / boundsWidth,
      (canvas.clientHeight - 72) / boundsHeight
    )
    const drawWidth = width * ratio * fit
    const drawHeight = height * ratio * fit
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(radians)
    context.filter = monochrome.value ? 'grayscale(1)' : 'none'
    const transform = context.drawElementImage(
      element,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    )

    if (transform && typeof transform.toString === 'function') {
      // Early implementations return the transform needed for pointer hit
      // testing and accessibility. Apply it only when it is actually returned.
      const cssTransform = transform.toString()
      if (element.style.transform !== cssTransform)
        element.style.transform = cssTransform
    } else if (typeof canvas.updateElementGeometry !== 'function') {
      // New implementations synchronize geometry during drawElementImage and
      // return void, including transitional browsers still using layoutSubtree.
      // Without either mechanism, the visible card could have incorrect hit
      // targets, so preserve working HTML instead of accepting broken input.
      fallback()
      return
    }
    clearInitialPaintTimeout()
    status.value = 'ready'
  } catch {
    // A detected method can still fail in an incomplete browser implementation.
    fallback()
  }
}

function resizeCanvas() {
  if (!canvas) return
  const ratio = window.devicePixelRatio || 1
  const width = Math.max(1, Math.round(canvas.clientWidth * ratio))
  const height = Math.max(1, Math.round(canvas.clientHeight * ratio))
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height
  requestPaint()
}

function watchPixelRatio() {
  pixelRatioQuery?.removeEventListener('change', onPixelRatioChange)
  pixelRatioQuery = window.matchMedia(
    `(resolution: ${window.devicePixelRatio}dppx)`
  )
  pixelRatioQuery.addEventListener('change', onPixelRatioChange, { once: true })
}

function onPixelRatioChange() {
  watchPixelRatio()
  resizeCanvas()
}

function armInitialPaintTimeout() {
  clearInitialPaintTimeout()
  if (status.value === 'starting' && !document.hidden) {
    initialPaintTimeout = setTimeout(() => {
      if (!disposed && status.value === 'starting') fallback()
    }, 4000)
  }
}

function onVisibilityChange() {
  armInitialPaintTimeout()
  requestPaint()
}

watch([angle, monochrome, likes, note], requestPaint, { flush: 'post' })

onMounted(async () => {
  // SSR renders an ordinary, useful HTML card. Browser globals are only read
  // after mounting, and the real canvas is created only when native APIs exist.
  const probe = document.createElement('canvas') as ExperimentalCanvas
  const probeContext = probe.getContext('2d') as ExperimentalContext | null
  if (
    typeof probe.requestPaint !== 'function' ||
    typeof probeContext?.drawElementImage !== 'function'
  ) {
    status.value = 'unsupported'
    return
  }

  if ('content' in probe && typeof probe.updateElementGeometry === 'function') {
    mode.value = 'drawable'
  } else if ('layoutSubtree' in probe) {
    mode.value = 'layoutsubtree'
  } else {
    status.value = 'unsupported'
    return
  }

  status.value = 'starting'
  await nextTick()
  if (disposed) return

  canvas = stage.value as ExperimentalCanvas | null
  context = canvas?.getContext('2d') as ExperimentalContext | null
  if (!canvas || typeof context?.drawElementImage !== 'function') {
    fallback()
    return
  }
  canvas.addEventListener('paint', paint)
  resizeObserver = new ResizeObserver(resizeCanvas)
  resizeObserver.observe(canvas)
  if (card.value) resizeObserver.observe(card.value)
  window.addEventListener('resize', resizeCanvas, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
  watchPixelRatio()
  resizeCanvas()
  armInitialPaintTimeout()
})

onBeforeUnmount(() => {
  disposed = true
  cleanupCanvas()
})
</script>

<template>
  <div class="html-canvas-demo">
    <div class="canvas-toolbar">
      <span
        class="canvas-status"
        :class="{ 'is-ready': status === 'ready' }"
        role="status"
      >
        <span class="status-dot" aria-hidden="true" />
        {{ statusLabel }}
      </span>
      <span class="canvas-experimental">EXPERIMENTAL</span>
    </div>

    <div class="canvas-stage-wrap">
      <span class="stage-corner" aria-hidden="true">HTML → PIXELS</span>
      <component
        :is="isNative ? 'canvas' : 'div'"
        ref="stage"
        class="canvas-stage"
        :class="{ 'is-native': isNative }"
        :layoutsubtree="mode === 'layoutsubtree' ? '' : undefined"
        :content="mode === 'drawable' ? 'drawable' : undefined"
      >
        <article
          ref="card"
          class="live-card"
          :drawable="mode === 'drawable' ? '' : undefined"
        >
          <div class="live-card-topline">
            <span>一张活着的卡片</span>
            <span class="live-card-star" aria-hidden="true">✳︎</span>
          </div>
          <p class="live-card-title">HELLO,<br />CANVAS<span>.</span></p>
          <label class="live-card-note">
            <span>写点什么，看看变化</span>
            <input
              v-model="note"
              type="text"
              maxlength="28"
              autocomplete="off"
              spellcheck="false"
            />
          </label>
          <div class="live-card-bottomline">
            <span>有文字，也有交互。</span>
            <button
              type="button"
              @click="likes += 1"
              :aria-label="`为实验点赞，已获得 ${likes} 次点赞`"
            >
              <span aria-hidden="true">↗</span> 喜欢
              {{ String(likes).padStart(2, '0') }}
            </button>
          </div>
        </article>
      </component>
      <span class="stage-caption" aria-hidden="true">{{
        status === 'ready' ? 'NATIVE CANVAS' : 'LIVE HTML PREVIEW'
      }}</span>
    </div>

    <div class="canvas-controls">
      <label class="rotation-control">
        <span
          >旋转 <output>{{ angle }}°</output></span
        >
        <input
          v-model.number="angle"
          type="range"
          min="-10"
          max="10"
          step="1"
          :disabled="status !== 'ready'"
        />
      </label>
      <button
        type="button"
        class="filter-control"
        :disabled="status !== 'ready'"
        :aria-pressed="monochrome"
        @click="monochrome = !monochrome"
      >
        {{ monochrome ? '恢复彩色' : '黑白滤镜' }}
      </button>
    </div>

    <p class="canvas-support-note">
      <template v-if="status === 'ready'"
        >试着修改文字或点击卡片，画布会同步更新。旋转和滤镜由原生 Canvas
        完成。</template
      >
      <template v-else-if="status === 'starting' || status === 'checking'"
        >正在检测原生 HTML-in-Canvas 支持。</template
      >
      <template v-else-if="status === 'failed'"
        >当前浏览器的实验接口未能完成绘制，已恢复为可交互的 HTML
        卡片。</template
      >
      <template v-else
        >你的浏览器尚未开放原生 HTML-in-Canvas，当前展示可交互的 HTML
        卡片；画布效果暂不可用。</template
      >
      <a
        href="https://github.com/WICG/html-in-canvas#developer-trial-information"
        target="_blank"
        rel="noopener noreferrer"
        >查看实验开启说明 ↗</a
      >
    </p>
  </div>
</template>

<style scoped>
.html-canvas-demo {
  color: #20251f;
}
.canvas-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 0;
}
.canvas-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  line-height: 1.5;
}
.status-dot {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: #999d91;
}
.is-ready .status-dot {
  background: #557719;
}
.canvas-experimental {
  font-size: 9px;
  letter-spacing: 0.1em;
  border: 1px solid #bec1b4;
  padding: 4px 7px;
  border-radius: 4px;
}
.canvas-stage-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #232820;
  background-image: radial-gradient(#56604b 1px, transparent 1px);
  background-size: 22px 22px;
}
.canvas-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 430px;
}
.canvas-stage.is-native {
  display: block;
}
.stage-corner,
.stage-caption {
  position: absolute;
  z-index: 1;
  font:
    10px/1.4 ui-monospace,
    monospace;
  letter-spacing: 0.09em;
  color: #bec6b3;
  pointer-events: none;
}
.stage-corner {
  top: 18px;
  left: 20px;
}
.stage-caption {
  bottom: 18px;
  right: 20px;
}
.live-card {
  box-sizing: border-box;
  width: min(310px, calc(100% - 72px));
  margin: 0;
  padding: 23px;
  overflow: hidden;
  color: #21261e;
  background: #faf9f0;
  border: 1px solid #bfc4b2;
  border-radius: 13px;
  transform-origin: 0 0;
}
.live-card-topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.05em;
}
.live-card-star {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  color: #273022;
  border-radius: 50%;
  background: #d7f75b;
  font-size: 24px;
  line-height: 1;
}
.live-card-title {
  margin: 24px 0 23px;
  font-size: 43px;
  font-weight: 850;
  line-height: 0.96;
  letter-spacing: -0.07em;
}
.live-card-title > span {
  color: #6e852e;
}
.live-card-note {
  display: grid;
  gap: 8px;
  font-size: 10px;
  color: #737768;
}
.live-card-note input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 8px 0;
  border: 0;
  border-bottom: 1px solid #bcc3ac;
  border-radius: 0;
  outline-offset: 4px;
  background: transparent;
  font-family: inherit;
  font-size: 12px;
  line-height: 1.5;
  color: #252c1f;
}
.live-card-bottomline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 22px;
}
.live-card-bottomline > span {
  color: #6b7160;
  font-size: 9px;
}
.live-card-bottomline button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  border: 1px solid #c0d447;
  border-radius: 100px;
  padding: 8px 11px;
  background: #d7f75b;
  color: #252c1f;
  font-size: 10px;
  font-weight: 650;
  cursor: pointer;
}
.live-card-bottomline button:hover {
  background: #c4e348;
}
.live-card-bottomline button > span {
  font-size: 15px;
}
.canvas-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 18px;
}
.rotation-control {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 11px;
}
.rotation-control > span {
  min-width: 70px;
}
.rotation-control output {
  margin-left: 7px;
  color: #777c6d;
  font-variant-numeric: tabular-nums;
}
.rotation-control input {
  width: 110px;
  height: 20px;
  accent-color: #536832;
  cursor: pointer;
}
.filter-control {
  padding: 8px 13px;
  border: 1px solid #b7bdab;
  border-radius: 100px;
  font-size: 11px;
  background: transparent;
  color: #353d2e;
  cursor: pointer;
}
.filter-control[aria-pressed='true'] {
  background: #252c21;
  color: #f7f8eb;
}
.canvas-controls :disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.html-canvas-demo button:focus-visible,
.html-canvas-demo input:focus-visible,
.html-canvas-demo a:focus-visible {
  outline: 2px solid #7b9138;
  outline-offset: 4px;
}
.canvas-support-note {
  margin: 18px 0 0;
  color: #747969;
  font-size: 11px;
  line-height: 1.85;
}
.canvas-support-note a {
  margin-left: 5px;
  color: #415726;
  text-decoration: underline;
  text-underline-offset: 3px;
}
@media (max-width: 420px) {
  .canvas-toolbar {
    align-items: flex-start;
  }
  .canvas-experimental {
    font-size: 8px;
  }
  .canvas-stage {
    height: 410px;
  }
  .live-card {
    width: calc(100% - 46px);
    padding: 18px;
  }
  .live-card-title {
    font-size: 38px;
  }
  .canvas-controls {
    gap: 10px;
  }
  .rotation-control {
    gap: 8px;
  }
  .rotation-control input {
    width: 80px;
  }
}
/* This demo is input-driven, with no autoplay or requestAnimationFrame loop. */
@media (prefers-reduced-motion: reduce) {
  .html-canvas-demo *,
  .html-canvas-demo *::before,
  .html-canvas-demo *::after {
    transition: none !important;
    animation: none !important;
  }
}
</style>
