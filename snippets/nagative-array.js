'use strict'

require('harmony-reflect')

const target = ['Parts', 'Powerful', 'ES5']

const proxy = new Proxy(target, {
  _getRealKey (target, propKey) {
    let realKey = +propKey

    if (realKey < 0) {
      let length = Reflect.get(target, 'length')
      realKey = length + realKey;
    }

    return realKey
  },
  get (target, propKey) {
    let realKey = this._getRealKey(...arguments)
    return Reflect.get(target, realKey)
  },
  set (target, propKey, propValue) {
    let realKey = this._getRealKey(...arguments)
    return Reflect.set(target, realKey, propValue)
  }
})

proxy[-1] = 'ES6'

console.log(proxy[-1])
console.log(proxy[-2]) 
console.log(proxy[-3])