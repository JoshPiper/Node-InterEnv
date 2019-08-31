// For production, replace ../env with @doctor_internet/interenv
const EnvHandler = require("../env")

let env = new EnvHandler({env: require("../package.json"), normalize: true})
console.log(env.raw("NAME"))