import iEnvironment from './types'

import UnableToConvertNumberException from "./errors/UnableToConvertNumberException";
import EnvironmentVariableNotFoundException from "./errors/EnvironmentVariableNotFoundException";
import UnableToConvertBooleanException from "./errors/UnableToConvertBooleanException";
import Dict = NodeJS.Dict;
import { delimiter } from 'path';

const IS_WIN = process.platform === "win32"
const RaiseException: unique symbol = Symbol('Raise an exception if the given environment variable is not provided.')

type FallbackValue = string | typeof RaiseException | undefined
type PossibleValue = Exclude<FallbackValue, typeof RaiseException>

class Environment {
	private readonly environ: iEnvironment
	private readonly prefix: string
	private readonly normalize_keys: boolean

	protected static readonly booleans: Dict<boolean> = {
		'true': true,
		'on': true,
		'1': true,
		'yes': true,
		'✔': true,
		'✅': true,
		'☑': true,
		'👍': true,
		'👍🏻': true,
		'👍🏼': true,
		'👍🏽': true,
		'👍🏾': true,
		'👍🏿': true,

		'false': false,
		'off': false,
		'0': false,
		'no': false,
		'❌': false,
		'❎': false,
		'⛔': false,
		'🚫': false,
		'👎': false,
		'🙅': false,
		'🙅‍♂️': false,
		'🙅‍♀️': false,
		'👎🏻': false,
		'🙅🏻': false,
		'🙅🏻‍♂️': false,
		'🙅🏻‍♀️': false,
		'👎🏼': false,
		'🙅🏼': false,
		'🙅🏼‍♂️': false,
		'🙅🏼‍♀️': false,
		'👎🏽': false,
		'🙅🏽': false,
		'🙅🏽‍♂️': false,
		'🙅🏽‍♀️': false,
		'👎🏾': false,
		'🙅🏾': false,
		'🙅🏾‍♂️': false,
		'🙅🏾‍♀️': false,
		'👎🏿': false,
		'🙅🏿': false,
		'🙅🏿‍♂️': false,
		'🙅🏿‍♀️': false,
		'': false
	}

	/**
	 * Construct a new environmental instance.
	 * @param {iEnvironment} environment Environmental dictionary to use. Defaults to process.env.
	 * @param {string} prefix Key prefix to filter by.
	 * @param {boolean} normalize_keys Whether fetching keys should be case-insensitive. When using process.env on Windows, this occurs natively and cannot be disabled.
	 */
	constructor(environment: iEnvironment = process.env, prefix: string = "", normalize_keys: boolean = false){
		this.environ = environment
		this.prefix = prefix
		this.normalize_keys = (!IS_WIN || environment !== process.env) && normalize_keys
	}

	/**
	 * Fetch the original key from the environment, if the given normalized key exists.
	 * If no normalisation occurs, this returns the same key.
	 * @param {string} key
	 * @returns {string | undefined}
	 * @protected
	 */
	protected original_key(key: string): string | undefined {
		key = this.normalize(key)
		if (!this.normalize_keys){
			return key
		}

		for (let test_key of Object.keys(this.environ)){
			if (test_key.toUpperCase() === key){
				return test_key
			}
		}
	}

	/**
	 * Normalize a given key.
	 * @param {string} key
	 * @returns {string}
	 * @protected
	 */
	protected normalize(key: string): string {
		return `${this.prefix}${key.toUpperCase()}`
	}

	/**
	 * Checks a given env var is stored inside this env representation.
	 * @param {string} key
	 * @returns {boolean}
	 */
	has(key: string): boolean {
		const orig_key = this.original_key(key)
		if (orig_key === undefined){
			return false
		}

		return this.environ[orig_key] !== undefined
	}

	/**
	 * Return an environment variable.
	 * @param {string} key
	 * @param {any} fallback
	 * @returns {?*}
	 * @throws
	 */
	get(key: string, fallback: undefined): string | undefined;
	get(key: string, fallback: typeof RaiseException): string;
	get<FB extends PossibleValue = undefined>(key: string, fallback: FB): string | FB;
	get(key: string, fallback?: FallbackValue): PossibleValue;
	get(key: string, fallback: FallbackValue = undefined): PossibleValue {
		const orig_key = this.original_key(key)
		if (orig_key === undefined){
			if (fallback === RaiseException){
				throw new EnvironmentVariableNotFoundException(this.normalize(key))
			}

			return fallback
		}

		const value = this.environ[orig_key]
		if (value === undefined){
			if (fallback === RaiseException){
				throw new EnvironmentVariableNotFoundException(this.normalize(key))
			}

			return fallback
		}

		return value
	}

