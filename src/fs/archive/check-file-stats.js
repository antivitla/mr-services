var fs = require("fs");
var util = require("util");

var file = process.argv[2];

fs.stat(file, function (error, stats) {
  if (error) {
    console.error(error);
  } else {
    console.log(util.inspect(stats));
  }
});
