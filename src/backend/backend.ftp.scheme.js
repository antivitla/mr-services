'use strict';

const check = require('../check');

const template = {
  hostname: 'host',
  pathname: 'path',
  username: 'user',
  password: '***'
};

module.exports = {
  template: template,
  check: function (options) {
    check({
      options: options,
      scheme: template,
      label: 'FtpBackend'
    });
  }
};
