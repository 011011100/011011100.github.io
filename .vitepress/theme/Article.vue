<script setup>
import Date from './Date.vue'
import Author from './Author.vue'
import PageHeader from './components/PageHeader.vue'
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from '../posts.data'

const { frontmatter: data } = useData()

const route = useRoute()

function findCurrentIndex() {
  return posts.findIndex(
    (p) =>
      p.href.replace(/\.html$/, '') ===
      decodeURI(route.path).replace(/\.html$/, '')
  )
}

// use the customData date which contains pre-resolved date info
const date = computed(() => posts[findCurrentIndex()]?.date)
const nextPost = computed(() => posts[findCurrentIndex() - 1])
const prevPost = computed(() => posts[findCurrentIndex() + 1])
</script>

<template>
  <article>
    <PageHeader :title="data.title">
      <template v-if="date" #meta><Date :date="date" /></template>
    </PageHeader>

    <div
      class="divide-y xl:divide-y-0 divide-gray-200 xl:grid xl:grid-cols-4 xl:gap-x-10"
      style="grid-template-rows: auto 1fr"
    >
      <Author />
      <div class="divide-y divide-gray-200 xl:pb-0 xl:col-span-3 xl:row-span-2">
        <Content class="prose max-w-none pt-10 pb-8" />
      </div>

      <footer
        class="text-sm font-medium leading-5 divide-y divide-gray-200 xl:col-start-1 xl:row-start-2"
      >
        <div v-if="nextPost" class="py-8">
          <h2 class="text-xs tracking-wide uppercase text-gray-500">
            Next Article
          </h2>
          <div class="link">
            <a :href="nextPost.href">{{ nextPost.title }}</a>
          </div>
        </div>
        <div v-if="prevPost" class="py-8">
          <h2 class="text-xs tracking-wide uppercase text-gray-500">
            Previous Article
          </h2>
          <div class="link">
            <a :href="prevPost.href">{{ prevPost.title }}</a>
          </div>
        </div>
        <div class="pt-8">
          <a class="link" href="/blog.html">← Back to the blog</a>
        </div>
      </footer>
    </div>
  </article>
</template>
