import fs from 'fs'
import { promises as fsp } from 'fs'
import glob from 'fast-glob'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import BananaSlug from 'github-slugger'
import { bundleMDX } from 'mdx-bundler'
import remarkSlug from 'remark-slug'
import remarkAutolinkHeadings from 'remark-autolink-headings'
import remarkImgToJsx from './img-to-jsx'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { ARTICLES_CONTENT_PATH } from '@config/constants'

const root = process.cwd()

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getSingleContent(contentPath, slug) {
  const filepath = path.join(root, contentPath, `${slug}.mdx`)

  const { frontmatter, code } = await bundleMDX({
    file: filepath,
    cwd: path.join(process.cwd(), 'src/components'),
    xdmOptions(options) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkSlug,
        remarkAutolinkHeadings,
        remarkImgToJsx,
        remarkMath,
      ]
      options.rehypePlugins = [...(options.rehypePlugins ?? []), rehypeKatex]
      return options
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      return options
    },
  })

  return {
    mdxSource: code,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      ...frontmatter,
    },
  }
}

export async function getFrontMatter(source) {
  const files = glob.sync(`${source}/**/*.{md,mdx}`)
  if (!files.length) return []

  const allFrontMatter = await Promise.all(
    files.map(async (filepath) => {
      let slug = filepath
        .replace(source, '')
        .replace(/^\/+/, '')
        .replace(new RegExp(path.extname(filepath) + '$'), '')

      // If we're looking at an article, then we split the slug from the date.
      // Otherwise, like for work items, we retain as-is.
      if (source == ARTICLES_CONTENT_PATH && slug.includes('_')) {
        slug = slug.split('_')[1]
      }

      const mdSource = await fs.readFileSync(filepath)
      const { data } = matter(mdSource)
      return {
        ...data,
        slug: slug,
      }
    })
  )

  // Use `.filter` here to get rid of any `{}` returned above. This means that
  // they're drafts, and shouldn't be returned to `getStaticProps`.
  return allFrontMatter
    .filter((value) => JSON.stringify(value) !== '{}')
    .sort((a, b) => dateSortDesc(a.publishedOn, b.publishedOn))
}

export async function buildTOC(source) {
  // Get each line individually, and filter out anything that
  // isn't a heading.
  const headingLines = source.split('\n').filter((line) => {
    return line.match(/^###*\s/)
  })

  const headings = await Promise.all(
    headingLines.map((raw) => {
      const text = raw.replace(/^###*\s/, '')
      // I only care about h2 and h3.
      // If I wanted more levels, I'd need to count the
      // number of #s.
      const level = raw.slice(0, 3) === '###' ? 3 : 2
      const hash = `#${BananaSlug.slug(text)}`

      return { text, level, hash }
    })
  )

  return headings
}
