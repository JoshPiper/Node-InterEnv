class env {
	/**
	 * Create an enviromental specification with the given enviroment vars.
	 * @param env true to load from .env file, string to load from specific path, object to use object and any other to use empty object.
	 */
	constructor(env = false){
		if (env === true){
			env = require("dotenv-expand")(require("dotenv").config({debug: false}))
			console.log(env)
		} else if (typeof env === "string"){
			env = require("dotenv-expand")(require("dotenv").config({path: env}))
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
}

module.exports = env