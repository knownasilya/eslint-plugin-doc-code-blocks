'use strict';

var test = require('tape');
var CLIEngine = require('eslint').CLIEngine;
var plugin = require('../');

var cli = new CLIEngine({
    envs: ['browser'],
    extensions: ['js'],
    ignore: false,
    //extends: ['plugin:doc-code-blocks/all'],
    rules: {
      'eol-last': 2,
      'no-console': 2,
      'no-undef': 2,
      'quotes': 2,
      'spaced-comment': 2,
      //'doc-code-blocks/quotes': ['error', 'single']
    },
    useEslintrc: false
});

cli.addPlugin('doc-code-blocks', plugin);

test('single comment with block - failing block', function (t) {
  var shortText = [
    '/*',
    '```js',
    'var test = "a";',
    'console.log(test);',
    '```',
    '*/',
  ].join('\n');
  var report = cli.executeOnText(shortText, 'test.js');

  t.equal(report.results.length, 1);
  t.equal(report.results[0].messages.length, 1);
  t.equal(report.results[0].messages[0].message, 'Unexpected console statement.');
  t.equal(report.results[0].messages[0].line, 4);
  t.end();
});

test('single comment with block - passing block', function (t) {
  var shortText = [
    '/*',
    '```js',
    'function blah(test) {',
    ' return test;',
    '}',
    '```',
    '*/',
  ].join('\n');
  var report = cli.executeOnText(shortText, 'test.js');

  t.equal(report.results.length, 1);
  t.equal(report.results[0].messages.length, 0);
  t.end();
});

test('single comment - multiple blocks', function (t) {
  var fixture = [
    '/*',
    'some text',
    '',
    '```js',
    'var test = "a";',
    'console.log(test);',
    '```',
    '',
    'some text',
    'more text',
    '',
    '```app/path/file.js',
    'function blah(test) {',
    '  console.log(test);',
    '}',
    '```',
    '',
    '*/'
  ].join('\n');
  var report = cli.executeOnText(fixture, 'test.js');

  t.equal(report.results.length, 1);
  t.equal(report.results[0].messages.length, 2);
  t.equal(report.results[0].messages[0].message, 'Unexpected console statement.');
  t.equal(report.results[0].messages[0].line, 6);
  t.equal(report.results[0].messages[1].message, 'Unexpected console statement.');
  t.equal(report.results[0].messages[1].line, 14);
  t.end();
});

test('multiple comments with blocks - one failing block', function (t) {
  var shortText = [
    '/* hi */',
    '/*',
    '```js',
    'var test = "a";',
    'console.log(test);',
    '```',
    'some test',
    '*/',
    '',
    '/*',
    '```js',
    'function test(val) {',
    ' return val;',
    '}',
    '```',
    '*/'
  ].join('\n');
  var report = cli.executeOnText(shortText, 'test.js');

  t.equal(report.results.length, 1);
  t.equal(report.results[0].messages.length, 1);
  t.equal(report.results[0].messages[0].message, 'Unexpected console statement.');
  t.equal(report.results[0].messages[0].line, 5);
  t.end();
});
