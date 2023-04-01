import Image from 'next/image'
import siteMetadata from '@data/siteMetadata'
import { getSingleContent } from '@/lib/mdx'
import { PageSEO } from '@components/SEO'
import { BASE_CONTENT_PATH } from '@config/constants'
import PageTitle from '@components/PageTitle'
import { MDXLayoutRenderer } from '@components/MDXComponents'

export async function getStaticProps() {
  const content = await getSingleContent(BASE_CONTENT_PATH, 'about')
  return { props: { content } }
}

export default function About({ content }) {
  const { mdxSource, frontMatter } = content

  return (
    <>
      <PageSEO
        title={`${frontMatter.title} • ${siteMetadata.title}`}
        description={frontMatter.summary}
      />
      {/* <header className="flex flex-row flex-wrap md:space-x-6 md:flex-nowrap mt-24">
        <PageTitle>Who am I?</PageTitle>
      </header> */}
      <div className="flex flex-row flex-wrap items-start mt-24">
        <div className="prose prose-md lg:prose-lg dark:prose-dark mb-24">
          <MDXLayoutRenderer mdxSource={mdxSource} frontMatter={frontMatter} />
          <div className="mt-8">
            <Image
              width={2000}
              height={1500}
              src="/static/images/me-girls.jpeg"
              className="rounded !mt-8"
              alt="Joel Hans and his daughters"
            />
            <p className="!-mt-2">Me and my daughters. Mt. Lemmon, Arizona. Nov 8, 2021.</p>
          </div>
        </div>
      </div>
    </>
  )
}
