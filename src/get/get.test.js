/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const fs = require('fs-extra-promise');
const md = require('../markdown/markdown');
const save = require('../save/save');
const get = require('../get/get');

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
      .then(() => get(id))
      .then((item) => {
        assert.equal(item[0].content, note);
        done();
      })
      .catch((error) => {
        console.log(error);
        done();
      });
  });

  after(function (done) {
    fs.removeAsync('.mr').then(() => {
      done();
    });
  });
});
