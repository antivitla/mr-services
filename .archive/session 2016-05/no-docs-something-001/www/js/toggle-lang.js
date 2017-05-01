
//
// Переключатель языка
//

/*

Чтоб активировать, нужно задать список языков в теге html внутри атрибута toggle-lang,
через запятую, например:

	<html toggle-lang="ru, en">

При инициализации проставится первый в списке язык в атрибут lang. Но рекомендуется сразу
проставить язык документа, например lang="ru". В итоге тег <html> будет вот так:

	<html toggle-lang="ru, en" lang="ru">

Это переключатель - часть идеи решения локализации страницы без бэкенда, когда все
переводы есть на одной странице и мы стилями прячем переведенные для других языков
элементы, оставляя только текущий язык. Короче что-то вроде этого в стилях:

	html[lang="ru"] *[lang]:not([lang="ru"]),
	html[lang="en"] *[lang]:not([lang="en"]) {
		display: none;
	}

И например вот такое в html:

	<html lang="ru">
	...
	<body>
		<p lang="ru">Привет</p>
		<p lang="en">Hello</p>
		<p>
			<a href="something.com/ru" lang="ru">Привет-ссылка</a>
			<a href="something.com/en" lang="en">Hello-link</a>
		</p>
	</body>
	</html>

Покажет только русские приветы на странице, и если в атрибуте lang у <html> будет "en",
то только английские.

Данный скрипт же и исполняет замену атрибута lang у <html>. Делает он этой внутри
глобальной функции toggleLang, которую поэтому можно навесить на кнопку. Функции можно
передать конкретный язык, например:

	toggleLang("ru")

врубит язык "ru" (точнее проставит lang="ru" для тега html или того, на ком был
определен список языков). Если конкретный язык не задан, то переключит на следующий
в списке.

Ньюансы:
- <title> переключается по-особому, скрипт заменяет полностью его содержимое из
  атрибутов ru или en или других языков. Например вот так должен выглядеть title:

  		<title ru="Привет" en="Hello">Привет</title>

  Опять же, рекомендуется сразу поставить в <title> названием на дефолтном языке.

  Скрипт сделает это с любым элементом, где найдет атрибуты ru, en или других кодов
  языков из списка. Но будьте осторожны - при использовании этого метода нужно задать
  либо все языки из списка, либо ни одного - иначе поведение непредсказуемо.


- Чтобы можно было например заменить текст кнопки переключения языка (или совершить
  другие действия) - на элементе где был найден список языков (в наших примерах - <html>)
  в момент переключения запускается событие "toggle-lang"

*/


;(function () {

	var libname = "toggle-lang",
		lang = window.JSON.parse(window.localStorage.getItem(libname)) || {
			list: [],
			current: undefined,
			next: undefined
		},
		langElement = document.documentElement;

	function toggleLang(newLang) {
		if (!newLang) {
			if (lang.next) {
				toggleLang(lang.next);
				return;
			}
		} else {
			langElement.setAttribute("lang", newLang);
			setLang(newLang);
		}
	}

	document.addEventListener("DOMContentLoaded", function () {
		window.toggleLang = toggleLang;
		parseToggleLangElement(document.querySelector("*[toggle-lang]"));
	});

	function parseToggleLangElement (element) {
		if (element) {
			langElement = element;
			var list = element.getAttribute("toggle-lang").replace(" ", "").split(",");
			while (list.length > 0) {
				addLang(list[0]);
				list.shift();
			}
			toggleLang(lang.current);
		}
	}

	function addLang (langName) {
		lang.list = lang.list || [];
		lang.list.push(langName);
		if (lang.list.length == 1) {
			setLang(lang.list[0]);
		}
	}

	function setLang (langName) {
		lang.current = langName;
		lang.next = lang.list[nextIndex(lang.list.indexOf(lang.current), lang.list)];
		window.localStorage.setItem(libname, window.JSON.stringify(lang));
		// Второй способ переключения, для <title> и других
		var specialElements = document.querySelectorAll("*[" + lang.current + "]");
		for (var i = 0; i < specialElements.length; i++) {
			specialElements[i].innerHTML = specialElements[i].getAttribute(lang.current);
		}
	}

	function nextIndex (currentIndex, arr) {
		return currentIndex + 1 >= arr.length ? 0 : currentIndex + 1;
	}

}());