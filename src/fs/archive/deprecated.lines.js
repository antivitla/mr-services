var es = require("event-stream");
// module.exports = es.split;
var Transform = require("stream").Transform;
module.exports = function () {
  var lines = [];
  var stream = new Transform({
    transform: function (chunk, encoding, next) {
      lines = chunk.toString().replace(/\r/g, "").split("\n");
      while (lines.length) this.push(lines.shift());
      next();
    },
    flush: function (end) {
      console.log("SPKIT END");
      end();
    }
  });
  return stream;
};
