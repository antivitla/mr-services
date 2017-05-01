describe("window.measureTime()", function () {
	it ("can measure", function () {
		measureTime.start();
		for(var i = 0; i < 1000000; i++) {
			var z = Math.sqrt(453453);
		}
		expect(measureTime.check() > 0).toBe(true);
	});
});