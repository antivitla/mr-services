var assert = require("assert");
var transformContentAndKeepContext = require("./transform-content-and-keep-context");

function transformExample (contentObject) {
  return {
    makabot: "Marmelad" + contentObject.makabot,
    date: contentObject.date.setMonth(1)
  };
}

describe("Transfrom through context", function () {
  it("should keep context while transforming", function () {
    var contentObject = {
      content: "Возможно хранить в нём (индекс).\r\nЗаметки там имеют айди.\n<!-- {\"zok\": \"zak\", \"lis\": 879} -->\nИ в нем как книжку."
    };
    var contextObject = {
      makabot: "Vitla",
      date: new Date()
    }
    var newContentObject = Object.assign(contentObject, transformContentAndKeepContext({
      contentObject: contentObject,
      contextObject: contextObject,
      keys: ["makabot", "date"],
      transform: transformExample
    }));
    assert.equal(contextObject.makabot, "MarmeladVitla");
    assert.equal(contentObject.makabot, "MarmeladVitla");
    assert.equal((new Date(contentObject.date)).getMonth(), 1);
  });
});
