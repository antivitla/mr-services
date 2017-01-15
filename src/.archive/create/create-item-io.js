var create = require("./create-item");
var encoding = require("encoding");

process.stdin.on("data", function (chunk) {
  var text = chunk.toString("utf8");
  var result = JSON.stringify(create(text));
  process.stdout.write(result);
  process.stdin.pause();
});