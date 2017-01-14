var fs = require("fs-extra");


var command = process.argv[2];
var params = process.argv.slice(3);

switch (command) {
  case "add":
    add(params);
    break;
  case "archive":
    archive(params);
    break;
  default:
    console.log("Commands: \"add \'sometext\'\", \"archive [filename] [filename]\"");
}

function archive (files) {
  // var files = process.argv.slice(3);
  // console.log(files);
  files.forEach(function (file) {
    fs.move(file, ".archive/" + file, function (error) {
      if (error) {
        console.log(error);
      }
    });
  });
}

function add (params) {
  fs.access(params[0], function (error) {
    if (!error) {
      return require("./add/add-from-file")(params);
    } else {
      return require("./add/add-content")(params);
    }
  });
}

