<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { gsap } from 'gsap'

const root = ref(null)
const progress = ref(0)
const playing = ref(false)
const ready = ref(false)
const reducedMotion = ref(false)
const speed = ref('1')
const easing = ref('power3.inOut')
let media
let timeline
let context
let observer
let visible = true
let disposed = false

function pause() {
  timeline?.pause()
  playing.value = false
}

function play() {
  if (!timeline || reducedMotion.value) return
  if (timeline.progress() >= 0.999) timeline.restart()
  else timeline.play()
  playing.value = true
}

function replay() {
  if (!timeline || reducedMotion.value) return
  timeline.restart()
  playing.value = true
}

function seek(event) {
  pause()
  timeline?.progress(Number(event.target.value) / 100)
  progress.value = Number(event.target.value)
}

function buildTimeline() {
  if (!root.value || disposed) return
  const oldProgress = timeline?.progress() ?? 0
  pause()
  context?.revert()
  context = gsap.context(() => {
    const cards = root.value.querySelectorAll('.motion-card')
    const ring = root.value.querySelector('.orbit-ring')
    timeline = gsap.timeline({
      paused: true,
      defaults: { duration: 1.1, ease: easing.value },
      onUpdate: () => {
        progress.value = Math.round(timeline.progress() * 100)
      },
      onComplete: () => {
        playing.value = false
      }
    })
    timeline
      .set(cards, {
        x: 0,
        xPercent: (i) => (i - 1) * 58,
        y: (i) => (i === 1 ? -14 : 12),
        rotation: (i) => (i - 1) * 12
      })
      .addLabel('spread')
      .to(
        cards,
        { xPercent: (i) => (i - 1) * 85, y: 0, rotation: 0, stagger: 0.06 },
        'spread'
      )
      .to(ring, { rotation: 90, scale: 1.06 }, 'spread')
      .addLabel('lift', '+=0.2')
      .to(
        cards,
        {
          y: (i) => (i === 1 ? -42 : 22),
          rotation: (i) => (i - 1) * -8,
          stagger: 0.06
        },
        'lift'
      )
      .to(ring, { rotation: 210, scale: 0.94 }, 'lift')
      .addLabel('gather', '+=0.2')
      .to(
        cards,
        {
          xPercent: (i) => (i - 1) * 16,
          y: (i) => (i - 1) * -8,
          rotation: (i) => (i - 1) * 10,
          stagger: 0.06
        },
        'gather'
      )
      .to(ring, { rotation: 300, scale: 1 }, 'gather')
      .addLabel('return', '+=0.2')
      .to(
        cards,
        {
          xPercent: (i) => (i - 1) * 58,
          y: (i) => (i === 1 ? -14 : 12),
          rotation: (i) => (i - 1) * 12,
          stagger: 0.06
        },
        'return'
      )
      .to(ring, { rotation: 360 }, 'return')
    timeline.timeScale(Number(speed.value))
    timeline.progress(reducedMotion.value ? 0 : oldProgress)
  }, root.value)
}

function handleVisibility() {
  if (document.hidden) pause()
}

watch(speed, (value) => timeline?.timeScale(Number(value)))
watch(easing, () => {
  buildTimeline()
})

onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = media.matches
  media.addEventListener('change', handleMotionChange)
  buildTimeline()
  ready.value = true
  document.addEventListener('visibilitychange', handleVisibility)
  observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting
      if (!visible) pause()
    },
    { threshold: 0.15 }
  )
  observer.observe(root.value)
  if (!media.matches && !document.hidden && visible) play()
})

function handleMotionChange(event) {
  reducedMotion.value = event.matches
  pause()
  if (event.matches) {
    timeline?.progress(0)
    progress.value = 0
  }
}

onBeforeUnmount(() => {
  disposed = true
  pause()
  observer?.disconnect()
  media?.removeEventListener('change', handleMotionChange)
  document.removeEventListener('visibilitychange', handleVisibility)
  context?.revert()
})
</script>

