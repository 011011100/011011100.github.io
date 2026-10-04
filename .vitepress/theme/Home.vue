<script setup>
import { useData } from 'vitepress'
const { frontmatter } = useData()
import Date from './Date.vue'
import PageHeader from './components/PageHeader.vue'
import { data as posts } from '../posts.data'
</script>

<template>
  <div>
    <PageHeader :title="frontmatter.title" :description="frontmatter.subtext" />
    <ul class="divide-y divide-gray-200">
      <li
        class="py-10 first:pt-0"
        v-for="{ title, href, date, excerpt } of posts"
        :key="href"
      >
        <article
          class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline"
        >
          <Date :date="date" />
          <div class="space-y-5 xl:col-span-3">
            <div class="space-y-6">
              <h2 class="text-2xl leading-8 font-bold tracking-tight">
                <a class="text-gray-900" :href="href">{{ title }}</a>
              </h2>
              <div
                v-if="excerpt"
                class="prose max-w-none text-gray-500"
                v-html="excerpt"
              ></div>
            </div>
            <div class="text-base leading-6 font-medium">
              <a class="link" aria-label="read more" :href="href"
                >Read more →</a
              >
            </div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>
