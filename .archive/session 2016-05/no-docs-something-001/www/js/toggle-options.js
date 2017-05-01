
//
// Универсальный переключатель какого-нибудь атрибута из списка значений
//

/*

Смысл - одним скриптом убить двух и более зайцев - например реализовать простенькую
локализацию и переключатель тем страницы и прочее что делается с помощью стилей,
завязанных на некий селектор на родительском контейнере.

Это нечто единое из toggle-lang.js и toggle-theme.js, разница между ними сделана
через вынесение события переключения и мы можем вручную добавить нужного поведения.

Набор нужных опций задается в любом теге страницы в атрибуте toggle-options, например:

	<div toggle-options="lang, theme, smth">

Скрипт теперь сделает три поиска:
	1. Элемента с атрибутом toggle-lang
	2. Элемента с атрибутом toggle-theme
	3. Элемента с toggle-smth

Считается что это три опции, которые могут принимать некие значения - указанные в виде
списков через запятую в соотв. атрибутах, например два языка

	<html toggle-lang="ru, en">

Или две темы страницы

	<body toggle-theme="space, woman">

В итоге значение опции будет храниться и переключаться скриптом в атрибуте ммм под
названием этой опции:

	<html lang="ru"> или <body theme="space">

Далее, имея на руках уникальные селекторы для опции, можно настраивать страницу стилями.
Функции переключения вынесены в глобальный window в виде функций. Например:

	toggleLang()
	toggleTheme()
	toggleSmth()

Соответственно заданным нами первоначально опциям - lang, theme, smth. Каждая принимает
один параметр - установка принудительно значения опции. Скажем

	toggleLang("ru")

Если же аргумента нет, функция по списку переключает значения. В простом случае, скажем
два языка:

	<html toggle-lang="ru, en">

Будет по очереди рус/анг (двоичный переключатель по сути). А скажем если у нас есть

	<div toggle-theme="light, dark, sexy,">

То функция toggleTheme() будет по кругу переключать атрибут theme в light, dark, sexy,
light, dark, sexy, light, и так далее.

В большинстве случаев рекомендуется в html странице сразу проставлять дефолтные значения
опций-атрибутов - чтобы страница выглядела как задумано даже если скрипты не сработали -
чтоб стили сделали своё дело. Скажем в нашем случае будет так:

	<html toggle-lang="ru, en" lang="ru">
		...
		<body toggle-theme="space, woman" theme="space"></body>
	</html>

Как видно, атрибуты lang и theme сразу и проставлены.

*/

;(function (){

	var options = {},
		toggleElement;

	document.addEventListener("DOMContentLoaded", function () {
		var optionsElement = document.querySelector("*[toggle-options]");
		if (optionsElement) {
			var optionsList = optionsElement.getAttribute("toggle-options").replace(/\s+/g, "").split(",");
			for (var i = 0; i < optionsList.length; i++) {
				// lang = { list: [], current: "", next: "" }
				options[optionsList[i]] = window.JSON.parse(window.localStorage.getItem("toggle-"+optionsList[i])) || {
					list: [],
					current: undefined,
					next: undefined
				};

				// window.toggleLang = toggleLang;
				window["toggle" + capitalize(optionsList[i])] = function (newVal) {
					// console.dir(this);
					if (!newVal) {
						if (options[this].next) {
							window["toggle" + capitalize(this)](options[this].next);
							return;
						}
					} else {
						options[this + "Element"].setAttribute(this, newVal);
						setOption(newVal, this);
						// Событие на элементе
						options[this + "Element"].dispatchEvent(new CustomEvent("toggle-"+this, {detail: newVal}));
					}
				}.bind(optionsList[i]);

				// parseToggleLangElement(document.querySelector("*[toggle-lang]"));
				parseToggleElement(document.querySelector("*[toggle-" + optionsList[i] + "]"), optionsList[i]);
			}
		}
	});

	function parseToggleElement(toggleElement, optionName) {
		if (toggleElement) {
			options[optionName+"Element"] = toggleElement;
			var shrt = options[optionName],
				list = options[optionName+"Element"].getAttribute("toggle-"+optionName).replace(" ", "").split(",");
			while (list.length > 0) {
				addOptionValue(list[0], optionName);
				list.shift();
			}
			window["toggle"+capitalize(optionName)](shrt.current);
		}
	}

	function addOptionValue (newOptionValue, optionName) {
		options[optionName] = options[optionName] || {};
		var shrt = options[optionName];
		shrt.list = shrt.list || [];
		if (shrt.list.indexOf(newOptionValue) < 0) {
			shrt.list.push(newOptionValue);
		}
		// if (shrt.list.length <= 2) {
		// 	setOption(shrt.list[0], optionName);
		// }
	}

	function setOption (newVal, optionName) {
		options[optionName] = options[optionName] || {};
		var shrt = options[optionName];
		shrt.current = newVal;
		shrt.next = shrt.list[nextIndex(shrt.list.indexOf(shrt.current), shrt.list)];
		window.localStorage.setItem("toggle-" + optionName, window.JSON.stringify(shrt));
	}

	function capitalize(str) {
		return str[0].toUpperCase() + str.slice(1);
	}

	function nextIndex (currentIndex, arr) {
		return currentIndex + 1 >= arr.length ? 0 : currentIndex + 1;
	}

}());
