# glob-filter.js [![Build Status](https://travis-ci.org/mantoni/glob-filter.js.png?branch=master)](http://travis-ci.org/mantoni/glob-filter.js)

Filter chains, event emitter style, with globs and callbacks.

Register filters on a [glob store][] and process matching [filter chains][].
Callbacks may be used in each filter to pass back errors or values
asynchronously.

Repository: <https://github.com/mantoni/glob-filter.js>

---

## Features

- Bi-directional control flow with `next` / `callback` pairs
- Add or remove filters while the chain is processed
- Easy to learn, event emitter style API
- Test suite runs on Node.js 0.10, PhantomJS, Chrome, Firefox and IE 9 / 10
  with 100% code coverage

## Usage

```js
var GlobFilter = require('glob-filter').GlobFilter;
var globFilter = new GlobFilter();

globFilter.addFilter('foo.*', function (next) {
  console.log('Foo');
  next();
});
globFilter.addFilter('foo.bar', function (next, callback) {
  next(function (err) {
    callback(err, 7);
  });
});
// ... more filters

globFilter.emit('foo.bar', function (err, value) {
  assert.equal(value, 7);
});
```

You can pass one additional filter to invoke at the end of the filter chain to
`emit`:

```js
globFilter.emit('foo.bar', function (callback) {
  callback(null, 42);
}, function (err, value) {
  assert.equal(value, 42);
});
```

## Install with npm

```
npm install glob-filter
```

## Browser support

Use [Browserify](http://browserify.org) to create a standalone file.

## License

MIT

[glob store]: https://github.com/mantoni/glob-store.js
[filter chains]: https://github.com/mantoni/min-filter.js
