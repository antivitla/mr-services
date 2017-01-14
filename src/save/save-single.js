var formatter = require("../formatter/formatter");
var fs = require("fs-extra");

function save (item, callback) {
  var filename = ".mr/content/" + item.id.slice(0, 2) + "/" + item.id.slice(2) + ".md";
  fs.mkdirs(".mr/content/" + item.id.slice(0,2), function (error) {
    if (!error) {
      fs.writeFile(filename, formatter(item), function (error) {
        if (callback) callback(error);
      });
    } else {
      if (callback) callback(error);
    }
  });
}

module.exports = save;