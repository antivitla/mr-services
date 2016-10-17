// globals: localStorage, uuid, JSON

function add (content) {
  var id = generateId();
  localStorage[id] = JSON.stringify(content);
  return id;
}

function update (key) {
  var item;
  try {
    item = JSON.parse(localStorage[key]);
  } catch (error) {
    console.warn("Плохое значение в localStorage[\"" + key + "\"]", error, error.stack);
  }
  return function (content) {
    if (typeof item != "object") {
      localStorage[key] = JSON.stringify(content);
    } else {
      localStorage[key] = JSON.stringify(Object.assign(item, content));
    }
  }
}

function get (id) {
  if (id) {
    try {
      return JSON.parse(localStorage[id]);
    } catch (error) {
      console.warn("Плохое значение в localStorage[\"" + id + "\"]", error);
      return undefined;
    }
  } else {
    return Object.keys(localStorage).map(function (id) {
      var item = {};
      try {
        item[id] = JSON.parse(localStorage[id]);
      } catch (error) {
        console.warn("Плохое значение в localStorage[\"" + id + "\"]", error);
        item[id] = error.name + " " + error.message;
      }
      return item;
    });
  }
}

function generateId () {
  return uuid.v1();
}
