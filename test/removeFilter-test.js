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


describe('removeFilter', function () {
  var e;

  beforeEach(function () {
    e = new Filter();
  });

  it('delegates to removeListener', function () {
    var s = util.stub();
    e._emitter.removeListener = s;
    var filter = util.noop();

    e.removeFilter('test', filter);

    assert.equal(s.calls.length, 1);
  });

  it('emits "removeFilter" event', function () {
    var s = util.stub();
    var f = util.noop();

    e.addFilter('removeFilter', s);
    e.addFilter('a', f);
    e.removeFilter('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].scope.args, ['a', f]);
  });

  it('does not emit "removeFilter" event to matchers', function () {
    var s = util.stub();
    var f = util.noop();

    e.addFilter('*', s);
    e.addFilter('a', f);
    e.removeFilter('a', f);

    assert.equal(s.calls.length, 0);
  });

});
