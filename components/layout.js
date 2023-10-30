import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const name = 'Youxing Z'
export const siteTitle = 'MathJoker'


const HIGH_WIDTH_SCREEN = 1400 // px.
export default function Layout({ children, left=null, right=null, home, note, previous }) {
  const [highScreen, setHighScreen] = useState(false)

  useEffect(() => {
    // document.createElement('side')
    // const { innerWidth: width, innerHeight: height } = window
    setHighScreen(window.innerWidth > HIGH_WIDTH_SCREEN)
    window.addEventListener('resize', () => {
      setHighScreen(window.innerWidth > HIGH_WIDTH_SCREEN)
    })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Are You Human?" />
        <meta name="og:title" content={siteTitle} />
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>
      <header className={styles.header}>
        {!home ? (
          <>
            <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt={name}
            />
            <h1>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <Image
                  priority
                  src="/images/profile.jpg"
                  className={utilStyles.borderCircle}
                  height={108}
                  width={108}
                  alt={name}
                />
              </a>
            </Link>
            <h3>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h3>
          </>
        )}
      </header>
      {
        (highScreen)
        ? <div className={styles.flex_span}>
          {left && <side className={styles.side}>{left}</side>}
          <main className={styles.main}>{children}</main>
          {right && <side className={styles.side}>{right}</side>}
        </div>
        : <div className={styles.flex_flow}>
          <main className={styles.main}>{children}</main>
          {right && <side className={styles.main}>{right}</side>}
          {left && <side className={styles.main}>{left}</side>}
        </div>
      }

      <div className={styles.back_footer}>
        {!!home && (
          <div className={styles.backToHome}>
            <Link href="/">
              <a>← Back to Cover</a>
            </Link>
          </div>
        )}
        {!!note && (
          <div className={styles.backToHome}>
            <Link href="/notes">
              <a>← Back to Cover</a>
            </Link>
          </div>
        )}
        {!!previous && (
          <div className={styles.backToHome}>
            <Link href={previous}>
              <a>← Back to Content</a>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
