import Layout from '../../components/layout'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import styles from './polygonal_numbers.module.css'

import {useState, useEffect} from 'react'
import renderLatex from '/lib/katex_render'

// s: polygonal edge size, n: the index of list
const numberOf = (s, n) => {
  if (s == 1) return 1
  return parseInt(((s-2)*n*n - (s-4)*n)/2)
}

const primes = ((max) => {

  const isPrime = (n) => {
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i == 0) return false
    }
    return true
  }

  const ps = [2,3,5,7,11,13,17,19]
  for (let n = 23; n < max; n++) {
    if (isPrime(n)) {
      ps.push(n)
    }
  }

  return ps
})(60000)

export default function CayleyTable({}) {
  const [currentSelectS, setCurrentSelectS] = useState(6)
  const [currentSelectN, setCurrentSelectN] = useState(8)
  const [blurCol, setBlurCol] = useState(-1)
  const [blurRow, setBlurRow] = useState(-1)
  const [fixedCols, setFixedCols] = useState([])
  const [fixedRows, setFixedRows] = useState([])

  const [showCenter, setShowCenter] = useState(false)
  const [showPrime, setShowPrime] = useState(false)

  const indexes = [...Array(currentSelectN).keys()].map(i=>i+1)
  const edges = [...Array(currentSelectS).keys()].map(i=>i+1)

  useEffect(() => {
    renderLatex()
  }, [currentSelectS, currentSelectN])

  return <Layout>
    <Head>
      <title>Table of Polygonal Numbers</title>
    </Head>
      <article>
        <h1 className={utilStyles.headingXl}>
          The Table of Polygonal Numbers
        </h1>
        <div className={utilStyles.lightText}>
          <Date dateString={'2022-03-25'} />
        </div>
        
        <p>
          <strong>Definition.</strong> Polygonal Number. See: <a target='_blank' href='https://www.wikiwand.com/en/Polygonal_number'>Wikipedia</a>
        </p>
        <p>
          Select $s\text - gonal$ $s=\ $
          <select
            className={styles.select}
            value={currentSelectS}
            onChange={(e)=>{
              setCurrentSelectS(parseInt(e.target.value))
              // reset all
              setFixedCols([])
              setFixedRows([])
              setBlurCol(-1)
              setBlurRow(-1)
            }}
            >
            {
              [...Array(49).keys()].map(i => <option key={'k'+(i+1)}>{i+1}</option>)
            }
          </select>
          Select $n=\ $
          <select
            className={styles.select}
            value={currentSelectN}
            onChange={(e)=>{
              setCurrentSelectN(parseInt(e.target.value))
              // reset all
              setFixedCols([])
              setFixedRows([])
              setBlurCol(-1)
              setBlurRow(-1)
            }}
            >
            {
              [...Array(49).keys()].map(i => <option key={'k'+(i+1)}>{i+1}</option>)
            }
          </select>
          {/* Show Center:
          <label className={[styles.switch, styles.tablecenter].join(' ')}>
            <input type="checkbox" value={showCenter} onChange={(e)=>{setShowCenter(e.target.checked)}}/>
            <span className={[styles.slider, styles.round].join(' ')}></span>
          </label> */}
          {/* Show Prime:
          <label className={[styles.switch, styles.tableunit].join(' ')}>
            <input type="checkbox" value={showPrime} onChange={(e)=>{setShowPrime(e.target.checked)}}/>
            <span className={[styles.slider, styles.round].join(' ')}></span>
          </label> */}
        </p>
      
        <div className={styles.cayley_table_header}>
          The $n$-th number of $s$-gonal numbers.
        </div>
        <div className={styles.cayley_table_container} cellSpacing="0" cellPadding="0">
          <table className={styles.cayley_table}>
            <tbody style={{whiteSpace: 'pre'}}>
              <tr className={styles.header}>
                <th key='product'
                  style={{width: 100}}
                  className={styles.th}
                  onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}>
                  🙂
                </th>
                <th key='formula'
                  // style={{width: 100}}
                  className={styles.th}
                  onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}>
                  Formula
                </th>
                {indexes.map(a => {
                  // const style4 = showPrime && (primes.indexOf(a) > -1) ? styles.unit : ''
                  return <th
                    key={'h_'+a}
                    className={[styles.th].join(' ')}
                    onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}
                    >
                      {a}
                    </th>
                })}
              </tr>
              {
                edges.map(b => {
                  const tds = indexes.map(a => {
                    const style1 = showCenter && a == b ? styles.center : ''
                    const style2 = (b == blurRow || a == blurCol) ? styles.selected : ''
                    const style3 = (fixedCols.indexOf(a) > -1 || fixedRows.indexOf(b) > -1) ? styles.fixed : ''
                    
                    const value = numberOf(b,a)
                    // const style4 = showPrime && (value == 1) ? styles.unit : ''
                    const style4 = showPrime && (primes.indexOf(value) > -1) ? styles.unit : ''

                    return <td
                      key={'v_'+a+'x'+b}
                      className={[style4, style3, style2, style1, styles.td].join(' ')}
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
                        // console.log(fixedCols)
                        // console.log(fixedRows)
                      }}
                      >
                      {value}
                    </td>
                  })
                  // const style4 = showPrime && (primes.indexOf(b) > -1) ? styles.unit : ''
                  return <tr key={'line_'+b}>
                    <td
                      key={'l_'+b}
                      className={[styles.col_first, styles.td].join(' ')}
                      onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}
                    >
                      { (b == 1) && 'Point' }
                      { (b == 2) && 'Line' }
                      { (b == 3) && 'Trangle' }
                      { (b == 4) && 'Square' }
                      { (b == 5) && 'Pentagon' }
                      { (b == 6) && 'Hexagon' }
                      { (b > 6) && b+'-Gonal' }
                    </td>
                    <td
                      key={'f_'+b}
                      className={[styles.col_first, styles.td].join(' ')}
                      onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}>
                      { (b == 1) && `$n-\\frac{1}{2}n(n-1)$`}
                      { (b == 2) && `$n$`}
                      { (b == 3) && `$n+\\frac{1}{2}n(n-1)$`}
                      { (b > 3) && (( b % 2 == 0) ? `$n+${parseInt(b/2)}n(n-1)$` : `$n+\\frac{${b-2}}{2}n(n-1)$`)}
                    </td>
                    { tds }
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </article>
  </Layout>
}
