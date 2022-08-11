import Image from 'next/image'
import { getSingleContent } from '@/lib/mdx'
import { PageSEO } from '@components/SEO'
import { BASE_CONTENT_PATH } from '@config/constants'
import PageTitle from '@components/PageTitle'
import { MDXLayoutRenderer } from '@components/MDXComponents'

export async function getStaticProps() {
  const content = await getSingleContent(BASE_CONTENT_PATH, 'portfolio')
  return { props: { content } }
}

export default function About({ content }) {
  const { mdxSource, frontMatter } = content

  return (
    <>
      <PageSEO title={frontMatter.title} description={frontMatter.summary} />
      <header className="flex flex-row flex-wrap md:space-x-6 md:flex-nowrap mt-24">
        <div>
          <PageTitle>{frontMatter.title}</PageTitle>
          <p className="text-xl lg:text-2xl text-steel">
            {frontMatter.summary} {frontMatter.summary_cont}
          </p>
        </div>
      </header>
      <div className="flex flex-row flex-nowrap items-start">
        <div className="prose prose-md lg:prose-lg dark:prose-dark mt-8 md:mt-16 mb-24">
          <MDXLayoutRenderer mdxSource={mdxSource} frontMatter={frontMatter} />
        </div>
      </div>
    </>
  )
}
