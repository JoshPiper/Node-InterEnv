import {EnvironValue, FlatEnviron, NestedEnviron, Environ, Settings, Configuration} from './types'

export default class Environment {
	private settings: Settings;
	private environ: Environ;

	/**
	 * Create an environmental specification with the given environment vars.
	 * @param {Configuration} configuration
	 */
	constructor(configuration: Configuration = {env: {}, expand: false, save: false, overwrite: false, normalize: false}){
		let {env, expand, normalize} = configuration

		delete configuration.env
		this.settings = configuration

		if (env !== undefined){
			this.environ = env
		} else {
			this.environ = {}
		}

		if (normalize){
			this.environ = this.flatten()
			this.normalize()
		}

		this.save()
	}

	/**
	 * Performs an in-place normalization of keys.
	 */
	normalize(){
		for (let key of Object.keys(this.environ)){
			let value = this.environ[key]
			let nKey = key.toUpperCase()
			this.environ[nKey] = value
			delete this.environ[key]
		}
	}

	/**
	 * Saves and optionally overwrites data in the process.env from this env handler.
	 */
	save(){
		if (!this.settings.save){return}

		for (let [key, value] of Object.entries(this.environ)){
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
	flatten(joiner = "_", data = this.environ, prefix = "", out: Environ = {}): FlatEnviron {
		for (let [key, value] of Object.entries(data)){
			if (value instanceof Object){
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
	rise(separator = "_"): NestedEnviron {
		let out: Environ = {}
		let current

		for (let [key, value] of Object.entries(this.env)){
			let parts = key.split(separator)

			current = out
			while (parts.length > 1){
				let next = parts.shift()!

				if (current[next] === undefined){
					current[next] = {}
				}

				current = out[next]
			}

			if (parts.length === 1){
				current[parts.shift()!] = value
			}
		}

		return out
	}


	/**
	 * Checks a given env var is stored inside this env representation.
	 * @param key
	 * @returns {boolean}
	 */
	has(key: string): boolean {
		return this.environ[key] !== undefined
	}

	/**
	 * Return a raw env var from the table.
	 * @param key
	 * @returns {?any}
	 */
	raw(key: string): any {
		return this.has(key) ? this.environ[key] : null
	}

	/**
	 * Fetch an env var as an integer, null if it cannot be converted.
	 * @param key
	 * @param radix
	 * @returns {null|number}
	 */
	int(key: string, radix: number= 0): number | null {
		if (!this.has(key)){
			return null
		}

		let out = parseInt(this.raw(key), radix)
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
	float(key: string): number | null {
		if (!this.has(key)){
			return null
		}

		let out = parseFloat(this.raw(key))
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
	list(key: string, sep: string = ","): string[] {
		if (!this.has(key)){
			return []
		}

		return String(this.raw(key)).split(sep)
	}

	/**
	 * Return a new env object, containing only keys which being with the specified prefix.
	 * @param prefix
	 * @return env
	 */
	prefixed(prefix: string): Environment {
		let out: Environ = {}
		let len = prefix.length

		for (let [key, value] of Object.entries(this.env)){
			key = String(key)
			if (key.startsWith(prefix)){
				let outKey = key.slice(len)
				out[outKey] = value
			}
		}

		return new Environment({env: out, save: false, overwrite: false})
	}

	/**
	 * Fetch a normalized environment name.
	 * @returns {string}
	 */
	environment(): string {
		let env = String(this.raw("NODE_ENV") ?? "development").toLowerCase()

		switch (env){
			default: return env
			case "dev":
			case "development":
				return "development"
			case "test":
			case "testing":
				return "testing"
			case "stage":
			case "staging":
				return "staging"
			case "prod":
			case "production":
			case "live":
				return "production"
		}
	}

	/**
	 * Checks if the current environment is a development env.
	 * @returns {boolean}
	 */
	isDevelopment(): boolean {
		return this.environment() === "development"
	}

	/**
	 * Checks if the current environment is a testing env.
	 * @returns {boolean}
	 */
	isTesting(): boolean {
		return this.environment() === "testing"
	}

	/**
	 * Checks if the current environment is a staging env.
	 * @returns {boolean}
	 */
	isStaging(): boolean {
		return this.environment() === "staging"
	}

	/**
	 * Checks if the current environment is a production env.
	 * @returns {boolean}
	 */
	isProduction(): boolean {
		return this.environment() === "production"
	}

	/**
	 * Returns the current environment.
	 * @see environment()
	 */
	env(){
		return this.environment()
	}
}
