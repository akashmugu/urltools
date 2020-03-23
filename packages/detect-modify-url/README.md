# `detect-modify-url`

## usage

```js
import detectModifyUrl from '@urltools/detect-modify-url'

const config = [
  {
    name: 'google search',
    test: '^(?:https|http)://(?:www.)?google.com/search?',
    filters: [{ searchParams: { type: 'pick', value: ['q'] } }]
  },
  {
    name: 'yahoo search',
    test: '^(?:https|http)://(?:www.)?yahoo.com/search?',
    filters: [{ searchParams: { type: 'pick', value: ['foo'] } }]
  }
]

const processUrl = detectModifyUrl(config)

const res1 = processUrl('http://google.com/search?q=galaxy&foo=bar&pryingtrackid=baz')
expect(res1.url).toBe('http://google.com/search?q=galaxy')
expect(res1.match).toBe(config[0])

const res2 = processUrl('http://yahoo.com/search?q=galaxy&foo=bar&pryingtrackid=baz')
expect(res2.url).toBe('http://yahoo.com/search?foo=bar')
expect(res2.match).toBe(config[1])
```

## config

[WHATWG](https://url.spec.whatwg.org) terminology is used for different parts of the url

[json schema of config root](../utils/src/schema/detectModifyUrl.json)

[json schema of filters](../utils/src/schema/modifyUrl.json)
