'use strict';

const async = require('async');
const Where = require('../where');
const PromiseFtp = require('promise-ftp');
const EOL = require('os').EOL;

const middleware = {
  justPut: function (session, item, i, arr) {
    // Just put files over FTP
    // if not found path, mkdir it
    const path = session.path + '/' + item.context.slice(0, -1).join('/');
    const filename = item.context.slice(-1)[0];
    const buffer = Buffer.from(item.content +
      (item.content.slice(-1)[0] !== EOL ? EOL : ''));
    const ftp = session.ftp;
    const data = session.data.slice(0);
    const promise = session.promise.then(() => {
      return ftp.put(buffer, `${path}/${filename}.md`);
    }).catch(error => {
      if (error.code === 550) {
        return ftp.mkdir(path, true).then(() => {
          return ftp.put(buffer, `${path}/${filename}.md`);
        }).catch(error => {
          data.push(error);
          return true;
        });
      } else {
        data.push(error);
        return true;
      }
    });
    return {
      ftp: ftp,
      path: session.path,
      data: data,
      promise: promise
    };
  }
}

class FtpBackend extends Where {
  constructor (credentials) {
    super();
    this.type = 'ftp';
    this.credentials = credentials;
  }

  push (items) {
    return new Promise((resolve, reject) => {
      // You need to setup tricky async cycle
      // through list of items to process them
      // (push to backend and do smth)
      // First - connect to ftp
      const ftp = new PromiseFtp();
      // Then populate promise chain
      const result = items.reduce(middleware.justPut, {
        ftp: ftp,
        path: this.credentials.pathname,
        data: [],
        promise: ftp.connect({
          host: this.credentials.hostname,
          user: this.credentials.username,
          password: this.credentials.password
        })
      });
      result.promise.then((r) => {
        ftp.end();
        resolve(result.data);
      }).catch(error => {
        ftp.end();
        reject(error);
      });
    });
  }

  pull (items) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  list (path) {
    const ftp = new PromiseFtp();
    return new Promise((resolve, reject) => {
      ftp.connect({
        host: this.credentials.hostname,
        user: this.credentials.username,
        password: this.credentials.password
      }).then((d) => {
        return ftp.list(path || this.credentials.pathname);
      }).then(list => {
        ftp.end();
        resolve(list);
      }).catch(error => {
        ftp.end();
        reject(error);
      });
    });
  }

  search (items) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}

module.exports = FtpBackend;
