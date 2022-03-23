import '../styles/global.css'
import '../lib/katex/katex.css'
import '../lib/katex/katex.mjs'
import renderLatex from '../lib/katex_render'

import {useEffect} from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    renderLatex()
  }, [])

  return <Component {...pageProps} />
}
