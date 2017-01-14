module.exports = {
  eol: function () { return process.platform.match("win") ? "\r\n" : "\n"; },
  safe: function (content) { return content ? content : ""; },
  title: function (cobj) { return cobj.title ? "# " + cobj.title : ""; },
};