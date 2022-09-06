import Head from 'next/head'
import { useEffect } from 'react'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'

export default function Home({ allPostsData }) {
  useEffect(() => {
    window.location.href = '/notes/index'
  }, [])
  return (
    <Layout home={false}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Hello, I’m <strong>Youxing Z</strong>.
        </p>
      </section>
    </Layout>
  )
}

// export async function getStaticProps() {
//   // const allPostsData = getNoteHomePagePostList()
//   return {
//     // props: {
//     //   allPostsData
//     // },
//     redirect: {
//       destination: '/notes/index',
//       permanent: true,
//       // statusCode: 301
//     },
//   }
// }
