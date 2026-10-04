import { defineConfig } from 'vitepress'
import { generateFeed, siteUrl } from './genFeed.mjs'

export default defineConfig({
  base: '/',
  lang: 'zh-CN',
  title: '011011100 · Blog',
  description: '记录、代码与动画实验。',
  sitemap: { hostname: siteUrl },
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/logo.svg'
      }
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: '011011100 · Blog',
        href: '/feed.rss'
      }
    ],
    ['meta', { name: 'theme-color', content: '#f7f7f2' }]
  ],
  buildEnd: generateFeed
})
