'use strict';

const check = require('./check');
const What = require('./what');
// const Where = require('./where');

const template = {
  content: '',
  context: []
};

module.exports = {
  template: template,
  check: function (options) {
    check({
      options: options,
      scheme: template,
      label: 'What'
    });
  }
};
