'use strict';

const scheme = require('./what.scheme');

class What {
  constructor (options = {
    content: '',
    context: []
  }) {
    scheme.check(options);
    this.content = options.content;
    this.context = options.context || [];
  }
}

module.exports = What;
