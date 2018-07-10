const assert = require('assert');
const PromiseFtp = require('promise-ftp');

const Backend = require('./backend');
const What = require('./what');

//
// Bare
//

describe('Backend', function () {
  it('exists', function () {
    const backend = new Backend({ type: 'mock', mock: {} });
    assert.ok(backend);
    assert.strictEqual(backend.driver.type, 'mock');
  });
});

//
// FTP
//

const credentials = {
  hostname: 'u49801.netangels.ru',
  pathname: '.minota',
  username: 'u49801_sandbox',
  password: 'RCuddHCFgqFoK7b'
}

// Create tree

function remoteCreateTree (nodelist, remote) {
  //
}

// Get tree

function remoteListTree (remote, path) {
  const ftp = new PromiseFtp();
  return new Promise((resolve, reject) => {
    ftp.connect({
      host: remote.hostname,
      user: remote.username,
      password: remote.password
    }).then(() => {
      return ftp.list(path);
    }).then(list => {
      ftp.end();
      resolve(list);
    }).catch(error => {
      ftp.end();
      reject(error);
    });
  });
}

// Debug

describe('FTP Backend', function () {

  afterEach('clear', function (done) {
    this.timeout(0);
    const ftp = new PromiseFtp();
    ftp.connect({
      host: credentials.hostname,
      user: credentials.username,
      password: credentials.password
    })
    .then(() => ftp.rmdir(credentials.pathname, true))
    .then(() => {
      ftp.end();
      done();
    }).catch(error => {
      ftp.end();
      if (error.code === 550) {
        done();
      } else {
        done(error);
      }
    });
  });


  it('exists', function () {
    const backend = new Backend({
      type: 'ftp',
      ftp: credentials
    });
    assert.strictEqual(backend.driver.type, 'ftp');
  });

  it('throws on unsupported type', function () {
    assert.throws(function () {
      new Backend({ type: 'zok', zok: {} });
    });
  });

  it('throws if type options not provided', function () {
    assert.throws(function () {
      new Backend({ type: 'ftp' });
    });
  });

  it('throw if try to push with invalid items', function () {
    const backend = new Backend({
      type: 'mock',
      mock: {}
    });
    assert.throws(function () {
      backend.push([new What({
        content: 'Good context without context'
      })]);
    });
    assert.throws(function () {
      backend.push({
        context: ['c']
      });
    });
    assert.throws(function () {
      backend.push([new What({
        context: ['not']
      })]);
    });
    assert.throws(function () {
      backend.push([{
        content: 'No class',
        context: ['not']
      }]);
    });
    assert.doesNotThrow(function () {
      backend.push([new What({
        content: 'Some content',
        context: ['context']
      })]);
    });
  });

  it('really pushes something to server', function (done) {
    this.timeout(10000);
    const backend = new Backend({
      type: 'ftp',
      ftp: credentials
    });
    backend.push([
      new What({ content: 'Content #1', context: ['test1'] }),
      new What({ content: 'Content #2', context: ['test2'] }),
      new What({ content: 'Content #3', context: ['test3'] }),
      new What({ content: 'Content #4', context: ['test', 'test2'] })
    ]).then(() => {
      remoteListTree(credentials, credentials.pathname).then(list => {
        assert.strictEqual(list.length, 4);
        done();
      }).catch(error => {
        done(error);
      });
    }).catch(error => {
      done(error);
    });
  });

  it('really gets whats there on server', function (done) {
    this.timeout(10000);
    const backend = new Backend({
      type: 'ftp',
      ftp: credentials
    });
    backend.push([
      new What({ content: 'Content #1', context: ['test1'] }),
      new What({ content: 'Content #3', context: ['test3'] }),
      new What({ content: 'Content #4', context: ['test', 'test2'] })
    ]).then(() => {
      backend.list().then(list => {
        assert.strictEqual(list.length, 3);
        done();
      }).catch(error => {
        done(error);
      });
    }).catch(error => {
      done(error);
    });
  });
});
