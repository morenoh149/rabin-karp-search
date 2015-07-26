// ref http://www.cs.cmu.edu/~15451/lectures/lec6/karp-rabin-09-15-14.pdf
var powerMod = require('number-theory').powerMod

var q = 997        // this prime number is too small in practice
// var q = 1900089991 // large prime near 2^32, want to be within vm wordsize
// var q = 33554393

// we want to select a uniformly random prime number from {2,...,K}
// where K = 10pt*ln(pt)
// result q is prime number in the set of O(t*p^2)
// function pickPrime(t, p) {
//   var K = 10 * p * t * Math.log(t * p)
//   var primes = []
//   // fill primes with K prime numbers
//   return primes[Math.floor(Math.random * K)]
// }

// base for our mathematical operations,
// smaller is better so we can have larger window size
var base = 2

// Our modulo arithmetic must always be positive
// ex: -3 mod 23 = 20
function mod(n, m) {
  return ((n % m) + m) % m
}

// Compute rabin Fingerprint rolling hash
// rollingHash('foo', 1, 2, 1234) = 12341231
function rollingHash(str, startIndex, windowSize, hash) {
  var modPower = powerMod(base, windowSize - 1, q)
  var code = mod(str.charCodeAt(startIndex - 1), q)
  var modProduct = mod(code * modPower, q)
  hash = mod(hash - modProduct, q)
  hash = mod(hash * base, q)
  hash = mod(hash + str.charCodeAt(startIndex + windowSize - 1), q)
  return hash
}

// hash whole pattern once upfront
function precompute(str) {
  var hash = 0
  var j = str.length - 1
  for(var i = 0; i <= j; i++) {
    var magnitude = powerMod(base, j - i, q)
    hash = mod(hash + str.charCodeAt(i) * magnitude, q)
  }
  return hash
}
// console.log('functions work;', precompute('pattern') === rollingHash('apatternb', 1, 7, precompute('apatter')))
// console.log('functions work;', precompute('pattern') === rollingHash('abpattern', 2, 7, precompute('bpatter')))

// Karp-Rabin Algorithm
// Searches for pattern P in search space T
// returns indexes in T
function search(T, P) {
  var t = T.length
  var p = P.length

  if (p > t) { throw new Error('pattern is larger than search space') }

  var patternHash = precompute(P)

  var result = []

  // Iterate over T
  // T[i..(i+p-1)] -> T[(i+1)..(i+p)]
  // Run t-p+1 times ~ O(t-p+1)
  var substring = T.slice(0, p)
  var substringHash = precompute(substring)
  if(patternHash === substringHash) {
    if(substring === P) {
      result.push(0)
    }
  }
  for(var i = 1; i <= t - p; i++) {
    substringHash = rollingHash(T, i, p, substringHash)
    console.log(substringHash, T.slice(i, i + p))
    if(patternHash === substringHash) {
      substring = T.slice(i, i + p)
      console.log('hash hit', substringHash, substring)
      if(substring === P) {
        result.push(i)
      }
    }
  }
  return result
}

// var T = 'abpattern b pattern'
// var P = 'pattern'
// console.log('search space:', T)
// console.log('pattern:', P)

var T = 'In mathematics, big O notation describes the limiting behavior of a function when the argument tends towards a particular value or infinity, usually in terms of simpler functions. It is a member of a larger family of notations that is called Landau notation, Bachmann–Landau notation (after Edmund Landau and Paul Bachmann),[1][2] or asymptotic notation. In computer science, big O notation is used to classify algorithms by how they respond (e.g., in their processing time or working space requirements) to changes in input size.[3] In analytic number theory, it is used to estimate the \"error committed\" while replacing the asymptotic size, or asymptotic mean size, of an arithmetical function, by the value, or mean value, it takes at a large finite argument. A famous example is the problem of estimating the remainder term in the prime number theorem.\nBig O notation characterizes functions according to their growth rates: different functions with the same growth rate may be represented using the same O notation. The letter O is used because the growth rate of a function is also referred to as order of the function. A description of a function in terms of big O notation usually only provides an upper bound on the growth rate of the function. Associated with big O notation are several related notations, using the symbols o, Ω, ω, and Θ, to describe other kinds of bounds on asymptotic growth rates.\nBig O notation is also used in many other fields to provide similar estimates.'
var P = 'Big O notation characterizes functions according to their growth rates: different functions with the same growth rate may be represented using the same O notation. The letter O is used because the growth rate of a function is also referred to as order of the function. A description of a function in terms of big O notation usually only provides an upper bound on the growth rate of the function. Associated with big O notation are several related notations, using the symbols o, Ω, ω, and Θ, to describe other kinds of bounds on asymptotic growth rates.\nBig O notation is also used in many other fields to provide similar estimates.'
console.log(search(T, P))

