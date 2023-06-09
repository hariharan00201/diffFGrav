

describe("FGStackFrames", function() {

    var stackFrames;

    beforeEach(function () {
        stackFrames = new FGStackFrames();
    });


    var extractName = function (value, index, array) {
        return value.name;
    };

    var extractSamples = function (value, index, array) {
        return value.samples;
    };

    var extractIndividualSamples = function (value, index, array) {
        return value.individualSamples;
    };

    describe("when loadCollapsed invoked ", function () {

        beforeEach(function() {
            jasmine.Ajax.install();
            jasmine.Ajax.stubRequest("test.collapsed").andReturn({
                responseText:
                    "a;b;c 1\n" +
                    "a;b;d 2\n" +
                    "a;x;d 3\n"
            });
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it("should load collapsed file", function (done) {
            var fg = new FG();
            fg.collapsedUrl = "test.collapsed";
            fg.margin = 12;
            fg.frameHeight = 7;
            stackFrames.load(fg, function () {

                try {
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe("test.collapsed");
                    expect(request.method).toBe('GET');

                    var expectedOneSampleWidth = parseFloat(((fg.width - 24) / 6).toFixed());
                    var expectedLastLevelHeight = fg.height - 12 - (7 * (3 + 2));

                    expect(stackFrames.stackFrameRows.length).toEqual(3);
                    expect(stackFrames.stackFrameRows[0].map(extractName)).toEqual(['a']);
                    expect(stackFrames.stackFrameRows[0].map(extractSamples)).toEqual([6]);
                    expect(stackFrames.stackFrameRows[1].map(extractName)).toEqual(['b', 'x']);
                    expect(stackFrames.stackFrameRows[1].map(extractSamples)).toEqual([3, 3]);
                    expect(stackFrames.stackFrameRows[2].map(extractName)).toEqual(['c', 'd', 'd']);
                    expect(stackFrames.stackFrameRows[2].map(extractSamples)).toEqual([1, 2, 3]);
                    expect(stackFrames.stackFrameRows[2].map(function (v) { return v.x(); })).
                        toEqual([12, 12 + expectedOneSampleWidth, 12 + expectedOneSampleWidth * 3]);
                    expect(stackFrames.stackFrameRows[2].map(function (v) { return v.y(); })).
                        toEqual([expectedLastLevelHeight, expectedLastLevelHeight, expectedLastLevelHeight]);
                    expect(stackFrames.stackFrameRows[2].map(function (v) { return v.w(); })).
                        toEqual([expectedOneSampleWidth, expectedOneSampleWidth * 2, expectedOneSampleWidth * 3]);
                    done();
                } catch (e) {
                    done(e);
                }
            }, function () {
                done.fail("ajax should succeed");
            });
        });

        it("should generate all frame with total samples as its samples count", function (done) {
            var fg = new FG();
            fg.collapsedUrl = "test.collapsed";
            fg.margin = 12;
            fg.frameHeight = 7;

            stackFrames.load(fg, function () {
                try {
                    var all = stackFrames.allFrame(fg);

                    expect(all.name).toEqual("all");
                    expect(all.samples).toEqual(6);
                    expect(all.w()).toEqual(fg.width - 24);
                    expect(all.x()).toEqual(12);
                    expect(all.y()).toEqual(fg.height - 12 - 14);
                    done();
                } catch (e) {
                    done(e);
                }
            }, function () {
                done.fail("ajax should succeed");
            });
        });

        it("should filter frames according to provided filters", function (done) {
            var fg = new FG();
            fg.collapsedUrl = "test.collapsed";
            fg.context.frameFilter.filters.push({
                filter: function (path) {
                    return (path.includes("x")) ? null : path;
                }
            });

            stackFrames.load(fg, function () {

                try {
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe("test.collapsed");
                    expect(request.method).toBe('GET');

                    expect(stackFrames.stackFrameRows.length).toEqual(3);
                    expect(stackFrames.stackFrameRows[0].map(extractName)).toEqual(['a']);
                    expect(stackFrames.stackFrameRows[0].map(extractSamples)).toEqual([3]);
                    expect(stackFrames.stackFrameRows[1].map(extractName)).toEqual(['b']);
                    expect(stackFrames.stackFrameRows[1].map(extractSamples)).toEqual([3]);
                    expect(stackFrames.stackFrameRows[2].map(extractName)).toEqual(['c', 'd']);
                    expect(stackFrames.stackFrameRows[2].map(extractSamples)).toEqual([1, 2]);
                    done();
                } catch (e) {
                    done(e);
                }
            }, function () {
                done.fail("ajax should succeed");
            });
        });
    });

    describe("when loadMultipleCollapsed invoked ", function () {

        beforeEach(function() {
            jasmine.Ajax.install();
            jasmine.Ajax.stubRequest("test1.collapsed").andReturn({
                responseText:
                    "a;b;c 1\n" +
                    "a;b;d 2\n" +
                    "a;x;d 3\n"
            });
            jasmine.Ajax.stubRequest("test2.collapsed").andReturn({
                responseText:
                    "a;x;d 1\n" +
                    "a;b;c 2\n" +
                    "a;y;z 3\n"
            });
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it("should load multiple collapsed files", function (done) {
            var fg = new FG();
            fg.collapsedUrl = ["test1.collapsed", "test2.collapsed"];
            fg.margin = 12;
            fg.frameHeight = 7;
            stackFrames.load(fg, function () {

                try {
                    expect(stackFrames.stackFrameRows.length).toEqual(3);
                    expect(stackFrames.stackFrameRows[0].map(extractName)).toEqual(['a']);
                    expect(stackFrames.stackFrameRows[0].map(extractSamples)).toEqual([12]);
                    expect(stackFrames.stackFrameRows[0].map(extractIndividualSamples)).toEqual([[6, 6]]);
                    expect(stackFrames.stackFrameRows[1].map(extractName)).toEqual(['b', 'x', 'y']);
                    expect(stackFrames.stackFrameRows[1].map(extractSamples)).toEqual([5, 4, 3]);
                    expect(stackFrames.stackFrameRows[1].map(extractIndividualSamples)).toEqual([[3, 2], [3, 1], [0, 3]]);
                    expect(stackFrames.stackFrameRows[2].map(extractName)).toEqual(['c', 'd', 'd', 'z']);
                    expect(stackFrames.stackFrameRows[2].map(extractSamples)).toEqual([3, 2, 4, 3]);
                    expect(stackFrames.stackFrameRows[2].map(extractIndividualSamples)).toEqual([[1, 2], [2, 0], [3, 1], [0, 3]]);
                    done();
                } catch (e) {
                    done(e);
                }
            }, function () {
                done.fail("ajax should succeed");
            }, new MergedCollapsed(2));
        });

        it("should filter frames according to provided filters", function (done) {
            var fg = new FG();
            fg.collapsedUrl = ["test1.collapsed", "test2.collapsed"];
            fg.context.frameFilter.filters.push({
                filter: function (path) {
                    return (path.includes("x")) ? null : path;
                }
            });

            stackFrames.load(fg, function () {

                try {
                    expect(stackFrames.stackFrameRows.length).toEqual(3);
                    expect(stackFrames.stackFrameRows[0].map(extractName)).toEqual(['a']);
                    expect(stackFrames.stackFrameRows[0].map(extractSamples)).toEqual([8]);
                    expect(stackFrames.stackFrameRows[0].map(extractIndividualSamples)).toEqual([[3, 5]]);
                    expect(stackFrames.stackFrameRows[1].map(extractName)).toEqual(['b', 'y']);
                    expect(stackFrames.stackFrameRows[1].map(extractSamples)).toEqual([5, 3]);
                    expect(stackFrames.stackFrameRows[1].map(extractIndividualSamples)).toEqual([[3, 2], [0, 3]]);
                    expect(stackFrames.stackFrameRows[2].map(extractName)).toEqual(['c', 'd', 'z']);
                    expect(stackFrames.stackFrameRows[2].map(extractSamples)).toEqual([3, 2, 3]);
                    expect(stackFrames.stackFrameRows[2].map(extractIndividualSamples)).toEqual([[1, 2], [2, 0], [0, 3]]);
                    done();
                } catch (e) {
                    done(e);
                }
            }, function () {
                done.fail("ajax should succeed");
            }, new MergedCollapsed(2));
        });
    });

    describe("calculations post stack frames creation", function () {

        var fg;

        beforeEach(function() {
            fg = new FG();
            jasmine.Ajax.install();
            jasmine.Ajax.stubRequest("test.collapsed").andReturn({
                responseText:
                    "a;b;c 10\n" +
                    "a;b;d 20\n" +
                    "a;x;d 30\n"
            });
            jasmine.Ajax.stubRequest("test_many_samples_with_small_minimum.collapsed").andReturn({
                responseText:
                    "a;b;c 1\n" +
                    "d;e;f 100\n" +
                    "a;b;d 200\n" +
                    "a;x;d 3000\n"
            });
            jasmine.Ajax.stubRequest("test_large_path.collapsed").andReturn({
                responseText:
                    "a;b;c 10\n" +
                    "a;b;c;d;e;f;g;h;i;j;k;l;m;n;o;p;q;r;s;t;u;v;w;x;y;z;" +
                    "a;b;c;d;e;f;g;h;i;j;k;l;m;n;o;p;q;r;s;t;u;v;w;x;y;z;" +
                    "a;b;c;d;e;f;g;h;i;j;k;l;m;n;o;p;q;r;s;t;u;v;w;x;y;z;" +
                    "a;b;c;d;e;f;g;h;i;j;k;l;m;n;o;p;q;r;s;t;u;v;w;x;y;z;" +
                    "a;b;c;d;e;f;g;h;i;j;k;l;m;n;o;p;q;r;s;t;u;v;w;x;y;z;" +
                    "a;b;c;d;e;f;g;h;i;j;k;l;m;n;o;p;q;r;s;t;u;v;w;x;y;z 100\n"
            });
            fg.context.currentColorScheme = {
                legend: {}
            };
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it("should keep default dimensions when freezeDimensions is true", function (done) {
            fg.freezeDimensions = true;
            fg.collapsedUrl = "test.collapsed";

            stackFrames.load(fg, function() {
                try {
                    expect(fg.width).toEqual(1200);
                    expect(fg.height).toEqual(2200);
                    expect(fg.frameHeight).toEqual(15);
                    expect(fg.margin).toEqual(24);
                    expect(fg.fontSize).toEqual(12);
                    expect(fg.textPadding).toEqual(10.5);
                    done();
                } catch (e) {
                    done(e);
                }
            }, function () {
                done.fail("ajax should succeed");
            });
        });

        it("should calculate dimensions based on stack frames", function (done) {
            fg.collapsedUrl = "test.collapsed";

            stackFrames.load(fg, function() {
                try {
                    expect(fg.width).toEqual((2 * 24) + (60 * 14));
                    expect(fg.height).toEqual((3 + 10 + 1) * (15 + 2) + (24 * 4)); // 3 = maxLevel, 10 = additional (estimated max drop down menu size constant)
                    done();
                } catch (e) {
                    done(e);
                }
            }, function () {
                done.fail("ajax should succeed");
            });

        });

        it("should modify margin and font when width is tight", function (done) {
            fg.collapsedUrl = "test_many_samples_with_small_minimum.collapsed";
            stackFrames.load(fg, function() {
                try {
                    expect(fg.width).toEqual(1200);
                    expect(fg.margin).toEqual(8);
                    expect(fg.fontSize).toEqual(8);
                    done();
                } catch (e) {
                    done(e);
                }
            }, function () {
                done.fail("ajax should succeed");
            });
        });

        it("should modify frame height font and text padding when height is tight", function (done) {
            fg.collapsedUrl = "test_large_path.collapsed";
            stackFrames.load(fg, function() {
                try {
                    expect(fg.frameHeight).toEqual(14);
                    expect(fg.fontSize).toEqual(8);
                    expect(fg.textPadding).toEqual(8);
                    done();
                } catch (e) {
                    done(e);
                }
            }, function () {
                done.fail("ajax should succeed");
            });
        });
    });
});