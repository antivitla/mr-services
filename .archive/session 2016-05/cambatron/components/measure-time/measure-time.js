(function ($window){
	$window.measureTime = new function () {
		this.start = function () {
			this._start = new Date();
		};

		this.check = function () {
			if (!this._start) {
				return 0;
			} else {
				var now = new Date();
				return now - this._start;
			}
		}
	};
}(window));