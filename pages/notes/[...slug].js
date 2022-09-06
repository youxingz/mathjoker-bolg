import Layout, { siteTitle } from '../../components/layout'
import { getAllPosts, getPostData } from '../../lib/notes'
import Head from 'next/head'
import Date from '../../components/date'
import Link from 'next/link'
import utilStyles from '../../styles/utils.module.css'

export default function SlugPage({ postData }) {
  switch (postData.layout) {
    case 'content-list':
      return Content({
        contentData: postData.contentList || [],
        contentTitle: postData.title,
      })
    case 'content-custom':
      return Content({
        contentData: postData.contentList || [],
        contentTitle: postData.title,
      })
    case 'post':
      return Post({ postData })
  }
}

function Content({ contentData, contentTitle }) {
  return (
    <Layout note>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Hello, I’m <strong>Youxing Z</strong>.
        </p>
        <p>
          Here are some notes about Mathematics and Computer Science.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Content { contentTitle && `of ${contentTitle}` }</h2>
        <ul className={utilStyles.list}>
          {contentData.filter(file => !file.hide).map(({ slug, title, date }) => (
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

function Post({ postData }) {
  return (
    <Layout previous={`${postData.backto}`}>
      <Head>
        <title>{postData.title}</title>
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
  const paths = getAllPosts().map(file => {
    console.log(file.slug)
    return {
      params: { slug: file.slug },
    }
  })
  console.log({ paths })
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  // return {props: { postData: { title: 'x?'} }}
  const postData = await getPostData(params.slug)
  // if (postData) {
  return {
    props: {
      postData
    }
  }
  // }
  // return { notFound: true }
}
