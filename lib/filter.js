/*
 * glob-filter.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var Emitter = require('glob-events').Emitter;
var filter  = require('min-filter');

var E_EVENT = 'Event must be string';


function Filter(opts) {
  opts = opts || {};
  opts.addEvent    = 'newFilter';
  opts.removeEvent = 'removeFilter';
  this._emitter    = new Emitter(opts);
}

Filter.prototype = {

  emit: function (event, then, callback) {
    var opts, scope;
    if (typeof event === 'object') {
      scope = event;
      opts  = event;
      event = event.event;
      if (!scope.args) {
        scope.args = [];
      }
    } else {
      scope = { event : event, args : [] };
    }
    if (typeof event !== 'string') {
      throw new TypeError(E_EVENT);
    }
    var i = this._emitter.iterator(event, opts);
    filter(i, scope, then, callback);
  },

  addFilter: function (event, fn) {
    this._emitter.on(event, fn);
  },

  filterOnce: function (event, fn) {
    this._emitter.once(event, fn);
  },

  removeFilter: function (event, fn) {
    this._emitter.removeListener(event, fn);
  },

  removeAllFilters: function (event) {
    this._emitter.removeAllListeners(event);
    listeners(this);
  },

  filters: function (event, opts) {
    return this._emitter.listeners(event, opts);
  }

};

exports.Filter = Filter;
