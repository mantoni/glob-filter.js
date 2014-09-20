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


describe('removeAllListeners', function () {
  var e;

  beforeEach(function () {
    e = new Filter();
  });

  it('delegates to "removeAllListeners"', function () {
    var s = util.stub();
    e._emitter.removeAllListeners = s;

    e.removeAllFilters('test');

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['test']);
  });

  it('emits "removeFilter" for each named listener', function () {
    var a = util.noop();
    var b = util.noop();
    var s = util.stub();
    e.addFilter('removeFilter', s);
    e.addFilter('a.*', a);
    e.addFilter('a.b', b);
    e.addFilter('b.c', util.noop());

    e.removeAllFilters('a.*');

    assert.equal(s.calls.length, 2);
    assert.deepEqual(s.calls[0].scope.args, ['a.*', a]);
    assert.deepEqual(s.calls[1].scope.args, ['a.b', b]);
  });

  it('emits "removeFilter" for all listeners', function () {
    var a = util.noop();
    var b = util.noop();
    var c = util.noop();
    var s = util.stub();
    e.addFilter('removeFilter', s);
    e.addFilter('a.*', a);
    e.addFilter('a.b', b);
    e.addFilter('b.c', c);

    e.removeAllFilters();

    assert.equal(s.calls.length, 4);
    assert.deepEqual(s.calls[0].scope.args, ['removeFilter', s]);
    assert.deepEqual(s.calls[1].scope.args, ['a.*', a]);
    assert.deepEqual(s.calls[2].scope.args, ['a.b', b]);
    assert.deepEqual(s.calls[3].scope.args, ['b.c', c]);
  });

  it('does not emit "removeFilter" on matchers', function () {
    var s = util.stub();
    e.addFilter('*', s);
    e.addFilter('a', util.noop());

    e.removeAllFilters();

    assert.equal(s.calls.length, 0);
  });

  it('emits function added with filterOnce', function () {
    var s = util.stub();
    var f = util.noop();
    e.addFilter('removeFilter', s);
    e.filterOnce('a', f);

    e.removeAllFilters('a');

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].scope.args, ['a', f]);
  });

  it('still emits "newFilter" afterwards', function () {
    e.removeAllFilters();
    var s = util.stub();
    e.addFilter('newFilter', s);

    e.addFilter('a', util.noop());

    assert.equal(s.calls.length, 1);
  });

  it('still emits "removeFilter" afterwards', function () {
    e.removeAllFilters();
    var f = util.noop();
    var s = util.stub();
    e.addFilter('removeFilter', s);
    e.addFilter('a', f);

    e.removeFilter('a', f);

    assert.equal(s.calls.length, 1);
  });

});
