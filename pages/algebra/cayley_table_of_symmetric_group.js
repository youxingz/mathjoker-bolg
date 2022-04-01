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


// [[1,2,3][4,5]] ...
const cycleProducts = (n) => {
  // [3,2,1] ...
  const partitions = (n) => {
    function helper(n, w) {
      // assert(n >= 0);
      // assert(w >= 0);
      if (n == 0)
          return [[]];
      if (w <= 0)
          return [];

      let results = [];
      for (let row = Math.min(n, w); row >= 1; row--) {
          let smaller = helper(n - row, row);
          results.push(...smaller.map(part => [row].concat(part)));
      }
      return results;
    }
    return helper(n, n);
  }

  return partitions(n).map(part => {
    let i = 1;
    const cycle = []
    for (let j = 0; j < part.length; j++) {
      let row_length = part[j]
      const item = []
      for (let k = 0; k < row_length; k++) {
        item.push(i)
        i++
      }
      cycle.push(item)
    }
    return cycle
  })
}

const permutationsOf = (n) => {
  function permutator(inputArr) {
    var results = [];

    function permute(arr, memo) {
      var cur, memo = memo || [];

      for (var i = 0; i < arr.length; i++) {
        cur = arr.splice(i, 1);
        if (arr.length === 0) {
          results.push(memo.concat(cur));
        }
        permute(arr.slice(), memo.concat(cur));
        arr.splice(i, 0, cur[0]);
      }

      return results;
    }

    return permute(inputArr);
  }
  // console.log('?', permutator([1,2,3]))
  const upper = [...Array(n).keys()].map(i=>i+1) // identity
  return permutator(upper).map(bottom => {
    // console.log(bottom)
    // init a map
    const double_line = new Map()
    for (let i = 0; i < n; i++) {
      double_line.set(upper[i], bottom[i])
      // double_line[upper[i]] = bottom[i]
    }

    const cycleprod = []
    let cycle_start = 1;
    let cycle = [cycle_start]
    let a = cycle_start; // start from 1
    for (let i = 0; i < n; i++) {
      let b = double_line.get(a)
      double_line.delete(a)
      if (b == cycle_start) { // one cycle done
        cycleprod.push(cycle)
        cycle_start = [...double_line.keys()][0]
        if (cycle_start === undefined) {
          break
        }
        // console.log({cycle_start})
        cycle = [cycle_start]
        a = cycle_start
      } else {
        cycle.push(b)
        // put a number
        a = b
      }
    }
    // console.log(JSON.stringify(cycleprod))
    return cycleprod
  })
}

// console.log('p::', permutations(3))


const ptstring = (cycleProd=[], hideFixedPoint) => {
  if (hideFixedPoint) {
    return cycleProd.filter(cycle=>cycle.length != 1).map(cycle => { return  "(" + cycle.join('') + ")" }).join('')
  }
  return cycleProd.map(cycle => { return  "(" + cycle.join('') + ")" }).join('')
}

const ptproduct = (cycle_a, cycle_b, n) => {
  const toMap = (cycleProd) => {
    const prodMap = new Map()
    for (let cycle of cycleProd) {
      if (cycle.length === 0) break
      for (let i = 0; i < cycle.length - 1; i++) {
        prodMap.set(cycle[i], cycle[i+1])
      }
      prodMap.set(cycle[cycle.length - 1], cycle[0])
    }
    return prodMap
  }

  const aMap = toMap(cycle_a)
  const bMap = toMap(cycle_b)
  
  const double_line = new Map()
  for (let i = 1; i <= n; i++) {
    double_line.set(i, aMap.get(bMap.get(i)))
  }

  const cycleprod = []
  let cycle_start = 1;
  let cycle = [cycle_start]
  let a = cycle_start; // start from 1
  for (let i = 0; i < n; i++) {
    let b = double_line.get(a)
    double_line.delete(a)
    if (b == cycle_start) { // one cycle done
      cycleprod.push(cycle)
      cycle_start = [...double_line.keys()][0]
      if (cycle_start === undefined) {
        break
      }
      // console.log({cycle_start})
      cycle = [cycle_start]
      a = cycle_start
    } else {
      cycle.push(b)
      // put a number
      a = b
    }
  }
  // console.log(JSON.stringify(cycleprod))
  return cycleprod
}

