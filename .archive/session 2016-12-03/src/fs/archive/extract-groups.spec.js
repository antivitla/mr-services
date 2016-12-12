var assert = require("assert");

function extractGroups (contentObject) {
  if (contentObject.title) {
    var groupsRegexp = /\([^\)\(]*\)/g;
    var matches = contentObject.title.trim().match(groupsRegexp);
    if (matches) {
      var newTitle = contentObject.title.trim().replace(groupsRegexp, "").trim();
      // consider last match in parenthesis being group indicator
      var groups = matches[matches.length-1].replace(/^\(|\)$/g, "").split(",").map(function (group) {
        return group.trim();
      });
      return {
        groups: groups,
        title: newTitle
      };
    }
  }
}

describe("Extract groups", function () {
  it("should work", function () {
    var contentObject = {
      title: "# 16 ноября 2017, PDF - база данных (Сервис заметок)"
    };
    var newContentObject = Object.assign(contentObject, extractGroups(contentObject));
    assert.equal(newContentObject.groups[0], "Сервис заметок");
    assert.equal(newContentObject.title, "# 16 ноября 2017, PDF - база данных");
  });

  it("should ignore absent groups", function () {
    var contentObject = {
      title: "# 16 ноября 2017, PDF - база данных"
    };
    var newContentObject = Object.assign(contentObject, extractGroups(contentObject));
    assert.ok(!newContentObject.groups);
    assert.equal(newContentObject.title, "# 16 ноября 2017, PDF - база данных");
  });

  it("should do well with empty groups", function () {
    var contentObject = {
      title: "# 16 ноября 2017, PDF - база данных ()"
    };
    var newContentObject = Object.assign(contentObject, extractGroups(contentObject));
    assert.ok(newContentObject.groups);
    assert.equal(newContentObject.title, "# 16 ноября 2017, PDF - база данных");
  });

  it("should take last parenthesis", function () {
    var contentObject = {
      title: "# 16 ноября 2017, PDF - база данных (и не только) (Разработка)"
    };
    var newContentObject = Object.assign(contentObject, extractGroups(contentObject));
    assert.equal(newContentObject.groups[0], "Разработка");
    assert.equal(newContentObject.title, "# 16 ноября 2017, PDF - база данных (и не только)");
  });
});
