'use strict';

const check = require('./check');

const template = {
  options: {},
  scheme: {},
  label: ''
};

module.exports = {
  template: template,
  check: function (options) {
    check({
      options: options,
      scheme: template,
      label: 'check'
    });
  }
};
