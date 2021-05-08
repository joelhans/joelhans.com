import fs from 'fs'
import { promises as fsp } from 'fs'
import glob from 'fast-glob'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import { serialize } from 'next-mdx-remote/serialize'

import imgToJsx from './img-to-jsx'

const root = process.cwd()

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getSingleContent(contentPath, slug) {
  const filepath = path.join(root, contentPath, `${slug}.mdx`)

  // Get the contents of the `links.json` file, then filter the array down into
  // only those with a `dest` that matches the slug for the page being rendered.
  const links = JSON.parse(fs.readFileSync(path.join(root, `/src/data/links.json`), 'utf-8'))
  const LinkMap = links.filter(function (link) {
    return link['dest'] == path.join(contentPath, `${slug}`).replace('content', '')
  })

  console.log(LinkMap)

  const source = await fsp.readFile(filepath)
  const stat = fs.statSync(filepath).mtime
  const { content, data } = matter(source)

  const mdxSource = await serialize(content, {
    scope: data,
    mdxOptions: {
      remarkPlugins: [require('remark-slug'), require('remark-autolink-headings'), imgToJsx],
      inlineNotes: true,
      rehypePlugins: [],
    },
  })

  return {
    filepath,
    slug,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      readingTime: readingTime(content),
      slug: slug || null,
      lastmod: JSON.parse(JSON.stringify(stat)),
      ...data,
    },
    mdxSource,
    LinkMap,
  }
}

export async function getFrontMatter(source, filterDrafts) {
  const files = glob.sync(`${source}/**/*.{md,mdx}`)

  if (!files.length) return []

  const allFrontMatter = await Promise.all(
    files.map(async (filepath) => {
      const slug = filepath
        .replace(source, '')
        .replace(/^\/+/, '')
        .replace(new RegExp(path.extname(filepath) + '$'), '')

      const mdSource = await fsp.readFile(filepath)
      const { data } = matter(mdSource)

      // I'm not sure why, but I can't get the drafts working. I just need to launch.
      if (data.draft !== true) {
        return {
          ...data,
          slug: slug,
        }
      } else {
        return {}
      }

      // if (data.draft !== true && (filterDrafts !== false || filterDrafts == null)) {
      //   console.log('hi')
      //   return {
      //     ...data,
      //     slug: slug,
      //   }
      // } else if (data.draft === true && (filterDrafts === false || filterDrafts == null)) {
      //   console.log('hello')
      //   return {
      //     ...data,
      //     slug: slug,
      //   }
      // } else {
      //   console.log('fail')
      //   return {}
      // }
    })
  )

  // Use `.filter` here to get rid of any `{}` returned above. This means that
  // they're drafts, and shouldn't be returned to `getStaticProps`.
  return allFrontMatter
    .filter((value) => JSON.stringify(value) !== '{}')
    .sort((a, b) => dateSortDesc(a.date, b.date))
}
