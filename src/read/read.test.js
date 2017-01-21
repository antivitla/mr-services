/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const read = require('./read');
const fs = require('fs-extra-promise');
const tempfile = require('tempfile');

describe('Read from input', function () {
  this.timeout(3000);
  it('gets data from spawned process', function (done) {
    const note = 'Текст заметки...';
    read.input(note)
      .then((text) => {
        assert.equal(text, note);
        done();
      })
      .catch((error) => {
        assert.ok(false);
        done();
      });
  });
});

describe('Read from file', function () {
  it('get data from file', function (done) {
    const noteText = 'Как делишки, бро?';
    // create and save file
    const filename = tempfile('.md');
    fs.outputFileAsync(filename, noteText, { encoding: 'utf8' })
      .then(function () {
        // read it through our module
        read.file(filename)
          .then(function (text) {
            assert.equal(text, noteText);
            done();
          });
      });
  });
});
