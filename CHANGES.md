# Changes

## 1.3.0

- Expose `emitter` in scope

## 1.2.0

- Add `removeMatchingFilters(event)`
- Only emit remove event in `removeAllFilters` for exact matches

## 1.1.1

- Don't invoke all filters when passing an object to `emit`

## 1.1.0

- Add `filterIterator`
- Expose and reuse glob-events `toScope`

## 1.0.1

- Improve the documentation dramatically

## 1.0.0

- Use `min-iterator` 1.0
- Use `min-filter` 1.0
- Use `glob-events` 1.0
- Pass `opts` to `glob-events` emitter constructor
- Simplify build by using Mochify
- Run tests in real browsers with SauceLabs

## 0.3.0

- Remove support for dynamic arguments and use `this.args` instead
- Fix ignoring listeners

## 0.2.0

- Invoke an additional function passed before the callback as the last function
  in the chain.

## 0.1.0

- Initial release
