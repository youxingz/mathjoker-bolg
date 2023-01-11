---
title: "面经总结（前端）"
date: "2020-11-27"
---

### JavaScript / TypeScript 基础语法

- ES6 新增
  - 关键字 `let` 和 `const`，用该关键字声明的变量仅在被声明的作用域内可访问，`const` 表示常量，不可重复赋值（相较于古老的 `var` 一处声明遍处处可用，会导致很多问题）
    ```javascript
      {
        var a = 1
        const a = 2  // SyntaxError: Identifier 'a' has already been declared
      }
      console.log(a) // 1
      { let b = 1 }
      console.log(b) // ReferenceError: b is not defined
      { const c = 1 }
      console.log(c) // ReferenceError: c is not defined
      const c = 2
      const c = 3    // SyntaxError: Identifier 'c' has already been declared
      const a = 2
      const b = 2
      
      // 特别的例子：
      // 因为 JS 奇葩的设定，在当前作用域内定义的变量，如果外部也定义过，则视为外部未定义（故在局部访问的时候可能发生`未初始化`的异常）
      let d = 1
      {
        console.log(d) // ReferenceError: Cannot access 'd' before initialization
        const d = 2
      }
    ```
  - 解构赋值（很多语言也称之为`模式匹配`）
    ```javascript
      //// array:
      const [ user, setUser ] = [ {}, () => {} ]
      const [ a, b, c ] = [ 1, 2, 3 ]
      console.log(a) // 1
      // ...rest
      const [ d, e, ...rest] = [ 1, 2, 3, 4, 5 ]
      console.log(rest) // [ 3, 4, 5 ]
      // set default
      const [ f = 1 ] = []
      console.log(f) // 1
      //// object:
      const { name: username } = { name: 'Tom' }
      console.log(username) // Tom
      const { name } = { name: 'Tom' }
      console.log(name) // Tom
      //// nest:
      const { a: [ b, c ], d: { e, f } } = { a: [ 1, 2 ], d: { e: 3, f: [ 4 ] } }
      console.log(b, c, e, f) // 1 2 3 [ 4 ]
    ```
  - 字符串新增函数：`includes`, `startsWith`, `endsWith`, `repeat`, `padStart`, `padEnd`
  - 模版字符串
  - `Number` 相关
    - 数值表示：二进制如 `0b11` `0B11`，八进制如 `0o77` `0O77`
    - 新增常量 $\varepsilon$，即：`Number.EPSILON` 为一个非常非常非常小的数字，可用于比较两个数是否相等（可参考因 IEEE754 浮点数规则导致的问题）
    - 新增 `Number.isFinite`, `Number.isNaN` 方法，用 `Number.parseInt`, `Number.parseFloat` 替代 `parseInt`, `parseFloat`
  - `Math` 相关：新增双曲函数、符号函数等
  - 对象相关
    ```javascript
      // 字面量（属性值简写）
      const name = 'Tom', age = 17
      const user = { name, age }
      console.log(user) // { name: 'Tom', age: 17 }
      // 方法名称简写
      const calls = {
        callIt: function () { /* do something */ }
        callMe () { /* do something */ }
      }
      // generator 函数简写
      const gens = {
        gen_prime: function * () {
          yield 2
          yield 3
          yield 5
        }
        * gen_prime () {
          yield 2
          yield 3
          yield 5
        }
      }
      // 属性名支持变量
      const id = 755
      const vars = {
        ['key-' + id ]: 'Hi, there!'
      }
      console.log(vars['key-755']) // Hi, there!
      // ... 算符
      const tom = { name, age }
      const newTom = { ...tom, age: 18 }

      //// Object 的新函数
      // Object.assign，浅拷贝
      const source = [1, 2, 3]
      const target = [4]
      Object.assign(source, target)
      console.log(source) // [4, 2, 3]
      // Object.is, 类似 === 算符
    ```
  - 数组相关
    - 新增函数
    ```javascript
    Array.of(1, 2, 3) // [1, 2, 3]
    Array.from([1, , 3]) // [1, undefined, 3]
    Array.from([1, 2, 3], (x) => x * 2) // [2, 4, 6]
    Array.from({ 0: 1, 1: 1, 2: 2}) // [1, 1, 2]
    Array.from("HelloWorld") // ['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd']
    ```
    - 扩展函数：`find`, `findIndex`, `fill`, `copyWithin`, `entries`, `keys`, `values`, `includes`, `flat`, `flatMap`
    - 注：`map`, `reduce`, `filter`, `forEach` 等函数是 ES5 中给出；`flatMap` 是先执行 `map` 再执行 `flat`
  - 函数
    - 支持默认参数
    - 支持不定参数（在参数列表最后以 `...rest` 形式表示为一个数组）
    - 支持箭头函数
      - 注意：箭头函数中无 `this`, `super`, `arguments`, `new.target` 操作
      - 因箭头函数内部的 `this` 表示执行者的上下文，所以使用箭头函数的时候需要按用途区分是用箭头函数还是普通的函数
  - Symbol（设计思路很像 Elixir 的 `Atom`，JS 里可作用于常量标签的场景使用）
  - Map / Set
    - Map 的键可以用任意类型，而 Object 只能用 `string` 或 `symbol` 来做键
    - Map 有 `size` 函数，Object 没有
    - Map 迭代使用 `for...of` 或者 `forEach`
    - Set 有 `has` 函数
  - Reflect / Proxy
    - Proxy 可以代理赋值操作的 `get` `set` 方法，很好用
    - 注：严格模式下，`set` 代理如果没有返回 `true`，就会报错
    - Proxy 常代理的其他方法：`apply`, `has`, `construct`, `defineProperty`, `deleteProperty`, `getOwnPropertyDescriptor`, `getPrototypeOf`, `isExtensible`, `ownKeys`, `preventExtensions`, `setPrototypeOf`
    - Reflect 与 Proxy 类似，可以反射很多函数，这些函数与 Proxy 支持的是一样的
  - 迭代器
    - Symbol.iterator，就是一个用 `next` 一直访问元素的构建方法
    - 可以用 `for...of` 迭代 `Map`, `Set`, `Array`, `String`，但 `Object` 不可迭代
  - Class 类
    - 类其实就是函数
    - 类的方法是定义在原型上的，所以可以通过 `Object.assign(MyClass.prototype, { mthond2() {} })` 来添加方法
    - `static` 相关：类中只有静态方法，没有静态属性
    - 类必须通过 `new` 关键字来实例化，不同的实例其原型是相同的
    - 类中定义的 `get` 必须与 `set` 同时出现
    - 类可通过 `extends` 关键字进行继承操作
  - Module 模块：`import`, `export` 关键字
  - Promise
  - Generator
  - `async` `await` 是 ES7 才有的关键字，是 Promise 的语法糖。被 `async` 修饰的函数会返回一个 Promise，被 `await` 修饰的语句如果是一个 Promise 则会等待其 resolve 后再执行后续代码
  
