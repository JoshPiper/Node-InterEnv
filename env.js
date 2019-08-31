const dotenv = require("dotenv")
const dotenvexpand = require("dotenv-expand")

class env {
	/**
	 * Create an environmental specification with the given environment vars.
	 * @param envPath true to load from .env file, string to load from specific path, object to use object and any other to use empty object.
	 * @param literal If the envPath should be treated as the literal environment object.
	 */
	constructor(envPath = false, literal = false){
		if (literal){
			this.env = envPath
		} else if (envPath === true){
			dotenvexpand(dotenv.config({debug: false}))
		} else if (typeof envPath === "string"){
			dotenvexpand(dotenv.config({debug: false, path: envPath}))
		} else if (typeof envPath === "object"){
			dotenvexpand({parsed: envPath})
		}

		if (!literal){
			this.env = process.env
		}
	}

	/**
	 * Performs an in-place normalization of keys.
	 */
	normalize(){
		for (let key of Object.keys(this.env)){
			let value = this.env[key]
			let nKey = key.toUpperCase()
			this.env[nKey] = value
			delete this.env[key]
		}
	}

	/**
	 * Saves and optionally overwrites data in the process.env from this env handler.
	 */
	save(){
		if (!this.settings.save){return}

		for (let [key, value] of Object.entries(this.env)){
			if (process.env[key] === undefined || this.settings.overwrite){
				process.env[key] = value
			}
		}
	}

	/**
	 * Returns a flattened
	 * @param joiner string to use to join key parts.
	 * @param data Data subset to use, defaults to the object's env
	 * @param prefix String key prefix to apply.
	 * @param out Current set of result data.
	 */
	flatten(joiner = "_", data = this.env, prefix = "", out = {}){
		for (let [key, value] of Object.entries(process)){
			if (typeof value === "object"){
				this.flatten(joiner, value, prefix + key + joiner, out)
			} else {
				out[prefix + key] = value
			}
		}

		return out
	}

	/**
	 * Return nested objects formed by splitting the keys.
	 * @param separator String to split keys on.
	 */
	rise(separator = "_"){
		let out = {}
		let current

		for (let [key, value] of Object.entries(this.env)){
			let parts = key.split(separator)
			current = out
			while (parts.length > 1){
				let next = parts.shift()
				if (current[next] === undefined){
					current[next] = {}
				}

				current = out[next]
			}
			current[parts.shift()] = value
		}

		return out
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

		return new env(out, true)
	}
}

module.exports = env