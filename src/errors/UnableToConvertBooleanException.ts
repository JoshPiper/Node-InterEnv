class UnableToConvertBooleanException extends TypeError {
	constructor(value: string){
		super(`The value "${value}" was not able to be convered to a boolean!`)
		this.name = "UnableToConvertBooleanException"
	}
}

export = UnableToConvertBooleanException
