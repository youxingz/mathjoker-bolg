import '../styles/global.css'
// import '../lib/katex/katex.css'
// import '../lib/katex/katex.mjs'
import renderLatex from '../lib/katex_render'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    renderLatex()
    document.querySelectorAll('pre>code').forEach(el => {
      // highlightBlock ?
      hljs.highlightElement(el)
    })
    // console.log({ lang: hljs.listLanguages() })
  }, [])

  return <Component {...pageProps} />
}
