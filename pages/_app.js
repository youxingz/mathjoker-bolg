import '../styles/global.css'
// import '../lib/katex/katex.css'
// import '../lib/katex/katex.mjs'
import renderLatex from '../lib/katex_render'
import hljs from 'highlight.js'
// import 'highlight.js/styles/atom-one-light.css'
import 'highlight.js/styles/atom-one-dark.css'
import Script from 'next/script'

import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  console.log("??")
  // console.log({ pageProps })
  useEffect(() => {
    // console.log("Enter new page.")
    renderLatex()
    document.querySelectorAll('pre>code').forEach(el => {
      // highlightBlock ?
      hljs.highlightElement(el)
    })
    // console.log({ lang: hljs.listLanguages() })
  }, [pageProps, pageProps.postData?.id, pageProps.postData])

  return <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-0TMGSRQ4NV" strategy="beforeInteractive"/>
      <Script id="google-analytics" strategy="beforeInteractive">
        { "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-0TMGSRQ4NV');" }
      </Script>
      <Component {...pageProps} />
  </>
}
