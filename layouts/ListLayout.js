import { useState } from 'react'
import _ from 'lodash'
import CustomLink from '@components/Link'
import Tag from '@components/Tag'
import PageTitle from '@components/PageTitle'

export default function ListLayout({ posts, title, summary }) {
  const [searchValue, setSearchValue] = useState('')
  const filteredArticles = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  const groupedArticles = _.groupBy(filteredArticles, function (article) {
    return article.publishedOn.substring(0, 7)
  })

  return (
    <>
      <div className="mt-24">
        <PageTitle>{title}</PageTitle>
        <div className="prose prose-md lg:prose-lg dark:prose-dark mt-6">
          <p className="text-xl lg:text-2xl text-steel">{summary}</p>
          <div className="relative max-w-lg">
            <input
              aria-label="Search articles"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search articles"
              className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <svg
              className="absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-16 mb-24">
          {Object.keys(groupedArticles).length === 0 && 'No articles found.'}
          {Object.keys(groupedArticles).map((date) => {
            const months = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ]
            const month = months[+date.split('-')[1] - 1]
            return (
              <div key={date} className="mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-lg text-steel font-display font-bold uppercase mb-4 ">
                  {month} {date.split('-')[0]}
                </h2>
                <ul>
                  {groupedArticles[date].map((article) => {
                    const { slug, title, summary } = article
                    return (
                      <li key={slug} className="mb-4 last:mb-0">
                        <CustomLink href={`/articles/${slug}`} className="group">
                          <h3 className="text-lg lg:text-xl font-display font-bold group-hover:text-sea mb-1 transition-all">
                            {title}
                          </h3>
                          <p className="prose dark:prose-dark text-gray-500 dark:text-gray-400">
                            {summary}
                          </p>
                        </CustomLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
