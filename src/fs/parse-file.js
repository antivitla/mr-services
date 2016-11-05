var es = require("event-stream");
var fs = require("fs");
var q = require("q");
var moment = require("moment");
var uuid = require("node-uuid");

var contentDelimiter = require("./content-delimiter");
var extractDate = require("./extract-date");
var extractTitle = require("./extract-title");
var pickExcerpt = require("./pick-excerpt");
var createMarkdownIndexEntry = require("./create-markdown-index-entry");

var chalk = require("chalk");
var util = require("util");

// contentObject, contextObject, keys, transform, transformOptions
function transformContentAndKeepContext (options) {
  options.keys.forEach(function (key) {
    options.contentObject[key] = options.contextObject[key];
  });
  Object.assign(options.contentObject, options.transform(options.contentObject, options.transformOptions));
  options.keys.forEach(function (key) {
    options.contextObject[key] = options.contentObject[key];
  });
}

function pickPropeties (contentObject) {
  var commentsRegexp = /<!--(.|\s)*?-->/g;
  if (contentObject.content.match(commentsRegexp)) {
    try {
      var properties = JSON.parse(contentObject.content.match(commentsRegexp)[0]
        .replace(/<!--|-->/g,"")
        .trim());
      return properties;
    } catch (error) {
      console.error(error);
    }
  }
  return contentObject;
}

function parseFile (filename) {
  // var fileTitle = (process.platform == "win32" ? path.win32.parse(filename).name : path.posix.parse(filename).name);
  var deferred = q.defer();
  var index = [];
  var initialContentObject = {};
  var contextObject = {
    date: fs.statSync(filename).birthtime
  };

  fs.createReadStream(filename)
    // split content
    .pipe(es.split(contentDelimiter))

    // get clean content
    .pipe(es.map(function (str, next) {
      var content = str.trim().replace(/^\s*|\s*$/g,"");
      next(null, content);
    }))

    // create instance of contentObject with {content}
    .pipe(es.map(function (content, next) {
      next(null, Object.assign({},
        {content: content}));
    }))

    // add contentObject properties defined in note, if any
    .pipe(es.map(function (contentObject, next) {
      next(null, Object.assign(contentObject,
        pickPropeties(contentObject)));
    }))

    // add {id}
    .pipe(es.map(function (contentObject, next) {
      next(null, Object.assign(contentObject,
        (!contentObject.id ? {id: uuid.v1()} : {})));
    }))

    // extract optional {title}
    .pipe(es.map(function (contentObject, next) {
      next(null, Object.assign(contentObject,
        (!contentObject.title ? extractTitle(contentObject) : {})));
    }))

    // pick excerpt
    .pipe(es.map(function (contentObject, next) {
      next(null, Object.assign(contentObject,
        (!contentObject.excerpt ? pickExcerpt(contentObject, {maxlength: 55}) : {})));
    }))

    // extract optional {date} from title and merge with context date
    .pipe(es.map(function (contentObject, next) {
      transformContentAndKeepContext({
        contentObject: contentObject,
        contextObject: contextObject,
        keys: ["date"],
        transform: extractDate
      });
      next(null, contentObject);
    }))

    // // extract options {group} from title and merge with context group
    // .pipe(es.map(function (contentObject, next) {
    //   transformContentAndKeepContext({
    //     contentObject: contentObject,
    //     contextObject: contextObject,
    //     keys: ["groups"],
    //     transform: extractGroups
    //   });
    //   next(null, contentObject);
    // }))



    // add {markdownIndexEntry}
    .pipe(es.map(function (contentObject, next) {
      next(null, Object.assign(contentObject,
        createMarkdownIndexEntry(contentObject)
      ));
    }))

    // collect index of contentObjects
    .pipe(es.map(function (contentObject, next) {
      index.push(contentObject);
      next(null, contentObject);
    }))

    // resolve index of contentObject
    .pipe(es.wait(function (error) {
      if(!error) {
        deferred.resolve(index);
      } else {
        deferred.reject(error)
      }
    }));

  return deferred.promise;
}

module.exports = parseFile;

if (process.argv[2]) {
  console.log(process.argv[2]);
  parseFile(process.argv[2]).then(function (index) {
    // console.log(index);
    index.forEach(function (obj) {
      console.log((obj.title ? chalk.yellow(obj.title) : chalk.grey(obj.excerpt)), chalk.cyan(obj.date));
    })
  });
}
