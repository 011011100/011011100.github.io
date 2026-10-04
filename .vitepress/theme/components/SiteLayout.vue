<script setup>
import { ref } from 'vue'
import SiteHeader from './SiteHeader.vue'

const mainContent = ref(null)
</script>

<template>
  <div class="site-shell antialiased">
    <a
      class="skip-link"
      href="#main-content"
      @click="mainContent?.focus({ preventScroll: true })"
      >跳到主要内容</a
    >
    <div class="site-container">
      <SiteHeader />
      <main id="main-content" ref="mainContent" tabindex="-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.site-shell {
  min-height: 100vh;
  background: var(--site-background);
  color: var(--site-ink);
}
.site-container {
  max-width: var(--site-width);
  margin: 0 auto;
  padding: 0 var(--site-gutter);
}
#main-content {
  padding-bottom: 64px;
}
#main-content:focus {
  outline: none;
}
.skip-link {
  position: fixed;
  z-index: 100;
  top: 12px;
  left: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  background: var(--site-ink);
  color: white;
  transform: translateY(-160%);
}
.skip-link:focus {
  transform: none;
}
</style>
