# InterEnv

> A simple environment wrapper.

InterEnv is designed to be a thin wrapper around process.env, or any string keyed, string valued object.

## Usage

```js {}[examples/readme-1.cjs]
const {Environment} = require('@doctor_internet/interenv')
const env = new Environment()
console.log(env.environment())
console.log(env.get('TEST_VAR'))
console.log(env.int('PORT'))
```
```console
user@localhost:~$ NODE_ENV=local TEST_VAR="Hello, world!" PORT=80 node examples/readme-1.cjs
> local
> Hello, world!
> 80
```

## API

### Standard Interaction

The functions get, int, float and list are used to pull raw values, integers, floats and arrays out of the environment.

```js {}[examples/readme-2.mjs]
import {Environment} from "@doctor_internet/interenv"
let env = new Environment({
	NODE_ENV: "test",
	TEST_INT: "1",
	TEST_FLOAT: "5.7",
	TEST_LIST: "this,is,a,csv,list"
})
let value

value = env.get("NODE_ENV")
console.log(typeof value, '->', value)

value = env.int("TEST_INT")
console.log(typeof value, '->', value)

value = env.float("TEST_FLOAT")
console.log(typeof value, '->', value)

value = env.list("TEST_LIST")
console.log(Array.isArray(value) ? 'array' : typeof value, '->', value)
```
```console
user@localhost:~$ node examples/readme-2.mjs
> string -> test
> number -> 1
> number -> 5.7
> array -> ['this', 'is', 'a', 'csv', 'list']
```

### Prefixing / Namespace'd Vars

For specific use cases, such as fetching only DB vars, prefixing can be used.

```ts {}[examples/readme-3.ts]
import {Environment} from "@doctor_internet/interenv"
const env = new Environment({
    NODE_ENV: "test",
    DB_HOST: "example.com",
    DB_USER: "testuser",
    DB_PASS: "testpass",
    DB_MAIN_DB: "test_database_eu",
    DB_BACKUP_DB: "test_database_us"
})

const sub = env.prefixed("DB_")
console.log("DB_ / NODE_ENV?", sub.has("NODE_ENV"))
console.log("DB_ / HOST:", sub.raw("HOST"))

const main = sub.prefixed("MAIN_")
console.log("DB_ / MAIN_ / DB:", main.raw("DB"))

const backup = sub.prefixed("BACKUP_")
console.log("DB_ / BACKUP_ / DB:", backup.raw("DB"))
```
```console
user@localhost:~$ ts-node examples/readme-1.ts
> DB_ / NODE_ENV? false
> DB_ / HOST: example.com
> DB_ / MAIN_ / DB: test_database_eu
> DB_ / BACKUP_ / DB: test_database_us
```

## Install

With [npm](https://npmjs.org/) installed, run

```console
user@localhost:~$ npm install @doctor_internet/interenv
```

## See Also

- [noffle/common-readme](https://github.com/noffle/common-readme) :: Readme Generation
- [mocha](https://mochajs.org/) :: Testing Suite

## License

MIT
