# glob-filter.js

[![Build Status]](https://travis-ci.org/mantoni/glob-filter.js)
[![SemVer]](http://semver.org)
[![License]](https://github.com/mantoni/glob-filter.js/blob/master/LICENSE)

Filter chains, event emitter style, with globs and callbacks.

Register filters using [glog events][] and process matching [filter chains][].
Callbacks may be used in each filter to pass back errors or values
asynchronously.

## Features

- Bi-directional control flow with `next` / `callback` pairs
- Add or remove filters while the chain is processed
- Easy to learn, event emitter style API
- Test suite runs on Node.js 0.10, PhantomJS, Chrome, Firefox and IE 9 / 10
- 100% code coverage

## Install with npm

    npm install glob-filter

## Browser support

Use [Browserify](http://browserify.org) to create a standalone file.

## Filter chain setup

This implementation supports flow in both directions which allows each filter
to apply logic before and / or after processing happens on the rest of the
chain:

               ┌────────────┐  ┌────────────┐  ┌────────────┐
               │  Filter A  │  │  Filter B  │  │  Filter C  │
               │            │  │            │  │            │
        emit ──┼───> next ──┼──┼───> next ──┼──┼───> next ──┼───> then
               │            │  │            │  │            │      │
    callback <─── callback <┼──┼─ callback <┼──┼─ callback <┼── callback
               │            │  │            │  │            │
               └────────────┘  └────────────┘  └────────────┘

## Usage

```js
var GlobFilter = require('glob-filter').GlobFilter;

var gf = new GlobFilter();

gf.addFilter('foo.*', function (next) {
  console.log('Foo');
  next();
});

gf.emit('foo.bar', function (err, value) {
  assert.equal(value, 7);
});
```

## Filter implementations

A filter which does not block the chain, the next filter will be invoked
immediately:

```js
gf.addFilter(function () {
  // ...
});
```

A filter that controls when to invoke the next filter:

```js
gf.addFilter(function (next) {
  // ...
  next();
});
```

A filter that controls when to invoke the callback:

```js
gf.addFilter(function (next, callback) {
  next(function (err, value) {
    // ...
    callback(err, value);
  });
});
```

You can pass a `then` function to invoke at the end of the filter chain to
`emit`:

```js
gf.emit('foo.bar', function (callback) {
  callback(null, 42);
}, function (err, value) {
  assert.equal(value, 42);
});
```

## GlobFilter API

- `emit(event[, then][, callback])`: Invokes all filters registered for the
  given event. Matching rules are applied on the event name as descibed in the
  [glob-tree match expressions][]. If a callback is passed, it will be invoked
  after all filters returned. If a `then` function is passed, it will be
  invoked after all filters called `next`. It receives a callback as the only
  argument expecting to be called with `(err, value)`. Invoking the callback
  causes the filter callback chain to be invoked.
- `addFilter(event, fn)`: Registers a filter for an event
- `filterOnce(event, fn)`: Registers a filter for an event that is
  automatically removed on the first invocation
- `removeFilter(event, fn)`: Unregisters a filter for an event
- `removeAllFilters([event])`: Unregisters all filters, or all filters
  for the given event. Matching rules are not applied.
- `filters([event][, options])`: Returns all filters, or all filters
  for the given event. Matching rules are applied on the event name as
  described in the [glob-tree match expressions][].

### Options

The `options` argument can have these properties:

- `matchers`: Emit to matchers, defaults to `true`
- `listeners`: Emit to listeners, defaults to `true`

The first argument passed to `emit` can be an object with an `event` property
and any of the above options.

### Scope

Filters are invoked with a special scope object. If an object is passed to
`emit` as the event (see Options), that object is used as the scope object.

It is also possible to bind individual filters to specific scope objects:

```js
gf.addFilter({
  event : 'some.event',
  scope : this
}, function () { ... });
```

### Events

- `newFilter`: Emitted by `addFilter` and `filterOnce` with the event name
  and the new filter function. Matchers will not receive this event.
- `removeFilter`: Emitted by `removeFilter` and `removeAllFilters` with
  the event name and the removed filter function. Matchers will not receive
  this event.

## License

MIT

[Build Status]: http://img.shields.io/travis/mantoni/glob-filter.js.svg
[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/glob-filter.svg
[glob events]: https://github.com/mantoni/glob-events.js
[filter chains]: https://github.com/mantoni/min-filter.js
[glob-tree match expressions]: https://github.com/mantoni/glob-tree.js#match-expressions
