var save = require("./save");

process.stdin.on("data", function (chunk) {
  var result = save(JSON.parse(chunk.toString("utf8")));
});