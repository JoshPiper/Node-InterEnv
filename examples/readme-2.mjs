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
