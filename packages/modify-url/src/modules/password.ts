import { Module } from '../types'

const password: Module = (url, config) => {
  url.password = config as string
  return url
}

export default password
