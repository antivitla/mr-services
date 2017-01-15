/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const es = require('event-stream');
const Transform = require('stream').Transform;
const contentDelimiter = require('./content-delimiter');

describe('Split', function () {
  it('into notes and clean', function (done) {
    let count = 0;
    es.readArray(['# Header 1\r\n  \r\n Hello, world  \r\n\r\n* * * \r\n \r\n# Header 2\r\n\r\nAnother note.\r\nEven longer.'])
      .pipe(es.split(contentDelimiter))
      .pipe(new Transform({
        transform(note, encoding, next) {
          count += 1;
          next();
        },
      }))
      .pipe(es.wait(function () {
        assert.equal(count, 2);
        done();
      }));
  });
});
