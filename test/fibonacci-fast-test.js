/*global describe, it*/

'use strict';

const assert = require('chai').assert;
const testvars = require('./test-vars.js');

var fibonacci = require('../fibonacci-fast.js');

describe('fibonacci-fast.js', function() {

  describe('get(k)', function() {
    it('should give expected number results', function() {
      assert.equal(fibonacci.get(0).number, 0);
      assert.equal(fibonacci.get(10).number, 55);
      assert.equal(fibonacci.get(23).number, 28657);
      assert.equal(fibonacci.get(89).number, 0x18b3c1d91e77decd);
      assert.equal(fibonacci.get(174).number, 0xc711cf991d7d21b50dac229895a6e8);
    });

    // it('it should be able to get big numbers', function() {
    //   assert.equal(
    //     fibonacci.get(30000).number.toFixed(), testvars.numbers.fib30000
    //   );
    // });

    it('should handle bad input', function() {
      assert.throws(function(){ fibonacci.get(-1); }, Error);
      assert.throws(function(){ fibonacci.get('abc'); }, Error);
      assert.throws(function(){ fibonacci.get(1.23); }, Error);
      assert.doesNotThrow(function(){ fibonacci.get('123'); }, Error);
    });
  });

  describe('find(num)', function() {
    it('should find the correct index', function() {
      assert.equal(fibonacci.find(0).index, 0);
      assert.equal(fibonacci.find(55).index, 10);
      assert.equal(fibonacci.find(28657).index, 23);
      assert.equal(fibonacci.find('1779979416004714189').index, 89);
    });

    // it('should be able to find big numbers', function() {
    //   assert.equal(
    //     fibonacci.find(testvars.numbers.fib30000).index, 30000
    //   );
    // });

    it('should handle bad input', function() {
      assert.throws(function(){fibonacci.find('abc'); }, Error);
      assert.equal(fibonacci.find('28657').index, 23);
      assert.throws(function(){fibonacci.find(-1); }, Error);
    });
  });

  describe('is(num)', function() {
    it('should give correct answers', function() {
      assert.equal(fibonacci.is(24157817), true);
      assert.equal(fibonacci.is(378), false);
    });

    it('should handle negative input', function() {
      assert.equal(fibonacci.is(-1), false);
    });

    it('should handle bad input', function() {
      assert.throws(function() { fibonacci.is('abc'); }, Error);
    });
  });

  describe('iterator(k, n)', function() {
    it('should start at index 0 if no arguments given', function() {
      var fibs = fibonacci.iterator();
      var expectations = ['0', '1', '1', '2', '3', '5', '8', '13', '21'];

      for (let expectation of expectations) {
        assert.equal(fibs.next().value.number.toFixed(), expectation);
      }
    });

    it('should start at correct index', function() {
      var fibs = fibonacci.iterator(13);
      assert.equal(fibs.next().value.number.toFixed(), '233');
    });

    it('should throw error if integer is not given', function() {
      assert.throws(function() { fibonacci.iterator(2.2); }, Error);
      assert.doesNotThrow(function() { fibonacci.iterator('2'); }, Error);
    });

    it('should be able to limit values', function() {
      var fibs = fibonacci.iterator(0, 5);
      var expected = [0, 1, 1, 2, 3, 5];

      var i = 0;
      for (let fib of fibs) {
        assert.equal(fib.number.toFixed(), expected[i]);
        i++;
      }
    });

    it('should handle a negative n value', function() {
      assert.throws(function() {fibonacci.iterator(0, -1);}, Error);
    });
  });

  describe('array(k0, k1)', function() {
    it('should give expected results', function() {
      var expected = [0, 1, 1, 2, 3, 5];
      fibonacci.array(0, 6).map(x => {
        return x.number.toFixed();
      }).forEach((x, i) => {
        assert.equal(x, expected[i]);
      });
    });

    it('should handle bad arguments', function(){
      assert.throws(function () {
        fibonacci.array(2, 1);
      }, Error);

      assert.throws(function () {
        fibonacci.array(0);
      }, Error);

      assert.throws(function () {
        fibonacci.array(0, 1.2);
      }, Error);
    });
  });

});
