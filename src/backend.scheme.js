'use strict';

const check = require('./check');

const template = {
  type: 'type'
};

module.exports = {
  template: template,
  check: function (options) {
    check({
      options: options,
      scheme: template,
      label: 'backend'
    });
    if (!options[options.type]) {
      throw new Error('Backend constructor invalid or missing "' + options.type + '" options: ' + JSON.stringify(options));
    }
  },
  mockType: 'mock'
};
