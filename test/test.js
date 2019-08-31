let assert = require("assert")
let env = require("../env")
let fs = require("fs")

describe("env", function(){
	describe("construct()", function(){
		it("should construct when not requesting an env config.", function(){
			let x = new env()
		})
		it("should construct when an env config.", function(){
			let x = new env(true)
		})
		it("should construct when passing a path.", function(){
			let x = new env("./.env")
		})
		it("should construct when passed an env object.", function(){
			let x = new env({
				"NODE_ENV": "test",
				"NODE_ENV_DEBUG": "${NODE_ENV}"
			})
		})
	})

	describe("has()", function(){
		let testEnv  = new env({env: {
			"NODE_ENV": "test"
		}})

		it("returns true when a key is set", function(){
			assert(testEnv.has("NODE_ENV"))
		})
		it("returns false when a key is not set", function(){
			assert(!testEnv.has("BIG_DICK_420"))
		})
	})

	describe("raw()", function(){
		let testEnv = new env({env: {
			"NODE_ENV": "test",
			"TEST_INT": "12"
		}})

		it("returns the value if set", function(){
			assert.strictEqual(testEnv.raw("NODE_ENV"), "test")
		})
		it("returns null if the value is not", function(){
			assert.strictEqual(testEnv.raw("BIG_DICK_420"), null)
		})
		it("performs no type coercion", function(){
			assert.strictEqual(testEnv.raw("TEST_INT"), "12")
			assert.strictEqual(typeof testEnv.raw("TEST_INT"), "string")
		})
	})

	describe("int()", function(){
		let testEnv = new env({env: {
			"NODE_ENV": "test",
			"TEST_INT": "12",
			"TEST_FLOAT": "12.7",
			"TEST_STRING": "asd"
		}})

		it("returns the value if set", function(){
			assert.strictEqual(testEnv.int("TEST_INT"), 12)
		})
		it("returns null if the value is not", function(){
			assert.strictEqual(testEnv.int("BIG_DICK_420"), null)
		})
		it("returns null for NaN values", function(){
			assert.strictEqual(testEnv.int("TEST_STRING"), null)
		})
		it("performs type coercion to int", function(){
			assert.strictEqual(testEnv.int("TEST_INT"), 12)
			assert.strictEqual(typeof testEnv.int("TEST_INT"), "number")
		})
		it("truncates floats to int", function(){
			assert.strictEqual(testEnv.int("TEST_INT"), 12)
			assert.strictEqual(typeof testEnv.int("TEST_INT"), "number")
		})
	})

	describe("float()", function(){
		let testEnv = new env({env: {
			"NODE_ENV": "test",
			"TEST_INT": "12",
			"TEST_FLOAT": "12.7",
			"TEST_STRING": "asd"
		}})

		it("returns the value if set", function(){
			assert.strictEqual(testEnv.float("TEST_FLOAT"), 12.7)
		})
		it("returns null if the value is not", function(){
			assert.strictEqual(testEnv.float("BIG_DICK_420"), null)
		})
		it("returns null for NaN values", function(){
			assert.strictEqual(testEnv.float("TEST_STRING"), null)
		})
		it("performs type coercion to number", function(){
			assert.strictEqual(testEnv.float("TEST_INT"), 12)
			assert.strictEqual(typeof testEnv.float("TEST_INT"), "number")
		})
		it("doesn't truncate floats", function(){
			assert.strictEqual(testEnv.float("TEST_FLOAT"), 12.7)
			assert.strictEqual(typeof testEnv.float("TEST_FLOAT"), "number")
		})
	})

	describe("list()", function(){
		let testEnv = new env({env: {
			"TEST_LIST_NORM": "abc,efg",
			"TEST_LIST_CSTM": "abc|efg|hij",
			"TEST_LIST_NONE": "qrf",
			"TEST_LIST_EMPTY": "",
		}})

		it("returns an array if set", function(){
			let testList = testEnv.list("TEST_LIST_EMPTY")
			assert(Array.isArray(testList))
		})

		it("returns an empty array if the value is not set", function(){
			let testList = testEnv.list("BIG_DICK_420")
			assert.deepStrictEqual(testList, [])
		})

		it("returns a single value array when the separator is not found", function(){
			let testList = testEnv.list("TEST_LIST_NONE")
			assert.deepStrictEqual(testList, ["qrf"])
		})
		it("correctly splits on separator", function(){
			let testList = testEnv.list("TEST_LIST_NORM")
			assert.deepStrictEqual(testList, ["abc", "efg"])
		})
		it("allows custom separators", function(){
			let testList = testEnv.list("TEST_LIST_CSTM", "|")
			assert.deepStrictEqual(testList, ["abc", "efg", "hij"])
		})
	})

	describe("prefixed()", function(){
		let testEnv = new env({env: {
			"TEST_LIST_NORM": "abc,efg",
			"TEST_LIST_CSTM": "abc|efg|hij",
			"TEST_LIST_NONE": "qrf",
			"TEST_LIST_EMPTY": "",
			"NOT_PREFIXED": "yes"
		}})
		let subEnv = testEnv.prefixed("TEST_LIST_")

		it("returns a new env object", function(){
			assert(subEnv instanceof env)
		})

		it("contains all prefixed values", function(){
			assert(subEnv.has("NORM"))
			assert(subEnv.has("CSTM"))
			assert(subEnv.has("NONE"))
			assert(subEnv.has("EMPTY"))
		})

		it("contains no other values", function(){
			assert(!subEnv.has("NOT_PREFIXED"))
		})
	})
})