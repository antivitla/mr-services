function pickProperties(contentObject) {
  const commentsRegexp = /<!--(.|\s)*?-->/g;
  if (contentObject.content.match(commentsRegexp)) {
    try {
      const properties = JSON.parse(contentObject.content.match(commentsRegexp)[0]
        .replace(/<!--|-->/g, '')
        .trim());
      return Object.assign({}, contentObject, properties, {
        content: contentObject.content.replace(commentsRegexp, '').trim(),
      });
    } catch (error) {
      console.error(error);
    }
  }
  return contentObject;
}

module.exports = pickProperties;
