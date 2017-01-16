/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const read = require('./read');

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
        console.log(error);
        assert.ok(false);
        done();
      });
  });
});
