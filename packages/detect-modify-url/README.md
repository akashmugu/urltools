# `detect-modify-url`

## motivation

i need a tool which modifies urls in bulk easily
based on just a serializable config representing a bunch of rules

## usage

```js
import detectModifyUrl from '@urltools/detect-modify-url'

const config = [
  {
    // name of the site
    name: 'google search',

    // regex to match the url
    test: '^(?:https|http)://(?:www.)?google.com/search?',

    // if matched, modify the url with these filters
    filters: [{ searchParams: { type: 'pick', value: ['q'] } }]
  },
  {
    // another site
    name: 'yahoo search',
    test: '^(?:https|http)://(?:www.)?yahoo.com/search?',
    filters: [{ searchParams: { type: 'pick', value: ['foo'] } }]
  }
]

// create processUrl once based on serializable config
const processUrl = detectModifyUrl(config)

// processUrl can process google urls according to google filters
const res1 = processUrl('http://google.com/search?q=galaxy&foo=bar&pryingtrackid=baz')
expect(res1.url).toBe('http://google.com/search?q=galaxy')
expect(res1.match).toBe(config[0])

// and also yahoo urls according to yahoo filters
const res2 = processUrl('http://yahoo.com/search?q=galaxy&foo=bar&pryingtrackid=baz')
expect(res2.url).toBe('http://yahoo.com/search?foo=bar')
expect(res2.match).toBe(config[1])

// pass any url to processUrl
// if it matches a rule, the modified url (and the match) gets returned
// if it doesn't match any rule, the original url gets returned
// e.g. bing.com doesn't match any regex in the above config
const res3 = processUrl('http://bing.com/search?q=galaxy&foo=bar&pryingtrackid=baz')
expect(res3.url).toBe('http://bing.com/search?q=galaxy&foo=bar&pryingtrackid=baz')
expect(res3.match).toBe(undefined)

/******************************/

// validity of dynamic configs (e.g. from user input)
// can be checked by using try...catch
// or by using the validate function
import detectModifyUrl, { validate } from '@urltools/detect-modify-url'

const invalidConfig = { foo: 'google.com' }

expect(() => {
  detectModifyUrl(invalidConfig)
}).toThrow()

expect(validate(invalidConfig)).toBe(false)
```

## config

[WHATWG](https://url.spec.whatwg.org) terminology is used for different parts of the url

[json schema of config](../utils/src/schema/detectModifyUrl.json)

to know what filters are possible, checkout the package `@urltools/modify-url` (dependency of this package) for more examples
