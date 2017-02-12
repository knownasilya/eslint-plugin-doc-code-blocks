'use strict';

var extract = require('extract-comments');
var blockComments = [];

function preprocess(text, fileName) {
  blockComments = extract.block(text);

  var codeBlocks = blockComments.reduce(function (all, item) {
    var blocks = extractCodeBlocks(item.value);

    all = all.concat(blocks);

    return all;
  }, []);

  return codeBlocks;
}

function postprocess(messages, fileName) {
  var keep = [];

  blockComments.forEach(function (item, index) {
    var start = item.loc.start;
    var lineOffset = start.line + 1; // 1 more for codeblock start
    var columnOffset = item.loc.column;
    var blockMessages = messages[index];

    if (blockMessages) {
      blockMessages.forEach(function (message) {
        message.line += lineOffset;
        message.column += columnOffset;
        keep.push(message);
      });
    }
  });

  return keep;
}

function extractCodeBlocks(commentBlock) {
  var code = [];
  var regex = /(?:```)(\S*)(?:\s*)([\s\S]+?)(?:```)/gm;
  var match;

  while ((match = regex.exec(commentBlock)) !== null) {
    var validType = typeFilter(match[1]);
    if (validType) {
      code.push(match[2]);
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
