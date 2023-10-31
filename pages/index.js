import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
// import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'
import Script from 'next/script'

import renderLatex from '/lib/katex_render'
import { useEffect } from 'react'

const articles = [
  {
    url: 'posts/ecto-timezone',
    date: '2022-08-20',
    title: '记一次 Ecto 的时区问题'
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
  // {
  //   url: 'files/presentation.pdf',
  //   date: '2022-05-19',
  //   title: 'PDF Presentation',
  // },
  // {
  //   url: 'files/presentation.pptx',
  //   date: '2022-05-19',
  //   title: 'PPT Presentation',
  // },
  {
    url: 'file/eassy.pdf',
    date: '2022-06-02',
    title: 'Final Thesis',
  }
]

const leftArticles = []
const rightArticles = [
  {
    url: 'notes/computer-science/elixir-meetup',
    date: '2022-11-29',
    title: 'Elixir Meetup 感想',
  },
  {
    url: 'posts/ecto-timezone',
    date: '2022-08-20',
    title: '记一次 Ecto 的时区问题'
  },
]

const LeftSide = () => {
  return (
    <div>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>About {` `} 
          <span style={{fontSize: 20}}><a href="https://www.mathjoker.com">Mathjoker</a></span>
        </h2>
        <div>
          <ul className={utilStyles.list}>
            <li>
              <div> Github: </div>
              <a href='https://github.com/youxingz'>https://github.com/youxingz</a>
            </li>
            <li>
              <div> Gmail: </div>
              <a href='mailto:youxingzeta@gmail.com'>youxingzeta@gmail.com</a>
            </li>
          </ul>
        </div>
        <h4 className={utilStyles.headingMd}>Tags</h4>
        <div>
          <p class='tag'>
            <code>Elixir</code>
            <code>Java</code>
            <code>C/C++</code>
            <code>C#</code>
            <code>Kotlin</code>
            <code>Swift</code>
            <code>JavaScript</code>
            <code>Golang</code>
            <code>Python</code>
            <code>Matlab</code>
            <code>Android</code>
            <code>ComposeUI</code>
            <code>Unity3D</code>
            <code>iOS</code>
            <code>ComposeDesktop</code>
            <code>NodeJS</code>
            <code>Electron.js</code>
            <code>React</code>
            <code>VueJS</code>
            <code>WeChatMiniapp</code>
            <code>Docker</code>
            <code>SpringBoot</code>
            <code>Phoenix</code>
            <code>PostgreSQL</code>
            <code>MySQL</code>
            <code>BLE/Bluetooth</code>
            <code>ESP32</code>
            <code>NordicRF52</code>
            <code>STM32</code>
            <code>Arduino</code>
            <code>Zephyr</code>
            <code>Modbus</code>
            <code>OPCUA</code>
            <code>gRPC</code>
            <code>Monkey</code>
            <code>League of Legends</code>
            <code>GroupTheory</code>
            <code>Sagemath</code>
            <code>Algebra</code>
          </p>
        </div>
      </section>
    </div>
  )
}

const RightSide = () => {
  return (
    <div>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Recent {` `} 
          <span style={{}}><a href="notes/index">Notes</a></span>
        </h2>
        <ul className={utilStyles.list}>
          {rightArticles.map(({ url, date, title }) => (
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
    </div>
  )
}

export default function Home({ allPostsData }) {
  useEffect(() => {
    renderLatex()
  }, [])

  return (
    <Layout home={false} left={ LeftSide() } right={ RightSide() }>
      <Script type="application/ld+json" strategy="beforeInteractive">
        {`{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Notes",
            "item": "https://www.mathjoker.com/notes/index"
          },{
            "@type": "ListItem",
            "position": 2,
            "name": "Cayley Table of Symmetric Group",
            "item": "https://www.mathjoker.com/algebra/cayley_table_of_symmetric_group"
          },{
            "@type": "ListItem",
            "position": 3,
            "name": "Polygonal Numbers",
            "item": "https://www.mathjoker.com/numbers/polygonal_numbers"
          }]
        }`}
      </Script>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={"Mathematic notes & algorithms | Math Joker is not joker since 小丑竟是你自己!"}></meta>
      </Head>
      <section className={utilStyles.headingMd}>
        {/* <p>
          <strong>Definition 1.</strong> Let MathJoker be a person?al blog, which satisfies 3 properties: <br/>
          i). Post something people know. <br/>
          ii). Do not do 1. <br/>
          iii). Do not do 2. <br/>
        </p> */}
        <p className={utilStyles.sign}>
          Art is a lie that tells the truth.
          <span>-- Pablo Picasso</span>
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog {`& `} 
          <span style={{fontSize: 20}}><a href="notes/index">Notes</a></span>
        </h2>
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
