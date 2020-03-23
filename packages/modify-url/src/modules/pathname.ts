import { resolve } from 'path'
import { Pathname } from '@urltools/utils/lib/types/modifyUrl'
import { Module } from '../types'

const modifyPathname = (type: Pathname['type'], pathname: string, value: string): string => {
  switch (type) {
    case 'replace':
      return value
    case 'append':
      return resolve(pathname, value)
  }
}

const pathname: Module = (url, config) => {
  const { type, value } = config as Pathname
  url.pathname = modifyPathname(type, url.pathname, value)
  return url
}

export default pathname
