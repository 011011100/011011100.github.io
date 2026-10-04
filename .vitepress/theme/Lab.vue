<script setup>
import PageHeader from './components/PageHeader.vue'
import TimelineDemo from './experiments/TimelineDemo.vue'
import HtmlCanvasDemo from './experiments/HtmlCanvasDemo.vue'
</script>

<template>
  <div class="lab-page">
    <PageHeader
      title="动画实验室"
      description="把想法变成会动的网页。这里记录我对动画、交互和浏览器新能力的小小探索。"
    />
    <TimelineDemo />
    <div class="lab-divider"><span>KEEP EXPLORING</span><span>↓</span></div>
    <section aria-labelledby="canvas-title">
      <div class="canvas-heading">
        <span>实验 02 / HTML-IN-CANVAS</span>
        <h2 id="canvas-title">让 HTML 走进画布。</h2>
      </div>
      <p class="canvas-description">
        文字可以编辑，按钮可以点击。当浏览器支持这项实验能力时，再给它一点旋转和滤镜。
      </p>
      <HtmlCanvasDemo />
    </section>
    <footer class="lab-footer">
      <span>实验持续更新，灵感随时发生。</span
      ><a
        href="https://github.com/011011100/011011100.github.io"
        target="_blank"
        rel="noopener noreferrer"
        >查看源代码 ↗</a
      >
    </footer>
  </div>
</template>

<style scoped>
.canvas-heading > span {
  font:
    11px/1.4 ui-monospace,
    monospace;
  letter-spacing: 0.09em;
  color: var(--site-muted);
}
.canvas-heading h2 {
  margin: 10px 0 0;
  font-size: clamp(23px, 3vw, 32px);
  font-weight: 600;
  letter-spacing: -0.04em;
}
.canvas-description {
  margin: 12px 0 24px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--site-muted);
}
.lab-divider {
  display: flex;
  justify-content: space-between;
  padding: 32px 0;
  margin: 32px 0 20px;
  border-bottom: 1px solid var(--site-border);
  font:
    10px/1.5 ui-monospace,
    monospace;
  color: var(--site-muted);
  letter-spacing: 0.1em;
}
.lab-divider span + span {
  font-size: 18px;
}
.lab-footer {
  margin-top: 60px;
  padding-top: 24px;
  border-top: 1px solid var(--site-border);
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-size: 11px;
  color: var(--site-muted);
}
.lab-footer a {
  color: var(--site-accent);
}
@media (max-width: 600px) {
  .lab-footer {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
