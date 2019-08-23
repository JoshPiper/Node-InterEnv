# InterEnv

> A simple environment processing system.

Even with tools like dotenv or docker's env management, moving from explicit configuration files to env vars can be difficult.
InterEnv is designed to make that as painless as possible with a unified API and simple processing.

## Usage

```js
const Handler = require('@doctor_internet/interenv')
let env = new Handler(process.env) // Simply wrap process.env

console.log(env.raw("NODE_ENV"))
```

outputs

```
test
```

or whatever your env is set to.

## API

### Standard Interaction

The functions raw, int, float and list are used to pull raw values, integers, floats and arrays out of the list.

```js
 const Handler = require('@doctor_internet/interenv')
 let env = new Handler({
    NODE_ENV: "test",
    TEST_INT: "3",
    TEST_FLOAT: "5.7",
    TEST_LIST: "this,is,a,csv,list"
})
console.log(env.raw("NODE_ENV")) // string: "test"
console.log(env.int("TEST_INT")) // number: 3
console.log(env.float("TEST_FLOAT")) // number: 5.7
console.log(env.list("TEST_LIST")) // string[]: ["this", "is", "a", "csv", "list"]
```

### Prefixing / Namespace'd Vars

For specific use cases, such as fetching only DB vars, prefixing can be used.

```js
 const Handler = require('@doctor_internet/interenv')
 let env = new Handler({
    NODE_ENV: "test",
    DB_HOST: "example.com",
    DB_USER: "testuser",
    DB_PASS: "testpass",
    DB_MAIN_DB: "test_database_eu",
    DB_BACKUP_DB: "test_database_us"
})

let subEnv = env.prefixed("DB_")
console.log(subEnv.raw("HOST")) // string: "example.com"
```

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install @doctor_internet/interenv
```

## See Also

- [noffle/common-readme](https://github.com/noffle/common-readme) :: Readme Generation
- [mocha](https://mochajs.org/) :: Testing Suite

## License

MIT

