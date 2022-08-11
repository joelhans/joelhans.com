import siteMetadata from '@data/siteMetadata'
import { ARTICLES_CONTENT_PATH } from '@config/constants'
import { getFrontMatter } from '@/lib/mdx'
import ListLayout from '@layouts/ListLayout'
import { PageSEO } from '@components/SEO'

export async function getStaticProps() {
  const posts = await getFrontMatter(ARTICLES_CONTENT_PATH, true)
  return { props: { posts } }
}

export default function Posts({ posts }) {
  return (
    <>
      <PageSEO
        title={`Articles • ${siteMetadata.title}`}
        description={`Updates about my writing, from fiction to copy, and any of the other disguises I wear from time to time.`}
      />
      <ListLayout
        posts={posts}
        title="Articles"
        summary="Updates about my writing, from fiction to copy, and any of the other disguises I wear from time to time."
      />
    </>
  )
}
