const stringify = require('./markdown').stringify;

process.stdin.on('data', (chunk) => {
  const result = stringify(JSON.parse(chunk.toString('utf8')));
  process.stdout.write(result);
});
