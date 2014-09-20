# glob-filter.js

[![Build Status]](https://travis-ci.org/mantoni/glob-filter.js)
[![SemVer]](http://semver.org)
[![License]](https://github.com/mantoni/glob-filter.js/blob/master/LICENSE)

Filter chains, event emitter style, with globs and callbacks.

Register filters on a [glob store][] and process matching [filter chains][].
Callbacks may be used in each filter to pass back errors or values
asynchronously.

## Features

- Bi-directional control flow with `next` / `callback` pairs
- Add or remove filters while the chain is processed
- Easy to learn, event emitter style API
- Test suite runs on Node.js 0.10, PhantomJS, Chrome, Firefox and IE 9 / 10
  with 100% code coverage

## Install with npm

```
npm install glob-filter
```

## Browser support

Use [Browserify](http://browserify.org) to create a standalone file.

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

## License

MIT

[Build Status]: http://img.shields.io/travis/mantoni/glob-filter.js.svg
[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/glob-filter.svg
[glob store]: https://github.com/mantoni/glob-store.js
[filter chains]: https://github.com/mantoni/min-filter.js
