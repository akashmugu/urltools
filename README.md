# `@urltools`

> packages for processing urls

below is a brief usage of the packages. check individual READMEs for more details

## [modify-url](packages/modify-url/README.md)

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

## [detect-modify-url](packages/detect-modify-url/README.md)

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

// this package can be used to modify urls in bulk easily
```
