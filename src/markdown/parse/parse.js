/* eslint array-callback-return: 0 */

const es = require('event-stream');
const moment = require('moment');
// const chalk = require('chalk');
// const util = require('util');
const uuid = require('node-uuid');
const contentDelimiter = require('./content-delimiter');
const extractDate = require('./extract-date');
const extractTitle = require('./extract-title');
const pickExcerpt = require('./pick-excerpt');
const pickProperties = require('./pick-properties');
// const createMarkdownIndexEntry = require('./create-markdown-index-entry');
const transformContentAndKeepContext = require('./transform-content-and-keep-context');
const parseTree = require('./parse-tree');

function parse(string, { contextObject = { date: moment().toISOString() } } = {}) {
  return new Promise((resolve, reject) => {
    // resulting index
    const index = [];

    // read file content and..
    es.readArray([string])

    // split content
    .pipe(es.split(contentDelimiter))

    // get clean content
    .pipe(es.map((str, next) => {
      const content = str.trim().replace(/^\s*|\s*$/g, '');
      next(null, content);
    }))

    // create instance of contentObject with {content} merged with contextObject
    .pipe(es.map((content, next) => {
      next(null, Object.assign({}, contextObject, { content }));
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
        extractTitle(contentObject)));
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

    // TODO: Extract optional {topic} from title and merge with context topic

    // add {markdownIndexEntry}
    // .pipe(es.map(function (contentObject, next) {
    //   next(null, Object.assign(contentObject,
    //     createMarkdownIndexEntry(contentObject)
    //   ));
    // }))

    // parse tree
    .pipe(es.map((contentObject, next) => {
      if (contentObject.type === 'tree') {
        next(null, Object.assign(contentObject,
          parseTree(contentObject)));
      } else {
        next(null, contentObject);
      }
    }))

    // collect index of contentObjects
    .pipe(es.map((contentObject, next) => {
      index.push(contentObject);
      next(null, contentObject);
    }))

    // progress
    .pipe(es.map((contentObject, next) => {
      next(null, contentObject);
    }))

    // resolve index of contentObject
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

