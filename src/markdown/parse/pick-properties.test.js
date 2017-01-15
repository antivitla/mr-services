/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const pickProperties = require('./pick-properties');

describe('Pick properties', function () {
  it('should pick them', function () {
    const contentObject = {
      content: 'Возможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\n<!-- {"zok": "zak", "lis": 879} -->\nИ в нем как книжку.',
    };
    const newContentObject = Object.assign({}, contentObject, pickProperties(contentObject));
    // console.log(pickProperties(contentObject));
    assert.equal(newContentObject.zok, 'zak');
    assert.equal(newContentObject.lis, 879);
  });

  it('should pick not very good', function () {
    const contentObject = {
      content: 'Возможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\n<!--{"zok": "zak", "lis": 88}-->\nИ в нем как книжку.',
    };
    const newContentObject = Object.assign({}, contentObject, pickProperties(contentObject));
    // console.log(pickProperties(contentObject));
    assert.equal(newContentObject.zok, 'zak');
    assert.equal(newContentObject.lis, 88);
    assert.ok(newContentObject.content);
  });
});
