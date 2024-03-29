// import renderMathInElement from '../lib/katex/contrib/auto-render.mjs'
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.css'

export default function () {
  console.warn('===============[KATEX RENDERING]===============')
  return renderMathInElement(document.body, {
    // customised options
    // • auto-render specific keys, e.g.:
    delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
    ],
    // • rendering keys, e.g.:
    throwOnError : true
  });
}
