
describe("Сущности", function () {
    describe("Отчёт", function () {
        var report = {
            title: undefined,
            entries: []
        };
        it("существует", function () {
            expect(report).toBeDefined();
        });
        it("имеет название", function () {
            expect(Object.keys(report).indexOf("title")).toBeGreaterThan(-1);
        });
        it("имеет записи", function () {
            expect(Array.isArray(report.entries)).toBeTruthy();
        });
    });
});

//
// Таймер
//

describe("Таймер", function () {

    var timer = {
        start: function () {
            return;
        }
    };

    it("может стартовать на таске", function () {
        var task;
        timer.start(task);

        // И без таска может стартовать
        timer.start();

        expect(typeof timer.start).toEqual("function");
        expect(typeof timer.start).toBeDefined();
    });
});
