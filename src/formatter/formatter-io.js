var formatter = require("./formatter");

process.stdin.on("data", function (chunk) {
  var result = formatter(JSON.parse(chunk.toString("utf8")));
  process.stdout.write(result);
});