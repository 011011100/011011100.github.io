<script setup>
import { useData } from 'vitepress'
import PageHeader from './components/PageHeader.vue'

const { frontmatter } = useData()
</script>

<template>
  <div>
    <PageHeader :title="frontmatter.title" description="你好 (⨞:|】" />
    <div class="about-content prose">
      <h2>我的名字是 {{ frontmatter.englishName }}.</h2>
      <p>
        我馬上就不是個學生啦, 這是我的開源社區
        <a
          class="link"
          :href="frontmatter.githubLink"
          target="_blank"
          rel="noopener noreferrer"
          >GitHub</a
        >.
      </p>
      <p>
        我的 {{ frontmatter.speakLanguage }} 名字
        {{ frontmatter.languageName }} ({{
          frontmatter.languagePronunciation
        }}).<br />
        如果你的母語也是 {{ frontmatter.speakLanguage }}, 或許我們可以交個朋友
      </p>
      <p>嗨嗨嗨。</p>
    </div>
  </div>
</template>

<style scoped>
.about-content > :first-child {
  margin-top: 0;
}
</style>
