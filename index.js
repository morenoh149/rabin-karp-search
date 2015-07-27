// ref http://www.cs.cmu.edu/~15451/lectures/lec6/karp-rabin-09-15-14.pdf
var powerMod = require('number-theory').powerMod

// prime q should be less than but near (2^32)/10
// assuming 2^32 is javascript vm wordsize
var q = 190011979

// base for our mathematical operations,
// smaller allows you to have larger window size
// larger is better to reduce odds of hash collisions
// var base = 2
var base = 16

// modulo arithmetic must always be positive
function mod(n, m) {
  return ((n % m) + m) % m
}

// Compute rabin Fingerprint rolling hash
exports.rollingHash = function rollingHash(str, startIndex, windowSize, hash, magnitude) {
  hash = mod(hash - str.charCodeAt(startIndex - 1) * magnitude, q)
  hash = mod(hash * base, q)
  hash = mod(hash + str.charCodeAt(startIndex + windowSize - 1), q)
  return hash
}

// hash whole pattern once upfront
exports.precompute = function precompute(str) {
  var hash = 0
  var j = str.length - 1
  for(var i = 0; i <= j; i++) {
    var magnitude = powerMod(base, j - i, q)
    hash = mod(hash + str.charCodeAt(i) * magnitude, q)
  }
  return hash
}

// Karp-Rabin Algorithm
// Searches for pattern P in search space T
// returns indexes in T
exports.search = function search(T, P) {
  var t = T.length
  var p = P.length

  if (p > t) { throw new Error('pattern is larger than search space') }

  var patternHash = exports.precompute(P)

  var result = []

  // Iterate over T
  // T[i..(i+p-1)] -> T[(i+1)..(i+p)]
  // Run t-p+1 times ~ O(t-p+1)
  var substring = T.slice(0, p)
  var substringHash = exports.precompute(substring)
  if(patternHash === substringHash) {
    if(substring === P) {
      result.push(0)
    }
  }
  var magnitudePrecompute = powerMod(base, p - 1, q)
  for(var i = 1; i <= t - p; i++) {
    substringHash = exports.rollingHash(T, i, p, substringHash, magnitudePrecompute)
    if(patternHash === substringHash) {
      substring = T.slice(i, i + p)
      if(substring === P) {
        result.push(i)
      }
    }
  }
  return result
}

