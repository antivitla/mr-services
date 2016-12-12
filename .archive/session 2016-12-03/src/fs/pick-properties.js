function pickProperties (contentObject) {
  var commentsRegexp = /<!--(.|\s)*?-->/g;
  if (contentObject.content.match(commentsRegexp)) {
    try {
      var properties = JSON.parse(contentObject.content.match(commentsRegexp)[0]
        .replace(/<!--|-->/g,"")
        .trim());
      return properties;
    } catch (error) {
      console.error(error);
    }
  }
  return contentObject;
}

module.exports = pickProperties;
