var assert = require("assert");
var create = require("./create-item");

describe("Create item", function () {
  it("should create item", function () {
    var contentItem = create("Ну вот такой итем");
    assert.ok(contentItem.date);
    assert.ok(contentItem.id);
    assert.equal(contentItem.content, "Ну вот такой итем");
  });
});