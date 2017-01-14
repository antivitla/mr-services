var create = require("./create-item");

process.stdin.on("data", function (chunk) {
  var result = JSON.stringify(create(chunk.toString("utf8")));
  process.stdout.write(result);
  process.stdin.pause();
});