
//
// Переключатель темы
//

/*

Ищет элемент с атрибутом toggle-theme, считая что там лежит список тем для
переключения через запятую. Если нашел, то:
1. Проставляет этому элементу атрибут theme на первую тему из списка
2. Создает глобальную функцию toggleTheme чтобы её можно было повесить на onclick
   какой-нибудь кнопке.

Бонусы:
- Запоминает текущее состояние в localStorage

Минусы:
- Может быть только одна тема, поэтому по факту активируем на <body>

Как пользоваться:
1. Подключить скрипт toggle-theme.js, неважно где - в конце или в head.
   Инициализация будет по DOMContentLoaded (после парсинга страницы).

   		<script src="path-to-script/toggle-theme.js"></script>

2. Задать какому-либо элементу список тем переключения, например <body>:

   		<body toggle-theme="space, woman">

   Задается в теге toggle-theme через запятую. Скрипт выставит первую в списке
   тему в атрибут theme. Таким образом после инициализация скрипта выбранный нами
   для примера тег <body> будет выглядеть так:

   		<body toggle-theme="space, woman" theme="space">

   Где theme="space" - текущая тема. В дальнейшем значение этого атрибута будет
   меняться на "woman" и опять "space" и так по кругу.

3. Проставить некоей кнопке собственно переключение, например через onclick:

   		<button onclick="toggleTheme();">

   Без аргументов функция перещёлкивает по списку, но можно задать и конкретную тему
   из списка:

   		<button onclick="toggleTheme('woman');">

   Именно вызов этой функции с аргументом и используется внутренне для задания
   начальной темы.

4. Написать темы!  Например:

		*[theme="woman"] {
			background-color: pink;
			color: black;
		}

		*[theme="woman"] .image {
			background-image: url(girl.jpg);
		}



		*[theme="space"] {
			background-color: black;
			color: white;
		}

		*[theme="space"] .image {
			background-image: url(man.jpg);
		}

   Я выбрал писать темы по значению атрибута (а не по классу).

*/

;(function () {

	var libname = "toggle-theme",
		theme = window.JSON.parse(window.localStorage.getItem(libname)) || {
			list: [],
			current: undefined,
			next: undefined
		},
		themeElement = document.body;

	function toggleTheme(newTheme) {
		if (!newTheme) {
			if (theme.next) {
				toggleTheme(theme.next);
				return;
			}
		} else {
			themeElement.setAttribute("theme", newTheme);
			setTheme(newTheme);
		}
	}

	document.addEventListener("DOMContentLoaded", function () {
		window.toggleTheme = toggleTheme;
		parseToggleThemeElement(document.querySelector("*[toggle-theme]"));
	});

	function parseToggleThemeElement (element) {
		if (element) {
			themeElement = element;
			var list = element.getAttribute("toggle-theme").replace(" ", "").split(",");
			while (list.length > 0) {
				addTheme(list[0]);
				list.shift();
			}
			toggleTheme(theme.current);
		}
	}

	function addTheme (themeName) {
		theme.list = theme.list || [];
		theme.list.push(themeName);
		setTheme(theme.current || theme.list[0]);
	}

	function setTheme (themeName) {
		theme.current = themeName;
		theme.next = theme.list[nextIndex(theme.list.indexOf(theme.current), theme.list)];
		window.localStorage.setItem(libname, window.JSON.stringify(theme));
	}

	function nextIndex (currentIndex, arr) {
		return currentIndex + 1 >= arr.length ? 0 : currentIndex + 1;
	}

}());