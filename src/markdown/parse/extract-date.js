const moment = require('moment');

const reDate = '\\d{1,2}';
const reMonth = '(январь|января|февраль|февраля|март|марта|апрель|апреля|май|мая|июнь|июня|июль|июля|август|августа|сентябрь|сентября|октябрь|октября|ноябрь|ноября|декабрь|декабря|january|february|march|april|may|june|july|august|september|october|november|december)';
const reYear = '[1|2|3]\\d{3}';
const reSpace = '\\s';

// Extracts date from title and return new mergeable contentObject
function extractDate(contentObject) {
  if (contentObject.title) {
    const momentFrom = {
      content: moment(contentObject.title, ['D MMMM', 'D MMMM YYYY', 'MMMM YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'MMMM', 'YYYY'], 'ru'),
      context: moment(contentObject.date ? contentObject.date : new Date()),
    };
    if (momentFrom.content.isValid() && momentFrom.content.year() > 999 && momentFrom.content.year() < 4000) {
      // remove date part from title
      let title;
      const dateFormat = momentFrom.content._f;
      if (dateFormat === 'D MMMM') {
        title = contentObject.title.replace(new RegExp(reDate + reSpace + reMonth), '');
      } else if (dateFormat === 'D MMMM YYYY') {
        title = contentObject.title.replace(new RegExp(reDate + reSpace + reMonth + reSpace + reYear), '');
      } else if (dateFormat === 'MMMM YYYY') {
        title = contentObject.title.replace(new RegExp(reMonth + reSpace + reYear), '');
      } else if (dateFormat === 'YYYY-MM-DD') {
        title = contentObject.title.replace(/[1|2|3]\d{3}-\d{2}-\d{2}/, '');
      } else if (dateFormat === 'DD-MM-YYYY') {
        title = contentObject.title.replace(/\d{2}-\d{2}-[1|2|3]\d{3}/);
      } else if (dateFormat === 'MMMM') {
        title = contentObject.title.replace(new RegExp(reMonth), '');
      } else {
        title = contentObject.title.replace(new RegExp(reYear), '');
      }
      title = title.split(',')
        .filter(item => Boolean(item.trim()))
        .map(item => item.trim())
        .join(', ');

      // create date
      const result = momentFrom.context;
      const format = momentFrom.content.creationData().format;
      if (format.match(/D/g)) result.date(momentFrom.content.date());
      if (format.match(/MM/g)) result.month(momentFrom.content.month());
      if (format.match(/YY/g)) result.year(momentFrom.content.year());
      return {
        date: result.toISOString(),
        title,
      };
    }
  }
  return contentObject;
}

module.exports = extractDate;
