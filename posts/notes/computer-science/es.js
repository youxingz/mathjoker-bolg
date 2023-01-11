const user = {
  name: 'haha',
  eat: () => {
    return 'bobo'
  }
}
const toSafe = (object) => {
  // not implement for !object type
  if (typeof object !== 'object') return object
  const handler = {
    get (obj, key) {
      if (typeof obj[key] === 'function') {
        return new Proxy(obj[key], {
          apply (target, that, args) {
            console.log(target, that, args)
            // return target(args)
            return target.apply(that, args)
          }
        })
      }
      if (obj.hasOwnProperty(key)) {
        return obj[key]
      }
      return new Proxy({}, handler)
      // throw new Error(`Undefined property: ${key}`)
    },
    set (obj, key, val) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = val
      }
    }
  }
  return new Proxy(object, handler)
}
const proxy = toSafe(user)
console.log(proxy.eat())
console.log(proxy.name)

const throttle = (func, wait) => {
  let start = new Date()
  return function (...args) {
    let now = new Date()
    if (now - start > wait) {
      func.apply(this, args)
      start = now
    }
  }
}

const debounce = (func, wait) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

const XPromise = function (func) {
  const PENDING = Symbol()
  const REJECTED = Symbol()
  const FULLFILLED = Symbol()

  this.state = PENDING
  this.value = null
  const resolve = (val) => {
    this.state = FULLFILLED
    this.value = val
  }
  const reject = (err) => {
    this.state = REJECTED
    this.value = err
  }

  this.then = (thenResolve, thenReject) => {
    if (this.state == FULLFILLED) {
      thenResolve(this.value)
    } else {
      thenReject(this.value)
    }
  }

  try {
    func(resolve, reject)
  } catch(error) {
    reject(error)
  }
}