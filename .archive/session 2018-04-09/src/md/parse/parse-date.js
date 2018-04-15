const moment = require('moment');

const reDate = '\\d{1,2}';
const reMonth = '(январь|января|февраль|февраля|март|марта|апрель|апреля|май|мая|июнь|июня|июль|июля|август|августа|сентябрь|сентября|октябрь|октября|ноябрь|ноября|декабрь|декабря|january|february|march|april|may|june|july|august|september|october|november|december)';
const reYear = '[1|2|3]\\d{3}';
const reSpace = '\\s';

function parseDate(contentObject) {
  if (contentObject.title) {
    // Достаём дату
    const titleDate = moment(contentObject.title, ['D MMMM', 'D MMMM YYYY', 'MMMM YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'MMMM', 'YYYY'], 'ru');

    // Убираем дату из заголовка
    if (titleDate.isValid() && titleDate.year() > 999 && titleDate.year() < 4000) {
      let title;
      const format = titleDate.creationData().format;
      if (format === 'D MMMM') {
        title = contentObject.title
          .replace(new RegExp(reDate + reSpace + reMonth), '');
      } else if (format === 'D MMMM YYYY') {
        title = contentObject.title
          .replace(new RegExp(reDate + reSpace + reMonth + reSpace + reYear), '');
      } else if (format === 'MMMM YYYY') {
        title = contentObject.title
          .replace(new RegExp(reMonth + reSpace + reYear), '');
      } else if (format === 'YYYY-MM-DD') {
        title = contentObject.title
          .replace(/[1|2|3]\d{3}-\d{2}-\d{2}/, '');
      } else if (format === 'DD-MM-YYYY') {
        title = contentObject.title
          .replace(/\d{2}-\d{2}-[1|2|3]\d{3}/);
      } else if (format === 'MMMM') {
        title = contentObject.title
          .replace(new RegExp(reMonth), '');
      } else {
        title = contentObject.title
          .replace(new RegExp(reYear), '');
      }
      title = title.split(',')
        .filter(item => Boolean(item.trim()))
        .map(item => item.trim())
        .join(', ');

      // Формируем финальную дату
      const result = moment(contentObject.date);
      if (format.match(/D/g)) result.date(titleDate.date());
      if (format.match(/MM/g)) result.month(titleDate.month());
      if (format.match(/YY/g)) result.year(titleDate.year());

      // Обновлем контект-объект
      Object.assign(contentObject, {
        date: result.toDate(),
        title,
      });
    }
  }
  return contentObject;
}

module.exports = parseDate;
