'use strict'

require('harmony-reflect')

class ActiveRecord {
  constructor(tableName) {
    this.tableName = tableName
  }
  getFindFn(key) {
    return function(value) {
      console.log(`Executing: select * from ${this.tableName} where ${key.toLowerCase()} = ${value}`)
    }
  }
}

class Customer extends ActiveRecord {
  constructor() {
    super('customers')
  }
}

Customer.prototype = new Proxy(Customer.prototype, {
  get(target, propKey) {
    if (propKey.startsWith('findBy')) {
      let findKey = propKey.slice('findBy'.length)
      return target.__proto__.getFindFn(findKey)
    }

    return Reflect.get(...arguments)
  }
})

const customer = new Customer

customer.findById(1)
customer.findByName('John Wu')
