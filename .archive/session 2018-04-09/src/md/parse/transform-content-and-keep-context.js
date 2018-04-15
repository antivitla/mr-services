/* eslint no-param-reassign: 0, */

function transformContentAndKeepContext(obj) {
  obj.keys.forEach((key) => {
    if (obj.contentObject[key] === undefined) {
      obj.contentObject[key] = obj.contextObject[key];
    }
  });
  Object.assign(obj.contentObject, obj.transform(obj.contentObject, obj.transformOptions));
  obj.keys.forEach((key) => {
    obj.contextObject[key] = obj.contentObject[key];
  });
}

module.exports = transformContentAndKeepContext;
