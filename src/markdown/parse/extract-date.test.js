/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const moment = require('moment');
const extractDate = require('./extract-date');

describe('Extract date', function () {
  it('should remove date from title', function () {
    const contentObject = {
      title: '27 мая, Универсальный инструмент',
    };
    const newContentObject = Object.assign(contentObject, extractDate(contentObject));
    assert.equal(newContentObject.title, 'Универсальный инструмент');
  });

  it('should remove date from empty title', function () {
    const contentObject = {
      title: '27 мая',
    };
    const newContentObject = Object.assign(contentObject, extractDate(contentObject));
    assert.equal(newContentObject.title, '');
  });

  it('should work fine with no-date title', function () {
    const contentObject = {
      title: 'Универсальный инструмент',
    };
    const newContentObject = Object.assign(contentObject, extractDate(contentObject));
    assert.equal(newContentObject.title, 'Универсальный инструмент');
  });

  it('should ignore invalid title', function () {
    const contentObject = {
      title: ' , Универсальный инструмент',
    };
    const newContentObject = Object.assign(contentObject, extractDate(contentObject));
    assert.equal(newContentObject.title, ' , Универсальный инструмент');
  });

  it('should work fine with no-title', function () {
    const contentObject = {
      content: 'Только текст',
    };
    const newContentObject = Object.assign(contentObject, extractDate(contentObject));
    assert.equal(newContentObject.content, 'Только текст');
    assert.ok(!newContentObject.title);
  });


  it('should merge with context year', function () {
    const contentObject = {
      title: '27 мая, Универсальный инструмент',
      content: 'Всё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой.',
      date: moment(new Date()).toISOString(),
    };
    const newContentObject = Object.assign(contentObject, extractDate(contentObject));
    assert.equal(moment(newContentObject.date).year(), (new Date()).getFullYear());
    assert.equal(moment(newContentObject.date).month(), 4);
    assert.equal(moment(newContentObject.date).date(), 27);
  });

  it('should replace date, month, year', function () {
    const contentObject = {
      title: '17 февраля 2011, Универсальный инструмент',
      content: 'Всё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой.',
      date: moment(new Date()).toISOString(),
    };
    const newContentObject = Object.assign(contentObject, extractDate(contentObject));
    assert.equal(moment(newContentObject.date).year(), 2011);
    assert.equal(moment(newContentObject.date).month(), 1);
    assert.equal(moment(newContentObject.date).date(), 17);
  });

  it('should catch month', function () {
    const contentObject = {
      title: 'Август, Универсальный инструмент',
      content: 'Всё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой.',
      date: moment(new Date()).toISOString(),
    };
    const newContentObject = Object.assign(contentObject, extractDate(contentObject));
    assert.equal(moment(newContentObject.date).year(), (new Date()).getFullYear());
    assert.equal(moment(newContentObject.date).month(), 7);
  });
});
