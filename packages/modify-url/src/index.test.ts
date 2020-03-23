import { ModifyUrlConfig } from '@urltools/utils/lib/types/modifyUrl'
import modifyUrl from './index'

const pipe = (...fns: ((x: any) => any)[]) => (arg: any) => fns.reduce((acc, fn) => fn(acc), arg)

describe('modifyUrl', () => {
  it('throws invalid config', () => {
    expect(() => {
      // @ts-ignore
      modifyUrl({ foo: 'bar' })
    }).toThrowErrorMatchingSnapshot()
  })

  it('returns fn for valid config', () => {
    expect(modifyUrl({ protocol: 'https' }) instanceof Function).toBe(true)
  })

  describe('simple cases - single key config', () => {
    test('protocol', () => {
      const oldUrl = 'http://google.com'
      const config = { protocol: 'https' }
      const newUrl = 'https://google.com/'
      expect(modifyUrl(config)(oldUrl)).toBe(newUrl)
    })

    test('username', () => {
      const oldUrl = 'http://google.com'
      const config = { username: 'akash' }
      const newUrl = 'http://akash@google.com/'
      expect(modifyUrl(config)(oldUrl)).toBe(newUrl)
    })

    test('password', () => {
      const oldUrl = 'http://google.com'
      const config = { password: 'secret123' }
      const newUrl = 'http://:secret123@google.com/'
      expect(modifyUrl(config)(oldUrl)).toBe(newUrl)
    })

    test('host', () => {
      const oldUrl = 'http://bing.com/some/path'
      const config = { host: 'google.com:3000' }
      const newUrl = 'http://google.com:3000/some/path'
      expect(modifyUrl(config)(oldUrl)).toBe(newUrl)
    })

    test('pathname - replace', () => {
      const oldUrl = 'http://google.com/some/path'
      const config = { pathname: { type: 'replace', value: '/some/other/path' } }
      const newUrl = 'http://google.com/some/other/path'
      expect(modifyUrl(config as ModifyUrlConfig)(oldUrl)).toBe(newUrl)
    })

    test('pathname - append', () => {
      const oldUrl = 'http://google.com/some/path'
      const config = { pathname: { type: 'append', value: '../foo' } }
      const newUrl = 'http://google.com/some/foo'
      expect(modifyUrl(config as ModifyUrlConfig)(oldUrl)).toBe(newUrl)
    })

    test('searchParams - pick', () => {
      const oldUrl = 'http://google.com/search?q=galaxy&foo=bar&track=someid'
      const config = { searchParams: { type: 'pick', value: ['foo', 'track'] } }
      const newUrl = 'http://google.com/search?foo=bar&track=someid'
      expect(modifyUrl(config as ModifyUrlConfig)(oldUrl)).toBe(newUrl)
    })

    test('searchParams - omit', () => {
      const oldUrl = 'http://google.com/search?q=galaxy&foo=bar&track=someid'
      const config = { searchParams: { type: 'omit', value: ['foo', 'track'] } }
      const newUrl = 'http://google.com/search?q=galaxy'
      expect(modifyUrl(config as ModifyUrlConfig)(oldUrl)).toBe(newUrl)
    })

    test('searchParams - replace', () => {
      const oldUrl = 'http://google.com/search?q=galaxy&foo=bar'
      const config = { searchParams: { type: 'replace', value: { name: 'akash' } } }
      const newUrl = 'http://google.com/search?name=akash'
      expect(modifyUrl(config as ModifyUrlConfig)(oldUrl)).toBe(newUrl)
    })

    test('searchParams - append', () => {
      const oldUrl = 'http://google.com/search?q=galaxy&foo=bar'
      const config = { searchParams: { type: 'append', value: { name: 'akash' } } }
      const newUrl = 'http://google.com/search?q=galaxy&foo=bar&name=akash'
      expect(modifyUrl(config as ModifyUrlConfig)(oldUrl)).toBe(newUrl)
    })

    test('hash', () => {
      const oldUrl = 'http://google.com/some/path'
      const config = { hash: 'section2' }
      const newUrl = 'http://google.com/some/path#section2'
      expect(modifyUrl(config)(oldUrl)).toBe(newUrl)
    })
  })

  describe('complex cases', () => {
    test('multi key config', () => {
      const oldUrl = 'http://bing.com/search?q=galaxy&tracking=somethingyoudontwant'
      const config = {
        protocol: 'https',
        host: 'google.com',
        searchParams: {
          type: 'pick',
          value: ['q']
        }
      }
      const newUrl = modifyUrl(config as ModifyUrlConfig)(oldUrl)
      expect(newUrl).toBe('https://google.com/search?q=galaxy')
    })

    test('multiple configs', () => {
      const config1: ModifyUrlConfig = { searchParams: { type: 'pick', value: ['q'] } }
      const config2: ModifyUrlConfig = { searchParams: { type: 'append', value: { name: 'akash' } } }

      const originalUrl = 'http://google.com/search?q=galaxy&undesirablefoo=bar&pryingtrackid=baz'
      const expectedUrl = 'http://google.com/search?q=galaxy&name=akash'

      // using tempUrl
      const tempUrl = modifyUrl(config1)(originalUrl)
      const finalUrl = modifyUrl(config2)(tempUrl)
      expect(finalUrl).toBe(expectedUrl)

      // using pipe
      const f = pipe(modifyUrl(config1), modifyUrl(config2))
      expect(f(originalUrl)).toBe(expectedUrl)
    })
  })
})
