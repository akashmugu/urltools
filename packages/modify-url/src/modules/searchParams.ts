import { URLSearchParams } from 'url'
import { SearchParamsPickOmit, SearchParamsReplaceAppend } from '@urltools/utils/lib/types/modifyUrl'
import { Module } from '../types'

type SearchParams = SearchParamsPickOmit | SearchParamsReplaceAppend

type Entries = [string, string][]

const modifyPickOmitEntries = (
  entries: Entries,
  type: SearchParamsPickOmit['type'],
  value: SearchParamsPickOmit['value']
): Entries => {
  switch (type) {
    case 'pick':
      return entries.filter(([key]) => value.includes(key))
    case 'omit':
      return entries.filter(([key]) => !value.includes(key))
  }
}

const modifyReplaceAppendEntries = (
  entries: Entries,
  type: SearchParamsReplaceAppend['type'],
  value: SearchParamsReplaceAppend['value']
): Entries => {
  switch (type) {
    case 'replace':
      return Object.entries(value)
    case 'append':
      return [...entries, ...Object.entries(value)]
  }
}

const searchParams: Module = (url, config) => {
  const { type, value } = config as SearchParams

  let entries = Array.from(new URLSearchParams(url.search).entries())

  switch (type) {
    case 'pick':
    case 'omit':
      entries = modifyPickOmitEntries(entries, type, value as SearchParamsPickOmit['value'])
      break
    case 'replace':
    case 'append':
      entries = modifyReplaceAppendEntries(entries, type, value as SearchParamsReplaceAppend['value'])
  }

  url.search = new URLSearchParams(entries).toString()

  return url
}

export default searchParams
