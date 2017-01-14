var assert = require("assert");
var util = require("util");
var fs = require("fs");

// https://gist.github.com/kethinov/6658166
function walkSync (dir, filelist) {
  var dir = dir || "./";
  var path = path || require('path');
  var fs = fs || require('fs'),
    files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    var stats = fs.statSync(path.join(dir, file));
    if (stats.isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push({
        filename: path.join(dir, file),
        title: file,
        date: {
          created: stats.birthtime,
          updated: stats.mtime
        },
        content: fs.readFileSync(path.join(dir, file), {encoding: "utf8"})
      });
    }
  });
  return filelist;
}


function journalit (items) {
  var contentDelimiter = "\r\n\r\n" + "* * *" + "\r\n\r\n";
  return items
    .sort(function (a, b) {
      return a.date.created - b.date.created;
    })
    .map(function (item) {
      return item.content + "\r\n\r\n" + "<!-- {filename: \"" + item.filename + "\", date: {created: " + item.date.created.getTime() + ", updated: " + item.date.updated.getTime() + "}} -->";
    })
    .join(contentDelimiter);
}

describe("Journal-it", function () {
  it("gets file list", function () {
    var dir = fs.readdirSync("./").filter(function (filename) {
      return !fs.statSync(filename).isDirectory();
    });
    var files = walkSync().slice(0).filter(function (item) {
      return !item.filename.match(/(\/|\\)/);
    });
    assert(files.length == dir.length);
  });

  it("gets right dates of each note", function () {
    var list = walkSync("f:\\Projects\\Personal\\Mr.Services\\mr-services.git\\docs\\Заметка\\");
    list.sort(function (a, b) {
      return a.date.created - b.date.created;
    });
    assert(list[0].date.created - list[1].date.created < 0);
  });

  it("output notes in one", function () {
    var list = walkSync("f:\\Projects\\Personal\\Mr.Services\\mr-services.git\\docs\\Заметка\\");
    var journal = journalit(list);
    console.log(process);
    assert(journal = journal.toString());
  });
});