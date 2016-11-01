'use strict';

const Big = require('big.js');
const cast = require('cast');

const NOT_IN_SEQUENCE_ERROR = 'Number is not in the Fibonacci sequence';

/**
 * Get the kth index of the Fibonacci sequence
 *
 * @param  {Integer} k index of the Fibonacci number to retrieve
 * @return {Object}   contains the number, next number, index, and time
 */
exports.get = function(k) {
  // save the start time of the function
  var startTime = new Date().getTime();

  // try to convert k to an int, if not already
  k = cast(k, 'integer');

  // make sure k was cast properly and is not positive
  if(k === null || k < 0) {
    throw new Error('Invalid argument. Expected a positive Integer');
  }

  // if user asks for the first fibonacci value, no computation is needed
  if (k === 0) {
    return {
      number: Big(0),
      next: Big(1),
      index: 0,
      ms: new Date().getTime() - startTime
    };
  }

  // use a double iterator to find larger indeces faster
  var dblFibs = fibDoubleIterator(Big(1), Big(1), 1);

  // calculate iterations for fast doubling
  var dblIterations = Math.floor(Math.log2(k));

  // iterate the double iterator
  for (let i = 0; i < dblIterations; i++) {
    dblFibs.next();
  }

  // double iterator result
  var result = dblFibs.next().value;

  // calculate single iterations if any
  var iterations = k - Math.pow(2, dblIterations);

  if (iterations > 0) {
    // iterate to the desired index
    var fibs = fibIterator(result.number, result.next, result.index);
    for (let i = 0; i < iterations; i++) {
      fibs.next();
    }

    // update the result
    result = fibs.next().value;
  }

  return {
    number: result.number,
    next: result.next,
    index: result.index,
    ms: new Date().getTime() - startTime
  };
};

/**
 * Find the index of a given Fibonacci number
 * @param  {Big | String | Integer} num Fibonacci number
 * @return {Object}     contains the number, next number, index, and time
 */
exports.find = function(num) {
  // save the start time of the function
  var startTime = new Date().getTime();

  // make sure num is given
  if (num === undefined) {
    throw new Error('The find function expects a number. No arguments given.');
  }

  // make num a Big number
  num = Big(num);

  // if first index requested, no calculations needed
  if (num.eq(0)) {
    return {
      number: Big(0),
      next: Big(1),
      index: 0,
      ms: new Date().getTime() - startTime
    };
  }

  // save the previous result in case double iterations surpass requested value
  var prev = {number: Big(0), next: Big(1), index: 0};

  // create a double iterator to find larger numbers faster
  var dblFibs = fibDoubleIterator(Big(1), Big(1), 1);

  // save the current value for comparing to the given value
  var cur = dblFibs.next().value;

  // iterate the double iterator until the current value is surpased or equaled
  while (cur.number.lte(num)) {
    prev = cur;
    cur = dblFibs.next().value;
  }

  // create a single iterator with the previous value
  var fibs = fibIterator(prev.number, prev.next, prev.index);

  // save the current value from the single iterator
  cur = fibs.next().value;

  // iterate the single iterator until it is no longer less than the given value
  while (cur.number.lt(num)) {
    cur = fibs.next().value;
  }

  // the current value from the iterations should equal the requested number
  if (cur.number.eq(num)) {
    return {
      number: cur.number,
      next: cur.next,
      index: cur.index,
      ms: new Date().getTime() - startTime
    };
  } else {
    // if the current number does not match, the number given isn't a Fibonacci
    throw new Error(NOT_IN_SEQUENCE_ERROR);
  }
};

/**
 * Checks if a given number is a Fibonacci number
 * @param  {Big | String | Integer}  num [description]
 * @return {Boolean}     is number in Fibonacci sequence
 */
exports.is = function(num) {
  try {
    exports.find(num);
  } catch (err) {
    if (err.message === NOT_IN_SEQUENCE_ERROR) {
      return false;
    } else {
      throw err;
    }
  }

  return true;
};


/**
 * Create a Fibonacci sequence iterator
 * @param  {Integer} [k] starting index of the iterator
 * @param  {Integer} [n] number of values to limit the iterator to
 * @return {Iterator}   Fibonacci sequence iterator
 */
exports.iterator = function(k, n) {
  // try to cast n as an integer
  n = cast(n, 'integer');

  // throw error if n was cast as an int, but not positive
  if (n && n < 0) {
    throw new Error('Invalid argument n. Expected a positive Integer.');
  }

  // if the user defined a starting index
  if (k) {
    // try to cast k as an integer
    k = cast(k, 'integer');

    // make sure k could be cast as an int and is positive
    if (k === null || k < 0) {
      throw new Error('Invalid argument k. Expected a positive Integer');
    }

    // use the get function to retrieve the values to the iterator
    var result = exports.get(k);
    return fibIterator(Big(result.number), Big(result.next), k, n);
  }

  // k and n were not defiend, so give a default iterator from 0 to infinity
  return fibIterator(Big(0), Big(1), 0, n);
};

/**
 * Grab an array of the Fibonacci sequence
 * @param  {Integer} k0 the starting index
 * @param  {Integer} k1 the ending index
 * @return {Array}    an array from index k0 up to but not including k1
 */
exports.array = function(k0, k1) {
  // try casting k0 and k1 as ints
  k0 = cast(k0, 'integer');
  k1 = cast(k1, 'integer');

  // make sure that k0 and k1 were properly cast to ints
  if (k0 !== null && k1 !== null) {
    // make sure k0 and k1 are positive
    if (k0 >= 0 && k1 >= 0) {
      // make sure k1 is greater or equal to k0
      if (k1 >= k0) {
        if (k1 === k0) {
          return [];
        }
        return Array.from(exports.iterator(k0, k1 - k0));
      } else {
        throw new Error('k1 can not be less than k0');
      }
    } else {
      throw new Error('k0 and k1 must be positive');
    }
  } else {
    throw new Error('k0 and k1 must be Integers');
  }
};

/**
 * Creates an iterator for the Fibonacci sequence
 *
 * @private
 * @param  {Big}    k0 value at starting index k of the iterator
 * @param  {Big}    k1 value at starting index k+1 of the iterator
 * @param  {Integer}    k current index of the iterator
 * @return {Generator}    sequence iterator
 */
function* fibIterator(k0, k1, k, n) {
  let tmp, i = 0;
  while ((n && i < n) || (!n && true)) {
    yield {number: k0, next: k1, index: k};

    tmp = k1;

    k1 = k1.plus(k0);
    k0 = tmp;
    k++;

    i++;
  }
}

/**
 * Creates a double iterator for the Fibonacci sequence
 *
 * eg. If starting the iterator at index 1, the iterator will traverse indeces:
 *     [1, 2, 4, 8, 16, 32, 64, 128, etc.]
 *
 * @private
 * @param  {Big}    k0 starting index k of the iterator
 * @param  {Big}    k1 starting index k+1 of the iterator
 * @param  {Integer}    k current index of the iterator
 * @return {Generator}    sequence double iterator
 */
function* fibDoubleIterator(k0, k1, k) {
  let tmp0, tmp1;
  while (true) {
    yield {number: k0, next: k1, index: k};

    tmp0 = k0.times(k1.times(2).minus(k0));
    tmp1 = k1.times(k1).plus(k0.times(k0));

    k0 = tmp0;
    k1 = tmp1;
    k = 2*k;
  }
}
