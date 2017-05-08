/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const parseExcerpt = require('./parse-excerpt');

describe('Pick excerpt', function () {
  it('should return excerpt', function () {
    const contentObject = {
      text: 'Возможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\nИ в нем как книжку.',
    };
    Object.assign(contentObject, parseExcerpt(contentObject, 10));
    assert.equal(contentObject.excerpt, 'Возможно х');
  });

  it('should return short', function () {
    const contentObject = {
      text: 'Возможно хранить в нём (индекс).',
    };
    Object.assign(contentObject, parseExcerpt(contentObject, 40));
    assert.equal(contentObject.excerpt, 'Возможно хранить в нём (индекс).');
  });

  it('should do fine with invalid', function () {
    const contentObject = {
      text: '',
    };
    Object.assign(contentObject, parseExcerpt(contentObject));
    assert.ok(!contentObject.excerpt);
  });

  it('should do fine with strange', function () {
    const contentObject = {
      text: '.',
    };
    Object.assign(contentObject, parseExcerpt(contentObject));
    assert.equal(contentObject.excerpt, '.');
  });
});
