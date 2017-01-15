const parse = require('./markdown').parse;

process.stdin.on('data', (chunk) => {
  const text = chunk.toString('utf8');
  const result = JSON.stringify(parse(text));
  process.stdout.write(result);
  process.stdin.pause();
});
