type EnvironValue = any
interface FlatEnviron {
    [index: string]: EnvironValue
}

interface NestedEnviron {
    [index: string]: Exclude<EnvironValue, object> | NestedEnviron
}

interface Environ {
    [index: string]: EnvironValue | NestedEnviron
}

interface Settings {
    expand: boolean
    save: boolean
    overwrite: boolean
    normalize: boolean
}
type Configuration = Omit<Settings> & {"env"?: object}

export {EnvironValue, FlatEnviron, NestedEnviron, Environ, Settings, Configuration}
