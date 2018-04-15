/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const parseProperties = require('./parse-properties');

describe('Pick properties', function () {
  it('should pick them', function () {
    const contentObject = {
      text: 'Возможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\n<!-- {"zok": "zak", "lis": 879} -->\nИ в нем как книжку.',
    };
    Object.assign(contentObject, parseProperties(contentObject));
    assert.equal(contentObject.zok, 'zak');
    assert.equal(contentObject.lis, 879);
  });

  it('should pick not very good', function () {
    const contentObject = {
      text: 'Возможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\n<!--{"zok": "zak", "lis": 88}-->\nИ в нем как книжку.',
    };
    Object.assign(contentObject, parseProperties(contentObject));
    assert.equal(contentObject.zok, 'zak');
    assert.equal(contentObject.lis, 88);
    assert.ok(contentObject.text);
  });
});
