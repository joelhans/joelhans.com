import siteMetadata from '@data/siteMetadata'

const generateRssItem = (post) => {
  const title = post.title.replace('&', '&amp;')
  const description = post.summary.replace('&', '&amp;')

  return `
      <item>
        <guid>${siteMetadata.siteUrl}/articles/${post.slug}</guid>
        <title>${title}</title>
        <link>${siteMetadata.siteUrl}/articles/${post.slug}</link>
        <description>${description}</description>
        <pubDate>${new Date(post.publishedOn).toUTCString()}</pubDate>
        <author>${siteMetadata.email} (${siteMetadata.author})</author>
        ${post.tags.map((t) => `<category>${t}</category>`).join('')}
      </item>
    `
}

const generateRss = (posts, page = 'index.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${siteMetadata.title}</title>
      <link>${siteMetadata.siteUrl}/articles</link>
      <description>${siteMetadata.description}</description>
      <language>${siteMetadata.language}</language>
      <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
      <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].publishedOn).toUTCString()}</lastBuildDate>
      <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`
export default generateRss
