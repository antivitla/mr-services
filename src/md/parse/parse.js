/* eslint array-callback-return: 0 */

const es = require('event-stream');
// const moment = require('moment');
// const chalk = require('chalk');
// const util = require('util');
// const uuid = require('node-uuid');
// const createMarkdownIndexEntry = require('./create-markdown-index-entry');
const Content = require('../../content/content');
const parseDate = require('./parse-date');
const parseProperties = require('./parse-properties');
const parseTitle = require('./parse-title');
const parseIndex = require('./parse-index');
const transformContentAndKeepContext = require('./transform-content-and-keep-context');

const contentDelimiter = /\r?\n\*\s+\*\s+\*\s*\r?\n/;

function parse(string, contextObject = { date: new Date() }) {
  return new Promise((resolve, reject) => {
    // Собираем контент-объекты сюда
    const index = [];

    // Загружаем в трубу строку
    es.readArray([string])

    // Делим на заметки
    .pipe(es.split(contentDelimiter))
    // Удаляем лишние пробелы
    .pipe(es.map((contentText, next) => {
      const text = contentText.trim().replace(/^\s*|\s*$/g, '');
      next(null, text);
    }))

    // Создаем Content объект с текстом
    // на базе контекстного объекта
    .pipe(es.map((text, next) => {
      next(null, new Content(Object.assign({}, contextObject, { text })));
    }))

    // Достаём заголовок
    .pipe(es.map((contentObject, next) => {
      next(null, Object.assign(contentObject,
        parseTitle(contentObject)));
    }))

    // Достаём дату из заголовка
    // и обновляем ею наш контент-объект
    // а также контекст-объект
    .pipe(es.map((contentObject, next) => {
      transformContentAndKeepContext({
        contentObject,
        contextObject,
        keys: ['date'],
        transform: parseDate,
      });
      next(null, contentObject);
    }))

    // Выковыриваем свойства из JSON'а в комментах
    // и перезаписываем ими всё что пропарсили из текста
    .pipe(es.map((contentObject, next) => {
      next(null, Object.assign(contentObject,
        parseProperties(contentObject)));
    }))

    // // Обрабатываем специфические команды в JSON
    // .pipe(es.map((contentObject, next) => {
    //   if (contentObject.delete) {
    //     // Удаляем из базы
    //     db.remove({ id: contentObject.id });
    //     // Пропускаем этот объект
    //     next();
    //   } else {
    //     next(null, contentObject);
    //   }
    // }))

    // Парсим детей, если есть
    .pipe(es.map((contentObject, next) => {
      next(null, Object.assign(contentObject,
        parseIndex(contentObject)));
    }))

    // Собираем коллекцию контент-объектов
    .pipe(es.map((contentObject, next) => {
      index.push(contentObject);
      next(null, contentObject);
    }))

    // Выдаём
    .pipe(es.wait((error) => {
      if (!error) {
        resolve(index);
      } else {
        reject(error);
      }
    }));
  });
}

module.exports = parse;
