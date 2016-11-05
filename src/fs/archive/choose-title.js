function chooseTitle (note) {
  if (note && note.length) {
    var unwantedChars = /^#\s*/g;

    // get first meaningful line of text
    var title = note
      .split(/\r?\n/g)
      .map(function (line) { return line.replace(unwantedChars, "").trim(); })
      .filter(function (line) { return Boolean(line); })[0];

    // now shorten it

    var delimiter = [".", ";", ",", " - "];
    var maxlength = 45;
    var count = 0;
    while (count < delimiter.length && title.length > maxlength) {
      title = title
        .split(delimiter[count++])
        .filter(function (part) { return Boolean(part.trim()); })[0];
    }
    if (title.length > maxlength) {
      title = title
        .slice(0, maxlength)
        .split(/\s+/g)
        .join(" ");
    }

    return title.trim();
  }
}

module.exports = chooseTitle;
