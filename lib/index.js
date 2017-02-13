/**
 * @fileoverview Lint JavaScript in block comment code blocks
 * @author Ilya Radchenko
 */
'use strict';

var processor = require('./processors/js');

module.exports.processors = {
  '.js': processor
};

