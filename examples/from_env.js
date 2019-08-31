// For production, replace ../env with @doctor_internet/interenv
const EnvHandler = require("../env")

let envObj = {
	NODE_ENV: "test",
	TEST_VAR: "myVar",
	TEST_INT: "12",
	TEST_FLOAT: "${TEST_INT}.7"
}

let env = new EnvHandler({env: envObj})
console.log(env.raw("NODE_ENV"))