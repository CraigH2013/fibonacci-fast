# fibonacci-fast
A fast node.js module for working with the Fibonacci sequence

## Install
```bash
$ npm install fibonacci-fast
```
## Usage
Documentation can be found [here](https://craigh2013.github.io/fibonacci-fast/)

### fibonacci.get(k)
Get the kth index of the Fibonacci sequence

```javascript
var fibonacci = require('fibonacci-fast');
var result = fibonacci.get(3000);
```

The `result` will be a JavaScript `object` containing the following:

```javascript
{
  number: ...,
  next: ...,
  index: 3000,
  ms: 21
}
```

Where `number` is a [big number](https://www.npmjs.com/package/big.js) representing *Fibonacci[3000]*
and `next` is also a [big number](https://www.npmjs.com/package/big.js) representing *Fibonacci[3001]*. The `ms` is the amount of time (in milliseconds) that it took to get the result.

### fibonacci.find(num)
Find the index of a given Fibonacci number

```javascript
var result = fibonacci.find(13);
var index = result.index; // index = 7
```

The `result` will be the same form as the result of the `fibonacci.get(n)` method, so the `index` can be retrieved easily with `result.index`. This also means that the `number` and `next` values are returned in the `result` variable as well.

### fibonacci.is(num)
Checks if a given number is a Fibonacci number

```javascript
fibonacci.is(34); // true
fibonacci.is(35); // false
```

### fibonacci.iterator([k, n])
Create a Fibonacci sequence iterator. Where `k` and `n` are optional parameters defining the starting index of the iterator and the max number of iterations respectively. If `k` is not given, then the iterator will start at index 0. If `n` is not given the iterator will allow infinite iterations.

#### With starting index and limit
```javascript
var fibs = fibonacci.iterator(5, 5);

for (let fib of fibs) {
  console.log(`F[${fib.index}] = ${fib.number.toString()}`);
}
```

The result:

```bash
F[5] = 5
F[6] = 8
F[7] = 13
F[8] = 21
F[9] = 34
```

#### No starting index or limit
```javascript
var fibs = fibonacci.iterator();

for (let i = 0; i < 5; i++) {
  var fib = fibs.next().value;
  console.log(`F[${fib.index}] = ${fib.number.toString()}`);
}
```
The result:
```bash
F[0] = 0
F[1] = 1
F[2] = 1
F[3] = 2
F[4] = 3
```

### fibonacci.array(k0, k1)
Grab an array of the Fibonacci sequence. Where `k0` is the starting index, and `k1` is the ending index.
> NOTE: the number at `k1` will not be included in the `array`

```javascript
var array = fibonacci.array(5, 11);
```

The result will be an array of objects with the following form:
```javascript
{
  number: ...,
  next: ...,
  index: ...
}
```

In order to get an array containing the actual Fibonacci numbers and not the objects, you could map the array like so:

```javascript
var array = fibonacci.array(5, 11).map(x => x.number.toString());
```

and the resulting array would look like this:
```javascript
[ '5', '8', '13', '21', '34', '55' ]
```

## Fast Doubling Algorithm

This module utilizes the [fast doubling algorithm](https://www.nayuki.io/page/fast-fibonacci-algorithms) which allows for much faster calculations of Fibonacci numbers than the traditional recurrence method.

The fast doubling algorithm takes Θ(log _n_) operations, and the recurrence algorithm takes Θ(_n_).

## Big.js

The fibonacci-fast module utilizes the [big.js library](https://www.npmjs.com/package/big.js) to handle large numbers.
