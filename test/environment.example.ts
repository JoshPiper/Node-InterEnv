import {join} from "path"
import {exec, execFile} from "child_process"
import {promisify} from "util"
import {assert} from "chai"

let pExecFile = promisify(execFile)
let pExec = promisify(exec)
const node = process.argv[0]

describe('Environment Examples', () => {
    describe('Readme Example 1', () => {
        it('Correctly Executes', async () => {
            let {stdout, stderr} = await pExecFile(node, ['examples/readme-1.cjs'], {
                env: {
                    PATH: process.env.PATH,
                    NODE_ENV: 'local',
                    TEST_VAR: "Hello, world!",
                    PORT: "80"
                }
            })

            assert.strictEqual(stdout.trim(), 'local\nHello, world!\n80')
            assert.strictEqual(stderr, '')
        })
    })

    describe('Readme Example 2', () => {
        it('Correctly Executes', async () => {
            let {stdout, stderr} = await pExecFile(node, ['examples/readme-2.mjs'], {env: {PATH: process.env.PATH}})

            assert.strictEqual(stdout.trim(),
                'string -> test\n' +
                'number -> 1\n' +
                'number -> 5.7\n' +
                'array -> [ \'this\', \'is\', \'a\', \'csv\', \'list\' ]'
            )
            assert.strictEqual(stderr, '')
        })
    })

    describe('Readme Example 3', () => {
        it('Correctly Executes', async function(){
            this.timeout(10000)
            let {stdout, stderr} = await pExec("npx -q ts-node examples/readme-3.ts", {env: {PATH: process.env.PATH}})

            assert.strictEqual(stdout.trim(),
        'DB_ / NODE_ENV? false\n' +
                'DB_ / HOST: example.com\n' +
                'DB_ / MAIN_ / DB: test_database_eu\n' +
                'DB_ / BACKUP_ / DB: test_database_us'
            )
            assert.strictEqual(stderr, '')
        })
    })
})
