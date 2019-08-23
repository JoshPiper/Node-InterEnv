class env {
	/**
	 * Create an environmental specification with the given environment vars.
	 * @param env true to load from .env file, string to load from specific path, object to use object and any other to use empty object.
	 */
	constructor(env = false){
		if (env === true){
			env = require("dotenv-expand")(require("dotenv").config({debug: false})).parsed
		} else if (typeof env === "string"){
			env = require("dotenv-expand")(require("dotenv").config({debug: false, path: env})).parsed
		} else if (typeof env !== "object"){
			env = {}
		}

		this.env = env
	}

	/**
	 * Checks a given env var is stored inside this env representation.
	 * @param key
	 * @returns {boolean}
	 */
	has(key){
		return this.env[key] !== undefined
	}

	/**
	 * Return a raw env var from the table.
	 * @param key
	 * @returns {?*}
	 */
	raw(key){
		return this.has(key) ? this.env[key] : null
	}

	/**
	 * Fetch an env var as an integer, null if it cannot be converted.
	 * @param key
	 * @param radix
	 * @returns {null|number}
	 */
	int(key, radix=0){
		if (!this.has(key)){
			return null
		}

		let out = parseInt(this.env[key], radix)
		if (isNaN(out)){
			return null
		}

		return out
	}

	/**
	 * Fetch an env var as a float.
	 * @param key
	 * @returns {null|number}
	 */
	float(key){
		if (!this.has(key)){
			return null
		}

		let out = parseFloat(this.env[key])
		if (isNaN(out)){
			return null
		}

		return out
	}

	/**
	 * Return a numericly indexed array of options, exploded from an env var.
	 * @param key
	 * @param sep
	 */
	list(key, sep=","){
		if (!this.has(key)){
			return []
		}

		return String(this.env[key]).split(sep)
	}

	/**
	 * Return a new env object, containing only keys which being with the specified prefix.
	 * @param prefix
	 * @return env
	 */
	prefixed(prefix){
		let out = {}
		let leng = prefix.length

		for (let key in this.env){
			key = String(key)
			if (key.startsWith(prefix)){
				let outKey = key.slice(leng)
				out[outKey] = this.env[key]
			}
		}

		return new env(out)
	}
}

module.exports = env