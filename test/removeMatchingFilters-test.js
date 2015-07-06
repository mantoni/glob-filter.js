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


describe('removeMatchingFilters', function () {
  var e;

  beforeEach(function () {
    e = new Filter();
  });

  it('throws if called without arguments', function () {
    assert.throws(function () {
      e.removeMatchingFilters();
    }, Error);
  });

  it('delegates to "removeMatchingListeners"', function () {
    var s = util.stub();
    e._emitter.removeMatchingListeners = s;

    e.removeMatchingFilters('test');

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['test']);
  });

  it('emits "removeFilter" for each named listener', function () {
    var x = util.noop();
    var a = util.noop();
    var b = util.noop();
    var s = util.stub();
    e.addFilter('removeFilter', s);
    e.addFilter('**', x);
    e.addFilter('a.*', a);
    e.addFilter('a.b', b);
    e.addFilter('b.c', util.noop());

    e.removeMatchingFilters('a.*');

    assert.equal(s.calls.length, 3);
    assert.deepEqual(s.calls[0].scope.args, ['**', x]);
    assert.deepEqual(s.calls[1].scope.args, ['a.*', a]);
    assert.deepEqual(s.calls[2].scope.args, ['a.b', b]);
  });

  it('emits function added with filterOnce', function () {
    var s = util.stub();
    var f = util.noop();
    e.addFilter('removeFilter', s);
    e.filterOnce('a', f);

    e.removeMatchingFilters('a');

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].scope.args, ['a', f]);
  });

  it('still emits "newFilter" after `removeAllFilters`', function () {
    e.removeAllFilters();
    var s = util.stub();
    e.addFilter('newFilter', s);

    e.addFilter('a', util.noop());

    assert.equal(s.calls.length, 1);
  });

  it('still emits "removeFilter" after `removeAllFilters`', function () {
    e.removeAllFilters();
    var f = util.noop();
    var s = util.stub();
    e.addFilter('removeFilter', s);
    e.addFilter('a', f);

    e.removeFilter('a', f);

    assert.equal(s.calls.length, 1);
  });

});
