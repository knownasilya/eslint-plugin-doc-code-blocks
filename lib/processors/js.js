'use strict';

var extract = require('extract-comments');
var lineColumn = require('line-column');
var blockComments = [];

function preprocess(text, fileName) {
  blockComments = extract.block(text);

  var codeBlocks = blockComments.reduce(function (all, item) {
    var blocks = extractCodeBlocks(item.value);
    var blockValues = blocks.map(function (item) {
      return item.value;
    });

    item.codeBlocks = blocks;
    all = all.concat(blockValues);

    return all;
  }, []);

  return codeBlocks;
}

function postprocess(messages, fileName) {
  var keep = [];
  var codeBlocksProcessed = 0;

  blockComments.forEach(function (item) {
    var numCodeBlocks = item.codeBlocks.length;

    if (!numCodeBlocks) {
      return;
    }

    var baseLineOffset = item.loc.start.line;
    var baseColumnOffset = item.loc.start.column;
    var blockIndex = 0 + codeBlocksProcessed;

    for (; blockIndex < numCodeBlocks; blockIndex++) {
      var baseIndex = blockIndex - codeBlocksProcessed;
      var block = item.codeBlocks[baseIndex];
      var blockMessages = messages[blockIndex];
      // minus 1 because ```[type] are not included
      var lineOffset = baseLineOffset + block.loc.line - 1;
      var columnOffset = baseColumnOffset + block.loc.col - 1;

      if (blockMessages) {
        blockMessages.forEach(function (message) {
          message.line += lineOffset;
          message.column += columnOffset;
          keep.push(message);
        });
      }
    }

    codeBlocksProcessed++;
  });
console.log(keep);

  return keep;
}

function extractCodeBlocks(commentBlock) {
  var code = [];
  var regex = /(?:```)(\S*)(?:\s*)([\s\S]+?)(?:```)/gm;
  var match;

  while ((match = regex.exec(commentBlock)) !== null) {
    var validType = typeFilter(match[1]);

    if (validType) {
      var col = lineColumn(commentBlock);
      var loc = col.fromIndex(match.index);

      code.push({ value: match[2], loc: loc });
    }
  }

  return code;
}

function typeFilter(type) {
  var normalized = type.toLowerCase().trim();

  if (!normalized) {
    return false;
  }

  return normalized.indexOf('js') !== -1 || normalized.indexOf('javascript') !== -1;
}

module.exports = {
  preprocess: preprocess,
  postprocess: postprocess
};
