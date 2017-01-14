var save = require("./save-single");

function saveMultiple (items, callback) {
  var total = items.length;
  var progress = 0;
  items.forEach(function (item) {
    save(item, function (error) {
      if (!error) progress++;
      if (progress >= total) {
        callback();
      }
    });
  });
}

module.exports = saveMultiple;