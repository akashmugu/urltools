import { Module } from '../types'
import protocol from './protocol'
import username from './username'
import password from './password'
import host from './host'
import pathname from './pathname'
import searchParams from './searchParams'
import hash from './hash'

const modules: { [key: string]: Module } = {
  protocol,
  username,
  password,
  host,
  pathname,
  searchParams,
  hash
}

export default modules
