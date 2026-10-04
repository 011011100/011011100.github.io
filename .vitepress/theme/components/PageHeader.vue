<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' }
})
</script>

<template>
  <header class="page-header">
    <h1>{{ title }}</h1>
    <p v-if="description" class="page-description">{{ description }}</p>
    <div v-if="$slots.meta" class="page-meta"><slot name="meta" /></div>
  </header>
</template>

<style scoped>
.page-header {
  padding: 24px 0 32px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--site-border);
}
h1 {
  margin: 0;
  font-size: clamp(32px, 4.5vw, 48px);
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -0.035em;
  overflow-wrap: anywhere;
  color: var(--site-ink);
}
.page-description,
.page-meta {
  margin-top: 16px;
  color: var(--site-muted);
  font-size: 16px;
  line-height: 1.75;
}
.page-description {
  max-width: 42rem;
}
@media (max-width: 600px) {
  .page-header {
    padding: 16px 0 24px;
    margin-bottom: 24px;
  }
  .page-description {
    font-size: 15px;
  }
}
</style>
