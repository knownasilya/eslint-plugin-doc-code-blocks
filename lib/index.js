/**
 * @fileoverview Lint JavaScript in block comment code blocks
 * @author Ilya Radchenko
 */
'use strict';

module.exports.processors = {
  '.js': require('./processors/js')
};

