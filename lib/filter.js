/*
 * glob-filter.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var events = require('glob-events');
var filter = require('min-filter');


function Filter(opts) {
  opts = opts || {};
  opts.addEvent    = 'newFilter';
  opts.removeEvent = 'removeFilter';
  this._emitter    = new events.Emitter(opts);
}

Filter.prototype = {

  emit: function (event, then, callback) {
    var scope = events.toScope([event], this);
    var i = this._emitter.iterator(scope.event, scope);
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
  },

  removeMatchingFilters: function (event) {
    this._emitter.removeMatchingListeners(event);
  },

  filterIterator: function (event, opts) {
    return this._emitter.iterator(event, opts);
  },

  filters: function (event, opts) {
    return this._emitter.listeners(event, opts);
  }

};

exports.Filter = Filter;
exports.toScope = events.toScope;
