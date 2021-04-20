import { URL } from 'url'
import { ModifyUrl } from './types'
import modules from './modules'

const modifyUrl: ModifyUrl = (config) => (url) =>
  Object.entries(config)
    .reduce((url, [key, value]) => modules[key](url, value) as URL, new URL(url))
    .toString()

export default modifyUrl
