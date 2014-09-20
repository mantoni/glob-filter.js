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


describe('filters', function () {
  var e;

  beforeEach(function () {
    e = new Filter();
  });

  it('returns an empty array by default', function () {
    var a = e.filters();

    assert.deepEqual(a, []);
  });

  it('returns previously added filters', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('a', fn1);
    e.addFilter('b.c', fn2);

    var a = e.filters();

    assert.deepEqual(a, [fn1, fn2]);
  });

  it('returns matching listeners', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('*', fn1);
    e.addFilter('b', fn2);

    var a = e.filters('*');

    assert.deepEqual(a, [fn1, fn2]);
  });

  it('allows to exclude filters', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('*', fn1);
    e.addFilter('b', fn2);

    var a = e.filters('*', {
      listeners : false
    });

    assert.deepEqual(a, [fn1]);
  });

  it('returns matchers', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('**', fn1);
    e.addFilter('a.*', fn2);

    var a = e.filters('a.b');

    assert.deepEqual(a, [fn1, fn2]);
  });

  it('allows to exclude matchers', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('**', fn1);
    e.addFilter('a.*', fn2);

    var a = e.filters('a.b', {
      matchers : false
    });

    assert.deepEqual(a, []);
  });

  it('still includes exact match if matchers are excluded', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addFilter('*', fn1);
    e.addFilter('b', fn2);

    var a = e.filters('*', {
      matchers : false
    });

    assert.deepEqual(a, [fn2]);
  });

  it('returns original once listener', function () {
    var f = util.noop();
    e.filterOnce('a', f);

    var a = e.filters();

    assert.deepEqual(a, [f]);
  });

  it('handles options as the only argument correctly', function () {
    var f = util.noop();
    e.addFilter('*', f);

    var a = e.filters({ matchers : false });

    assert.deepEqual(a, []);
  });

});
