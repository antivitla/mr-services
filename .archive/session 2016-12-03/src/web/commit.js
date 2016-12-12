function commit (type, content) {
  var commit = {id: generateId()};
  if (content === undefined) {
    commit.content = type;
  } else {
    commit.content = {};
    commit.content[type] = content;
  }
  // var commit = {
  //   id: generateId(),
  //   type: content
  // };
  radio("commitCreate").broadcast(commit);
  // console.log(JSON.stringify(commit));
  console.log(commit);
}
