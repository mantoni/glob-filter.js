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
var events = require('glob-events');
var filter = require('../lib/filter');


describe('toScope', function () {

  it('exposes toScope from glob-events', function () {
    assert.strictEqual(filter.toScope, events.toScope);
  });

});
