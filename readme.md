# Rabin Karp Search Algorithm

A Javascript implemenation of the [Rabin-Karp Algorithm](https://en.wikipedia.org/wiki/Rabin%E2%80%93Karp_algorithm)

It can be used for detecting occurances of a string in another string. Can be
used to detect plagarism. Note I advise not to use this algo, iteratively
calling `indexOf` yields better performance in V8.

## Usage
`npm install`

```
var rks = require('rabin-karp-search')

rks.search('There is a pattern in this string', 'pattern') // prints [ 11 ]
rks.search('A pattern and another pattern', 'pattern') // prints [ 2, 22 ]
```

## Tests
run `npm test`