	/**
	 * Fetch an environment variable and convert it to an integer.
	 * If the variable cannot be converted, this raises an exception.
	 * @param key
	 * @param fallback
	 * @param radix
	 */
	int(
		key: string,
		fallback: FallbackValue = undefined,
		radix: number | undefined = undefined,
	): number | undefined {
		const value = this.get(key, fallback)
		if (value === undefined){
			return undefined
		}

		const parsed = parseInt(value, radix)
		if (isNaN(parsed)){
			throw new UnableToConvertNumberException(value)
		}

		return parsed
	}
	get_int = this.int
	get_integer = this.int

	/**
	 * Fetch an environment variable and convert it to an float.
	 * If the variable cannot be converted, this raises an exception.
	 * @param key
	 * @param fallback
	 */
	float(
		key: string,
		fallback: FallbackValue = undefined,
	): number | undefined {
		const value = this.get(key, fallback)
		if (value === undefined){
			return undefined
		}

		const parsed = parseFloat(value)
		if (isNaN(parsed)){
			throw new UnableToConvertNumberException(value)
		}

		return parsed
	}
	get_float = this.float

	/**
	 * Fetch an environment variable and convert it to a boolean.
	 * If the variable cannot be converted, this raises an exception.
	 * @param key
	 * @param fallback
	 */
	bool(key: string, fallback: FallbackValue): boolean | undefined {
		const value = this.get(key, fallback)
		if (value === undefined){
			return undefined
		}

		const bool = Environment.booleans[value]
		if (bool === undefined){
			throw new UnableToConvertBooleanException(value)
		}

		return bool
	}
	get_bool = this.bool
	get_boolean = this.bool

	/**
	 * Return an array of strings, exploded from the given environment variable.
	 * By default, this creates a CSV list.
	 * Unlike other methods, this does not have a default argument, instead if the variable is not present, an empty list is returned.
	 * Whitespace is truncated and empty entries are discarded.
	 * @param {string} key
	 * @param {string | RegExp} splitter Either a string or Regular Expression to split on.
	 */
	list(key: string, splitter: string | RegExp = ","): string[] {
		const value = this.get(key, undefined)
		if (value === undefined){
			return []
		}

		return value.split(splitter).map(entry => entry.trim()).filter(Boolean)
	}
	get_list = this.list

	/**
	 * Get a CSV list from the environment.
	 * @see list
	 * @param {string} key
	 */
	csv(key: string): string[] {
		return this.list(key, ",")
	}
	get_csv = this.csv

	/**
	 * Create a new environment which only contains keys with a given prefix.
	 * @param {string} prefix
	 */
	prefixed(prefix: string): Environment {
		return new Environment(this.environ, `${this.prefix}${prefix}`, this.normalize_keys)
	}

	/**
	 * Fetch all environment variables from this environment.
	 * If the environment is prefixed, the output does *NOT* include the prefix.
	 * Entries in this output are copied by value during the process, and will not live update if the environment changes.
	 * @returns {Dict<string>}
	 */
	all(): Dict<string> {
		return Object.fromEntries(
			Object.entries(this.environ)
				.filter(([key, _]) => key.startsWith(this.prefix))
				.map(([key, value]) => {
					return [key.substring(this.prefix.length), value]
				})
		)
	}

	/**
	 * Fetch a normalized environment name.
	 * @returns {string}
	 */
	environment(): string {
		let env = this.get("NODE_ENV", "development").toLowerCase()

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
			case "local":
			case "localhost":
				return "local"
		}
	}
	env = this.environment

	/**
	 * Checks if the current environment is development env.
	 * @returns {boolean}
	 */
	isDevelopment(): boolean {
		return this.environment() === "development"
	}

	/**
	 * Checks if the current environment is testing env.
	 * @returns {boolean}
	 */
	isTesting(): boolean {
		return this.environment() === "testing"
	}

	/**
	 * Checks if the current environment is staging env.
	 * @returns {boolean}
	 */
	isStaging(): boolean {
		return this.environment() === "staging"
	}

	/**
	 * Checks if the current environment is production env.
	 * @returns {boolean}
	 */
	isProduction(): boolean {
		return this.environment() === "production"
	}

	/**
	 * Checks if the current environment is local.
	 * @returns {boolean}
	 */
	isLocal(): boolean {
		return this.environment() === "local"
	}

	/**
	 * Fetches the current path variable as a list of paths.
	 */
	path(): string[] {
		return this.list('PATH', delimiter)
	}
}

export default Environment
export {Environment, RaiseException}
export type {iEnvironment}
