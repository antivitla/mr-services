var assert = require("assert");
var es = require("event-stream");
var fs = require("fs");
var Transform = require("stream").Transform;
var contentDelimiter = require("./content-delimiter");

describe("Split", function () {
  it("into notes and clean", function (done) {
    var count = 0;
    es.readArray(["# Header 1\r\n  \r\n Hello, world  \r\n\r\n* * * \r\n \r\n# Header 2\r\n\r\nAnother note.\r\nEven longer."])
      .pipe(es.split(contentDelimiter))
      .pipe(new Transform({
        transform: function (note, encoding, next) {
          ++count;
          next();
        }
      }))
      .pipe(es.wait(function () {
        assert.equal(count, 2);
        done();
      }));
  })
});
