const os = require('os');
const util = require('util')

const paragraphDivider = os.EOL.repeat(2);
const contentDivider = `${paragraphDivider}* * *${paragraphDivider}`;

function stringify(contentObject, { nojson, expand, depth = 0 } = {}) {
  if (Array.isArray(contentObject)) {
    return contentObject
    .map(item => stringify(item, { nojson, expand, depth }))
    .join(contentDivider);
  }
  // console.log(util.inspect(contentObject, { depth: 10 }));
  // Делаем json свойств и потом отрезаем ему лишнее
  const json = Object.assign({}, contentObject);
  // Надо вывести заметку в текст, но есть хитрость
  // с деревьями - нужно подзаголовки лепить с id и комментами
  // для вложенных узлов. А кроме того, конечные заметки
  // не лепить вовсе, а только в виде ссылок на них.
  // Собираем текст
  const lines = [];
  // Определить что мы вложены можно по depth > 0.
  // Определить что мы последняя финальная заметка и не надо нас
  // стрингифаить по полной программе можно по
  // type !== 'tree' или !index.
  // А, ну и если опция не просит развернуть таки
  if (depth > 0 && !contentObject.index && contentObject.type !== 'tree' && !expand) {
    // Сокращённая программа
    const li = '*';
    const t = `[${contentObject.title || contentObject.excerpt(40)}]`;
    const id = `(${contentObject.id})`;
    lines.push(`${li} ${t}${id}`);
  } else {
    // Полная программа:
    // Если есть заголовок, лепим его
    if (contentObject.title) {
      const h = '#'.repeat(depth + 1);
      // Но если внутри дерева, на бОльшей глубине, то
      // заголовок делаем ссылкой с id
      if (depth > 0) {
        const t = `[${contentObject.title}]`;
        const id = `(${contentObject.id})`;
        lines.push(`${h} ${t}${id}`);
        // И кстати json надо будет не лепить,
        // но про это позже
      } else {
        // а нет, значит это корневой заголовок
        // заметки, лепим как обычно
        const t = contentObject.title;
        lines.push(`${h} ${t}`);
      }
    }
    delete json.title;
    // Собственный текст заметки.
    if (contentObject.text) {
      lines.push(contentObject.text.replace(/^(#{1,})(\s+)/gm, `$1${'#'.repeat(depth)}$2`));
    }
    delete json.text;
    // Теперь дети (рекурсивно).
    if (contentObject.index) {
      lines.push(contentObject.index
        .map(item => stringify([item], { nojson, expand, depth: depth + 1 }).concat(item.index ? os.EOL : ''))
        .join(os.EOL)
        .trim());
    }
    delete json.index;
    // Отрезаем остальные излишки
    delete json.path;
    delete json.excerpt;
    delete json.parent;
    // Чтоб залепить прилагающийся json
    // Но только в том случае если мы в корневом узле
    // для остальных хватит и ссылок
    // (а, ну и если опция не запрещает)
    if (depth === 0 && !nojson) {
      lines.push(`<!-- ${JSON.stringify(json)}-->`);
    }
  }
  // Отдаём получившийся markdown-текст
  return lines.join(paragraphDivider);
}

module.exports = stringify;
