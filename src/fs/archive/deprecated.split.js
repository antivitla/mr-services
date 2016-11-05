var es = require("event-stream");
var Transform = require("stream").Transform;





module.exports = function () {
  var note = [];
  var divider = "* * *";
  var count = 0;
  var stream = new Transform({
    transform: function (chunk, encoding, next) {
      var line = chunk.toString();
      if (line == divider) {
        this.push(note.join("\n"));
        note = [];
      } else {
        note.push(line);
      }
      // console.log("line", line, "EOL");
      next();
    },
    flush: function (end) {
      this.push(note.join("\n"));
      console.log("FILE", note, "EOF");
      // this.push(null);
      note = [];
      end();
    }
  });

  stream.on("end", function () {
    console.log("End");
  });

  return stream;
}
