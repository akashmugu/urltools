# `modify-url`

## usage

```js
import modifyUrl from '@urltools/modify-url'

// serializable config is used to modify the url
const config = {
  protocol: 'https',
  host: 'google.com',
  searchParams: {
    type: 'pick',
    value: ['q']
  }
}

const oldUrl = 'http://bing.com/search?q=galaxy&tracking=somethingyoudontwant'

// create processUrl once based on serializable config
const processUrl = modifyUrl(config)

// processUrl can be used in pipe (functional style) or as a url transformation function
const newUrl = processUrl(oldUrl)

expect(newUrl).toBe('https://google.com/search?q=galaxy')

// this package can used to modify any part of the url easily
```

## config

[WHATWG](https://url.spec.whatwg.org) terminology is used for different parts of the url

[json schema of config](../utils/src/schema/modifyUrl.json)

<!-- prettier-ignore -->
```js
import modifyUrl from '@urltools/modify-url'

// this assertion is represented ->
const oldUrl = 'http://google.com/'
const config = { protocol: 'https' }
const newUrl = 'https://google.com/'
expect(
  modifyUrl(config)(oldUrl)
).toBe(newUrl)

// -> like this for brevity
'http://google.com/'
{ protocol: 'https' }
'https://google.com/'

/******************************/
// config keys

// protocol
'http://google.com'
{ protocol: 'https' }
'https://google.com/'

// username
'http://google.com'
{ username: 'akash' }
'http://akash@google.com'

// password
'http://google.com'
{ password: 'secret123' }
'http://:secret123@google.com'

// host
'http://bing.com/some/path'
{ host: 'google.com:3000' }
'http://google.com:3000/some/path'

// pathname - replace
'http://google.com/some/path'
{ pathname: { type: 'replace', value: '/some/other/path' } }
'http://google.com/some/other/path'

// pathname - append
'http://google.com/some/path'
{ pathname: { type: 'append', value: '../foo' } }
'http://google.com/some/foo'

// searchParams - pick
'http://google.com/search?q=galaxy&foo=bar&track=someid'
{ searchParams: { type: 'pick', value: ['foo', 'track'] } }
'http://google.com/search?foo=bar&track=someid'

// searchParams - omit
'http://google.com/search?q=galaxy&foo=bar&track=someid'
{ searchParams: { type: 'omit', value: ['foo', 'track'] } }
'http://google.com/search?q=galaxy'

// searchParams - replace
'http://google.com/search?q=galaxy&foo=bar'
{ searchParams: { type: 'replace', value: { name: 'akash' } } }
'http://google.com/search?name=akash'

// searchParams - append
'http://google.com/search?q=galaxy&foo=bar'
{ searchParams: { type: 'append', value: { name: 'akash' } } }
'http://google.com/search?q=galaxy&foo=bar&name=akash'

// hash
'http://google.com/some/path'
{ hash: 'section2' }
'http://google.com/some/path#section2'

/******************************/
// examples

// most of the scenarios can be covered by a single config
// as multiple parts of the url are independent

// e.g. config with one part of the url
const config1 = { protocol: 'https' }

// e.g. config with multiple parts of the url
const config2 = { protocol: 'https', host: 'google.com' }


// complex scenario might need multiple configs

// e.g. searchParams pick and append
const config3 = { searchParams: { type: 'pick', value: ['q'] } }
const config4 = { searchParams: { type: 'append', value: { name: 'akash' } } }

const originalUrl = 'http://google.com/search?q=galaxy&undesirablefoo=bar&pryingtrackid=baz'
const expectedUrl = 'http://google.com/search?q=galaxy&name=akash'

const tempUrl = modifyUrl(config3)(originalUrl)
const finalUrl = modifyUrl(config4)(tempUrl)

expect(finalUrl).toBe(expectedUrl)

// if you are using a functional library like ramda,
const f = require('ramda').pipe(
  modifyUrl(config3),
  modifyUrl(config4)
)

expect(
  f(originalUrl)
).toBe(expectedUrl)


// error will be thrown for invalid configs
const invalidConfig = { foo: 'google.com' }
expect(() => {
  modifyUrl(invalidConfig)
}).toThrow()

// so validity of dynamic configs (e.g. from user input)
// can be checked by using try...catch

// why do the above output urls end with / ?
// e.g. https://google.com/ instead of just https://google.com
// that's because WHATWG URL libs modify it that way
// try running `new window.URL('https://google.com').toString()` in browser console
// or `new (require('url').URL)('https://google.com').toString()` in node repl
// this npm module just uses the above libs for modifying url
```
