const get = require('./get');

get(process.argv[2])
  .then((note) => {
    process.stdout.write(note);
  });
