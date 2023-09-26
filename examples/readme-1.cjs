const {Environment} = require('@doctor_internet/interenv')

// By default, wrap process.env
const env = new Environment()
console.log(env.environment())
console.log(env.get('TEST_VAR'))
console.log(env.int('PORT'))
