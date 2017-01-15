/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const save = require('./save');
const fs = require('fs-extra');
const md = require('../markdown/markdown');

describe('Save items', function () {
  it('один итем за раз, правильный путь имеет', function (done) {
    md.parse('Заметочка моя').then(function (index) {
      const input = index[0];
      const filepath = `.mr/content/${input.id.slice(0, 2)}/${input.id.slice(2)}.md`;
      // сохраняем
      save(input, function (error) {
        if (!error) {
          // читаем
          fs.access(filepath, fs.constants.R_OK, function (err) {
            assert.ok(!err);
            done();
          });
        } else {
          assert.ok(false);
          done();
        }
      });
    });
  });

  it('один итем за раз, содержимое файла (проверяем длина строки)', function (done) {
    md.parse('Ещё заметочка').then(function (index) {
      const input = index[0];
      const filepath = `.mr/content/${input.id.slice(0, 2)}/${input.id.slice(2)}.md`;
      const contentLength = md.stringify(input).length;
      // сохраняем
      save(input, function (error) {
        if (!error) {
          // читаем
          fs.readFile(filepath, function (err, data) {
            assert.equal(data.toString('utf8').length, contentLength);
            done();
          });
        } else {
          assert.ok(false);
          done();
        }
      });
    });
  });

  it('сохраняем несколько итемов за раз', function (done) {
    md.parse('Заметочка номер один\r\n\r\n* * *\r\n\r\nЕщё какая-то идейка на раз\r\n\r\n* * *\r\n\r\nКакой-то уже список образовывается.').then(function (items) {
      const filepaths = [
        `.mr/content/${items[0].id.slice(0, 2)}/${items[0].id.slice(2)}.md`,
        `.mr/content/${items[1].id.slice(0, 2)}/${items[1].id.slice(2)}.md`,
        `.mr/content/${items[2].id.slice(0, 2)}/${items[2].id.slice(2)}.md`,
      ];

      const contentLengths = [
        md.stringify(items[0]).length,
        md.stringify(items[1]).length,
        md.stringify(items[2]).length,
      ];

      save(items, function (error) {
        if (!error) {
          const i = parseInt(Math.random() * 3, 10);
          fs.readFile(filepaths[i], function (err, data) {
            assert.equal(data.toString('utf8').length, contentLengths[i]);
            done();
          });
        }
      });
    });
  });

  after(function (done) {
    fs.remove('.mr', function () {
      done();
    });
  });
});

