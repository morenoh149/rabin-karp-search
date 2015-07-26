// ref http://www.cs.cmu.edu/~15451/lectures/lec6/karp-rabin-09-15-14.pdf

// TODO make dynamic
var q = 997        // this prime number is too small in practice
// var q = 1900089991 // large prime near 2^32, want to be within vm wordsize
// var q = 33554393

// we want to select a uniformly random prime number from {2,...,K}
// where K = 10pt*ln(pt)
// result q is prime number in the set of O(t*p^2)
function pickPrime(t, p) {
  var K = 10 * p * t * Math.log(t * p)
  var primes = []
  // fill primes with K prime numbers
  return primes[Math.floor(Math.random * K)]
}

// base for our mathematical operations,
// large base means we get large numbers for our hash
var base = 2

// Our modulo arithmetic must always be positive
// ex: -3 mod 23 = 20
function mod(n, m) {
  return ((n % m) + m) % m
}

// Compute rabin Fingerprint rolling hash
// if args missing defaults are provided
// rabinFingerprint('foo') = 12341
// rabinFingerprint('foo', 1, 2, 1234) = 12341231
function rollingHash(str, startIndex, endIndex, hash) {
  // hash -= mod(str.charCodeAt(startIndex - 1) * Math.pow(base, endIndex - startIndex), q)
  // hash = mod(hash * base, q)
  // hash += mod(str.charCodeAt(endIndex), q)
  hash = mod(hash - str.charCodeAt(startIndex - 1) * Math.pow(base, endIndex - startIndex), q)
  hash = mod(hash * base, q)
  hash = mod(hash + str.charCodeAt(endIndex), q)
  return hash
}

// hash whole pattern once upfront
function precompute(str) {
  var hash = 0
  var endIndex = str.length - 1
  for(var i = 0; i <= endIndex; i++) {
    hash = mod(hash + str.charCodeAt(i) * Math.pow(base, endIndex - i), q)
  }
  return hash
}

// Karp-Rabin Algorithm
// Searches for pattern P in search space T
// returns indexes in T
function search(T, P) {
  var t = T.length
  var p = P.length
  // q = pickPrime(p, t)

  if (p > t) { throw new Error('pattern is larger than search space') }

  var patternHash = precompute(P)

  var result = []

  // Iterate over T
  // T[i..(i+p-1)] -> T[(i+1)..(i+p)]
  // Run t-p+1 times ~ O(t-p+1)
  var substringHash = precompute(T.slice(0, p))
  if(patternHash === substringHash) {
    var substring = T.slice(0, p)
    if(substring === P) {
      result.push(0)
    }
  } else {
    for(var i = 1; i <= t - p; i++) {
      substringHash = rollingHash(T, i, i + p - 1, substringHash) //TODO refactor rabinFingerPrint to accept (T, i, i+p, hash)
      // console.log(substringHash, T.slice(i, i+p-1))
      if(patternHash === substringHash) {
        substring = T.slice(i, i + p)
        console.log('hash hit:', substringHash, substring)
        if(substring === P) {
          result.push(i)
        }
      }
    }
  }
  return result
}

var T = 'abpattern b patternbe'
var P = 'pattern'
// console.log('search space:', T)
// console.log('pattern:', P)

// var T = 'In mathematics, big O notation describes the limiting behavior of a function when the argument tends towards a particular value or infinity, usually in terms of simpler functions. It is a member of a larger family of notations that is called Landau notation, Bachmann–Landau notation (after Edmund Landau and Paul Bachmann),[1][2] or asymptotic notation. In computer science, big O notation is used to classify algorithms by how they respond (e.g., in their processing time or working space requirements) to changes in input size.[3] In analytic number theory, it is used to estimate the \"error committed\" while replacing the asymptotic size, or asymptotic mean size, of an arithmetical function, by the value, or mean value, it takes at a large finite argument. A famous example is the problem of estimating the remainder term in the prime number theorem.\nBig O notation characterizes functions according to their growth rates: different functions with the same growth rate may be represented using the same O notation. The letter O is used because the growth rate of a function is also referred to as order of the function. A description of a function in terms of big O notation usually only provides an upper bound on the growth rate of the function. Associated with big O notation are several related notations, using the symbols o, Ω, ω, and Θ, to describe other kinds of bounds on asymptotic growth rates.\nBig O notation is also used in many other fields to provide similar estimates.'
// var P = 'Big O notation'
console.log(search(T, P))

// module.exports.rabinFingerprint = function(str,
//                                            startIndex
//                                            endIndex,
//                                            hash) {
//   var base = 997 // make this dynamic
//   if (!hash) { hash = 0 }
//   subStrLength = endIndex - startIndex
//   if (hash === 0) {
//     for(var i = startIndex; i < endIndex; i++) {
//       hash += str.charCodeAt(i) *
//               Math.pow(base, subStrLength - i - 1)
//     }
//   } else {
//     hash -= str.charCodeAt(startIndex - 1) *
//             Math.pow(base, subStrLength - 1)
//     hash *= base
//     hash += str.charCodeAt(endIndex - 1)
//   }
//   return hash
// }

// module.exports.karpRabin = function(string, pattern) {
//   // base = O(string.length * pattern.length^2)
//   var base = 997 // make this dynamic
//   var hash = module.exports.hash

//   var patternHash = hash(pattern, 0, pattern.length)
//   var substringHash = 0
//   for(var i=0; i<=(string.length-pattern.length+1); i++) {
//     console.log(i)
//     substringHash = hash(string, i, pattern.length + i, substringHash)
//     if(substringHash === patternHash) {
//       var j = i + pattern.length
//       if (pattern === string.slice(i, j)) {
//         return true
//       }
//     }
//   }
//   return false
// }
