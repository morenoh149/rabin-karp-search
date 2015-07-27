var fs = require('fs')
var powerMod = require('number-theory').powerMod
var base = 16
var q = 190011979
var precompute = require('./index.js').precompute
var rollingHash = require('./index.js').rollingHash
var search = require('./index.js').search

function iterativeIndexOf(T, P, i) {
  if(!i) { i = 0 }
  var results = []

  var matchIndex = T.indexOf(P)
  while(matchIndex !== -1) {
    results.push(matchIndex)
    matchIndex = T.indexOf(P, matchIndex + 1)
  }
  return results
}

// small test strings
// var T = 'abpattern b pattern'
// var P = 'pattern'

// larger test - against words file
var T = fs.readFileSync('/usr/share/dict/words', { encoding: 'utf8' })
var P = 'zymotoxic\nzymurgy\nZyrenian\nZyrian\nZyryan\nzythem\nZythia\nzythum\nZyzomys\nZyzzogeton'
// var P = 'moto'

var magnitude = powerMod(base, 'pattern'.length - 1, q)
console.log('rollingHash check1:', precompute('pattern') === rollingHash('apatternb', 1, 7, precompute('apatter'), magnitude))
console.log('rollingHash check2:', precompute('pattern') === rollingHash('abpattern', 2, 7, precompute('bpatter'), magnitude))

var startTime = Date.now()
search(T, P)
var endTime = Date.now()
console.log('karp-rabin time:', endTime - startTime, 'ms')

startTime = Date.now()
iterativeIndexOf(T, P)
endTime = Date.now()
console.log('iterative indexOf time:', endTime - startTime, 'ms')
