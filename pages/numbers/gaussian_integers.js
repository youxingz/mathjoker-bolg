import Layout from '../../components/layout'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import styles from './polygonal_numbers.module.css'

import {useState, useEffect} from 'react'
import renderLatex from '/lib/katex_render'

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
})(8000)

const genGaussianPrimes = (maxA, maxB) => {
  const result = []
  for (let a = 0; a <= maxA; a ++) {
    for (let b = 0; b < maxB; b ++) {
      let pr = a*a+b*b
      if (primes.indexOf(pr) > -1) {
        result.push([a, b])
      }
    }
  }
  return result
}

const genGoldbachPrimes = (maxA, maxB) => {
  const result = []
  for (let a = 3; a <= maxA; a ++) {
    if (primes.indexOf(a) > -1) {
      for (let b = 3; b < maxB; b ++) {
        if (primes.indexOf(b) > -1) {
          result.push([a, b])
        }
      }
    }
  }
  return result
}

export default function CayleyTable({}) {
  const [currentSelectX, setCurrentSelectX] = useState(60)
  const [currentSelectY, setCurrentSelectY] = useState(60)

  const [currentHoverPoint, setCurrentHoverPoint] = useState([12,17])
  const [currentHoverGoldPoint, setCurrentHoverGoldPoint] = useState([12,17])

  const [gaussianPrimes, setGaussianPrimes] = useState(genGaussianPrimes(currentSelectX, currentSelectY))
  const [goldbachPrimes, setGoldbachPrimes] = useState(genGoldbachPrimes(currentSelectX, currentSelectY))

  const [showGoldbach, setShowGoldbach] = useState(true)

  useEffect(() => {
    const primes = genGaussianPrimes(currentSelectX, currentSelectY)
    setGaussianPrimes(primes)
    primes.forEach(point => {
      const pointEl = document.getElementById('p_gaus'+point[0]+'-'+point[1])
      if (pointEl) {
        pointEl.addEventListener('mouseover', function(e) {
          e.currentTarget.setAttribute('fill', '#ff00cc');
          setCurrentHoverPoint(point)
        })
        pointEl.addEventListener('click', function(e) {
          e.currentTarget.setAttribute('fill', '#ff00cc');
          setCurrentHoverPoint(point)
        })
        pointEl.addEventListener('mouseout', function(e) {
          e.currentTarget.setAttribute('fill', '#000');
        })
      }
    })

    const primes2 = genGoldbachPrimes(currentSelectX, currentSelectY)
    setGoldbachPrimes(primes2)
    primes2.forEach(point => {
      const pointEl = document.getElementById('p_gold'+point[0]+'-'+point[1])
      if (pointEl) {
        pointEl.addEventListener('mouseover', function(e) {
          e.currentTarget.setAttribute('fill', '#ff00cc');
          setCurrentHoverGoldPoint(point)
        })
        pointEl.addEventListener('click', function(e) {
          e.currentTarget.setAttribute('fill', '#ff00cc');
          setCurrentHoverGoldPoint(point)
        })
        pointEl.addEventListener('mouseout', function(e) {
          e.currentTarget.setAttribute('fill', '#000');
        })
      }
    })

    renderLatex()
  }, [currentSelectX, currentSelectY])


  const HEIGHT = 16*currentSelectY;
  const WIDTH = 16*currentSelectX;
  const Y_OFFSET = 16;
  const X_OFFSET = 20;

  const diagonalMin = HEIGHT > WIDTH ? WIDTH : HEIGHT;

  return <Layout>
    <Head>
      <title>Gaussian Integers</title>
    </Head>
      <article>
        <h1 className={utilStyles.headingXl}>
          Gaussian Integers
        </h1>
        <div className={utilStyles.lightText}>
          <Date dateString={'2022-04-05'} />
        </div>
        
        <p>
          <strong>Definition.</strong> Gaussian Integer. See: <a target='_blank' href='https://www.wikiwand.com/en/Gaussian_integer'>Wikipedia</a>
        </p>
        <p>
          Select $x=\ $
          <select
            className={styles.select}
            value={currentSelectX}
            onChange={(e)=>{
              setCurrentSelectX(parseInt(e.target.value))
            }}
            >
            {
              [...Array(60).keys()].map(i => <option key={'k'+(i+1)}>{i+1}</option>)
            }
          </select>
          Select $y=\ $
          <select
            className={styles.select}
            value={currentSelectY}
            onChange={(e)=>{
              setCurrentSelectY(parseInt(e.target.value))
            }}
            >
            {
              [...Array(60).keys()].map(i => <option key={'k'+(i+1)}>{i+1}</option>)
            }
          </select>
          <br/>
          Show Goldbach Integers:
          <label className={[styles.switch, styles.tablegoldbach].join(' ')}>
            <input type="checkbox" checked={showGoldbach} onChange={(e)=>{setShowGoldbach(e.target.checked)}}/>
            <span className={[styles.slider, styles.round].join(' ')}></span>
          </label>
        </p>
      
        <div className={styles.cayley_table_header}>
          The Gaussian Integer | Black dot is Gaussian Prime | Red dot is $p_x+p_y=$ even number.
        </div>
        <div className={styles.cayley_table_container}>
          {/* <div style={{width: '100%'}} id="canvas"/> */}
          <div style={{width: '100%', overflow: 'scroll'}}>
            <svg width={WIDTH} height={HEIGHT+20} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="gray" stroke-width="0.5" />
                </pattern>
                <pattern id="grid" x="16" width="160" height="160" patternUnits="userSpaceOnUse">
                  <rect width="160" height="160" fill="url(#smallGrid)" />
                  <path d="M 160 0 L 0 0 0 160" fill="none" stroke="gray" stroke-width="1" />
                </pattern>
                <pattern id="y-axis-numbers">
                </pattern>
              </defs>
              <line id="x-axis" x1={Y_OFFSET} x2={WIDTH+Y_OFFSET} y1={HEIGHT} y2={HEIGHT} stroke="black" strokeWidth="2" strokeLinecap="butt"/>
              <line id="y-axis" x1={Y_OFFSET} x2={Y_OFFSET} y1="0" y2={HEIGHT} stroke="black" strokeWidth="2" strokeLinecap="butt"/>
              <rect x={Y_OFFSET} width={WIDTH} height={HEIGHT} fill="url(#grid)" />
              <rect width={Y_OFFSET} height={HEIGHT} fill="url(#y-axis-numbers)"/>
              {
                // y
                [...Array(currentSelectY).keys()].map((number, index)=><text x="0" y={HEIGHT - 12 - index*16} style={{fontSize: 12}}>{number+1}</text>)
              }
              {
                // x
                [...Array(currentSelectX).keys()].map((number, index)=><text x={index*16+10} y={HEIGHT + X_OFFSET} style={{fontSize: 12}}>{number}</text>)
              }
              {
                // points
                showGoldbach && goldbachPrimes.map(point => <circle id={'p_gold2'+point[0]+'-'+point[1]} cx={Y_OFFSET+point[0]*16} cy={HEIGHT-point[1]*16} r="4" fill="#FF5555"/>)
              }
              {
                // points
                gaussianPrimes.map(point => <circle id={'p_gaus'+point[0]+'-'+point[1]} cx={Y_OFFSET+point[0]*16} cy={HEIGHT-point[1]*16} r="4"/>)
              }
              {
                // draw line // (0,0) -> (min, min)
                <line id="diagonal" x1={Y_OFFSET} y1={HEIGHT} x2={diagonalMin+16} y2={0} stroke="#eb3636db" strokeWidth="2" strokeLinecap="butt"/>
              }
              {/* draw hover lines */}
              <line id="hover-x" x1={Y_OFFSET} x2={WIDTH+Y_OFFSET} y1={HEIGHT - currentHoverPoint[1]*16} y2={HEIGHT - currentHoverPoint[1]*16} stroke="#3693ebdb" strokeWidth="1" strokeLinecap="butt"/>
              <line id="hover-y" x1={Y_OFFSET+currentHoverPoint[0]*16} x2={Y_OFFSET+currentHoverPoint[0]*16} y1={0} y2={HEIGHT} stroke="#3693ebdb" strokeWidth="1" strokeLinecap="butt"/>
              <line id="hover-diagonal-1" stroke-dasharray="5,5" x1={Y_OFFSET+(currentHoverPoint[0]-currentHoverPoint[1])*16} y1={HEIGHT} x2={Y_OFFSET + HEIGHT - (currentHoverPoint[1] - currentHoverPoint[0])*16} y2={0} stroke="#3693ebdb" strokeWidth="1" strokeLinecap="butt"/>
              <line id="hover-diagonal-2" stroke-dasharray="5,5" x1={Y_OFFSET} y1={HEIGHT - (currentHoverPoint[1]+currentHoverPoint[0])*16} x2={Y_OFFSET + (currentHoverPoint[1] + currentHoverPoint[0])*16} y2={HEIGHT} stroke="#3693ebdb" strokeWidth="1" strokeLinecap="butt"/>
            </svg>
          </div>
        </div>

        <br/>
        <div className={styles.cayley_table_header}>
          The Goldbach Conjecture | Black dot is $p_x+p_y=$ even number.
        </div>
        <div className={styles.cayley_table_container}>
          {/* <div style={{width: '100%'}} id="canvas"/> */}
          <div style={{width: '100%', overflow: 'scroll'}}>
            <svg width={WIDTH} height={HEIGHT+20} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="gray" stroke-width="0.5" />
                </pattern>
                <pattern id="grid" x="16" width="160" height="160" patternUnits="userSpaceOnUse">
                  <rect width="160" height="160" fill="url(#smallGrid)" />
                  <path d="M 160 0 L 0 0 0 160" fill="none" stroke="gray" stroke-width="1" />
                </pattern>
                <pattern id="y-axis-numbers">
                </pattern>
              </defs>
              <line id="x-axis" x1={Y_OFFSET} x2={WIDTH+Y_OFFSET} y1={HEIGHT} y2={HEIGHT} stroke="black" strokeWidth="2" strokeLinecap="butt"/>
              <line id="y-axis" x1={Y_OFFSET} x2={Y_OFFSET} y1="0" y2={HEIGHT} stroke="black" strokeWidth="2" strokeLinecap="butt"/>
              <rect x={Y_OFFSET} width={WIDTH} height={HEIGHT} fill="url(#grid)" />
              <rect width={Y_OFFSET} height={HEIGHT} fill="url(#y-axis-numbers)"/>
              {
                // y
                [...Array(currentSelectY).keys()].map((number, index)=><text x="0" y={HEIGHT - 12 - index*16} style={{fontSize: 12}}>{number+1}</text>)
              }
              {
                // x
                [...Array(currentSelectX).keys()].map((number, index)=><text x={index*16+10} y={HEIGHT + X_OFFSET} style={{fontSize: 12}}>{number}</text>)
              }
              {
                // points
                goldbachPrimes.map(point => <circle id={'p_gold'+point[0]+'-'+point[1]} cx={Y_OFFSET+point[0]*16} cy={HEIGHT-point[1]*16} r="4"/>)
              }
              {
                // draw line // (0,0) -> (min, min)
                <line id="diagonal" x1={Y_OFFSET} y1={HEIGHT} x2={diagonalMin+16} y2={0} stroke="#eb3636db" strokeWidth="2" strokeLinecap="butt"/>
              }
              {/* draw hover lines */}
              <line id="hover-x" x1={Y_OFFSET} x2={WIDTH+Y_OFFSET} y1={HEIGHT - currentHoverGoldPoint[1]*16} y2={HEIGHT - currentHoverGoldPoint[1]*16} stroke="#3693ebdb" strokeWidth="1" strokeLinecap="butt"/>
              <line id="hover-y" x1={Y_OFFSET+currentHoverGoldPoint[0]*16} x2={Y_OFFSET+currentHoverGoldPoint[0]*16} y1={0} y2={HEIGHT} stroke="#3693ebdb" strokeWidth="1" strokeLinecap="butt"/>
              <line id="hover-diagonal-1" stroke-dasharray="5,5" x1={Y_OFFSET+(currentHoverGoldPoint[0]-currentHoverGoldPoint[1])*16} y1={HEIGHT} x2={Y_OFFSET + HEIGHT - (currentHoverGoldPoint[1] - currentHoverGoldPoint[0])*16} y2={0} stroke="#3693ebdb" strokeWidth="1" strokeLinecap="butt"/>
              <line id="hover-diagonal-2" stroke-dasharray="5,5" x1={Y_OFFSET} y1={HEIGHT - (currentHoverGoldPoint[1]+currentHoverGoldPoint[0])*16} x2={Y_OFFSET + (currentHoverGoldPoint[1] + currentHoverGoldPoint[0])*16} y2={HEIGHT} stroke="#3693ebdb" strokeWidth="1" strokeLinecap="butt"/>
            </svg>
          </div>
        </div>
      </article>
  </Layout>
}
