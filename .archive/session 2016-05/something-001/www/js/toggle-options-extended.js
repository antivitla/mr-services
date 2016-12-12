document.documentElement.addEventListener("toggle-lang", function (event) {
	var currentLang = event.detail;
	var specialElements = document.querySelectorAll("*[" + currentLang + "]");
	for (var i = 0; i < specialElements.length; i++) {
		specialElements[i].innerHTML = specialElements[i].getAttribute(currentLang);
	}
});