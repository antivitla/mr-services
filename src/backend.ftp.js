'use strict';

const Where = require('./where');

class FtpBackend extends Where {
  constructor () {
    super();
    this.type = 'ftp';
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

/*
const eol = require('os').EOL;
const PromiseFtp = require('promise-ftp');

const scheme = require('./backend.ftp.scheme');
const Where = require('./where');
const What = require('./what');

class FtpBackend extends Where {
  constructor (options) {
    scheme.check(options);
    super(options);
    this.ftp = new PromiseFtp();
    this.credentials = options;
  }

  push (items) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  pushz (what) {
    if (what instanceof What) {
      what = [what];
    } else if (!(what instanceof Array)) {
      throw new Error('FtpBackend push invalid arguments' + what);
    }

    what.forEach(item => {
      //
    });

    return new Promise((resolve, reject) => {
      const path = `${this.credentials.pathname}/${what.context.slice(0, -1).join('/')}`;
      const filename = what.context.slice(-1);
      const filenameWithPath = `${path}/${filename}.md`;
      const ifEOLNeeded = what.content.slice(-1) !== eol ? eol : '';
      const buffer = Buffer.from(what.content + ifEOLNeeded);

      this.ftp.connect({
        host: this.credentials.hostname,
        user: this.credentials.username,
        password: this.credentials.password
      }).then(welcome => {
        return this.ftp.append(buffer, filenameWithPath);
      }).then(result => {
        // Success close
        this.ftp.end().then((r) => {
          console.log('1 resolve', r);
          resolve(true);
        });
        // resolve(result);
      }).catch(error => {
        if (error.code === 550) {
          // if path do not exist, create and try again
          return this.ftp.mkdir(path, true)
        } else {
          // Error close
          this.ftp.end().then((r) => {
            console.log('1 reject', r);
            reject(error);
          });
        }
      }).then(result => {
        return this.ftp.put(buffer, filenameWithPath);
      }).then(result => {
        // Success close
        this.ftp.end().then((r) => {
          console.log('2 resolve', r);
          resolve(true);
        });
      }).catch(error => {
        // Error close
        this.ftp.end().then((r) => {
          console.log('2 reject', r);
          reject(error);
        });
      });
    });
  }

}

*/

module.exports = FtpBackend;
