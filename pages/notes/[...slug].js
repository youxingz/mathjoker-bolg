import Layout, { siteTitle } from '../../components/layout'
import { getAllPosts, getOnePostData } from '../../lib/notes'
import Head from 'next/head'
import Date from '../../components/date'
import Link from 'next/link'
import utilStyles from '../../styles/utils.module.css'
import { useEffect } from 'react'
import renderLatex from '/lib/katex_render'

export default function SlugPage(props) {
  const { postData } = props
  if (!postData) return <div>404</div>
  switch (postData.layout) {
    case 'content-list':
      return Content({
        contentData: postData.contentList || [],
        contentTitle: postData.title,
      })
    case 'content-custom':
      return Post({ postData })
    case 'post':
      return Post({ postData })
    default:
      throw Error('Unknown file type: []')
  }
}

function Content(props) {
  const { contentData, contentTitle } = props
  useEffect(() => {
    renderLatex()
  }, [props.contentTitle])

  return (
    <Layout note>
      <Head>
        <title>{siteTitle} | { contentTitle || 'Notes' }</title>
      </Head>
      {/* <section className={utilStyles.headingMd}>
        <p>
          Hello, I’m <strong>Youxing Z</strong>.
        </p>
        <p>
          Here are some notes about Mathematics and Computer Science.
        </p>
      </section> */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Content { contentTitle && `of ${contentTitle}` }</h2>
        <ul className={utilStyles.list}>
          {contentData.filter(file => !file.hide && file.title).map(({ slug, title, date }) => (
            <li className={utilStyles.listItem} key={slug.join('/')}>
              <Link href={`/notes/${slug.join('/')}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                { date && <Date dateString={date} /> }
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

function Post(props) {
  const { postData } = props
  useEffect(() => {
    renderLatex()
  }, [props.postData])

  // console.log({ postData })
  return (
    <Layout previous={`/notes/${postData.backto}`}>
      <Head>
        <title>{postData.title} | {siteTitle}</title>
      </Head>
      <article>
      {/* <h1 className={utilStyles.headingXl}>{postData.title}</h1> */}
        <h2>{postData.title}</h2>
        <div className={utilStyles.lightText}>
          { postData.date && <Date dateString={postData.date} />}
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: getAllPosts().map(file => {
      // console.log('FILE::>>', file)
      return { params: { slug: file.slug } }
    }),
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  // return {props: { postData: { title: 'x?'} }}
  const postData = await getOnePostData(params.slug)
  if (postData) {
    return {
      props: {
        postData
      }
    }
  }
  return { notFound: true }
}
