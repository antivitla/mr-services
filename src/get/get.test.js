/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const fs = require('fs-extra-promise');
const md = require('../md/md');
const save = require('../save/save');
const get = require('../get/get');

console.log('gettest md', get.md);

describe('Get notes', function () {
  it('get note by id', function (done) {
    // create and save note
    const note = 'My note, hello world';
    let id;
    md.parse(note)
      .then((index) => {
        // save it's id somehow
        id = index[0].id;
        // save it now
        return save(index);
      })
      .then(() => get({ id }))
      .then((item) => {
        assert.equal(item[0].content, note);
        done();
      })
      .catch((error) => {
        console.log(error);
        done();
      });
  });

  it('get all notes', function (done) {
    const n1 = 'My note No. 1';
    const n2 = 'My note No. 2';
    const n3 = 'My note No. 3';
    md.parse(n1)
      .then(index => save(index))
      .then(() => md.parse(n2))
      .then(index => save(index))
      .then(() => md.parse(n3))
      .then(index => save(index))
      .then(() => get())
      .then((notes) => {
        assert.ok(notes.length >= 3);
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  after(function (done) {
    fs.removeAsync('.mr').then(() => {
      done();
    });
  });
});
