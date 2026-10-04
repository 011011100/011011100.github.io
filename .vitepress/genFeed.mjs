import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createContentLoader } from 'vitepress'
import { Feed } from 'feed'
import { parsePostDate } from './post-utils.mjs'

export const siteUrl = 'https://011011100.github.io'

function resolveFeedLinks(html, pageUrl) {
  return html?.replace(/\b(href|src)="([^"]+)"/g, (attribute, name, value) => {
    // Markdown uses public/ paths locally, but Vite serves these at the site root.
    if (/^[a-z][a-z\d+.-]*:/i.test(value)) return attribute
    const url = new URL(value, new URL(pageUrl, siteUrl))
    if (url.origin === siteUrl)
      url.pathname = url.pathname.replace(/^\/public\//, '/')
    return `${name}="${url.href}"`
  })
}

export function createFeed(pages) {
  const posts = pages
    .map((page) => ({
      ...page,
      date: parsePostDate(page.frontmatter.date, page.url)
    }))
    .sort((a, b) => b.date - a.date || a.url.localeCompare(b.url))

  const feed = new Feed({
    title: '011011100 · Blog',
    description: '记录、代码与动画实验。',
    id: siteUrl,
    link: siteUrl,
    language: 'zh-CN',
    image: `${siteUrl}/logo.svg`,
    favicon: `${siteUrl}/logo.svg`,
    updated: posts[0]?.date,
    copyright: 'Copyright © 011011100',
    feedLinks: { rss: `${siteUrl}/feed.rss` }
  })

  for (const { url, frontmatter, excerpt, html, date } of posts) {
    const link = new URL(url, siteUrl).href
    const authorLink = frontmatter.github
      ? `https://github.com/${frontmatter.github.replace(/^@/, '')}`
      : frontmatter.twitter
        ? `https://twitter.com/${frontmatter.twitter.replace(/^@/, '')}`
        : undefined

    feed.addItem({
      title: frontmatter.title,
      id: link,
      link,
      description: resolveFeedLinks(excerpt, url) || undefined,
      content: resolveFeedLinks(html, url),
      author: frontmatter.author
        ? [{ name: frontmatter.author, link: authorLink }]
        : undefined,
      date
    })
  }
  return feed.rss2()
}

export async function generateFeed(config) {
  // Read Markdown directly: feed generation no longer depends on layout markup.
  const posts = await createContentLoader('posts/**/*.md', {
    excerpt: true,
    render: true
  }).load()
  await writeFile(join(config.outDir, 'feed.rss'), createFeed(posts))
}
