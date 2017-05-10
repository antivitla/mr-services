function sort(arr, key, compare) {
  return arr.sort((a, b) => compare(a, b));
}

module.exports = sort;
