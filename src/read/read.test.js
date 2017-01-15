/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const read = require('./read');

describe('Read from database', function () {
  it('read exists', function () {
    assert.equal(typeof read, 'function');
  });
});
