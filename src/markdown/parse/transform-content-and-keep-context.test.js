/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const transformContentAndKeepContext = require('./transform-content-and-keep-context');

function transformExample(contentObject) {
  return {
    makabot: `Marmelad ${contentObject.makabot}`,
    date: contentObject.date.setMonth(1),
  };
}

describe('Transfrom through context', function () {
  it('should keep context while transforming', function () {
    const contentObject = {
      content: 'Возможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\n<!-- {"zok": "zak", "lis": 879} -->\nИ в нем как книжку.',
    };
    const contextObject = {
      makabot: 'Vitla',
      date: new Date(),
    };
    Object.assign(contentObject, transformContentAndKeepContext({
      contentObject,
      contextObject,
      keys: ['makabot', 'date'],
      transform: transformExample,
    }));
    assert.equal(contextObject.makabot, 'Marmelad Vitla');
    assert.equal(contentObject.makabot, 'Marmelad Vitla');
    assert.equal((new Date(contentObject.date)).getMonth(), 1);
  });
});
