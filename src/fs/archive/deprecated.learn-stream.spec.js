var fs = require("fs");
var assert = require("assert");
var es = require("event-stream");
var Writable = require("stream").Writable;
var Readable = require("stream").Readable;

xdescribe("Learn streams", function () {
  it("should read stream", function (done) {
    var filename = "журнал идей и туду.md";
    fs.createReadStream(filename).on("data", function (data) {
      assert.equal(Boolean(data.toString()), true);
      done();
    });
  });

  it("should create stream", function (done) {
    var reader = es.readArray(["Виталий"]);
    reader.on("data", function (data) {
      assert.equal(data.toString(), "Виталий");
      done();
    });
  });

  it("should trim lines as stream", function (done) {
    var counter = 0;
    var result = ["zok", "ZodZog baar", "", "", "Витла",""];
    es.readArray(["zok  \n ZodZog baar      \n  \n\n  Витла \n"])
      .pipe(es.split())
      .pipe(es.map(function (line, callback) {
        assert.equal(result[counter++], line.trim());
        callback(null, line.trim());
      }))
      .pipe(es.wait(function () {
        done();
      }));
  });

  it("should emit chunk into stream", function () {
    var reader = new Readable();
    var writer = new Writable({
      write: function (chunk, encoding, next) {
        console.log("zok", chunk.toString());
        next();
      }
    });
    writer.write("Виталий");
    writer.write("Уасилий");
    writer.write("Сергей");
    // reader.push(null);
    // reader.pipe(writer);
  });
});
