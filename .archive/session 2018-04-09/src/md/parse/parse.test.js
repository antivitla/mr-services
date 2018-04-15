/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const parse = require('./parse');
const moment = require('moment');
const chalk = require('chalk');

describe('Parse', function () {

  it('parses node', function (done) {
    const content = `
# Интерфейс

* [...Добавить add. Достать посмотреть get](c540cd00-332e-11e7-8e5c-eb8b742bbc4d)
* [Добавление](c540f410-332e-11e7-8e5c-eb8b742bbc4d)
* [Получение посмотреть](c541b760-332e-11e7-8e5c-eb8b742bbc4d)
* [JSON-объект заметки, её id и связь с базой](c541b761-332e-11e7-8e5c-eb8b742bbc4d)
* [Обновление (синхронизация, редактирование)](c541de70-332e-11e7-8e5c-eb8b742bbc4d)
* [Удаление](c541de71-332e-11e7-8e5c-eb8b742bbc4d)
* [Формат заметки, отделения заметок друг от друга в файле, дата](c5420580-332e-11e7-8e5c-eb8b742bbc4d)
`;
    parse(content).then((index) => {
      const contentObject = index[0];
      assert.equal(index.length, 1);
      assert.equal(contentObject.text, '');
      assert.ok(contentObject.excerpt().match('Добавить add. Достать'));
      assert.equal(contentObject.index.length, 7);
      assert.equal(contentObject.index[0].text, 'Добавить add. Достать посмотреть get');
      assert.equal(contentObject.index[0].title, '');
      assert.equal(contentObject.index[1].title, 'Добавление');
      assert.equal(contentObject.index[1].text, '');
      assert.equal(contentObject.index[2].id, 'c541b760-332e-11e7-8e5c-eb8b742bbc4d');
      assert.equal(contentObject.index[5].id, 'c541de71-332e-11e7-8e5c-eb8b742bbc4d');
      assert.equal(contentObject.index.filter(item => item.type === 'tree').length, 0);
    })
    .then(() => done())
    .catch(error => console.log(chalk.red(error)));
  });

  it('parses simple content', function (done) {
    const content = 'Малая заметка';
    parse(content).then((index) => {
      assert.equal(index.length, 1);
      assert.equal(index[0].text, content);
      assert.equal(index[0].constructor.name, 'Content');
      assert.ok(Object.prototype.toString.call(index[0].date) === '[object Date]');
      assert.equal(typeof index[0].id, 'string');
      assert.equal(index[0].id.length, 36);
    })
    .then(() => done())
    .catch(error => console.log(chalk.red(error)));
  });

  it('returning objects are typeof \'Content\'', function (done) {
    const text = 'Моя заметочка';
    parse(text)
    .then((index) => {
      assert.equal(index[0].constructor.name, 'Content');
    })
    .then(() => done())
    .catch(error => console.log(chalk.red(error)));
  });

  it('parse content with context date', function (done) {
    const note = 'Заметка';
    const date = moment().toISOString();
    parse(note, { date }).then(function (index) {
      assert.ok(index[0]);
      assert.ok(index[0].id);
      assert.equal(index[0].date, date);
      assert.equal(index[0].text, note);
    })
    .then(() => done())
    .catch(error => console.log(chalk.red(error)));
  });

  it('catches title', function (done) {
    const text = `
## Структуры

Ворох заметок-идей и ворох заметок дневника нужно отделить от вороха заметок по документации проекта. Структура "Дневник" - это в сущности опять markdown-заметка, но со ссылками на уже конкретные заметки-записи дневника
  `;
    parse(text)
    .then((index) => {
      assert.equal(index[0].title, 'Структуры');
      assert.equal(index[0].text, index[0].text.trim());
    })
    .then(() => done())
    .catch(error => console.log(chalk.red(error)));
  });

  it('catches date in title', function (done) {
    const text = `
## 15 мая, Структуры

Ворох заметок-идей и ворох заметок дневника нужно отделить от вороха заметок по документации проекта. Структура "Дневник" - это в сущности опять markdown-заметка, но со ссылками на уже конкретные заметки-записи дневника
  `;
    parse(text)
    .then((index) => {
      assert.equal(index[0].date.getMonth(), 4);
      assert.equal(index[0].date.getDate(), 15);
    })
    .then(() => done())
    .catch(error => console.log(chalk.red(error)));
  });
});
