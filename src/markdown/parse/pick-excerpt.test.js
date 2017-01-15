/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const pickExcerpt = require('./pick-excerpt');

describe('Pick excerpt', function () {
  it('should return with ellipsis', function () {
    const contentObject = {
      content: 'Возможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\nИ в нем как книжку.',
    };
    const newContentObject = Object.assign(contentObject, pickExcerpt(contentObject));
    assert.equal(newContentObject.excerpt, 'Возможно хранить в нём (индекс). Заметки там...');
  });

  it('should return without ellipsis', function () {
    const contentObject = {
      content: 'Возможно хранить в нём (индекс).',
    };
    const newContentObject = Object.assign(contentObject, pickExcerpt(contentObject));
    assert.equal(newContentObject.excerpt, 'Возможно хранить в нём (индекс).');
  });

  it('should do fine with invalid', function () {
    const contentObject = {
      content: '',
    };
    const newContentObject = Object.assign(contentObject, pickExcerpt(contentObject));
    assert.equal(newContentObject.excerpt, '');
  });

  it('should do fine with strange', function () {
    const contentObject = {
      content: '.',
    };
    const newContentObject = Object.assign(contentObject, pickExcerpt(contentObject));
    assert.equal(newContentObject.excerpt, '.');
  });
});
