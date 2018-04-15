/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const moment = require('moment');
const parseDate = require('./parse-date');

describe('Extract date', function () {
  it('should remove date from title', function () {
    const contentObject = {
      title: '27 мая, Универсальный инструмент',
    };
    Object.assign(contentObject, parseDate(contentObject));
    assert.equal(contentObject.title, 'Универсальный инструмент');
  });

  it('should remove date from empty title', function () {
    const contentObject = {
      title: '27 мая',
    };
    Object.assign(contentObject, parseDate(contentObject));
    assert.equal(contentObject.title, '');
  });

  it('should work fine with no-date title', function () {
    const contentObject = {
      title: 'Универсальный инструмент',
    };
    Object.assign(contentObject, parseDate(contentObject));
    assert.equal(contentObject.title, 'Универсальный инструмент');
  });

  it('should ignore invalid title', function () {
    const contentObject = {
      title: ' , Универсальный инструмент',
    };
    Object.assign(contentObject, parseDate(contentObject));
    assert.equal(contentObject.title, ' , Универсальный инструмент');
  });

  it('should work fine with no-title', function () {
    const contentObject = {
      content: 'Только текст',
    };
    Object.assign(contentObject, parseDate(contentObject));
    assert.equal(contentObject.content, 'Только текст');
    assert.ok(!contentObject.title);
  });


  it('should merge with context year', function () {
    const contentObject = {
      title: '27 мая, Универсальный инструмент',
      content: 'Всё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой.',
      date: new Date(),
    };
    Object.assign(contentObject, parseDate(contentObject));
    assert.equal(moment(contentObject.date).year(), (new Date()).getFullYear());
    assert.equal(moment(contentObject.date).month(), 4);
    assert.equal(moment(contentObject.date).date(), 27);
  });

  it('should replace date, month, year', function () {
    const contentObject = {
      title: '17 февраля 2011, Универсальный инструмент',
      content: 'Всё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой.',
      date: new Date(),
    };
    Object.assign(contentObject, parseDate(contentObject));
    assert.equal(moment(contentObject.date).year(), 2011);
    assert.equal(moment(contentObject.date).month(), 1);
    assert.equal(moment(contentObject.date).date(), 17);
  });

  it('should catch month', function () {
    const contentObject = {
      title: 'Август, Универсальный инструмент',
      content: 'Всё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой.',
      date: new Date(),
    };
    Object.assign(contentObject, parseDate(contentObject));
    assert.equal(moment(contentObject.date).year(), (new Date()).getFullYear());
    assert.equal(moment(contentObject.date).month(), 7);
  });

  it('should catch year', function () {
    const contentObject = {
      title: '2006, Универсальный инструмент',
      content: 'Всё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой.',
      date: new Date(),
    };
    Object.assign(contentObject, parseDate(contentObject));
    assert.equal(moment(contentObject.date).year(), 2006);
  });

  it('should catch month and year', function () {
    const contentObject = {
      title: 'сентябрь 2006, Универсальный инструмент',
      content: 'Всё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой.',
      date: new Date(),
    };
    Object.assign(contentObject, parseDate(contentObject));
    assert.equal(moment(contentObject.date).year(), 2006);
    assert.equal(moment(contentObject.date).month(), 8);
  });
});
