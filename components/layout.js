import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Script from 'next/script'

const name = 'Youxing Z'
export const siteTitle = 'MathJoker'

export default function Layout({ children, home, note, previous }) {
  return (
    <div className={styles.container}>
      <Script id="google-analytics" strategy="afterInteractive">
        { "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-0TMGSRQ4NV');" }
      </Script>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Are You Human?" />
        <meta name="og:title" content={siteTitle} />
        {/* <meta name="twitter:card" content="summary_large_image" /> */}

        {/* <!-- Google tag (gtag.js) --> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0TMGSRQ4NV"></script>
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
      <main>{children}</main>
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
  )
}
