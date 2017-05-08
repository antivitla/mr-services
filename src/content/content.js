const uuid = require('node-uuid');

function Content(model) {
  const defaultModel = {
    id: uuid.v1(),
    date: new Date(),
  };
  Object.assign(this, defaultModel, model);
}

module.exports = Content;
