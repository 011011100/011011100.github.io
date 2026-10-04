<script setup>
import TimelineDemo from './experiments/TimelineDemo.vue'
import HtmlCanvasDemo from './experiments/HtmlCanvasDemo.vue'
</script>

<template>
  <div class="lab-page">
    <header class="lab-intro">
      <div class="lab-eyebrow"><span></span> A SMALL PLACE FOR BIG IDEAS</div>
      <div class="lab-title-row">
        <h1>动画实验室<span>Lab.</span></h1>
        <span class="lab-edition">WEB EXPERIMENTS<br />VOL. 001 / 2026</span>
      </div>
      <p>
        把想法变成会动的网页。这里记录我对动画、交互和浏览器新能力的小小探索。
      </p>
    </header>
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
  color: #686d60;
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
  color: #686d60;
}
.lab-page {
  --lab-ink: #20231d;
  color: var(--lab-ink);
  padding-bottom: 36px;
}
.lab-intro {
  padding: 24px 0 44px;
  margin-bottom: 36px;
  border-bottom: 1px solid #d9ddcf;
}
.lab-eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  font:
    10px/1.6 ui-monospace,
    monospace;
  letter-spacing: 0.09em;
  color: #73796a;
}
.lab-eyebrow > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6a823e;
}
.lab-title-row {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-top: 20px;
}
h1 {
  font-size: clamp(32px, 5vw, 58px);
  line-height: 1.2;
  letter-spacing: -0.055em;
  font-weight: 600;
}
h1 > span {
  font-family: Georgia, serif;
  font-style: italic;
  font-weight: 400;
  padding-left: 16px;
  color: #687c4d;
}
.lab-edition {
  flex-shrink: 0;
  color: #767c6e;
  font:
    10px/1.7 ui-monospace,
    monospace;
  text-align: right;
  letter-spacing: 0.06em;
}
.lab-intro p {
  max-width: 620px;
  font-size: 14px;
  color: #777d6e;
  line-height: 1.9;
  margin-top: 20px;
}
.lab-divider {
  display: flex;
  justify-content: space-between;
  padding: 32px 0;
  margin: 32px 0 20px;
  border-bottom: 1px solid #d9ddcf;
  font:
    10px/1.5 ui-monospace,
    monospace;
  color: #818777;
  letter-spacing: 0.1em;
}
.lab-divider span + span {
  font-size: 18px;
}
.lab-footer {
  margin-top: 60px;
  padding-top: 24px;
  border-top: 1px solid #d9ddcf;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-size: 11px;
  color: #777d6e;
}
.lab-footer a {
  color: #424d35;
}
.lab-footer a:focus-visible {
  outline: 2px solid #536b32;
  outline-offset: 4px;
}
@media (max-width: 600px) {
  .lab-intro {
    padding-top: 14px;
    padding-bottom: 28px;
    margin-bottom: 28px;
  }
  .lab-edition {
    display: none;
  }
  .lab-intro p {
    font-size: 13px;
  }
  .lab-footer {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
