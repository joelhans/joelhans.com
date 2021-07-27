const fs = require('fs')
const fsp = require('fs/promises')
const glob = require('fast-glob')
const matter = require('gray-matter')
const visit = require('unist-util-visit')
const { serialize } = require('next-mdx-remote/serialize')

;(async () => {
  const files = glob.sync(`./content/articles/**/*.{md,mdx}`)
  if (!files.length) return false

  let Links = []
  await Promise.all(
    files.map(async (filepath) => {
      const mdSource = await fsp.readFile(filepath)
      const { content, data } = matter(mdSource)
      await serialize(content, {
        mdxOptions: {
          scope: data,
          rehypePlugins: [
            () => {
              return (tree) => {
                visit(tree, 'element', (node, index, parent) => {
                  if (node.tagName === 'a' && node.properties.href.startsWith('/')) {
                    let sourceText = ''
                    if (parent.children.length > 0) {
                      // Map through the children of the parent, aka the sibling
                      // nodes to the `a` that we've extracted via walking the
                      // tree. If the element is text, return the text,
                      // otherwise start walking down its children in search of
                      // the text.
                      sourceText = parent.children.map((child) => {
                        if (child.type == 'text') {
                          return child.value
                        } else if (child.tagName == 'a') {
                          if (child.children[0].type == 'text') {
                            return child.children[0].value
                          } else {
                            return child.children[0].children[0].value
                          }
                        }
                      })

                      const obj = parent.children
                      const iterate = (obj) => {
                        Object.keys(obj).forEach((key) => {
                          // console.log(`key: ${key}, value: ${obj[key]}`)

                          console.log(obj[key])

                          // if (obj[key] == 'text') (
                          //   console.log(obj[key])
                          // )

                          if (typeof obj[key] === 'object') {
                            iterate(obj[key])
                          }
                        })
                      }

                      const text = iterate(parent.children)
                      console.log(text)
                    }

                    Links.push({
                      dest: node.properties.href,
                      sourceSlug: filepath.replace('./content', '').replace('.mdx', ''),
                      sourceTitle: data.title,
                      sourceText: sourceText,
                    })
                  }
                })
              }
            },
          ],
        },
      })
    })
  )

  fs.writeFileSync('./src/data/links.json', JSON.stringify(Links, null, 1))
})()
