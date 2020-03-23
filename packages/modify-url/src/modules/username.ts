import { Module } from '../types'

const username: Module = (url, config) => {
  url.username = config as string
  return url
}

export default username
