import { Module } from '../types'

const protocol: Module = (url, config) => {
  url.protocol = config as string
  return url
}

export default protocol
