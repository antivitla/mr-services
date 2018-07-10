'use strict';

const Where = require('../where');

class MockBackend extends Where {
  constructor () {
    super();
    this.type = 'mock';
  }

  push (items) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  pull (items) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  list (items) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}

module.exports = MockBackend;
