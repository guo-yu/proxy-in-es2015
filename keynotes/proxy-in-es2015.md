title: Proxy in ES2015
speaker: Guo Yu
url: http://guoyu.me
transition: slide2

[slide]
## Proxy in ES2015, JavaScript Meta Programming 101
---
**Meta Programming**  
Programming the programming of your program

[slide]
## Guo Yu
**GitHub@guo-yu** https://github.com/guo-yu  
**新浪微博@郭宇** http://weibo.com/turingou
<img src="http://ww2.sinaimg.cn/large/61ff0de3jw1eyewrtr8swj20hf0fftcd.jpg"/> {:&.moveIn}

[slide]
## io.js => Node.js 
<img src="http://ww4.sinaimg.cn/large/61ff0de3jw1eyewulkip3j20cz08ct96.jpg"/>

[slide]
## Meta Programming
Code inspecting itself, Code modifying itself
<img src="https://img2.doubanio.com/lpic/s7014167.jpg">

[slide]
- Method lookup 方法查找
  * Hack 对象属性或函数
- Introspection 内省
  * 在运行时查看类或对象的信息
- Reflection 反射
  * respond_to?

[slide]
## Method lookup & Reflection
在方法查找中设置陷阱（Traps）
```javascript
const original = {
  a: 3,
  b: 4,
}

const proxied = new Proxy(original, {
  get(target, key, context) {
    console.log('accessing:', key)
    return key === 'a' ? 
      'Got it!' : 
      target[key] // Or `Reflect.get(target, key, context)`
  }
})

// => 3
console.log(original.a)

// => accessing:a
// => Got it!
console.log(proxied.a)
console.log(proxied.b)
```

[slide]
## Why Proxy a Object?
- Validation, correction and default property.
- Protect data (Immutable data list)
- Define missing method (like **ActiveRecord** in RoR)
- Define virtual property (like mongoose virtual property)
- Overwrite or hack prototype chain (`Object.setPrototypeOf`)
- For fun (Black Magic methods)

[slide]
## Why Proxy a Object?
Validation, correction and default property.
```js
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // The default behavior to store the value
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);

person.age = 100;
console.log(person.age); // 100
person.age = 'young'; // Throws an exception
person.age = 300; // Throws an exception
```

[slide]
## Why Proxy a Object?
Protect data (Immutable data list)
```js
let target = {
  getAttr: function (key) {
    return this[`_${key}`];
  },
  _name: 'John Wu',
  _age: 21
};

let proxy = new Proxy(target, {
  get (target, propKey, receiver) {
    return target.getAttr(propKey);
  }
});

console.log(proxy.name);
console.log(proxy.age);
```

[slide]
## Why Proxy a Object?
Define missing method (like **ActiveRecord** in RoR)
```js
class ActiveRecord {
  constructor ({ tableName }) {
    this.tableName = 'test-table';
  }
  getFindFn (key) {
    return function (value) {
      console.log(`Executing: select * from ${this.tableName} where ${key.toLowerCase()} = ${value}`);
    }
  }
}

ActiveRecord.prototype = new Proxy(ActiveRecord.prototype, {
  get (target, propKey) {
    if (propKey.startsWith('findBy')) {
      let findKey = propKey.slice('findBy'.length);
      return target.__proto__.getFindFn(findKey);
    }
    return Reflect.get(...arguments);
  }
});

let customer = new ActiveRecord;
customer.findById(1);
customer.findByName('John Wu');
```

[slide]
## Why Proxy a Object?
Define virtual property (like mongoose virtual property)
```js
const jack = {
  firstName: 'Jack',
  lastName: 'Ma'
}

const proxy = new Proxy(jack, {
  get(target, key) {
    if (key === 'name') {
      return `${target.firstName} ${target.lastName}`
    }

    return Reflect.get(...arguments)
  }
})
```

[slide]
## Why Proxy a Object
Overwrite or hack prototype chain (`Object.setPrototypeOf`) to create a tail proxy
```js
var person = {
  speak(to = 'jack') {
    console.log(`hello ${to}`)
  }
}
var proxy = new Proxy({}, {
  get(target,key,context) {
    // Pass this returned proxy function to context.speak()
    return context.speak(`${key}, Got you back!`)
  }
})

// Pass a proxy obejct to `Object.setPrototypeOf`
// Setup `person` to fall back to `proxy`
Object.setPrototypeOf(person, proxy);

// => hello jack
person.speak()
// => hello jackMa
person.speck('jackMa')
// => hello jackMa, Got you back!
person.jackMa()
```

[slide]
## How to Proxy a Object?
Hooks list:
- get => `proxy[name]`
- set => `proxy[name] = val`
- has => `name in proxy`
- deleteProperty => `delete proxy[name]`
- apply => `proxy()`
- construct => `new proxy()`
- enumerate => `for (var name in proxy) {...}`
- ownKeys => `Object.keys(proxy)`
- defineProperty
- getOwnPropertyDescriptor
- ...

[slide]
## What to do?
Some interesting approachs:
- Add a async hook to a promise object: `asyncObject.data`
- Support nagative index of proxied Array `proxyArray[-1]` https://github.com/sindresorhus/negative-array
- A small script that enables you to make typos in JavaScript property names `array.tosTr1ng() => array.toStrng()`: https://mths.be/tpyo
- ...

[slide]
## Read more
- Metaprogramming in ruby: http://deathking.github.io/metaprogramming-in-ruby/chapter04.html
- Proxy API in MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
- Proxy Tutorial: http://soft.vub.ac.be/~tvcutsem/proxies/
- You do not konw JS: https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20&%20beyond/ch7.md
- More examples: https://github.com/tvcutsem/harmony-reflect/tree/master/examples

[slide]
## Thanks