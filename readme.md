# Rabin Karp Search Algorithm

A Javascript implementation of the [Rabin-Karp Algorithm](https://en.wikipedia.org/wiki/Rabin%E2%80%93Karp_algorithm).

It can be used for detecting occurrences of a string in another string. Can be
used to detect plagiarism. Note I advise not to use this algo, iteratively
calling [indexOf](https://github.com/morenoh149/rabin-karp-search/blob/master/test.js#L9) yields better performance in V8.

## Usage
`npm install`

```
var rks = require('rabin-karp-search')

rks.search('There is a pattern in this string', 'pattern') // prints [ 11 ]
rks.search('A pattern and another pattern', 'pattern') // prints [ 2, 22 ]
```

## Tests
run `npm test`

## Dependencies
https://github.com/rsandor/number-theory
