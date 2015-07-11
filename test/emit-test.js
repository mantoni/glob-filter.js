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


describe('emit', function () {
  var e;

  beforeEach(function () {
    e = new Filter();
  });

  it('throws if first arg is null', function () {
    assert.throws(function () {
      e.emit(null);
    }, TypeError);
  });

  it('invokes filters with args', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addFilter('a', l1);
    e.addFilter('a', l2);

    e.emit('a');

    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 1);
  });

  it('invokes matching filters', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addFilter('a.b', l1);
    e.addFilter('a.c', l2);

    e.emit('a.*');

    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 1);
  });

  it('does not invoke non-matching filters', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addFilter('b.a', l1);
    e.addFilter('a.b.c', l2);

    e.emit('a.*');

    assert.equal(l1.calls.length, 0);
    assert.equal(l2.calls.length, 0);
  });

  it('invokes matchers', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addFilter('**', l1);
    e.addFilter('a.*', l2);

    e.emit('a.b');

    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 1);
  });

  it('accepts config object with event', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addFilter('*', l1);
    e.addFilter('a', l2);

    assert.doesNotThrow(function () {
      e.emit({ event : 'a' });
    });
    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 1);
  });

  it('throws if config object is empty', function () {
    assert.throws(function () {
      e.emit({});
    }, TypeError);
  });

  it('does not emit other event than defined on object', function () {
    var la = util.stub();
    var lb = util.stub();
    e.addFilter('a', la);
    e.addFilter('b', lb);

    e.emit({ event : 'b' });

    assert.equal(la.calls.length, 0);
    assert.equal(lb.calls.length, 1);
  });

  it('allows to exclude matchers', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addFilter('*', l1);
    e.addFilter('a', l2);

    e.emit({ event : 'a', matchers : false });

    assert.equal(l1.calls.length, 0);
    assert.equal(l2.calls.length, 1);
  });

  it('allows to exclude filters', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addFilter('*', l1);
    e.addFilter('a', l2);

    e.emit({ event : 'a', listeners : false });

    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 0);
  });

  it('exposes event in scope', function () {
    var l = util.stub();
    e.addFilter('a', l);

    e.emit('a');

    assert.equal(l.calls[0].scope.event, 'a');
  });

  it('exposes args in scope', function () {
    var l = util.stub();
    e.addFilter('a', l);

    e.emit({ event : 'a', args : [42, [], null, 'str'] });

    assert.deepEqual(l.calls[0].scope.args, [42, [], null, 'str']);
  });

  it('defaults args to empty array', function () {
    var l = util.stub();
    e.addFilter('a', l);

    e.emit('a');

    assert.deepEqual(l.calls[0].scope.args, []);
  });

  it('defaults args to empty array if object is given', function () {
    var l = util.stub();
    e.addFilter('a', l);

    e.emit({ event : 'a' });

    assert.deepEqual(l.calls[0].scope.args, []);
  });

  it('exposes opts in scope', function () {
    var l = util.stub();
    e.addFilter('a', l);

    e.emit({
      event     : 'a',
      matchers  : true,
      listeners : true
    });

    assert(l.calls[0].scope.matchers);
    assert(l.calls[0].scope.listeners);
  });

  it('does not define undefined opts', function () {
    var l = util.stub();
    e.addFilter('a', l);

    e.emit({
      event : 'a'
    });

    assert.strictEqual(l.calls[0].scope.matchers, undefined);
    assert.strictEqual(l.calls[0].scope.listeners, undefined);
  });

  it('passes on custom properties on scope', function () {
    var l = util.stub();
    e.addFilter('a', l);

    e.emit({
      event  : 'a',
      answer : 42
    });

    assert.equal(l.calls[0].scope.answer, 42);
  });

  it('invokes once listener with scope', function () {
    var l = util.stub();
    e.filterOnce('a', l);

    e.emit('a');

    assert.equal(l.calls[0].scope.event, 'a');
  });

  it('invokes callback', function () {
    var l = util.stub();

    e.emit('a', l);

    assert.equal(l.calls.length, 1);
  });

  it('does not add callback to this.args', function () {
    var l = util.stub();
    e.addFilter('a', l);

    e.emit('a', util.noop());

    assert.deepEqual(l.calls[0].scope.args, []);
  });

  it('sets emitter on scope to this', function () {
    var l = util.stub();
    e.addFilter('a', l);

    e.emit('a', util.noop());

    assert.strictEqual(l.calls[0].scope.emitter, e);
  });

  it('does not invoke callback if filter does not yield', function () {
    e.addFilter('a', function (next, callback) {
      /*jslint unparam: true*/
      return;
    });
    var l = util.stub();

    e.emit('a', l);

    assert.equal(l.calls.length, 0);
  });

  it('invokes callback if filter yields', function () {
    e.addFilter('a', function (next, callback) {
      /*jslint unparam: true*/
      callback(null, 42);
    });
    var l = util.stub();

    e.emit('a', l);

    assert.equal(l.calls.length, 1);
    assert.deepEqual(l.calls[0].args, [null, 42]);
  });

  it('invokes function before callback as last filter function', function () {
    e.addFilter('a', function (next, callback) {
      next(function (v) {
        callback(v * 7);
      });
    });

    var res;
    e.emit('a', function (callback) {
      callback(2 * 3);
    }, function (v) {
      res = v;
    });

    assert.equal(res, 42);
  });

  it('invokes function before callback with same scope', function () {
    var l = util.stub();

    e.emit('a', l, util.noop());

    assert.deepEqual(l.calls[0].scope.event, 'a');
  });

  it('does not emit "newFilter"', function () {
    var l = util.stub();
    e.addFilter('newFilter', l);

    e.emit('*');

    assert.equal(l.calls.length, 0);
  });

  it('does not emit "removeFilter"', function () {
    var l = util.stub();
    e.addFilter('removeFilter', l);

    e.emit('*');

    assert.equal(l.calls.length, 0);
  });

});
