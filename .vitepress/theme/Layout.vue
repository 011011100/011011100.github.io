<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import Me from './Me.vue'
import Home from './Home.vue'
import Projects from './Projects.vue'
import Article from './Article.vue'
import SiteLayout from './components/SiteLayout.vue'
import PageHeader from './components/PageHeader.vue'

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
</script>

<template>
  <SiteLayout>
    <div v-if="page.isNotFound">
      <PageHeader
        title="这一页还没有写下。"
        description="也许地址变了，回到博客继续看看吧。"
      >
        <template #meta>404</template>
      </PageHeader>
      <a class="link" href="/blog.html">返回博客 →</a>
    </div>
    <Me v-else-if="path === '/'" />
    <Home v-else-if="path === '/blog'" />
    <Projects v-else-if="path === '/projects'" />
    <Content v-else-if="isLab" />
    <Article v-else-if="path.startsWith('/posts/')" :key="route.path" />
    <Content v-else class="prose max-w-none py-10" />
  </SiteLayout>
</template>
