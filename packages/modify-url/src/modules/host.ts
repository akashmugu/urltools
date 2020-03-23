import { Module } from '../types'

const host: Module = (url, config) => {
  url.host = config as string
  return url
}

export default host
