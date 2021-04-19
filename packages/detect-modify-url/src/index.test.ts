import { DetectModifyUrlConfig } from '@urltools/utils/lib/types/detectModifyUrl'
import { ModifyUrlConfig } from '@urltools/utils/lib/types/modifyUrl'
import detectModifyUrl from './index'

describe('detectModifyUrl', () => {
  it('throws invalid config', () => {
    expect(() => {
      // @ts-ignore
      detectModifyUrl({ foo: 'bar' })
    }).toThrowErrorMatchingSnapshot()
  })

  it('returns fn for valid config', () => {
    expect(detectModifyUrl([]) instanceof Function).toBe(true)
  })

  describe('no match', () => {
    test('no sites', () => {
      const res = detectModifyUrl([])('http://www.google.com/search?foo=bar')
      expect(res.url).toBe('http://www.google.com/search?foo=bar')
      expect(res.match).toBe(undefined)
    })

    test('1 site', () => {
      const config: DetectModifyUrlConfig = [
        {
          name: 'site 1',
          test: '^(?:https|http)://(?:www.)?site1.com',
          filters: []
        }
      ]

      const res = detectModifyUrl(config)('http://www.site2.com')
      expect(res.url).toBe('http://www.site2.com')
      expect(res.match).toBe(undefined)
    })

    test('multiple site', () => {
      const config: DetectModifyUrlConfig = [
        {
          name: 'site 1',
          test: '^(?:https|http)://(?:www.)?site1.com',
          filters: []
        },
        {
          name: 'site 2',
          test: '^(?:https|http)://(?:www.)?site2.com',
          filters: []
        }
      ]

      const res = detectModifyUrl(config)('http://www.site3.com')
      expect(res.url).toBe('http://www.site3.com')
      expect(res.match).toBe(undefined)
    })
  })

  describe('match', () => {
    test('1 site - no filters', () => {
      const config: DetectModifyUrlConfig = [
        {
          name: 'site 1',
          test: '^(?:https|http)://(?:www.)?site1.com',
          filters: []
        }
      ]

      const res = detectModifyUrl(config)('http://www.site1.com/?q=galaxy&foo=bar')
      expect(res.url).toBe('http://www.site1.com/?q=galaxy&foo=bar')
      expect(res.match).toBe(config[0])
    })

    test('1 site - 1 filter', () => {
      const subconfig: ModifyUrlConfig = {
        searchParams: { type: 'pick', value: ['q'] }
      }
      const config: DetectModifyUrlConfig = [
        {
          name: 'site 1',
          test: '^(?:https|http)://(?:www.)?site1.com',
          filters: [subconfig]
        }
      ]

      const res = detectModifyUrl(config)('http://www.site1.com/?q=galaxy&foo=bar')
      expect(res.url).toBe('http://www.site1.com/?q=galaxy')
      expect(res.match).toBe(config[0])
    })

    test('1 site - multiple filters', () => {
      const subconfig1: ModifyUrlConfig = {
        searchParams: { type: 'pick', value: ['q'] }
      }
      const subconfig2: ModifyUrlConfig = {
        searchParams: { type: 'append', value: { name: 'akash' } }
      }
      const config: DetectModifyUrlConfig = [
        {
          name: 'google search',
          test: '^(?:https|http)://(?:www.)?google.com/search?',
          filters: [subconfig1, subconfig2]
        }
      ]

      const res = detectModifyUrl(config)('http://google.com/search?q=galaxy&undesirablefoo=bar&pryingtrackid=baz')
      expect(res.url).toBe('http://google.com/search?q=galaxy&name=akash')
      expect(res.match).toBe(config[0])
    })

    test('multiple sites', () => {
      const subconfig1: ModifyUrlConfig = {
        searchParams: { type: 'pick', value: ['q'] }
      }
      const subconfig2: ModifyUrlConfig = {
        searchParams: { type: 'pick', value: ['foo'] }
      }
      const config: DetectModifyUrlConfig = [
        {
          name: 'google search',
          test: '^(?:https|http)://(?:www.)?google.com/search?',
          filters: [subconfig1]
        },
        {
          name: 'yahoo search',
          test: '^(?:https|http)://(?:www.)?yahoo.com/search?',
          filters: [subconfig2]
        }
      ]

      const processUrl = detectModifyUrl(config)

      const res1 = processUrl('http://google.com/search?q=galaxy&foo=bar&pryingtrackid=baz')
      expect(res1.url).toBe('http://google.com/search?q=galaxy')
      expect(res1.match).toBe(config[0])

      const res2 = processUrl('http://yahoo.com/search?q=galaxy&foo=bar&pryingtrackid=baz')
      expect(res2.url).toBe('http://yahoo.com/search?foo=bar')
      expect(res2.match).toBe(config[1])
    })
  })
})
