const assert = require('assert');
// const axios = require('axios');
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
  pathname: 'mr-woodman.ru/www/sandbox/.minota' + parseInt(Math.random() * 10000, 10),
  username: 'u49801',
  password: 'zsuydhh5bh'
}

describe('FTP Backend', function () {
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

  it('pushes something to server', function (done) {
    const backend = new Backend({
      type: 'ftp',
      ftp: credentials
    });
    const ftp = new PromiseFtp();
    backend.push([
      new What({ content: 'Content #1', context: ['test1'] }),
      new What({ content: 'Content #2', context: ['test2'] })
    ]).then(() => {
      // success. now check real ftp
      return ftp.connect({
        host: credentials.hostname,
        user: credentials.username,
        password: credentials.password
      });
    }).then(() => {
      return ftp.listSafe(credentials.path);
    }).then(list => {
      console.log(list);
      // check list
      assert.ok(list);
      // anyway finish
      ftp.end();
      done();
    }).catch(error => {
      // fail. something went wrong
      // finish anyway
      ftp.end();
      done(error);
    });

  });
});

  // describe('FTP', function () {
  //   afterEach('clear', function (done) {
  //     this.timeout(0);
  //     const ftp = new PromiseFtp();
  //     ftp.connect({
  //       host: ftpSandboxCredentials.hostname,
  //       user: ftpSandboxCredentials.username,
  //       password: ftpSandboxCredentials.password
  //     })
  //     .then(() => ftp.rmdir(ftpSandboxCredentials.pathname, true))
  //     .then(() => {
  //       ftp.end();
  //       done();
  //     }).catch(error => {
  //       ftp.end();
  //       done(error);
  //     });
  //   });

  //   before(function () {
  //     ftpBackend = new FtpBackend(ftpSandboxCredentials);
  //     ftp = new PromiseFtp();
  //   });

  //   it('can be pushed something', function (done) {
  //     this.timeout(5000);

  //     ftpBackend.push({
  //       content: 'Some content',
  //       context: ['test']
  //     })
  //     .then(() => {
  //       return ftpBackend.push({
  //         content: 'Other content',
  //         context: ['second test']
  //       });
  //     }).then(() => {
  //       return ftp.connect({
  //         host: ftpSandboxCredentials.hostname,
  //         user: ftpSandboxCredentials.username,
  //         password: ftpSandboxCredentials.password
  //       });
  //     }).then(() => {
  //       return ftp.listSafe(ftpSandboxCredentials.pathname);
  //     }).then(list => {
  //       ftp.end();
  //       const items = list.map(item => item.name).sort();
  //       assert.strictEqual(items.length, 2);
  //       assert.strictEqual(items[0], 'second test.md');
  //       assert.strictEqual(items[1], 'test.md');
  //       done();
  //     }).catch(error => {
  //       ftp.end()
  //       done(error);
  //     });
  //   });

  //   // it('can push and list pushed', function (done) {
  //   //   this.timeout(10000);
  //   //   ftpBackend.push({})
  //   // });


  // }); // FTP
// }); // Backend
