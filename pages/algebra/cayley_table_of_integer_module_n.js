import Layout from '../../components/layout'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import styles from './cayley_table_of_integer_module_n.module.css'

import {useState, useEffect} from 'react'
import renderLatex from '/lib/katex_render'

const gcd = function(a, b) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

export default function CayleyTable({}) {
  const [currentSelectInteger, setCurrentSelectInteger] = useState(8)
  const [blurCol, setBlurCol] = useState(-1)
  const [blurRow, setBlurRow] = useState(-1)
  const [fixedCols, setFixedCols] = useState([])
  const [fixedRows, setFixedRows] = useState([])

  const [showCenter, setShowCenter] = useState(false)
  const [showUnit, setShowUnit] = useState(false)

  const integers = [...Array(currentSelectInteger-1).keys()].map(i=>i+1)

  const units = integers.filter(i => {
    return gcd(currentSelectInteger, i) === 1
  })
  const tag = `$\\mathbb Z/${currentSelectInteger} \\mathbb Z$`

  useEffect(() => {
    renderLatex()
  }, [currentSelectInteger])

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
          <strong>Definition.</strong> Integer Module $N$. See: <a target='_blank' href='https://www.wikiwand.com/en/Modular_arithmetic#/Integers_modulo_n'>Wikipedia</a>
        </p>
        <p>
          Select $n=\ $
          <select
            className={styles.select}
            value={currentSelectInteger}
            onChange={(e)=>{
              setCurrentSelectInteger(e.target.value)
              // reset all
              setFixedCols([])
              setFixedRows([])
              setBlurCol(-1)
              setBlurRow(-1)
            }}
            >
            {
              [...Array(49).keys()].map(i => <option>{i+1}</option>)
            }
          </select>
          {/* Show Center:
          <label className={[styles.switch, styles.tablecenter].join(' ')}>
            <input type="checkbox" value={showCenter} onChange={(e)=>{setShowCenter(e.target.checked)}}/>
            <span className={[styles.slider, styles.round].join(' ')}></span>
          </label> */}
          Show Unit:
          <label className={[styles.switch, styles.tableunit].join(' ')}>
            <input type="checkbox" value={showUnit} onChange={(e)=>{setShowUnit(e.target.checked)}}/>
            <span className={[styles.slider, styles.round].join(' ')}></span>
          </label>
        </p>
      
        <div className={styles.cayley_table_header}>
          {`$\\mathbb Z_{${currentSelectInteger}} \\cong \\mathbb Z/${currentSelectInteger} \\mathbb Z$`}
        </div>
        <div className={styles.cayley_table_container}>
          <table className={styles.cayley_table}>
            <tr className={styles.header}>
              <th onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}>
                $\times$
              </th>
              {integers.map(a => {
                const style4 = showUnit && (units.indexOf(a) > -1) ? styles.unit : ''
                return <th
                  className={style4}
                  onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}
                  >
                    {a}
                  </th>
              })}
            </tr>
            {
              integers.map(b => {
                const tds = integers.map(a => {
                  const style1 = showCenter && a == b ? styles.center : ''
                  const style2 = (b == blurRow || a == blurCol) ? styles.selected : ''
                  const style3 = (fixedCols.indexOf(a) > -1 || fixedRows.indexOf(b) > -1) ? styles.fixed : ''
                  
                  const value = (a*b)%(currentSelectInteger)
                  const style4 = showUnit && (value == 1) ? styles.unit : ''

                  return <td
                    className={[style4, style3, style2, style1].join(' ')}
                    onMouseOver={()=>{setBlurRow(b); setBlurCol(a)}}
                    onClick={()=>{
                      const indexA = fixedCols.indexOf(a)
                      const indexB = fixedRows.indexOf(b)
                      if (indexA > -1 && indexB > -1) {
                        // release it
                        fixedCols.splice(indexA, 1)
                        fixedRows.splice(indexB, 1)
                        setFixedCols(fixedCols)
                        setFixedRows(fixedRows)
                      } else {
                        // add new record
                        setFixedCols(fixedCols.concat(a))
                        setFixedRows(fixedRows.concat(b))
                      }
                      console.log(fixedCols)
                      console.log(fixedRows)
                    }}
                    >
                    {value}
                  </td>
                })
                const style4 = showUnit && (units.indexOf(b) > -1) ? styles.unit : ''
                return <tr>
                  <td
                    className={[styles.col_first, style4].join(' ')}
                    onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}
                  >
                    {b}
                  </td>
                  { tds }
                </tr>
              })
            }
          </table>
        </div>
      </article>
  </Layout>
}
