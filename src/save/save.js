var saveMultiple = require("./save-multiple");
var saveSingle = require("./save-single");

module.exports = function (data, callback) {
  if (Array.isArray(data)) {
    return saveMultiple(data, callback);
  } else {
    return saveSingle(data, callback);
  }
};