var fs = require("fs");
var path = require("path");
var del = require("delete");

function walkSync (dir, filelist) {
  var dir = dir || "./";
  var files = fs.statSync(dir).isDirectory() ? fs.readdirSync(dir) : [dir];
  filelist = filelist || [];
  files.forEach(function(file) {
    var stats = fs.statSync(dir != file ? path.join(dir, file) : file);
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
        content: (path.extname(file) == ".md" ? fs.readFileSync(path.join(dir, file), {encoding: "utf8"}) : "")
      });
    }
  });
  return filelist;
}

function journalit (items) {
  var contentDelimiter = "\r\n\r\n" + "* * *" + "\r\n\r\n";
  return items
    .sort(function (a, b) {
      return a.date.created.getTime() - b.date.created.getTime();
    })
    .map(function (item) {
      return item.content + "\r\n\r\n" + "<!-- {filename: \"" + item.filename + "\", date: {created: " + item.date.created.getTime() + ", updated: " + item.date.updated.getTime() + "}} -->";
    })
    .join(contentDelimiter);
}

if (process.argv[2] && process.argv[3]) {
  var source = process.argv[2];
  var target = process.argv[3]
  // console.log(source, target);
  var items = walkSync(source);
  var journal = journalit(items);
  // console.log(journal, items);
  // if (fs.statSync(source).isDirectory()) {
  //   fs.readdirSync(source)
  //     .forEach(function (file) {
  //       del.sync([path.join(source, file)], {force: true});
  //     });
  // } else {
  //   fs.unlink(source);
  // }
  fs.writeFileSync(target, journal);
}

module.exports = {
  journal: journalit,
  fileitems: walkSync
};