import { Module } from '../types'

const hash: Module = (url, config) => {
  url.hash = config as string
  return url
}

export default hash
