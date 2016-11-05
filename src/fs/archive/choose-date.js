var moment = require("moment");

moment.locale(["ru", "en"]);

// Нужно так распарсить дату в заголовке заметки, чтобы контекстная дата
// (дата предыдущей заметки или дата создания файла) изменялась только на
// месяц (если указан месяц) или дату (если указана дата) - короче говоря,
// дата это уточнение контекстной даты вплоть до полностью с годом,
// а не замена. Плюс нужна поддержка других локалей, сейчас понимает только
// русский язык.

function chooseDate (content, contextDate) {
  var rawDateString = content.split(/\r?\n/g)
    // drop empty lines
    .filter(function (line) {
      return Boolean(line.trim());
    })[0]
    // remove starting Markdown header "#" symbols
    .replace(/^#+\s+/,"")
    // get all header text until first comma
    .split(",")[0]
    // drop trailing spaces
    .trim();
  if (rawDateString) {
    var contentDate = moment(rawDateString, ["D MMMM", "D MMMM YYYY", "MMMM"], "ru");
    if (contentDate.isValid()) {
      var resultDate = moment(contextDate);
      var format = contentDate.creationData().format;
      if (format.match(/D/g)) resultDate.date(contentDate.date());
      if (format.match(/MM/g)) resultDate.month(contentDate.month());
      if (format.match(/YY/g)) resultDate.year(contentDate.year());
      return resultDate.toDate();
    }
  }
}

module.exports = chooseDate;