const centersOfPermutations = (permutations=[], n, hideFixedPoint) => {
  // console.log(permutations)
  const centers = []
  for (let a of permutations) {
    if (a.length == n) {
      centers.push(ptstring(a, hideFixedPoint))
      continue
    }
    let flag = true
    for (let b of permutations) {
      const prodLeft = ptstring(ptproduct(a, b, n), hideFixedPoint)
      const prodRight = ptstring(ptproduct(b, a, n), hideFixedPoint)
      // console.log({prodLeft, prodRight})
      if (prodLeft != prodRight) {
        flag = false
        break
      }
    }
    // console.log('----------------------')
    if (flag) {
      centers.push(ptstring(a, hideFixedPoint))
    }
  }
  return centers
}

const isEvenPermutation = (permu) => {
  let cycle_number = 0
  for (let p of permu) {
    cycle_number += (p.length - 1)
  }
  return cycle_number % 2 == 0
}

export default function CayleyTable({}) {
  const [currentSelectInteger, setCurrentSelectInteger] = useState(3)
  const [blurCol, setBlurCol] = useState(-1)
  const [blurRow, setBlurRow] = useState(-1)
  const [fixedCols, setFixedCols] = useState([])
  const [fixedRows, setFixedRows] = useState([])

  const [hideFixedPoint, setHideFixedPoint] = useState(true)
  const [showCenter, setShowCenter] = useState(false)
  const [showEvenPermutation, setShowEvenPermutation] = useState(false)
  const [showAn, setShowAn] = useState(false)

  const [permutations, setPermutations] = useState(permutationsOf(currentSelectInteger))

  // const permutations = permutationsOf(parseInt(currentSelectInteger))
  // 
  const [centers, setCenters] = useState([]) // normal subgroup

  const [headerTag, setHeaderTag] = useState('')

  useEffect(() => {
    const permuts = permutationsOf(parseInt(currentSelectInteger))
    if (showAn) {
      setPermutations(permuts.filter(isEvenPermutation))
    } else {
      setPermutations(permuts)
    }
    // console.log({permuts, currentSelectInteger})
    setCenters(centersOfPermutations(permuts, currentSelectInteger, hideFixedPoint))
    // const identityElement = [...Array(currentSelectInteger).keys()].map(i=>(i+1)).join('')
    const tag = `$S_{${currentSelectInteger}} \\text{ has order: }${currentSelectInteger}! = ${[1, 2, 6, 24, 120, 720, 5040][currentSelectInteger-1]}$`
    + `, $\\text{Identity}:\\ e=()$`
    setHeaderTag(tag)
  }, [currentSelectInteger, showAn])


  useEffect(() => {
    renderLatex()
  }, [headerTag])

  return <Layout>
    <Head>
      <title>Cayley Table of Symmetric Group S_n</title>
    </Head>
      <article>
        <h1 className={utilStyles.headingXl}>
            The Cayley Table of Symmetric Group ($S_n$)
        </h1>
        <div className={utilStyles.lightText}>
          <Date dateString={'2022-03-25'} />
        </div>
        
        <p>
          <strong>Definition.</strong> Symmetric Group $S_n$. See: <a target='_blank' href='https://groupprops.subwiki.org/wiki/Determination_of_multiplication_table_of_symmetric_group:S3'>Subwiki</a>
        </p>
        <p>
          Select $n=\ $
          <select
            className={styles.select}
            value={currentSelectInteger}
            onChange={(e)=>{
              setCurrentSelectInteger(parseInt(e.target.value))
              // reset all
              setFixedCols([])
              setFixedRows([])
              setBlurCol(-1)
              setBlurRow(-1)
            }}
            >
            {
              [...Array(6).keys()].map(i => <option key={'k'+(i+1)} value={''+(i+1)}>{i+1}</option>)
            }
          </select>
          <br/>
          Hide Fixed Point:
          <label className={[styles.switch, styles.tablecenter].join(' ')}>
            <input type="checkbox" checked={hideFixedPoint} onChange={(e)=>{setHideFixedPoint(e.target.checked)}}/>
            <span className={[styles.slider, styles.round].join(' ')}></span>
          </label>
          {/* Show Centralizer:
          <label className={[styles.switch, styles.tableunit].join(' ')}>
            <input type="checkbox" checked={showCenter} onChange={(e)=>{setShowCenter(e.target.checked)}}/>
            <span className={[styles.slider, styles.round].join(' ')}></span>
          </label> */}
          <br/>
          Show Even Permutation:
          <label className={[styles.switch, styles.tableunit].join(' ')}>
            <input type="checkbox" checked={showEvenPermutation} onChange={(e)=>{setShowEvenPermutation(e.target.checked)}}/>
            <span className={[styles.slider, styles.round].join(' ')}></span>
          </label>
          <br/>
          Show $A_n$:
          <label className={[styles.switch, styles.tableunit].join(' ')}>
            <input type="checkbox" checked={showAn} onChange={(e)=>{setShowAn(e.target.checked)}}/>
            <span className={[styles.slider, styles.round].join(' ')}></span>
          </label>
        </p>
      
        <div className={styles.cayley_table_header}>
          {headerTag}
        </div>
        <div className={styles.cayley_table_container}>
          <table className={styles.cayley_table}>
            <tbody style={{whiteSpace: 'pre'}}>
              <tr className={styles.header}>
                <th key="product" className={styles.th} onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}>
                  $\times$
                </th>
                {permutations.map((a,index) => {
                  const label = (a.length == currentSelectInteger) ? ' () ' : ptstring(a, hideFixedPoint)
                  // const style4 = showCenter && (a.length == currentSelectInteger || centers.indexOf(label) > -1) ? styles.unit : ''
                  const style4 = showEvenPermutation && isEvenPermutation(a) ? styles.unit : ''
                  return <th
                    key={'h_'+index}
                    className={[style4, styles.th].join(' ')}
                    onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}
                    >
                      {label}
                    </th>
                })}
              </tr>
              {
                permutations.map((b,indexB) => {
                  const pt_b = ptstring(b, hideFixedPoint)
                  const tds = permutations.map((a, indexA) => {
                    const pt_a = ptstring(a, hideFixedPoint)
                    const style2 = (pt_b == blurRow || pt_a == blurCol) ? styles.selected : ''
                    const style3 = (fixedCols.indexOf(pt_a) > -1 || fixedRows.indexOf(pt_b) > -1) ? styles.fixed : ''
                    
                    const value = ptproduct(a,b, currentSelectInteger)
                    const label = (value.length == currentSelectInteger) ? ' () ' : ptstring(value, hideFixedPoint)
                    
                    let style4 = ''
                    // if (showCenter) {
                    //   const value2 = ptproduct(b,a, currentSelectInteger)
                    //   const label2 = (value2.length == currentSelectInteger) ? ' () ' : ptstring(value2, hideFixedPoint)
                    //   if (label == label2) { // is comutative
                    //     style4 = styles.unit
                    //   }
                    // }

                    return <td
                      key={'v_'+indexA+'x'+indexB}
                      className={[style4, style3, style2].join(' ')}
                      onMouseOver={()=>{setBlurRow(pt_b); setBlurCol(pt_a)}}
                      onClick={()=>{
                        const indexA = fixedCols.indexOf(pt_a)
                        const indexB = fixedRows.indexOf(pt_b)
                        if (indexA > -1 && indexB > -1) {
                          // release it
                          fixedCols.splice(indexA, 1)
                          fixedRows.splice(indexB, 1)
                          setFixedCols(fixedCols)
                          setFixedRows(fixedRows)
                        } else {
                          // add new record
                          setFixedCols(fixedCols.concat(pt_a))
                          setFixedRows(fixedRows.concat(pt_b))
                        }
                        // console.log(fixedCols)
                        // console.log(fixedRows)
                      }}
                      >
                      {label}
                    </td>
                  })
                  // const style4 = showCenter && (units.indexOf(b) > -1) ? styles.unit : ''

                  const label = (b.length == currentSelectInteger) ? ' () ' : ptstring(b, hideFixedPoint)
                  // const style4 = showCenter && centers.indexOf(label) > -1 ? styles.unit : ''
                  // const style4 = showCenter && (b.length == currentSelectInteger || centers.indexOf(label) > -1) ? styles.unit : ''
                  const style4 = showEvenPermutation && isEvenPermutation(b) ? styles.unit : ''

                  return <tr key={'line_'+indexB}>
                    <td
                      key={'l_'+indexB}
                      className={[style4, styles.col_first, styles.td].join(' ')}
                      onMouseOver={()=>{setBlurRow(-1); setBlurCol(-1)}}
                    >
                      {label}
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
