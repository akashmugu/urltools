import { ModifyUrlConfig } from '@urltools/utils/lib/types/modifyUrl'

export type ModifyUrl = (config: ModifyUrlConfig) => (url: string) => string

export type ModifyUrlSubConfig = Exclude<ModifyUrlConfig[keyof ModifyUrlConfig], undefined>

export type Module = (url: URL, config: ModifyUrlSubConfig) => URL
