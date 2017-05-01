document.addEventListener("toggle-option", function (event) {
	if (event.detail.name == "lang") {
		var lang = event.detail.value,
			specialElements = document.querySelectorAll("*[" + lang + "]");
		for (var i = 0; i < specialElements.length; i++) {
			specialElements[i].innerHTML = specialElements[i].getAttribute(lang);
		}
	}
});