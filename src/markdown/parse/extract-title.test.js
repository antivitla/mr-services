/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const extractTitle = require('./extract-title');

describe('Extract title', function () {
  it('should work', function () {
    const contentObject = {
      content: '# 16 ноября 2017, PDF - база данных\r\n\r\nВозможно хранить в нём (индекс). http://pdfkit.org/\r\nЗаметки там имеют айди. И в нем как книжку.',
    };
    const newContentObject = Object.assign(contentObject, extractTitle(contentObject));
    assert.equal(newContentObject.title, '16 ноября 2017, PDF - база данных');
    assert.equal(newContentObject.content, 'Возможно хранить в нём (индекс). http://pdfkit.org/\r\nЗаметки там имеют айди. И в нем как книжку.');
  });
  it('should go fine with bad title 1', function () {
    const contentObject = {
      content: '# \n\nВозможно хранить в нём (индекс). http://pdfkit.org/\nЗаметки там имеют айди. И в нем как книжку.',
    };
    const newContentObject = Object.assign(contentObject, extractTitle(contentObject));
    assert.equal(newContentObject.title, '');
    assert.equal(newContentObject.content, 'Возможно хранить в нём (индекс). http://pdfkit.org/\nЗаметки там имеют айди. И в нем как книжку.');
  });
  it('should go fine with bad title 2', function () {
    const contentObject = {
      content: '# ,,\r\n\r\nВозможно хранить в нём (индекс). http://pdfkit.org/\r\nЗаметки там имеют айди. И в нем как книжку.',
    };
    const newContentObject = Object.assign(contentObject, extractTitle(contentObject));
    assert.equal(newContentObject.title, ',,');
    assert.equal(newContentObject.content, 'Возможно хранить в нём (индекс). http://pdfkit.org/\r\nЗаметки там имеют айди. И в нем как книжку.');
  });
  it('should ignore no-title', function () {
    const contentObject = {
      content: '#,,\r\n\r\nВозможно хранить в нём (индекс). http://pdfkit.org/\r\nЗаметки там имеют айди. И в нем как книжку.',
    };
    const newContentObject = Object.assign(contentObject, extractTitle(contentObject));
    assert.equal(newContentObject.title, '');
    assert.equal(newContentObject.content, '#,,\r\n\r\nВозможно хранить в нём (индекс). http://pdfkit.org/\r\nЗаметки там имеют айди. И в нем как книжку.');
  });

  it('should respect windows EOL', function () {
    const contentObject = {
      content: '# Окончания строк\n\nВозможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\nИ в нем как книжку.',
    };
    const newContentObject = Object.assign(contentObject, extractTitle(contentObject));
    assert.equal(newContentObject.title, 'Окончания строк');
    assert.equal(newContentObject.content, 'Возможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\r\nИ в нем как книжку.');
  });

  it('should respect unix EOL', function () {
    const contentObject = {
      content: '# Окончания строк\n\nВозможно хранить в нём (индекс).\nЗаметки там имеют айди.\n\nИ в нем как книжку.',
    };
    const newContentObject = Object.assign(contentObject, extractTitle(contentObject));
    assert.equal(newContentObject.title, 'Окончания строк');
    assert.equal(newContentObject.content, 'Возможно хранить в нём (индекс).\nЗаметки там имеют айди.\n\nИ в нем как книжку.');
  });
});
