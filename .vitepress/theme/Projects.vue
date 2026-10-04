<template>
  <div>
    <PageHeader :title="frontmatter.title" :description="frontmatter.subtext" />

    <div>
      <template v-for="key in Object.keys(frontmatter.projects)" :key="key">
        <h2 class="mt-10 first:mt-0 font-bold">
          {{ key }}
        </h2>
        <div class="project-grid py-2 -mx-3 gap-2">
          <a
            v-for="(item, idx) in frontmatter.projects[key]"
            :key="idx"
            class="item relative flex items-center"
            :href="item.link"
            target="_blank"
            :class="
              !item.link ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4' : ''
            "
          >
            <div v-if="item.icon" class="pt-2 pr-5">
              <Simple
                v-if="item.icon === 'simple'"
                class="text-4xl opacity-50"
              />
              <blueBall
                v-else-if="item.icon === 'blueBall'"
                class="text-4xl opacity-50"
              />
              <Unknown v-else class="text-4xl opacity-50" />
            </div>
            <div class="flex-auto">
              <div class="text-normal">{{ item.name }}</div>
              <div
                class="desc text-sm opacity-50 font-normal"
                v-html="item.desc"
              />
            </div>
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import PageHeader from './components/PageHeader.vue'
const { frontmatter } = useData()
import Simple from './icon/Simple.vue'
import Unknown from './icon/Unknown.vue'
import blueBall from './icon/PokeBall.vue'
</script>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
.project-grid a.item {
  padding: 0.8em 1em;
  background: transparent;
  font-size: 1.1rem;
}
.project-grid a.item:hover {
  background: #88888808;
}
</style>
