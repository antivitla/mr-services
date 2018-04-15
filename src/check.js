'use strict';

function check (params) {
  if (!params.options) {
    throw new Error(params.label + ': empty options to check');
  } else if (!params.scheme) {
    throw new Error(params.label + ': empty scheme to check');
  } else {
    Object.keys(params.scheme).forEach(function (key) {
      let isFunction = typeof params.scheme[key] === 'function';
      let isInstance = isFunction && params.options[key] instanceof params.scheme[key];
      let isSameType = typeof params.options[key] === typeof params.scheme[key];
      if (isFunction) {
        if (!isInstance) {
          throw new Error(params.label + ': invalid scheme\'s parameter "' + key + '" class');
        }
      } else if (!isSameType) {
        throw new Error(params.label + ': invalid scheme\'s parameter "' + key + '" type');
      }
    });
  }
}

module.exports = check;
