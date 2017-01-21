/* eslint array-callback-return: 0 */

const es = require('event-stream');
const moment = require('moment');
const chalk = require('chalk');
const uuid = require('node-uuid');
const contentDelimiter = require('./content-delimiter');
const extractDate = require('./extract-date');
const extractTitle = require('./extract-title');
const pickExcerpt = require('./pick-excerpt');
const pickProperties = require('./pick-properties');
// const createMarkdownIndexEntry = require('./create-markdown-index-entry');
const transformContentAndKeepContext = require('./transform-content-and-keep-context');

function renderParseProgressEnd(index) {
  console.log(chalk.gray('Parsed'), chalk.green(index.length), chalk.gray('notes'));
}

function renderParseProgress(item) {
  console.log(chalk.gray('Parsed'),
    chalk.white(item.id),
    chalk.green(item.excerpt));
}

function parse(string, { contextObject = { date: moment().toISOString() }, showProgress = true } = {}) {
  // const currentContextObject = contextObject;
  return new Promise((resolve, reject) => {
    const index = [];
    // const deferred = q.defer();

    // read file content and..
    es.readArray([string])

    // split content
    .pipe(es.split(contentDelimiter))

    // get clean content
    .pipe(es.map((str, next) => {
      const content = str.trim().replace(/^\s*|\s*$/g, '');
      next(null, content);
    }))

    // create instance of contentObject with {content}
    .pipe(es.map((content, next) => {
      next(null, Object.assign({}, { content }));
    }))

    // add contentObject properties defined in note, if any
    .pipe(es.map((contentObject, next) => {
      next(null, Object.assign(contentObject,
        pickProperties(contentObject)));
    }))

    // add {id}
    .pipe(es.map((contentObject, next) => {
      next(null, Object.assign(contentObject,
        (!contentObject.id ? { id: uuid.v1() } : {})));
    }))

    // extract optional {title}
    .pipe(es.map((contentObject, next) => {
      next(null, Object.assign(contentObject,
        (!contentObject.title ? extractTitle(contentObject) : {})));
    }))

    // pick excerpt
    .pipe(es.map((contentObject, next) => {
      next(null, Object.assign(contentObject,
        (!contentObject.excerpt ? pickExcerpt(contentObject, { maxlength: 55 }) : {})));
    }))

    // extract optional {date} from title and merge with context date
    .pipe(es.map((contentObject, next) => {
      transformContentAndKeepContext({
        contentObject,
        contextObject,
        keys: ['date'],
        transform: extractDate,
      });
      next(null, contentObject);
    }))

    // add {markdownIndexEntry}
    // .pipe(es.map(function (contentObject, next) {
    //   next(null, Object.assign(contentObject,
    //     createMarkdownIndexEntry(contentObject)
    //   ));
    // }))

    // collect index of contentObjects
    .pipe(es.map((contentObject, next) => {
      index.push(contentObject);
      next(null, contentObject);
    }))

    // progress
    .pipe(es.map((contentObject, next) => {
      if (showProgress) {
        renderParseProgress(contentObject);
      }
      next(null, contentObject);
    }))

    // resolve index of contentObject
    .pipe(es.wait((error) => {
      if (!error) {
        if (showProgress) {
          renderParseProgressEnd(index);
        }
        resolve(index);
      } else {
        reject(error);
      }
    }));
  });
}

module.exports = parse;

