import {assert} from "chai"
import {Environment} from "../src/index"

describe('Environment', () => {
    it('Can be created', () => {
        const env = new Environment()
    })

    it('Stores process.env as a default argument', () => {
        const env = new Environment()
        assert.deepStrictEqual(env['environ'], process.env)
    })

    it('Can take an object as a pseudo-environment', () => {
        const environment = {'NODE_ENV': 'test'}
        const env = new Environment(environment)
        assert.deepStrictEqual(env['environ'], environment)
    })
});
