import { createContentLoader } from 'vitepress'
import { createPostIndex } from './post-utils.mjs'

// Keep the theme's compact data interface; full HTML belongs only in the feed.
export default createContentLoader('posts/**/*.md', {
  excerpt: true,
  transform: createPostIndex
})
