const glob = require('glob');

module.exports = function globPromised(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (error, files) => {
      if (!error) {
        resolve(files);
      } else {
        reject(error);
      }
    });
  });
};
