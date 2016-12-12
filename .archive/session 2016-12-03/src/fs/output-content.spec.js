var assert = require("assert");
var moment = require("moment");
require("es5-shim");
require("es6-shim");

var print = {
  eol: function () { return process.platform.match("win") ? "\r\n" : "\n"; },
  safe: function (content) { return content ? content : ""; },
  title: function (cobj) { return cobj.title ? "# " + cobj.title : ""; },
};

function stringify (contentObject, options) {
  var title = print.title(contentObject);
  var content = print.safe(contentObject.content);
  var divider = print.eol().repeat(2);
  return title + (content && title ? divider : "") + content;
}

describe("Output content objects", function () {
  it ("outputs simple plain object", function () {
    var index = [{
      title: "Title 1",
      content: "Content 1"
    }, {
      title: "Title 2",
      content: "Content 2"
    }];
    var answer = [
      "# Title 1" + print.eol().repeat(2) + "Content 1",
      "# Title 2" + print.eol().repeat(2) + "Content 2"
    ];
    var output = index.map(stringify);
    output.forEach(function (o, i) {
      assert.equal(o, answer[i]);
    });
  });

  it("outputs with no title", function () {
    var index = [{
      content: "Content 1"
    }, {
      title: "Title 2",
      content: "Content 2"
    }];
    var answer = ["Content 1", "# Title 2" + print.eol().repeat(2) + "Content 2"];
    var output = index.map(stringify);
    output.forEach(function (o, i) {
      assert.equal(o, answer[i]);
    });
  });

  it("outputs with no content", function () {
    var index = [{
      content: "Content 1"
    }, {
      title: "Title 2"
    }];
    var answer = ["Content 1", "# Title 2"];
    var output = index.map(stringify);
    output.forEach(function (o, i) {
      assert.equal(o, answer[i]);
    });
  });

  it("outputs with no content and title", function () {
    var index = [{
    }, {
      title: "Title 2",
      content: "Content 1"
    }];
    var answer = ["", "# Title 2" + print.eol().repeat(2) + "Content 1"];
    var output = index.map(stringify);
    output.forEach(function (o, i) {
      assert.equal(o, answer[i]);
    });
  });

  it("output with date", function () {
    var contentObject = {
      title: "Title 1",
      date: moment(),
      content: "Content 1"
    };
    var output = stringify(contentObject, {date: true});
    var result = "# " + moment().format("DD MMMM YYYY") + ", Title 1" + print.eol().repeat(2) + "Content 2";
    assert.equal(output, result);
  });

  xdescribe("output with options", function () {
    xit("output with optional date");
    xit("output with non-repeating date");
    xit("output with explicit date");
    xit("output with no date");
    xit("output with content only (no title)");
  });
});
