const sort = require('./sort');

process.stdin.on('data', (chunk) => {
  const items = JSON.parse(chunk.toString('utf8'));
  sort(items);
  process.stdout.write(JSON.stringify(items));
});
