class UnableToConvertNumberException extends TypeError {
	constructor(value: string){
		super(`The value "${value}" was not able to be convered to a number!`)
		this.name = "UnableToConvertNumberException"
	}
}

export = UnableToConvertNumberException
