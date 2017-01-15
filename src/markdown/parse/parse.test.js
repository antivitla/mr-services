/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const parse = require('./parse');
const moment = require('moment');

describe('Parse', function () {
  it('parses note string', function (done) {
    const note = 'Привет, как дила?';
    parse(note).then(function (index) {
      assert.ok(index[0]);
      assert.ok(index[0].date);
      assert.ok(index[0].id);
      assert.equal(index[0].content, note);
      done();
    });
  });

  it('parses note with context', function (done) {
    const note = 'Заметка';
    const date = moment().toISOString();
    parse(note, { date }).then(function (index) {
      assert.ok(index[0]);
      assert.ok(index[0].id);
      assert.equal(index[0].date, date);
      assert.equal(index[0].content, note);
      done();
    });
  });
});
