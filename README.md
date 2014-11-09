chant
===========

A key-value styles cached layer framework.

[![Build Status](https://travis-ci.org/kumatch/chant.png?branch=master)](https://travis-ci.org/kumatch/chant)


Install
--------

    $ npm install chant


Example
--------

```javascript
var chant = require("chant");

var memory  = {};
var storage = {};

// create front layer (cache)
var front = chant.create({
    get: function (key, callback) {
        callback(null, memory[key]);
    },

    put: function (key, value, callback) {
        memory[key] = value;
        callback();
    },

    delete: function (key, callback) {
        delete memory[key];
        callback();
    },

    clean: function (callback) {
        memory = {};
        callback();
    },
});

// create back layer (main storage)
var back = chant.create({
    get: function (key, callback) {
        callback(null, storage[key]);
    },

    put: function (key, value, callback) {
        storage[key] = value;
        callback();
    },

    delete: function (key, callback) {
        delete storage[key];
        callback();
    },

    clean: function (callback) {
        callback();  // do nothing.
    },
});


var data = chant.chain(front, back);

data.put("name", "chant", function () {
  //...
});

data.get("name", function (err, value) {
  //...
});

```





Methods
-------

### var cache = chant.create(action)

Create chant cached layer instance.

`action` parameters (all required):

* `action.get = function (key, callback) { ... }` - action for get a value of key.
* `action.put = function (key, value, callback) { ... }` - action for put a value of key.
* `action.delete = function (key, callback) { ... }` - action for delete a value of key.
* `action.clean = function (callback) { ... }` - action for clean up cache.


### cache.get(key, callback)

Get a value of key from cache. It will call `action.get()`.

### cache.put(key, value, callback)

Put a value of key to cache. It will call `action.put()`.

### cache.delete(key, value, callback)

Delete a value of key from cache. It will call `action.delete()`.

### cache.clean(callback)

Clean up a cache. It will call `action.clean()`.


### var chain = chant.chain(front_cache, back_cache)

Create chant chained cache.

### chain.get(key, callback)

Get a value of key from chained cache.

It will call `front_cache.get()` first, return value and finish if front layer cache has a value, or call `back_cache.get()` next, return value and call `front_cache.put()` with key, value.

### chain.put(key, value, callback)

Put a value of key to chained cache.

It will call `front_cache.put()` and `back_cache.put()` with key, value.


### chain.delete(key, value, callback)

Delete a value of key from chained cache.

It will call `front_cache.delete()` and `back_cache.delete()` with key.


### chain.clean(callback)

Clean up a chained cache. It will call `action.clean()`.

It will call `front_cache.clean()` and `back_cache.clean()` with key.



License
--------

Licensed under the MIT License.

Copyright (c) 2014 Yosuke Kumakura

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
