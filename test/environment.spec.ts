import {assert} from "chai"
import {Environment, RaiseException} from "../src/index"
import { delimiter } from "path"

type EnvNameSpec = [string, string, boolean, boolean, boolean, boolean, boolean][]

const test_environment = {
    'NODE_ENV': 'test',
    'PATH': `path1${delimiter}path2${delimiter}path3`,
    'TEST_GET': 'value',
    'TEST_INT': '1',
    'TEST_INT_HEX': '0xff',
    'TEST_FLOAT': '1.5',
    'TEST_BOOL_ON': 'on',
    'TEST_BOOL_OFF': '❌',
    'TEST_LIST': 'a| b| c| d |e',
    'TEST_CSV': 'a, b, c, d ,e'
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

        it('Can return undefined values', () => {
            const env = new Environment(test_environment)
            const value = env.int('TEST_NXT')

            assert.isUndefined(value)
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

        it('Can return undefined values', () => {
            const env = new Environment(test_environment)
            const value = env.float('TEST_NXT')

            assert.isUndefined(value)
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

    describe('#bool', () => {
        it('Returns true values it has', () => {
            const env = new Environment(test_environment)
            const value = env.bool('TEST_BOOL_ON')

            assert.isBoolean(value)
            assert.isTrue(value)
        })

        it('Returns false values it has', () => {
            const env = new Environment(test_environment)
            const value = env.bool('TEST_BOOL_OFF')

            assert.isBoolean(value)
            assert.isFalse(value)
        })

        it('Can return undefined values', () => {
            const env = new Environment(test_environment)
            const value = env.bool('TEST_NXT')

            assert.isUndefined(value)
        })

        it('Returns default values', () => {
            const env = new Environment(test_environment)
            const value = env.getBool('TEST_NXT', 'yes')

            assert.isBoolean(value)
            assert.isTrue(value)
        })

        it('Is case insensitive', () => {
            const env = new Environment(test_environment)
            const value = env.getBoolean('TEST_NXT', 'yEs')

            assert.isBoolean(value)
            assert.isTrue(value)
        })

        it('Raises an exception for invalid booleans', () => {
            const env = new Environment(test_environment)
            assert.throws(() => {
                env.bool('TEST_NXT', 'invalid')
            })
        })
    })

    describe('#list', () => {
        it('Returns pipe seperated values', () => {
            const env = new Environment(test_environment)
            const value = env.list('TEST_LIST', '|')

            assert.isArray(value)
            assert.lengthOf(value, 5)
            assert.deepStrictEqual(value, ['a', 'b', 'c', 'd', 'e'])
        })

        it('Returns empty lists for non-existant entries', () => {
            const env = new Environment(test_environment)
            const value = env.list('TEST_NXT')

            assert.isArray(value)
            assert.lengthOf(value, 0)
            assert.deepStrictEqual(value, [])
        })
    })

    describe('#csv', () => {
        it('Returns comma seperated values', () => {
            const env = new Environment(test_environment)
            const value = env.csv('TEST_CSV')

            assert.isArray(value)
            assert.lengthOf(value, 5)
            assert.deepStrictEqual(value, ['a', 'b', 'c', 'd', 'e'])
        })

        it('Returns empty lists for non-existant entries', () => {
            const env = new Environment(test_environment)
            const value = env.csv('TEST_NXT')

            assert.isArray(value)
            assert.lengthOf(value, 0)
            assert.deepStrictEqual(value, [])
        })
    })

    describe('#all', () => {
        it('Returns all entries', () => {
            const env = new Environment(test_environment)
            const entries = env.all()

            assert.isObject(entries)
            assert.lengthOf(Object.entries(entries), Object.entries(test_environment).length)
            assert.deepStrictEqual(entries, test_environment)
        })
    })

    describe('#prefixed', () => {
        it('Creates a new prefixed environment', () => {
            const env = (new Environment(test_environment)).prefixed('TEST_')

            assert.strictEqual(env.get('GET'), 'value')
        })
        it('Filters all', () => {
            const entries = (new Environment(test_environment)).prefixed('TEST_').all()
            assert.hasAnyKeys(entries, ['GET', 'INT', 'INT_HEX'])
            assert.doesNotHaveAnyKeys(entries, ['NODE_ENV', 'ENV'])
            assert.lengthOf(Object.keys(entries), Object.keys(test_environment).length - Object.keys(test_environment).filter(key => !key.startsWith('TEST_')).length)
        })
    })

    describe('#environment', () => {
        const envNames: EnvNameSpec = [
            ['default', 'default', false, false, false, false, false],
            ['dev', 'development', true, false, false, false, false],
            ['development', 'development', true, false, false, false, false],
            ['test', 'testing', false, true, false, false, false],
            ['testing', 'testing', false, true, false, false, false],
            ['stage', 'staging', false, false, true, false, false],
            ['staging', 'staging', false, false, true, false, false],
            ['prod', 'production', false, false, false, true, false],
            ['production', 'production', false, false, false, true, false],
            ['live', 'production', false, false, false, true, false],
            ['local', 'local', false, false, false, false, true],
            ['localhost', 'local', false, false, false, false, true],
        ]
        for (let [en, out, id, ite, is, ip, il] of envNames){
            describe(`(${en})`, () => {
                it(`Maps to "${out}"`, () => {
                    assert.strictEqual((new Environment({'NODE_ENV': en})).environment(), out)
                })

                if (id){
                    it(`Is a development environment"`, () => {
                        assert.isTrue((new Environment({'NODE_ENV': en})).isDevelopment())
                    })
                } else {
                    it(`Is not a development environment"`, () => {
                        assert.isFalse((new Environment({'NODE_ENV': en})).isDevelopment())
                    })
                }

                if (ite){
                    it(`Is a testing environment"`, () => {
                        assert.isTrue((new Environment({'NODE_ENV': en})).isTesting())
                    })
                } else {
                    it(`Is not a testing environment"`, () => {
                        assert.isFalse((new Environment({'NODE_ENV': en})).isTesting())
                    })
                }

                if (is){
                    it(`Is a staging environment"`, () => {
                        assert.isTrue((new Environment({'NODE_ENV': en})).isStaging())
                    })
                } else {
                    it(`Is not a staging environment"`, () => {
                        assert.isFalse((new Environment({'NODE_ENV': en})).isStaging())
                    })
                }

                if (ip){
                    it(`Is a production environment"`, () => {
                        assert.isTrue((new Environment({'NODE_ENV': en})).isProduction())
                    })
                } else {
                    it(`Is not a production environment"`, () => {
                        assert.isFalse((new Environment({'NODE_ENV': en})).isProduction())
                    })
                }

                if (il){
                    it(`Is a local environment"`, () => {
                        assert.isTrue((new Environment({'NODE_ENV': en})).isLocal())
                    })
                } else {
                    it(`Is not a local environment"`, () => {
                        assert.isFalse((new Environment({'NODE_ENV': en})).isLocal())
                    })
                }

            })
        }
    })

    describe('#path', () => {
        it('Creates an array of paths', () => {
            const env = new Environment(test_environment)
            const path = env.path()

            assert.isArray(path)
            assert.lengthOf(path, 3)
            assert.deepEqual(path, ['path1', 'path2', 'path3'])
        })
    })

    describe('Key Normalisation', () => {
        it('Can be enabled', () => {
            const env = new Environment(test_environment, "", true)
        })

        it('Normalises lowercase keys to upper case', () => {
            const env = new Environment(test_environment, "", true)
            assert.strictEqual(env.get('node_env'), 'test')
        })

        it('Returns undefined for unknown normalised keys', () => {
            const env = new Environment(test_environment, "", true)
            assert.isUndefined(env.get('test_nxt'))
        })
    })
})
