import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
// import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'

import renderLatex from '/lib/katex_render'
import { useEffect } from 'react'

const articles = [
  {
    url: 'notes/index',
    date: '2022-09-06',
    title: 'Some Notes'
  },
  {
    url: 'numbers/gaussian_integers',
    date: '2022-04-05',
    title: 'Gaussian Integers',
  },
  {
    url: 'numbers/polygonal_numbers',
    date: '2022-03-25',
    title: 'The Table of Polygonal Numbers',
  },
  {
    url: 'algebra/cayley_table_of_symmetric_group',
    date: '2022-03-25',
    title: 'The Cayley Table of Symmetric Group ($S_n$)',
  },
  {
    url: 'algebra/cayley_table_of_integer_module_n',
    date: '2022-03-23',
    title: 'The Cayley Table of Integer Module N ($\\mathbb Z/n\\mathbb Z$)',
  },
  {
    url: 'files/presentation.pdf',
    date: '2022-05-19',
    title: 'PDF Presentation',
  },
  {
    url: 'files/presentation.pptx',
    date: '2022-05-19',
    title: 'PPT Presentation',
  },
  {
    url: 'files/eassy.pdf',
    date: '2022-06-02',
    title: 'Final Thesis',
  }
]

export default function Home({ allPostsData }) {
  useEffect(() => {
    renderLatex()
  }, [])

  return (
    <Layout home={false}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          <strong>Definition 1.</strong> Let MathJoker be a person?al blog, which satisfies 3 properties: <br/>
          i). Post something people know. <br/>
          ii). Do not do 1. <br/>
          iii). Do not do 2. <br/>
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {articles.map(({ url, date, title }) => (
            <li className={utilStyles.listItem} key={url}>
              <Link href={`/${url}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData()
//   return {
//     props: {
//       allPostsData
//     }
//   }
// }
