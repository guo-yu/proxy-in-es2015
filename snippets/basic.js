'use strict'

require('harmony-reflect')

const original = {
  a: 3,
  b: 4,
}

const proxied = new Proxy(original, {
  get(target, key, context) {
    console.log('accessing:', key)
    return key === 'a' ? 
      'Got it!' : 
      target[key]
  }
})

// => 3
console.log(original.a)

// => accessing:a
// => Got it!
console.log(proxied.a)
console.log(proxied.b)