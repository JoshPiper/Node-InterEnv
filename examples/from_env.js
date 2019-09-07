// For production, replace ../env with @doctor_internet/interenv
const EnvHandler = require("../env")

// Create an example "environment".
let envObj = {
	NODE_ENV: "test",
	TEST_VAR: "myVar",
	TEST_INT: "12",
	TEST_FLOAT: "${TEST_INT}.7"
}

// Load it into our handler and expand the vars.
let env = new EnvHandler({
	env: envObj,
	expand: true
})

// Grab some data from it.
console.log(env.isTesting())
console.log(env.raw("TEST_FLOAT"))