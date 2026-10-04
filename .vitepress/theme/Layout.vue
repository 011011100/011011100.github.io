<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import Me from './Me.vue'
import Home from './Home.vue'
import Projects from './Projects.vue'
import Article from './Article.vue'

const route = useRoute()
const { page, frontmatter } = useData()
const path = computed(
  () =>
    decodeURI(route.path)
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '')
      .replace(/\/$/, '') || '/'
)
const isLab = computed(() => frontmatter.value.layout === 'lab')
const navigation = [
  { href: '/', path: '/', label: '个人介绍' },
  { href: '/blog.html', path: '/blog', label: '我的博客' },
  { href: '/projects.html', path: '/projects', label: '我的项目' },
  { href: '/lab.html', path: '/lab', label: '动画实验室' }
]
</script>

<template>
  <div class="site-shell antialiased" :class="{ 'lab-shell': isLab }">
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <div class="site-container">
      <nav class="site-nav" aria-label="主要导航">
        <a class="site-logo" href="/" aria-label="李卓航的博客首页"
          ><img src="/logo.svg" width="36" height="31" alt=""
        /></a>
        <div class="nav-links">
          <a
            v-for="item in navigation"
            :key="item.path"
            :href="item.href"
            :aria-current="path === item.path ? 'page' : undefined"
            >{{ item.label }}</a
          >
          <a
            href="https://github.com/011011100"
            target="_blank"
            rel="noopener noreferrer"
            >GitHub ↗</a
          >
        </div>
      </nav>
      <main id="main-content" tabindex="-1">
        <div v-if="page.isNotFound" class="not-found">
          <span>404</span>
          <h1>这一页还没有写下。</h1>
          <p>也许地址变了，回到博客继续看看吧。</p>
          <a class="link" href="/blog.html">返回博客 →</a>
        </div>
        <Me v-else-if="path === '/'" />
        <Home v-else-if="path === '/blog'" />
        <Projects v-else-if="path === '/projects'" />
        <Content v-else-if="isLab" />
        <Article v-else-if="path.startsWith('/posts/')" :key="route.path" />
        <Content v-else class="prose max-w-none py-10" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.site-shell {
  min-height: 100vh;
}
.site-container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 24px;
}
.site-nav {
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
.nav-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px 23px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
}
.nav-links a {
  padding: 6px 0;
}
.nav-links a[aria-current='page'] {
  color: #263521;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 7px;
}
.lab-shell {
  background: #f7f8f2;
}
.lab-shell .site-nav {
  border-bottom: 1px solid #e2e5d9;
  margin-bottom: 16px;
}
.lab-shell .site-container {
  max-width: 1048px;
}
.skip-link {
  position: fixed;
  z-index: 100;
  top: 12px;
  left: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  background: #202b1b;
  color: white;
  transform: translateY(-160%);
}
.skip-link:focus {
  transform: none;
}
a:focus-visible {
  outline: 2px solid #687c4d;
  outline-offset: 5px;
}
#main-content:focus {
  outline: none;
}
.not-found {
  padding: 90px 0;
}
.not-found > span {
  color: #7b8a6e;
  font:
    14px ui-monospace,
    monospace;
}
.not-found h1 {
  font-size: 32px;
  margin: 18px 0;
}
.not-found p {
  color: #737b6c;
  margin-bottom: 24px;
}
@media (hover: hover) and (pointer: fine) {
  .nav-links a:hover {
    color: #202b1b;
  }
}
@media (max-width: 600px) {
  .site-container {
    padding: 0 20px;
  }
  .site-nav {
    padding: 24px 0;
    gap: 20px;
    align-items: flex-start;
  }
  .site-logo {
    padding-top: 5px;
  }
  .nav-links {
    gap: 4px 16px;
    font-size: 12px;
  }
  .nav-links a {
    padding: 5px 0;
  }
}
</style>
