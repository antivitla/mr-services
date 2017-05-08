/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const parseTitle = require('./parse-title');

describe('Extract title', function () {
  it('should work', function () {
    const contentObject = {
      text: '# 16 ноября 2017, PDF - база данных\r\n\r\nВозможно хранить в нём (индекс). http://pdfkit.org/\r\nЗаметки там имеют айди. И в нем как книжку.',
    };
    Object.assign(contentObject, parseTitle(contentObject));
    assert.equal(contentObject.title, '16 ноября 2017, PDF - база данных');
  });
  it('should go fine with bad title 1', function () {
    const contentObject = {
      text: '# \n\nВозможно хранить в нём (индекс). http://pdfkit.org/\nЗаметки там имеют айди. И в нем как книжку.',
    };
    Object.assign(contentObject, parseTitle(contentObject));
    assert.equal(contentObject.title, '');
  });
  it('should go fine with bad title 2', function () {
    const contentObject = {
      text: '# ,,\r\n\r\nВозможно хранить в нём (индекс). http://pdfkit.org/\r\nЗаметки там имеют айди. И в нем как книжку.',
    };
    Object.assign(contentObject, parseTitle(contentObject));
    assert.equal(contentObject.title, ',,');
  });
  it('should ignore no-title', function () {
    const contentObject = {
      text: '#,,\r\n\r\nВозможно хранить в нём (индекс). http://pdfkit.org/\r\nЗаметки там имеют айди. И в нем как книжку.',
    };
    Object.assign(contentObject, parseTitle(contentObject));
    assert.ok(!contentObject.title);
  });

  it('should respect windows EOL', function () {
    const contentObject = {
      text: '# Окончания строк\n\nВозможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\nИ в нем как книжку.',
    };
    Object.assign(contentObject, parseTitle(contentObject));
    assert.equal(contentObject.title, 'Окончания строк');
  });

  it('should respect unix EOL', function () {
    const contentObject = {
      text: '# Окончания строк\n\nВозможно хранить в нём (индекс).\nЗаметки там имеют айди.\n\nИ в нем как книжку.',
    };
    Object.assign(contentObject, parseTitle(contentObject));
    assert.equal(contentObject.title, 'Окончания строк');
  });
});
