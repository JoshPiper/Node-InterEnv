class EnvironmentVariableNotFoundException extends TypeError {
	constructor(name: string){
		super(`The environment variable "${name}" could not be found!`)
		this.name = "EnvironmentVariableNotFoundException"
	}
}

export = EnvironmentVariableNotFoundException
