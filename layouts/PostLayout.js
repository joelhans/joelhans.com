import CustomLink from '@components/Link'
import PageTitle from '@components/PageTitle'
import SectionContainer from '@components/SectionContainer'
import { BlogSeo } from '@components/SEO'
import siteMetdata from '@data/siteMetadata'

const postDateTemplate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

export default function PostLayout({ children, frontMatter, LinkMap }) {
  const { title, lastmod } = frontMatter

  console.log(LinkMap)

  return (
    <SectionContainer>
      <BlogSeo url={`${siteMetdata.siteUrl}/articles/${frontMatter.slug}`} {...frontMatter} />
      <article>
        <div className="">
          <header className="py-8 md:py-16 text-center">
            <PageTitle>{title}</PageTitle>
          </header>

          <div className="mb-24" style={{ gridTemplateRows: 'auto 1fr' }}>
            <div className="prose prose-md lg:prose-lg xl:prose-xl dark:prose-dark mx-auto">
              <div className="pb-8">{children}</div>

              {LinkMap && (
                <div className="max-w-none prose dark:prose-dark bg-sea bg-opacity-10 p-6 mb-16 rounded">
                  <h3>
                    Articles that link to <em>{title}</em>:
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    {LinkMap.map((link) => (
                      <CustomLink
                        key={`${link.dest}${link.sourceTitle}`}
                        className="block"
                        href={link.sourceSlug}
                      >
                        {link.sourceTitle}
                      </CustomLink>
                    ))}
                  </div>
                </div>
              )}

              <footer>
                <div className="">
                  <p className="text-base font-bold text-gray-500 dark:text-gray-400 mb-8">
                    Last updated:{' '}
                    <time dateTime={lastmod}>
                      {new Date(lastmod).toLocaleDateString(siteMetdata.locale, postDateTemplate)}
                    </time>
                  </p>
                  <CustomLink
                    href="/articles"
                    className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    &larr; See my other articles
                  </CustomLink>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
