var es = require("event-stream");
var fs = require("fs");
var q = require("q");
var uuid = require("node-uuid");

var contentDelimiter = require("./content-delimiter");
var extractDate = require("./extract-date");
var extractTitle = require("./extract-title");
var pickExcerpt = require("./pick-excerpt");
var pickProperties = require("./pick-properties");
var createMarkdownIndexEntry = require("./create-markdown-index-entry");
var transformContentAndKeepContext = require("./transform-content-and-keep-context");

function parseFileStat (filename) {
  var deferred = q.defer();
  fs.stat(filename, function (error, stat) {
    if (!error) {
      deferred.resolve(stat);
    } else {
      deferred.reject(stat);
    }
  });
  return deferred.promise;
}

function parseFileContent (filename, contextObject) {
  var index = [];
  var deferred = q.defer();

  // read file content and..
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
        pickProperties(contentObject)));
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

    // add {markdownIndexEntry}
    // .pipe(es.map(function (contentObject, next) {
    //   next(null, Object.assign(contentObject,
    //     createMarkdownIndexEntry(contentObject)
    //   ));
    // }))

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

function parseFile (filename) {
  return parseFileStat(filename).then(function (stat) {
    return parseFileContent(filename, {
      date: stat.birthtime
    });
  });
}

module.exports = parseFile;

// If executed standalone
if (process.argv[2]) {
  parseFile(process.argv[2]).then(function (index) {
    var output = index.map(function (item) {
      return item.markdownIndexEntry;
    }).join("\n");
    process.stdout.write(output);
  });
}
