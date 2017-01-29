/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const moment = require('moment');
const md = require('../markdown/markdown');
const assert = require('assert');
const sort = require('./sort');

describe('Sort items', function () {
  // Сортировка итемов по дате
  it('sorts by date', function (done) {
    // насоздавать заметок с разными датами
    const index = [];
    let date = moment().add(2, 'days').toISOString();
    let note = `Заметочка номер 1\r\n\r\n<!-- { "date": "${date}" } -->\r\n`;
    md.parse(note)
      .then((items) => {
        index.push(items[0]);
        date = moment().add(0, 'days').toISOString();
        // console.log(date);
        note = `Заметочка номер 2\r\n\r\n<!-- { "date": "${date}" } -->\r\n`;
        return md.parse(note);
      })
      .then((items) => {
        index.push(items[0]);
        date = moment().add(10, 'days').toISOString();
        // console.log(date);
        note = `Заметочка номер 3\r\n\r\n<!-- { "date": "${date}" } -->\r\n`;
        return md.parse(note);
      })
      .then((items) => {
        index.push(items[0]);
        date = moment().add(12, 'days').toISOString();
        // console.log(date);
        note = `Заметочка номер 4\r\n\r\n<!-- { "date": "${date}" } -->\r\n`;
        return md.parse(note);
      })
      .then((items) => {
        index.push(items[0]);
        date = moment().add(8, 'days').toISOString();
        // console.log(date);
        note = `Заметочка номер 5\r\n\r\n<!-- { "date": "${date}" } -->\r\n`;
        return md.parse(note);
      })
      .then((items) => {
        index.push(items[0]);
        date = moment().add(13, 'days').toISOString();
        // console.log(date);
        note = `Заметочка номер 6\r\n\r\n<!-- { "date": "${date}" } -->\r\n`;
        return md.parse(note);
      })
      .then((items) => {
        index.push(items[0]);
        sort(index, 'date', (a, b) => moment(a.date) - moment(b.date)).reverse();
        assert.equal('643512', index.map(item => parseInt(item.content.replace('Заметочка номер ', ''), 10)).join(''));
        done();
      });
  });
});
