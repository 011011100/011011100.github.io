<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const route = useRoute()
const { page, frontmatter } = useData()
const activeSection = computed(() => {
  if (page.value.isNotFound) return null
  if (frontmatter.value.layout === 'lab') return '/lab'
  const path =
    decodeURI(route.path)
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '')
      .replace(/\/$/, '') || '/'
  return path.startsWith('/posts/') ? '/blog' : path
})
const navigation = [
  { href: '/', path: '/', label: '个人介绍' },
  { href: '/blog.html', path: '/blog', label: '我的博客' },
  { href: '/projects.html', path: '/projects', label: '我的项目' },
  { href: '/lab.html', path: '/lab', label: '动画实验室' }
]
</script>

<template>
  <header class="site-header">
    <a class="site-logo" href="/" aria-label="李卓航的博客首页">
      <img src="/logo.svg" width="36" height="31" alt="" />
    </a>
    <nav class="site-nav" aria-label="主要导航">
      <a
        v-for="item in navigation"
        :key="item.path"
        :href="item.href"
        :aria-current="activeSection === item.path ? 'page' : undefined"
        >{{ item.label }}</a
      >
      <a
        href="https://github.com/011011100"
        target="_blank"
        rel="noopener noreferrer"
        >GitHub ↗</a
      >
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 38px 0;
}
.site-logo {
  display: block;
  flex-shrink: 0;
}
.site-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px 23px;
  font-size: 13px;
  font-weight: 600;
  color: var(--site-muted);
}
.site-nav a {
  padding: 6px 0;
}
.site-nav a[aria-current='page'] {
  color: var(--site-accent);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 7px;
}
@media (hover: hover) and (pointer: fine) {
  .site-nav a:hover {
    color: var(--site-accent);
  }
}
@media (max-width: 600px) {
  .site-header {
    padding: 24px 0;
    gap: 20px;
    align-items: flex-start;
  }
  .site-logo {
    padding-top: 5px;
  }
  .site-nav {
    gap: 4px 16px;
    font-size: 12px;
  }
  .site-nav a {
    padding: 5px 0;
  }
}
</style>