<template>
  <section ref="root" class="timeline-demo" aria-labelledby="timeline-title">
    <div class="demo-heading">
      <div>
        <span class="experiment-number">实验 01 / GSAP</span>
        <h2 id="timeline-title">给时间一个形状。</h2>
      </div>
      <span class="demo-tag">TIMELINE</span>
    </div>
    <p class="demo-description">
      展开、错位、聚合。拖动时间轴，让每一帧停在你喜欢的位置。
    </p>
    <div
      class="motion-stage"
      role="img"
      aria-label="三张几何卡片随时间轴展开、错位、聚合的动画"
    >
      <div class="stage-caption">
        <span>PLAY WITH TIME</span><span>01 — 04</span>
      </div>
      <div class="orbit-ring"><i></i><i></i></div>
      <div class="motion-card card-one">
        <span class="card-index">01 / FORM</span>
        <div class="shape shape-circle"></div>
        <strong>形状</strong>
      </div>
      <div class="motion-card card-two">
        <span class="card-index">02 / SPACE</span>
        <div class="shape shape-grid"><i v-for="n in 9" :key="n"></i></div>
        <strong>空间</strong>
      </div>
      <div class="motion-card card-three">
        <span class="card-index">03 / MOTION</span>
        <div class="shape shape-lines"><i></i><i></i><i></i></div>
        <strong>流动</strong>
      </div>
      <div class="stage-footer">
        <span>ORDER → PLAY → POSSIBILITY</span
        ><span class="stage-cross">+</span>
      </div>
    </div>
    <div class="playback-controls">
      <button
        class="play-button"
        :disabled="!ready || reducedMotion"
        :aria-label="playing ? '暂停动画' : '播放动画'"
        @click="playing ? pause() : play()"
      >
        <span aria-hidden="true">{{ playing ? 'Ⅱ' : '▶' }}</span>
        {{ playing ? '暂停' : '播放' }}
      </button>
      <button
        class="restart-button"
        :disabled="!ready || reducedMotion"
        @click="replay"
      >
        重播 ↺
      </button>
      <label class="scrubber"
        ><span class="sr-only">动画进度</span
        ><input
          type="range"
          min="0"
          max="100"
          step="1"
          :value="progress"
          :disabled="!ready || reducedMotion"
          aria-label="动画进度"
          :aria-valuetext="`${progress}%`"
          @input="seek"
      /></label>
      <output class="progress-label"
        >{{ String(progress).padStart(3, '0') }}<small>%</small></output
      >
    </div>
    <div class="settings-row">
      <label
        >播放速度
        <select v-model="speed" :disabled="reducedMotion">
          <option value="0.5">0.5 ×</option>
          <option value="1">1 ×</option>
          <option value="1.5">1.5 ×</option>
          <option value="2">2 ×</option>
        </select></label
      >
      <label
        >运动曲线
        <select v-model="easing" :disabled="reducedMotion">
          <option value="power3.inOut">柔和进出</option>
          <option value="back.inOut(1.2)">轻微回弹</option>
          <option value="none">匀速运动</option>
        </select></label
      >
      <span class="motion-note">{{
        reducedMotion
          ? '已遵循系统「减少动态效果」设置'
          : '可暂停 · 可拖动 · 可重播'
      }}</span>
    </div>
  </section>
</template>

