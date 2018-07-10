'use strict';

const Where = require('./where');
const What = require('./what');
const scheme = require('./backend/backend.scheme');
const mockBackend = require('./backend/backend.mock');
const ftpBackend = require('./backend/backend.ftp');

const supportedBackendTypes = {
  mock: mockBackend,
  ftp: ftpBackend
};

function checkTypeSupport (type) {
  if (!supportedBackendTypes[type]) {
    throw new Error('Backend type "' + type + '" not supported');
  }
}

class Backend extends Where {
  constructor (options) {
    super(options);
    scheme.check(options);
    checkTypeSupport(options.type);
    this.driver = new supportedBackendTypes[options.type](options[options.type]);
  }

  push (items) {
    // Wrap into array if needed
    if (!(items instanceof Array)) {
      items = [items];
    }
    // check items in batch
    items.forEach(what => {
      if (!(what instanceof What)) {
        throw new Error(`Backend Push: invalid item: ${JSON.stringify(what)}`);
      }
    });
    // do pushing with current driver
    return this.driver.push(items);
  }

  list (path) {
    return this.driver.list(path);
  }
}

module.exports = Backend;
