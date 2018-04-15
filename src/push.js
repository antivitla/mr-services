'use strict';

const scheme = require('./push.scheme');

function push (options) {
  // Имитация типизации
  scheme.check(options);
  return true;
}

module.exports = push;
