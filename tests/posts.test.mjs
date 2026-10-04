import test from 'node:test'
import assert from 'node:assert/strict'
import { createPostIndex, parsePostDate } from '../.vitepress/post-utils.mjs'
import { createFeed } from '../.vitepress/genFeed.mjs'

const page = (url, date, extra = {}) => ({
  url,
  frontmatter: { title: '文章', date, author: '作者', ...extra },
  excerpt: '<p>摘要</p>',
  html: '<h2 id="content">完整正文</h2><a href="#content">章节</a><img src="../public/picture.png">'
})

test('post index preserves theme fields and sorts newest first without shipping full HTML', () => {
  const date = new Date('2022-04-15T00:00:00.000Z')
  const originalTime = date.getTime()
  const posts = createPostIndex([
    page('/posts/older.html', date),
    page('/posts/newer.html', '2026-10-04')
  ])
  assert.deepEqual(
    posts.map((post) => post.href),
    ['/posts/newer.html', '/posts/older.html']
  )
  assert.deepEqual(Object.keys(posts[0]), ['title', 'href', 'date', 'excerpt'])
  assert.equal(posts[0].date.string, '2026年10月4日')
  assert.equal(posts[0].date.time, Date.parse('2026-10-04T00:00:00.000Z'))
  assert.equal(date.getTime(), originalTime)
})

test('invalid or missing metadata fails clearly instead of corrupting index and feed dates', () => {
  assert.throws(
    () => parsePostDate(undefined, '/posts/missing.html'),
    /Missing date.*missing/
  )
  assert.throws(
    () => parsePostDate('not-a-date', '/posts/invalid.html'),
    /Invalid date.*invalid/
  )
  assert.throws(
    () =>
      createPostIndex([
        page('/posts/untitled.html', '2026-10-04', { title: '' })
      ]),
    /Missing title/
  )
})

test('RSS uses the real site URL, rendered Markdown, stable dates and original author names', () => {
  const rss = createFeed([
    page('/posts/newer.html', '2026-10-04', { github: '@011011100' }),
    page('/posts/older.html', new Date('2022-04-15'), { twitter: '@huchengye' })
  ])
  assert.match(rss, /https:\/\/011011100.github.io\/posts\/newer.html/)
  assert.match(rss, /完整正文/)
  assert.match(rss, /https:\/\/011011100.github.io\/posts\/newer.html#content/)
  assert.match(rss, /src="https:\/\/011011100.github.io\/picture.png"/)
  assert.match(rss, /Sun, 04 Oct 2026 00:00:00 GMT/)
  assert.match(rss, /<author>作者<\/author>/)
  assert.doesNotMatch(rss, /simple\.elonehoo\.xyz|https:\/\/elonehoo\.xyz/)
})
