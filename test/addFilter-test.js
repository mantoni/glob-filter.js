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
var util   = require('./util');


describe('addFilter', function () {
  var e;

  beforeEach(function () {
    e = new Filter();
  });

  it('delegates to on', function () {
    var s = util.stub();
    e._emitter.on = s;
    var filter = util.noop();

    e.addFilter('test', filter);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['test', filter]);
  });

  it('emits "newFilter" event', function () {
    var s = util.stub();
    var f = util.noop();

    e.addFilter('newFilter', s);
    e.addFilter('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].scope.args, ['a', f]);
  });

  it('does not emit "newFilter" event to matchers', function () {
    var s = util.stub();

    e.addFilter('*', s);
    e.addFilter('a', util.noop());

    assert.equal(s.calls.length, 0);
  });

});
