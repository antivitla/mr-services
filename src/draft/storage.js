var storage = {};

function save (content) {
  var id = generateId();
  storage[id] = content;
  return id;
}

function get () {
  return Object.keys(storage).map(function (id) {
    return storage[id];
  });
}

function add (content) {
  //
}

function remove (id) {
  //
}

function edit (id, content) {
  //
}

function generateId () {
  return uuid.v1();
}
