'use strict';

class Where {
  constructor() {
    this.items = [];
  }

  push (what) {
    this.items.push(what);
  }

  list (query = '') {
    return new Promise((resolve, reject) => {
      const delimiter = ' / '
      const contexts = this.items
        .map(item => item.context.join(delimiter))
        .reduce((list, item) => {
          if (list.indexOf(item) < 0) {
            list.push(item);
          }
          return list;
        }, [])
        .filter(item => item.search(query) > -1)
      resolve(contexts);
    });
  }
}

module.exports = Where;