- TypeScript
  - 常见的类型有：`number`, `string`, `boolean`, `any`, `object`, `Array`, `Function`, `Promise` `Date`, `RegExp`, `undefined`, `null`
  - 接口 `interface`
  - 枚举 `enum`
  - 函数返回为空时 `void`
    ```typescript
      const age: number = 17
      const list: Array<number|string> = [1, 2, 3, '4']
      // self-defined type
      type User = {
        name: string
      }
      type Callback = () => void
      const doSomething:Callback = () => {
        // ...
      }
      // enum
      enum GENDER {
        male, female, unknown
      }
      const gender:GENDER = GENDER.male
      // function
      const foo:(x:number)=>number = (x) => {
        return x
      }
      // Promise
      const promise:Promise<string> = new Promise((resolve, reject) => {})
      function request:Promise<object> {
        const promise = new Promise((resolve:(val: object) => void) => {
          resolve({})
        })
        return promise
      }
      // interface
      interface User {
        readonly name: string
        age: number
        height?: number
        makeFriend: (friend: User) => void
      }
      const tom:User = {name: 'Tom', age: 17}
      // interface extends
      interface VipUser extends User {
        vipLevel: number
      }
      // type extends
      type VipUser2 extends User {
        vipLevel: number
      }
    ```
- 防抖 / 节流
  ```javascript
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
  ```
- Promise
  
  实现一个 Promise
  ```javascript
    const XPromise = function (func) {
      const PENDING = Symbol()
      const REJECTED = Symbol()
      const FULFILLED = Symbol()

      this.state = PENDING
      this.value = null
      const resolve = (val) => {
        this.state = FULFILLED
        this.value = val
      }
      const reject = (err) => {
        this.state = REJECTED
        this.value = err
      }

      this.then = (thenResolve, thenReject) => {
        if (this.state == FULFILLED) {
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
  ```

### HTTP 相关
常见主题：
  - 状态码（略）
  - 缓存（略）
  - HTTPS（略）
  - `fetch` （略）

### VueJS / React
  - VueJS
    VueJS 常见主题包含：生命周期、Vuex、组件传值
    - 生命周期
