var fs = require("fs-extra");
var moment = require("moment");
var uuid = require("node-uuid");
var parse = require("../parse-file/parse-file");
var stringify = require("../stringify/stringify");

function addFromFile (params) {
  // 1. parse file for items
  parse(params[0]).then(function (items) {
    // 2. save
    var count = 0;
    items.forEach(function (item) {
      console.log(++count + "/" + items.length)
      var filename = ".mr/content" + item.id.slice(0, 2) + "/" + item.id.slice(2) + ".md";
      fs.mkdirs(".mr/content" + item.id.slice(0,2), function (error) {
        if (!error) {
          fs.writeFile(filename, stringify(item), function (error) {
            if (error) {
              console.log(error);
            }
          });
        } else {
          console.log(error);
        }
      });
    });
  });

}

module.exports = addFromFile;