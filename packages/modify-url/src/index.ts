import validate from '@urltools/utils/lib/validate/modifyUrl'
import { URL } from '@urltools/utils/lib/url'
import { ModifyUrl } from './types'
import modules from './modules'

const modifyUrl: ModifyUrl = (config) => {
  if (!validate(config)) {
    throw new Error(JSON.stringify(validate.errors))
  }

  return (url) =>
    Object.entries(config)
      .reduce((url, [key, value]) => modules[key](url, value) as URL, new URL(url))
      .toString()
}

export default modifyUrl
export { validate }
