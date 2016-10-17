describe("MrTickBehavior", function () {
	it("is", function () {
		expect(MrTickBehavior).toBeDefined();
		expect(MrTickBehavior.tick).toBeDefined();
		expect(MrTickBehavior.untick).toBeDefined();
	});
	it ("ticks", function (done) {
		var ticks = 0;
		MrTickBehavior.tick(function () {
			ticks = ticks + 1;
			if (ticks >= 3) {
				expect(ticks).toBe(3);
				MrTickBehavior.untick();
				done();
			}
		},1);
	});
});