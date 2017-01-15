module.exports = {
  safe(content) { return content || ''; },
  title(cobj) { return cobj.title ? `# ${cobj.title}` : ''; },
};
