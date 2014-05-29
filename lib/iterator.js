/*
 * glob-filter.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var inherits = require('inherits');
var MinIterator = require('min-iterator');


function Iterator(i, f) {
  this._i = i;
  this._f = f;
}

inherits(Iterator, MinIterator);

Iterator.prototype.next = function () {
  var f = this._i.next();
  if (!f) {
    f = this._f;
    this._f = undefined;
  }
  return f;
};


exports.Iterator = Iterator;
