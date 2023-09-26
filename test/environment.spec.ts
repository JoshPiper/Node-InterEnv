import {assert} from "chai"
import {Environment} from "../src/index"
import {Environment, RaiseException, iEnvironment} from "../src/index"

interface TestEnvironment extends iEnvironment {
    NODE_ENV: string
    TEST_INT: string
    TEST_INT_HEX: string
    TEST_FLOAT: string
    TEST_BOOL_ON: string
    TEST_BOOL_OFF: string
}
const test_environment: TestEnvironment = {
    'NODE_ENV': 'test',
    'TEST_INT': '1',
    'TEST_INT_HEX': '0xff',
    'TEST_FLOAT': '1.5',
    'TEST_BOOL_ON': 'on',
    'TEST_BOOL_OFF': '❌'
}

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
