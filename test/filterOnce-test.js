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
var util = require('./util');


describe('filterOnce', function () {
  var e;

  beforeEach(function () {
    e = new Filter();
  });

  it('delegates to once', function () {
    var s = util.stub();
    e._emitter.once = s;
    var filter = util.noop();

    e.filterOnce('test', filter);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['test', filter]);
  });

  it('invokes listener on first emit', function () {
    var called = 0;
    e.filterOnce('a', function () {
      called++;
    });

    e.emit('a');
    e.emit('a');
    e.emit('a');

    assert.equal(called, 1);
  });

  it('passes arguments', function () {
    var args;
    e.filterOnce('such', function () {
      args = this.args;
    });

    e.emit('such', 'args', { much : 'wow' });

    assert.deepEqual(args, ['args', { much : 'wow' }]);
  });

  it('emits "newFilter" event', function () {
    var s = util.stub();
    var f = util.noop();

    e.addFilter('newListener', s);
    e.filterOnce('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('does not emit "newFilter" event to matchers', function () {
    var s = util.stub();

    e.addFilter('*', s);
    e.filterOnce('a', util.noop());

    assert.equal(s.calls.length, 0);
  });

});
