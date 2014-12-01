/*
 * glob-filter.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*globals describe, it, beforeEach*/
'use strict';

var assert = require('assert');
var Filter = require('../lib/filter').Filter;
var util = require('./fixture/util');


describe('filterIterator', function () {
  var e;

  beforeEach(function () {
    e = new Filter();
  });

  it('returns an empty iterator by default', function () {
    var a = e.filterIterator().toArray();

    assert.deepEqual(a, []);
  });

  it('returns previously added filters', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('a', fn1);
    e.addFilter('b.c', fn2);

    var a = e.filterIterator().toArray();

    assert.deepEqual(a, [
      { event : 'a', fn : fn1 },
      { event : 'b.c', fn : fn2 }
    ]);
  });

  it('returns matching listeners', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('*', fn1);
    e.addFilter('b', fn2);

    var a = e.filterIterator('*').toArray();

    assert.deepEqual(a, [
      { event : '*', fn : fn1 },
      { event : 'b', fn : fn2 }
    ]);
  });

  it('allows to exclude filters', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('*', fn1);
    e.addFilter('b', fn2);

    var a = e.filterIterator('*', {
      listeners : false
    }).toArray();

    assert.deepEqual(a, [{ event : '*', fn : fn1 }]);
  });

  it('returns matchers', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('**', fn1);
    e.addFilter('a.*', fn2);

    var a = e.filterIterator('a.b').toArray();

    assert.deepEqual(a, [
      { event : '**', fn : fn1 },
      { event : 'a.*', fn : fn2 }
    ]);
  });

  it('allows to exclude matchers', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('**', fn1);
    e.addFilter('a.*', fn2);

    var a = e.filterIterator('a.b', {
      matchers : false
    }).toArray();

    assert.deepEqual(a, []);
  });

  it('still includes exact match if matchers are excluded', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('*', fn1);
    e.addFilter('b', fn2);

    var a = e.filterIterator('*', {
      matchers : false
    }).toArray();

    assert.deepEqual(a, [{ event : 'b', fn : fn2 }]);
  });

  it('does not return original once listener', function () {
    var f = util.noop();
    e.filterOnce('a', f);

    var a = e.filterIterator().toArray();

    assert.notDeepEqual(a, [{ event : 'a', fn : f }]);
  });

  it('handles options as the only argument correctly', function () {
    var f = util.noop();
    e.addFilter('*', f);

    var a = e.filterIterator({ matchers : false }).toArray();

    assert.deepEqual(a, []);
  });

  it('returns filters with same name in add  order by default', function () {
    var l1 = util.noop();
    var l2 = util.noop();
    var l3 = util.noop();
    e.addFilter('a', l1);
    e.addFilter('a', l2);
    e.addFilter('a', l3);

    var a = e.filterIterator('a').toArray();

    assert.deepEqual(a, [
      { event : 'a', fn : l1 },
      { event : 'a', fn : l2 },
      { event : 'a', fn : l3 }
    ]);
  });

  it('returns filters with same name in reverse order', function () {
    e = new Filter({ reverse : true });
    var l1 = util.noop();
    var l2 = util.noop();
    var l3 = util.noop();
    e.addFilter('a', l1);
    e.addFilter('a', l2);
    e.addFilter('a', l3);

    var a = e.filterIterator('a').toArray();

    assert.deepEqual(a, [
      { event : 'a', fn : l3 },
      { event : 'a', fn : l2 },
      { event : 'a', fn : l1 }
    ]);
  });

});
