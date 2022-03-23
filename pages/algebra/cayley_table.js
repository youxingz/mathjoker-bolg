import Layout from '../../components/layout'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import styles from './cayley_table.module.css'

import {useState, useEffect} from 'react'
import renderLatex from '/lib/katex_render'


export default function CayleyTable({}) {
  const [currentSelectInteger, setCurrentSelectInteger] = useState(8)
  const [blurCol, setBlurCol] = useState(-1)
  const [blurRow, setBlurRow] = useState(-1)

  const integers = [...Array(currentSelectInteger-1).keys()].map(i=>i+1)

  useEffect(() => {
    renderLatex()
  }, [])

  return <Layout>
    <Head>
      <title>Cayley Table</title>
    </Head>
      <article>
        <h1 className={utilStyles.headingXl}>
            The Cayley Table of Integer Module N ($\mathbb Z/n\mathbb Z$)
        </h1>
        <div className={utilStyles.lightText}>
          <Date dateString={'2022-03-23'} />
        </div>
        
        <p>
          <strong>Definition.</strong> Integer Module $N$ <a href='https://www.wikiwand.com/en/Modular_arithmetic#/Integers_modulo_n'>Link Wikipedia</a>
        </p>
        <p>
          Select $n=\ $
          <select value={currentSelectInteger} onChange={(e)=>{setCurrentSelectInteger(e.target.value)}}>
            {
              [...Array(50).keys()].map(i => <option>{i}</option>)
            }
          </select>
        </p>
      
        <div>
          <table className={styles.cayley_table}>
            <tr className={styles.header}>
              <th></th>
              {integers.map(a => <th>{a}</th>)}
            </tr>
            {
              integers.map(b => {
                const tds = integers.map(a => {
                  return <td
                    className={(b == blurRow || a == blurCol)&&styles.selected}
                    onMouseOver={()=>{ console.log('blue!');setBlurRow(b); setBlurCol(a)}}>
                    {(a*b)%(currentSelectInteger)}
                  </td>
                })
                return <tr><td className={styles.col_first}>{b}</td>{ tds }</tr>
              })
            }
          </table>
        </div>
      </article>
  </Layout>
}
