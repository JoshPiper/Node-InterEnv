import {assert} from "chai"
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
    describe('#construct', () => {
        it('Can be created', () => {
            const env = new Environment()
        })

        it('Stores process.env as a default argument', () => {
            const env = new Environment()
            assert.deepStrictEqual(env['environ'], process.env)
        })

        it('Can take an object as a pseudo-environment', () => {
            const env = new Environment(test_environment)
            assert.deepStrictEqual(env['environ'], test_environment)
        })
    })


    describe('#has', () => {
        it('Correctly answers keys it has and does not have', () => {
            const env = new Environment(test_environment)
            assert.isTrue(env.has('NODE_ENV'))
            assert.isFalse(env.has('TEST_NXT'))
        })
    })


    describe('#get', () => {
        it('Returns values it has', () => {
            const env = new Environment(test_environment)
            const value = env.get('NODE_ENV')

            assert.isString(value)
            assert.strictEqual(value, "test")
        })

        it('Returns undefined, by default, for values it does not have', () => {
            const env = new Environment(test_environment)
            const value = env.get('TEST_NXT')
            assert.isUndefined(value)
        })

        it('Returns default value if given for values it does not have', () => {
            const env = new Environment(test_environment)
            const value = env.get('TEST_NXT', 'fallback')
            assert.isString(value)
            assert.strictEqual(value, "fallback")
        })

        it('Raises an exception if commanded', () => {
            const env = new Environment(test_environment)
            assert.throws(() => {
                env.get('TEST_NXT', RaiseException)
            })
        })

        it('Does not raise an exception the value exists', () => {
            const env = new Environment(test_environment)
            assert.doesNotThrow(() => {
                env.get('NODE_ENV', RaiseException)
            })
        })
    })

    describe('#int', () => {
        it('Returns values it has', () => {
            const env = new Environment(test_environment)
            const value = env.int('TEST_INT')

            assert.isNumber(value)
            assert.isNotNaN(value)
            assert.strictEqual(value, 1)
        })

        it('Returns default values', () => {
            const env = new Environment(test_environment)
            const value = env.int('TEST_NXT', '2')

            assert.isNumber(value)
            assert.isNotNaN(value)
            assert.strictEqual(value, 2)
        })

        it('Raises an exception for invalid numbers', () => {
            const env = new Environment(test_environment)
            assert.throws(() => {
                env.int('TEST_NXT', 'test')
            })
        })

        it('Can pass a radix', () => {
            const env = new Environment(test_environment)
            const value = env.int("TEST_INT_HEX", undefined, 16)

            assert.isNumber(value)
            assert.isNotNaN(value)
            assert.strictEqual(value, 255)
        })
    })

    describe('#float', () => {
        it('Returns values it has', () => {
            const env = new Environment(test_environment)
            const value = env.float('TEST_FLOAT')

            assert.isNumber(value)
            assert.isNotNaN(value)
            assert.strictEqual(value, 1.5)
        })

        it('Returns default values', () => {
            const env = new Environment(test_environment)
            const value = env.getFloat('TEST_NXT', '2.5')

            assert.isNumber(value)
            assert.isNotNaN(value)
            assert.strictEqual(value, 2.5)
        })

        it('Raises an exception for invalid numbers', () => {
            const env = new Environment(test_environment)
            assert.throws(() => {
                env.float('TEST_NXT', 'test')
            })
        })
    })
})
