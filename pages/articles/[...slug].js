import fs from 'fs'
import { getFrontMatter, getSingleContent } from '@/lib/mdx'
import generateRss from '@/lib/generate-rss'
import { ARTICLES_CONTENT_PATH } from '@config/constants'
import PostLayout from '@/layouts/PostLayout'
import MDXComponents from '@components/MDXComponents'
import { MDXRemote } from 'next-mdx-remote'

export async function getStaticPaths() {
  const posts = await getFrontMatter(ARTICLES_CONTENT_PATH, false)
  const paths = posts.map(({ slug }) => ({
    params: {
      slug: slug.split('/'),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const postSlug = slug.join('/')
  const content = await getSingleContent(ARTICLES_CONTENT_PATH, postSlug)

  const posts = await getFrontMatter(ARTICLES_CONTENT_PATH, false)
  const rss = generateRss(posts)
  fs.writeFileSync('./public/index.xml', rss)

  if (!content) {
    console.warn(`No content found for slug ${postSlug}`)
  }

  return {
    props: {
      mdxSource: content.mdxSource,
      frontMatter: content.frontMatter,
      LinkMap: content.LinkMap,
    },
  }
}

export default function Article({ mdxSource, frontMatter, LinkMap }) {
  // Detect the development environment.
  const env = process.env.NODE_ENV

  console.log(LinkMap)

  return (
    <>
      {frontMatter.draft !== true || (frontMatter.draft === true && env === 'development') ? (
        <PostLayout frontMatter={frontMatter} LinkMap={LinkMap}>
          <MDXRemote {...mdxSource} components={MDXComponents} />
        </PostLayout>
      ) : (
        <div className="my-48 text-center">
          <h1 className="text-xl font-bold">
            Under construction.{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </h1>
        </div>
      )}
    </>
  )
}
