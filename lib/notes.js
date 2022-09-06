import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

/**
 * render all .md files in any folder. (under /posts/notes/** )
 */

const notesDirectory = path.join(process.cwd(), 'posts/notes')

// export function getNoteHomePagePostList() {
//   // Get file names under /posts
//   return readFolder('').sort((a, b) => {
//     if (a.nonexist && !b.nonexist) {
//       return -1
//     }
//     if (!a.nonexist && b.nonexist) {
//       return 1
//     }
//     if (a.nonexist && b.nonexist) {
//       return -1
//     }
//     return a.date < b.date ? 1 : -1
//   }).map(file => {
//     if (file.type === 'directory') {
//       return { ...file, children: [] } // remove children?
//     }
//     return file
//   })
// }

export function getAllPosts() {
  const extractChildren = (files=[]) => {
    return (files || []).map(file => {
      if (file.type === 'directory') {
        return [...extractChildren(file.children), file]
      }
      return file
    })
  }
  return extractChildren(readFolder('')).flat()
}

function capitalizeFirstLetter(word) {
  function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  return word.split(/_|-/).map(capitalizeFirst).join(' ')
}

/**
 * will append a default index.md file in return.
 * @param {*} folder 
 */
function readFolder(folder, deeply=true) {
  const fileNames = fs.readdirSync(path.join(notesDirectory, folder))
  const files = fileNames.map(filename => {
    const filepath = path.join(folder, filename)
    const absolutePath = path.join(notesDirectory, filepath)
    if (fs.lstatSync(absolutePath).isDirectory()) {
      // index file exists?
      const indexFilePath = path.join(absolutePath, 'index.md')
      if (fs.existsSync(indexFilePath)) {
        // index file existes, return a index.md instead of a normal content.
        const fileContents = fs.readFileSync(indexFilePath, 'utf8')
        const matterResult = matter(fileContents)
        return [{
          folder,
          type: 'directory',
          slug: folder === '' ? [filename] : [folder, filename],
          children: deeply ? readFolder(filepath) : [],
          ...matterResult.data,
        }]
      } else {
        // index file not exist, then return a content?
        return [{
          folder,
          type: 'directory',
          slug: folder === '' ? [filename] : [folder, filename],
          children: deeply ? readFolder(filepath) : [],
          title: capitalizeFirstLetter(filename),
        }, {
          folder,
          type: 'file',
          slug: folder === '' ? [filename] : [folder, filename, 'index'],
          // children: deeply ? readFolder(filepath) : [],
          title: capitalizeFirstLetter(filename),
          hide: true, // do not show it on content list.
        }]
      }
    } else { // not directory, may be a .md file
      if (filename.endsWith('.md')) {
        const fileContents = fs.readFileSync(absolutePath, 'utf8')
        const matterResult = matter(fileContents)
        return {
          folder,
          type: 'file',
          slug: folder === '' ? [filename.replace(/\.md$/, '')] : [folder, filename.replace(/\.md$/, '')],
          ...matterResult.data
        }
      }
      return null // ignore file which is not markdown.
    }
  }).filter(file => !!file).flat()
  if (files.find(file => file.slug.includes('index'))) {
    return files
  }
  return files.concat({
    folder,
    type: 'file',
    slug: folder === '' ? ['index'] : [folder, 'index'],
    title: capitalizeFirstLetter(folder),
    nonexist: true,
    hide: true,
  })
}

async function renderMarkdown(filepath) {
  const fileContents = fs.readFileSync(filepath, 'utf8')
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    // slug,
    contentHtml,
    ...matterResult.data
  }
}

export async function getOnePostData(slug) {
  console.log('========================================================================')
  console.log('SLUG::', slug)
  const filepath = path.join(notesDirectory, slug.join('/'))
  if (fs.existsSync(filepath)) {
    // it is a folder
    const backto = slug.length >= 1 ? slug.slice(0, slug.length - 1) : [slug[0]]
    const indexFilePath = path.join(filepath, 'index.md')
    if (fs.existsSync(indexFilePath)) {
      // index file existes!
      return {
        ...await renderMarkdown(indexFilePath),
        layout: 'content-custom',
        backto: backto.join('/'),
      }
    } else {
      // return a default content list
      return {
        title: capitalizeFirstLetter(slug[slug.length - 1]),
        contentList: readFolder(slug.join('/'), false),
        layout: 'content-list',
        backto: backto.join('/'),
      }
    }
  } else {
    if (filepath.endsWith("index")) {
      const indexFilePath = filepath + '.md'
      if (fs.existsSync(indexFilePath)) { // exist index.md
        const backto = slug.length >= 2 ? slug.slice(0, slug.length - 2) : [slug[0]]
        return {
          ...await renderMarkdown(indexFilePath),
          layout: 'post',
          backto: backto.join('/'),
        }
      } else { // render normal content
        const dir = slug.slice(0, slug.length - 1).join('/')
        const title = slug.length >= 2 ? slug[slug.length - 2] : slug[0]
        const backto = slug.length >= 2 ? slug.slice(0, slug.length - 2) : [slug[0]]
        return {
          title: capitalizeFirstLetter(title === 'index' ? '' : title),
          contentList: readFolder(dir, false),
          layout: 'content-list',
          backto: backto.join('/'),
        }
      }
    }
    // it is a markdown file
    const backto = slug.length >= 1 ? slug.slice(0, slug.length - 1) : [slug[0]]
    return {
      ...await renderMarkdown(filepath + ".md"),
      layout: 'post',
      backto: backto.join('/'),
    }
  }
}
