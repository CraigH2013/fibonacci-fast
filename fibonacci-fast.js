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
 * Create an iterator for the Fibonacci sequence
 * @param  {Integer} [k] starting index of the iterator
 * @return {Iterator}   Fibonacci sequence iterator
 */
exports.iterator = function(k) {
  if (k) {
    k = cast(k, 'integer');
    if (k === null || k < 0) {
      throw new Error('Invalid argument. Expected a positive Integer');
    }
    var result = exports.get(k);
    return fibIterator(Big(result.number), Big(result.next), k);
  }

  return fibIterator(Big(0), Big(1), 0);
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
function* fibIterator(k0, k1, k) {
  let tmp;
  while (true) {
    yield {number: k0, next: k1, index: k};

    tmp = k1;

    k1 = k1.plus(k0);
    k0 = tmp;
    k++;
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
