/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const fs = require('fs-extra-promise');
const db = require('./db');
const uuid = require('node-uuid');

describe('Read/Write database', function () {
  it('Write', function (done) {
    const myContent = 'Моя маленькая заметочка';
    db.write({ content: myContent })
    .then(id => db.read({ id }))
    .then((dbContent) => {
      assert.equal(myContent, dbContent);
      done();
    });
  });

  it('Write with id', function (done) {
    const myContent = 'Другая моя заметочка';
    const myId = uuid.v1();
    db.write({ id: myId, content: myContent })
    .then((id) => {
      assert.equal(myId, id);
      return db.read({ id });
    })
    .then((dbContent) => {
      assert.equal(myContent, dbContent);
      done();
    });
  });

  after(function (done) {
    fs.removeAsync('.mr')
    .then(() => {
      done();
    });
  });
});
