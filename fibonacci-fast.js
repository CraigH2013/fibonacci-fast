'use strict';

const Big = require('big.js');
const cast = require('cast');

/**
 * Get the kth index of the Fibonacci sequence
 *
 * @param  {Integer} k index of the Fibonacci number to retrieve
 * @return {Object}   contains the number, next number, index, and time
 */
exports.get = function(k) {
  var startTime = new Date().getTime();

  k = cast(k, 'integer');

  if(k === null || k < 0) {
    throw new Error('Invalid argument. Expected a positive Integer');
  }

  if (k === 0) {
    return {
      number: Big(0),
      next: Big(1),
      index: 0,
      ms: new Date().getTime() - startTime
    };
  }

  var dblFibs = fibDoubleIterator(Big(1), Big(1), 1);

  var dblIterations = Math.floor(Math.log2(k));
  for (let i = 0; i < dblIterations; i++) {
    dblFibs.next();
  }

  let result = dblFibs.next().value;

  var iterations = k - Math.pow(2, dblIterations);

  if (iterations > 0) {
    var fibs = fibIterator(result.number, result.next, result.index);
    for (let i = 0; i < iterations; i++) {
      fibs.next();
    }
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
  var startTime = new Date().getTime();

  if (num === undefined) {
    throw new Error('The find function expects a number. No arguments given.');
  }

  num = Big(num);

  if (num.eq(0)) {
    return {
      number: Big(0),
      next: Big(1),
      index: 0,
      ms: new Date().getTime() - startTime
    };
  }

  var prev = {number: Big(0), next: Big(1), index: 0};
  var dblFibs = fibDoubleIterator(Big(1), Big(1), 1);

  var cur = dblFibs.next().value;

  while (cur.number.lte(num)) {
    prev = cur;
    cur = dblFibs.next().value;
  }

  var fibs = fibIterator(prev.number, prev.next, prev.index);

  cur = fibs.next().value;
  while (cur.number.lt(num)) {
    cur = fibs.next().value;
  }

  if (cur.number.eq(num)) {
    return {
      number: cur.number,
      next: cur.next,
      index: cur.index,
      ms: new Date().getTime() - startTime
    };
  } else {
    throw new Error('Number is not in the Fibonacci sequence');
  }
};


/**
 * Create a Fibonacci sequence iterator
 * @param  {Integer} [k] starting index of the iterator
 * @param  {Integer} [n] number of values to limit the iterator to
 * @return {Iterator}   Fibonacci sequence iterator
 */
exports.iterator = function(k, n) {
  n = cast(n, 'integer');
  if (n && n < 0) {
    throw new Error('Invalid argument n. Expected a positive Integer.');
  }

  if (k) {
    k = cast(k, 'integer');
    if (k === null || k < 0) {
      throw new Error('Invalid argument k. Expected a positive Integer');
    }
    var result = exports.get(k);
    return fibIterator(Big(result.number), Big(result.next), k, n);
  }

  return fibIterator(Big(0), Big(1), 0, n);
};

exports.array = function(k0, k1) {
  k0 = cast(k0, 'integer');
  k1 = cast(k1, 'integer');

  if (k0 !== null && k1 !== null) {
    if (k0 >= 0 && k1 >= 0) {
      if (k1 - k0 >= 0) {
        if (k1 === k0) {
          return [];
        }
        return Array.from(exports.iterator(k0, k1 - k0 + 1));
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
  while ((n && i < n - 1) || (!n && true)) {
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
