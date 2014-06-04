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


function listeners(self) {
  self._newListener = function (event, fn) {
    self.emit({
      event    : 'newFilter',
      matchers : false,
      args     : [event, fn]
    });
  };
  self._removeListener = function (event, fn) {
    if (event !== 'newListener' && event !== 'removeListener') {
      self.emit({
        event    : 'removeFilter',
        matchers : false,
        args     : [event, fn]
      });
    }
  };
  self._emitter.on('newListener', self._newListener);
  self._emitter.on('removeListener', self._removeListener);
}


function Filter() {
  this._emitter = new Emitter();
  listeners(this);
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

  addFilter: function (name, fn) {
    this._emitter.on(name, fn);
  },

  filterOnce: function (name, fn) {
    this._emitter.once(name, fn);
  },

  removeFilter: function (name, fn) {
    this._emitter.removeListener(name, fn);
  },

  removeAllFilters: function (name) {
    this._emitter.removeAllListeners(name);
    listeners(this);
  },

  filters: function (name, opts) {
    var newListener = this._newListener;
    var removeListener = this._removeListener;
    return this._emitter.listeners(name, opts).filter(function (fn) {
      return fn !== newListener && fn !== removeListener;
    });
  }

};

exports.Filter = Filter;
