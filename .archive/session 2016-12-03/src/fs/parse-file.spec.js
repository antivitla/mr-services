var assert = require("assert");
var chalk = require("chalk");
var parseFile = require("./parse-file");

describe("Parse", function () {
  it("doing", function (done) {
    parseFile("f:/Projects/Articles/журнал сознания, 2016-08-14.md")
      .then(function (index) {
        assert.ok(index);
        done();
      });
  });
});