<style scoped>
.timeline-demo {
  --ink: #20231d;
  --muted: #686d60;
  --lime: #d7f589;
  color: var(--ink);
}
.demo-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}
.experiment-number {
  font:
    11px/1.4 ui-monospace,
    monospace;
  letter-spacing: 0.09em;
  color: var(--muted);
}
h2 {
  margin: 10px 0 0;
  font-size: clamp(23px, 3vw, 32px);
  font-weight: 600;
  letter-spacing: -0.04em;
}
.demo-tag {
  border: 1px solid #d3d5cb;
  border-radius: 4px;
  padding: 5px 8px;
  font:
    10px/1.2 ui-monospace,
    monospace;
  letter-spacing: 0.08em;
}
.demo-description {
  margin: 12px 0 24px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--muted);
}
.motion-stage {
  position: relative;
  height: 380px;
  overflow: hidden;
  border: 1px solid #dde0d4;
  border-radius: 12px;
  background-color: #ecede6;
  background-image: radial-gradient(#bec4b3 1px, transparent 1px);
  background-size: 20px 20px;
  isolation: isolate;
}
.stage-caption,
.stage-footer {
  position: absolute;
  left: 24px;
  right: 24px;
  display: flex;
  justify-content: space-between;
  color: #767c6d;
  font:
    10px/1.5 ui-monospace,
    monospace;
  letter-spacing: 0.08em;
}
.stage-caption {
  top: 22px;
}
.stage-footer {
  bottom: 20px;
  align-items: center;
}
.stage-cross {
  font-size: 24px;
}
.orbit-ring {
  position: absolute;
  left: calc(50% - 152px);
  top: calc(50% - 152px);
  width: 304px;
  height: 304px;
  border: 1px solid #b7c0a6;
  border-radius: 50%;
}
.orbit-ring i {
  position: absolute;
  left: calc(50% - 4px);
  top: -4px;
  width: 8px;
  height: 8px;
  background: #687957;
  border-radius: 50%;
}
.orbit-ring i + i {
  top: auto;
  bottom: -4px;
}
.motion-card {
  position: absolute;
  width: 146px;
  height: 196px;
  left: calc(50% - 73px);
  top: calc(50% - 98px);
  border: 1px solid #303729;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 12px 24px #28311a12;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-one {
  background: #f5f4ed;
  transform: translate(-58%, 12px) rotate(-12deg);
}
.card-two {
  background: #d7f589;
  transform: translateY(-14px);
}
.card-three {
  background: #263027;
  color: #eff4e7;
  transform: translate(58%, 12px) rotate(12deg);
}
.card-index {
  font:
    9px/1.3 ui-monospace,
    monospace;
  letter-spacing: 0.05em;
}
.motion-card strong {
  font-size: 21px;
  font-weight: 500;
  letter-spacing: 0.04em;
}
.shape {
  align-self: center;
  width: 72px;
  height: 72px;
}
.shape-circle {
  border: 1px solid #273124;
  border-radius: 50%;
  box-shadow: inset 10px 0 #d7f589;
}
.shape-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}
.shape-grid i {
  border: 1px solid #344726;
  border-radius: 50%;
}
.shape-lines {
  display: flex;
  justify-content: center;
  gap: 7px;
  transform: rotate(25deg);
}
.shape-lines i {
  width: 13px;
  height: 72px;
  border: 1px solid #c4dc9f;
  border-radius: 20px;
}
.shape-lines i:nth-child(2) {
  background: #d7f589;
}
.playback-controls {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px 0;
  border-bottom: 1px solid #dee0d5;
}
.play-button,
.restart-button {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
}
.play-button {
  min-width: 84px;
  padding: 10px 14px;
  background: #222b20;
  color: #f4f5ed;
  border-radius: 6px;
}
.play-button span {
  display: inline-block;
  font-size: 10px;
  width: 13px;
}
.restart-button {
  padding: 10px 0;
  color: var(--muted);
}
.scrubber {
  display: flex;
  flex: 1;
  min-width: 0;
}
.scrubber input {
  width: 100%;
  min-width: 0;
  accent-color: #526b32;
  cursor: pointer;
}
.progress-label {
  width: 44px;
  flex-shrink: 0;
  text-align: right;
  font:
    13px/1 ui-monospace,
    monospace;
  font-variant-numeric: tabular-nums;
}
.progress-label small {
  padding-left: 2px;
  font-size: 10px;
  color: var(--muted);
}
.settings-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 24px;
  padding: 18px 0 0;
  font-size: 11px;
  color: var(--muted);
}
.settings-row label {
  display: flex;
  align-items: center;
  gap: 10px;
}
.settings-row select {
  color: var(--ink);
  border: 1px solid #d7dacd;
  border-radius: 5px;
  padding: 5px 24px 5px 8px;
  background: #fbfcf6;
}
.motion-note {
  margin-left: auto;
}
button:disabled,
input:disabled,
select:disabled {
  opacity: 0.5;
  cursor: default;
}
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #536b32;
  outline-offset: 4px;
}
@media (hover: hover) and (pointer: fine) {
  .play-button:hover:not(:disabled) {
    background: #3d4a35;
  }
  .restart-button:hover:not(:disabled) {
    color: #171d12;
  }
}
@media (max-width: 600px) {
  .motion-stage {
    height: 310px;
  }
  .motion-card {
    width: 102px;
    height: 156px;
    left: calc(50% - 51px);
    top: calc(50% - 78px);
    padding: 10px;
  }
  .shape {
    width: 56px;
    height: 56px;
  }
  .shape-lines i {
    height: 56px;
    width: 10px;
  }
  .motion-card strong {
    font-size: 18px;
  }
  .card-index {
    font-size: 7px;
  }
  .orbit-ring {
    width: 236px;
    height: 236px;
    left: calc(50% - 118px);
    top: calc(50% - 118px);
  }
  .playback-controls {
    gap: 12px;
  }
  .play-button {
    min-width: 68px;
    padding: 10px;
  }
  .motion-note {
    width: 100%;
    margin: 0;
  }
  .stage-caption,
  .stage-footer {
    left: 16px;
    right: 16px;
  }
  .stage-footer {
    font-size: 8px;
  }
}
</style>
