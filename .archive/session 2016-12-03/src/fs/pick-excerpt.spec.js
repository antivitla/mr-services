var assert = require("assert");
var pickExcerpt = require("./pick-excerpt");

describe("Pick excerpt", function () {
  it("should return with ellipsis", function () {
    var contentObject = {
      content: "Возможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\nИ в нем как книжку."
    };
    var newContentObject = Object.assign(contentObject, pickExcerpt(contentObject));
    assert.equal(newContentObject.excerpt, "Возможно хранить в нём (индекс). Заметки там...");
  })

  it("should return without ellipsis", function () {
    var contentObject = {
      content: "Возможно хранить в нём (индекс)."
    };
    var newContentObject = Object.assign(contentObject, pickExcerpt(contentObject));
    assert.equal(newContentObject.excerpt, "Возможно хранить в нём (индекс).");
  })

  it("should do fine with invalid", function () {
    var contentObject = {
      content: ""
    };
    var newContentObject = Object.assign(contentObject, pickExcerpt(contentObject));
    assert.equal(newContentObject.excerpt, "");
  });

  it("should do fine with strange", function () {
    var contentObject = {
      content: "."
    };
    var newContentObject = Object.assign(contentObject, pickExcerpt(contentObject));
    assert.equal(newContentObject.excerpt, ".");
  });
});
