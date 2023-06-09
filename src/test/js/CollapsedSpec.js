

describe("Collapsed", function() {

    var collapsed;

    beforeEach(function () {
        collapsed = new Collapsed();
    });

    describe("when parseCollapsed invoked ", function () {

        it("should parsed collapsed content", function () {
            collapsed.parseCollapsed(["a;b;c 1","a;b;d 2","a;x;d 3"]);

            expect(collapsed.paths.length).toEqual(3);
            expect(collapsed.totalSamples).toEqual(6);
            expect(collapsed.minSample).toEqual(1);
        });
    });

    it('should sort paths by original string', function () {
        collapsed.parseCollapsed(["a;b;z 1","a;b;d 2","a;x;d 3", "a;b;d 4"]);

        collapsed.sort();

        expect(collapsed.paths.length).toEqual(4);
        expect(collapsed.paths[0].sortBy).toEqual("a;b;d");
        expect(collapsed.paths[1].sortBy).toEqual("a;b;d");
        expect(collapsed.paths[2].sortBy).toEqual("a;b;z");
        expect(collapsed.paths[3].sortBy).toEqual("a;x;d");
    });

    describe("when calculating offsets ", function () {

        it("should caculate offsets", function () {
            collapsed.parseCollapsed(["a;b;c 1","a;b;c;d 2","a;x;d 3"]);

            collapsed.calculateOffsets(17, 1, 0);

            expect(collapsed.offset.length).toEqual(3);
            expect(collapsed.offset[0]).toEqual(2.5);
            expect(collapsed.offset[1]).toEqual(7.5);
            expect(collapsed.offset[2]).toEqual(15);
            expect(collapsed.maxLevel).toEqual(4);
        });

        it("should only take displayed paths into account when calculating max level", function () {
            collapsed.parseCollapsed(["a;b;c;d;e;f; 1","a;b;c;d 2","a;x;y 3"]);

            collapsed.calculateOffsets(17, 19, 3);

            expect(collapsed.maxLevel).toEqual(3);
        });
    });

    it('should clear state', function () {
        collapsed.parseCollapsed(["a;b;c 1","a;b;d 2","a;x;d 3"]);

        expect(collapsed.totalSamples).toEqual(6);

        collapsed.clear();

        expect(collapsed.totalSamples).toEqual(0);
        expect(collapsed.paths.length).toEqual(0);

    });
});