// contentObject, contextObject, keys, transform, transformOptions
function transformContentAndKeepContext (options) {
  options.keys.forEach(function (key) {
    options.contentObject[key] = options.contextObject[key];
  });
  Object.assign(options.contentObject, options.transform(options.contentObject, options.transformOptions));
  options.keys.forEach(function (key) {
    options.contextObject[key] = options.contentObject[key];
  });
}

module.exports = transformContentAndKeepContext;
