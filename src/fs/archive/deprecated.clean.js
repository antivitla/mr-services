var es = require("event-stream");
module.exports = function () {
  return es.map(function (line, next) {
    // console.log("clean", line.toString());
    next(null, line.toString().replace(/\r/g, "").replace(/\s+$/, ""));
  });
};
