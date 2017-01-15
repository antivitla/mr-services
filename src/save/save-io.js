const save = require('./save');

process.stdin.on('data', (chunk) => {
  save(JSON.parse(chunk.toString()));
});
