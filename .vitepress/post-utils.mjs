const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC'
})

export function parsePostDate(value, url) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing date in ${url}`)
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date in ${url}: ${value}`)
  }
  return date
}

export function createPostIndex(pages) {
  return pages
    .map(({ url, frontmatter, excerpt }) => {
      if (!frontmatter.title) throw new Error(`Missing title in ${url}`)
      const date = parsePostDate(frontmatter.date, url)
      return {
        title: frontmatter.title,
        href: url,
        date: { time: date.getTime(), string: dateFormatter.format(date) },
        excerpt: excerpt || ''
      }
    })
    .sort((a, b) => b.date.time - a.date.time || a.href.localeCompare(b.href))
}
