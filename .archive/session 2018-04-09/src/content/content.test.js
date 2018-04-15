/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const Content = require('./content');

describe('Content', function () {
  it('can be created', function () {
    const content = new Content();
    assert.ok(content);
  });

  it('accept id, date and text', function () {
    const date = require('moment')(new Date()).toISOString();
    const id = require('node-uuid').v1();
    const text = 'Моя маленькая заметочка';
    const content = new Content({ date, id, text });
    assert.deepEqual(content, { date, id, text });
  });

  // it('Write', function (done) {
  //   const myContent = 'Моя маленькая заметочка';
  //   db.write({ content: myContent })
  //   .then(id => db.read({ id }))
  //   .then((dbContent) => {
  //     assert.equal(myContent, dbContent);
  //     done();
  //   });
  // });

  // it('Write with id', function (done) {
  //   const myContent = 'Другая моя заметочка';
  //   const myId = uuid.v1();
  //   db.write({ id: myId, content: myContent })
  //   .then((id) => {
  //     assert.equal(myId, id);
  //     return db.read({ id });
  //   })
  //   .then((dbContent) => {
  //     assert.equal(myContent, dbContent);
  //     done();
  //   });
  // });

  // after(function (done) {
  //   fs.removeAsync('.mr')
  //   .then(() => {
  //     done();
  //   });
  // });
});
