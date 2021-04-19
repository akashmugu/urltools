import modifyUrl from '@urltools/modify-url'
import { DetectModifyUrl } from './types'

const detectModifyUrl: DetectModifyUrl = (config) => (url) => {
  const match = config.find((siteConfig) => new RegExp(siteConfig.test).test(url))

  if (match === undefined) {
    return { url }
  }

  const modifiedUrl = match.filters.reduce((_url, _config) => modifyUrl(_config)(_url), url)

  return {
    url: modifiedUrl,
    match
  }
}

export default detectModifyUrl
